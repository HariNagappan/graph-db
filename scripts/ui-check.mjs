import {spawn} from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9233;
const BASE = "http://localhost:3000";
const PROFILE = path.join(process.env.TEMP ?? ".", `graphnet-ui-${Date.now()}`);
const OUT = path.join(process.cwd(), "qa-redesign");
fs.mkdirSync(OUT, {recursive: true});

const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, "about:blank",
], {stdio: "ignore"});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWs() {
    for (let i = 0; i < 80; i++) {
        try {
            const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
            const page = list.find((t) => t.type === "page");
            if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
        } catch { /* wait */ }
        await sleep(200);
    }
    throw new Error("no CDP");
}
const ws = new WebSocket(await getWs());
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let n = 0;
const pending = new Map();
const errors = [];
ws.onmessage = (event) => {
    const m = JSON.parse(event.data);
    if (m.id && pending.has(m.id)) {
        const p = pending.get(m.id);
        pending.delete(m.id);
        m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result);
        return;
    }
    if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
};
const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++n;
    pending.set(id, {resolve, reject});
    ws.send(JSON.stringify({id, method, params}));
});
const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", {expression, returnByValue: true, awaitPromise: true, userGesture: true});
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result?.value;
};
const waitFor = async (expr, timeout = 30000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (await evaluate(expr).catch(() => false)) return true;
        await sleep(150);
    }
    throw new Error(`timeout ${expr}`);
};
async function shot(name) {
    await sleep(400);
    const {data} = await send("Page.captureScreenshot", {format: "png"});
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(data, "base64"));
}
async function viewport(width, height) {
    await send("Emulation.setDeviceMetricsOverride", {width, height, deviceScaleFactor: 1, mobile: width < 800});
    await sleep(250);
}
async function login(email, password, expected) {
    await send("Page.navigate", {url: `${BASE}/auth/login`});
    await sleep(1200);
    await evaluate(`(() => { const i=document.querySelector('#auth-email'); i.value=${JSON.stringify(email)}; document.querySelector('form').requestSubmit(); return true; })()`);
    await waitFor("location.pathname === '/auth/check-password'");
    await evaluate(`(() => { const i=document.querySelector('#auth-pw'); const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; s.call(i,${JSON.stringify(password)}); i.dispatchEvent(new Event('input',{bubbles:true})); return true; })()`);
    await sleep(200);
    await evaluate("document.querySelector('form').requestSubmit()");
    await waitFor(`location.pathname === ${JSON.stringify(expected)}`);
    await sleep(1600);
}
async function go(p, waitExpr) {
    await send("Page.navigate", {url: BASE + p});
    await sleep(1300);
    if (waitExpr) await waitFor(waitExpr);
    await sleep(600);
}

const paneState = `(() => {
    const main = document.querySelector('.gn-admin-main');
    const graph = document.querySelector('.gn-graph-area');
    const table = document.querySelector('.gn-admin-table');
    const vis = (el) => !!el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 0;
    return {
        pane: main?.getAttribute('data-pane'),
        graphVisible: vis(graph),
        tableVisible: vis(table),
        title: document.querySelector('.gn-admin-title')?.textContent,
        activeRail: [...document.querySelectorAll('.gn-rail-btn')].findIndex((b) => b.classList.contains('is-active')),
        tableRows: document.querySelectorAll('.gn-table tbody tr').length,
        tableHeight: table ? Math.round(table.getBoundingClientRect().height) : 0,
    };
})()`;

