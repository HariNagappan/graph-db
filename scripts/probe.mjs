import {spawn} from "node:child_process";
import path from "node:path";
import fs from "node:fs";
const CHROME="C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT=9235, BASE="http://localhost:3000";
const PROFILE=path.join(process.env.TEMP??".",`gn-probe2-${Date.now()}`);
const chrome=spawn(CHROME,["--headless=new","--disable-gpu","--hide-scrollbars","--no-first-run",`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`,"about:blank"],{stdio:"ignore"});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function wsurl(){for(let i=0;i<80;i++){try{const l=await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const p=l.find(t=>t.type==="page");if(p?.webSocketDebuggerUrl)return p.webSocketDebuggerUrl;}catch{}await sleep(200);}throw new Error("no cdp");}
const ws=new WebSocket(await wsurl());await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej;});
let n=0;const pend=new Map();
ws.onmessage=(e)=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){const p=pend.get(m.id);pend.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++n;pend.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const ev=async(x)=>{const r=await send("Runtime.evaluate",{expression:x,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result?.value;};
const waitFor=async(e,t=30000)=>{const s=Date.now();while(Date.now()-s<t){if(await ev(e).catch(()=>false))return true;await sleep(150);}throw new Error("timeout");};
try{
 await send("Page.enable");await send("Runtime.enable");
 await send("Emulation.setDeviceMetricsOverride",{width:1440,height:980,deviceScaleFactor:1,mobile:false});
 await send("Page.navigate",{url:`${BASE}/auth/login`});await sleep(1200);
 await ev(`(()=>{const i=document.querySelector('#auth-email');i.value="alice@demo.test";document.querySelector('form').requestSubmit();return true;})()`);
 await waitFor("location.pathname==='/auth/check-password'");
 await ev(`(()=>{const i=document.querySelector('#auth-pw');const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(i,"Demo@123");i.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);
 await sleep(200);await ev("document.querySelector('form').requestSubmit()");
 await waitFor("location.pathname==='/'");await sleep(1800);
 console.log(JSON.stringify(await ev(`(() => {
   const host = document.querySelector('nextjs-portal');
   const out = {host: !!host, rects: []};
   const sr = host?.shadowRoot;
   if (sr) {
     for (const el of sr.querySelectorAll('*')) {
       const cs = getComputedStyle(el);
       if (cs.position === 'fixed') {
         const r = el.getBoundingClientRect();
         if (r.width > 10 && r.height > 10) out.rects.push({w: Math.round(r.width), h: Math.round(r.height), l: Math.round(r.left), t: Math.round(r.top), b: Math.round(r.bottom)});
       }
     }
   }
   const side = document.querySelector('.gn-side');
   const foot = document.querySelector('.gn-side-foot');
   out.side = {padBottom: getComputedStyle(side).paddingBottom, h: Math.round(side.getBoundingClientRect().height)};
   out.foot = foot ? {bottom: Math.round(foot.getBoundingClientRect().bottom)} : null;
   out.vh = window.innerHeight;
   return out;
 })()`),null,1));
}finally{ws.close();chrome.kill();await sleep(300);try{fs.rmSync(PROFILE,{recursive:true,force:true});}catch{}}