try {
    await send("Page.enable");
    await send("Runtime.enable");
    await viewport(1440, 980);

    // ---- admin: rail buttons must switch panes ----
    await login("admin@gmail.com", "admin123", "/admin");
    await waitFor("document.querySelectorAll('.g-node').length > 0");
    console.log("A. initial      ", JSON.stringify(await evaluate(paneState)));
    await shot("admin-01-graph-pane");

    await evaluate("document.querySelector('[aria-label=\"Users table\"]').click()");
    await sleep(700);
    console.log("B. after users  ", JSON.stringify(await evaluate(paneState)));
    await shot("admin-02-users-pane");

    await evaluate("document.querySelector('[aria-label=\"Graph view\"]').click()");
    await sleep(700);
    console.log("C. after graph  ", JSON.stringify(await evaluate(paneState)));
    await shot("admin-03-graph-again");

    await evaluate("document.querySelector('[aria-label=\"Users table\"]').click()");
    await sleep(700);
    const pager = await evaluate(`(() => {
        const btns = [...document.querySelectorAll('.gn-page-btn')];
        const two = btns.find((b) => b.textContent.trim() === '2');
        two?.click();
        return new Promise((r) => setTimeout(() => r({
            meta: document.querySelector('.gn-table-meta')?.textContent.trim(),
            rows: document.querySelectorAll('.gn-table tbody tr').length,
        }), 400));
    })()`);
    console.log("D. users page 2 ", JSON.stringify(pager));
    await shot("admin-04-users-page2");

    await evaluate("document.querySelector('.gn-theme-toggle').click()");
    await sleep(600);
    console.log("E. admin dark   ", JSON.stringify(await evaluate(paneState)), await evaluate("document.documentElement.getAttribute('data-theme')"));
    await shot("admin-05-users-dark");
    await evaluate("document.querySelector('.gn-theme-toggle').click()");
    await sleep(400);

    await viewport(390, 844);
    await sleep(500);
    console.log("E2. mobile users", JSON.stringify(await evaluate(paneState)));
    await shot("admin-06-users-mobile");
    await evaluate("document.querySelector('[aria-label=\"Graph view\"]').click()");
    await sleep(700);
    console.log("E3. mobile graph", JSON.stringify(await evaluate(paneState)));
    await shot("admin-07-graph-mobile");
    await viewport(1440, 980);
    await sleep(400);

    // ---- regular user: pages + metadata ----
    await send("Network.clearBrowserCookies");
    await login("alice@demo.test", "Demo@123", "/");
    const meta = await evaluate("[...document.querySelectorAll('.gn-meta')].map((n) => n.innerText.replace(/\\s+/g, ' '))");
    console.log("F. dashboard meta", JSON.stringify(meta));
    await shot("app-01-dashboard-light");

    await go("/network", "document.querySelector('.gn-people') !== null");
    console.log("G. network meta ", JSON.stringify(await evaluate("[...document.querySelectorAll('.gn-meta')].map((n) => n.innerText.replace(/\\s+/g, ' '))")));
    await shot("app-02-network-light");

    await go("/discover", "document.querySelector('.gn-search-card') !== null");
    console.log("H. discover meta", JSON.stringify(await evaluate("[...document.querySelectorAll('.gn-meta')].map((n) => n.innerText.replace(/\\s+/g, ' '))")));
    await shot("app-03-discover-light");

    await go("/requests", "document.querySelector('.gn-2col-requests') !== null");
    console.log("I. requests meta", JSON.stringify(await evaluate("[...document.querySelectorAll('.gn-meta')].map((n) => n.innerText.replace(/\\s+/g, ' '))")));
    await shot("app-04-requests-light");

    await evaluate("document.querySelector('.gn-theme-toggle').click()");
    await sleep(600);
    console.log("J. theme       ", await evaluate("document.documentElement.getAttribute('data-theme')"));
    await shot("app-05-requests-dark");
    await go("/", "document.querySelector('.gn-stats') !== null");
    await shot("app-06-dashboard-dark");

    await viewport(390, 844);
    await go("/", "document.querySelector('.gn-stats') !== null");
    await shot("app-07-dashboard-mobile");

    console.log("errors", JSON.stringify(errors));
} finally {
    ws.close();
    chrome.kill();
    await sleep(400);
    try { fs.rmSync(PROFILE, {recursive: true, force: true}); } catch { /* ignore */ }
}
