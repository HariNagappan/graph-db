  /* ---------------------------------------------------------------------
     GraphNet design delivery
     Row 1 context, Row 2 design system, Row 3 every screen in flow order.
     --------------------------------------------------------------------- */
  const GNX = window.GN;
  const ST = GNX.store;

  const C = {
    ink: '#06070E', surf: '#0C0F1A', raise: '#171C2F', raise2: '#1E2440',
    violet: '#8E6FFF', violet2: '#6C4BF2', cyan: '#35D6DE', lav: '#B9A8FF',
    text: '#ECF0FA', text2: '#A6AFC8', text3: '#7E88A4', line: 'rgba(148,163,209,0.17)'
  };

  function dsBody(html) {
    return '<div class="gn" style="height:auto;background:transparent">' + html + '</div>';
  }

  /* design-system previews reuse the product components, so they need the
     token scope that .gn provides */
  function gnify(cardEl) {
    const body = cardEl.querySelector('.ds-body');
    if (!body) return cardEl;
    const wrap = document.createElement('div');
    wrap.className = 'gn';
    wrap.style.height = 'auto';
    wrap.style.background = 'transparent';
    while (body.firstChild) wrap.appendChild(body.firstChild);
    body.appendChild(wrap);
    return cardEl;
  }

  const PAGE_W = 1440, PAGE_H = 900, PAGE_GAP = 64, PAGE_STEP = PAGE_W + PAGE_GAP;
  const X0 = 100;

  function memberFrame(route, opts) {
    const content = GNX.screens(route, ST, opts || {});
    return GNX.shell(ST, { active: route, mode: 'frame', content: content, query: (opts || {}).query });
  }

  function authFrame(opts) {
    return GNX.screens('auth', ST, Object.assign({ mode: 'frame' }, opts));
  }

  /* ---------------------------------------------------------------- content */
  function swatch(name, hex, ring) {
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:7px;width:62px">' +
      '<div style="width:42px;height:42px;border-radius:50%;background:' + hex + ';' +
      (ring ? 'box-shadow:inset 0 0 0 1px rgba(255,255,255,0.16)' : 'box-shadow:inset 0 1px 0 rgba(255,255,255,0.14)') + '"></div>' +
      '<div style="font-size:10px;color:#b9b6cd;text-align:center;line-height:1.25">' + name + '</div>' +
      '<div style="font-family:Consolas,monospace;font-size:8.5px;color:#6d6885;letter-spacing:0.02em">' + hex.toUpperCase() + '</div>' +
      '</div>';
  }

  function typeRow(label, meta, size, weight, family, sample, color) {
    return '<div style="display:flex;align-items:baseline;gap:16px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.05)">' +
      '<div style="width:90px;flex:0 0 90px;font-family:Consolas,monospace;font-size:8.5px;letter-spacing:0.08em;color:#6d6885;text-transform:uppercase;line-height:1.5">' +
      label + '<br><span style="color:#4c4761">' + meta + '</span></div>' +
      '<div style="font-family:' + family + ';font-size:' + size + 'px;font-weight:' + weight + ';color:' + (color || C.text) + ';line-height:1.15;white-space:nowrap;letter-spacing:-0.02em">' + sample + '</div>' +
      '</div>';
  }

  function degreeRow(degree, cls, title, note) {
    return '<div style="display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.05)">' +
      '<span class="gn-ring ' + cls + '" style="padding:3px"><span class="gn-av gn-av-md" style="background:#1c2140;color:#b9c4ff;font-size:11px">AM</span></span>' +
      '<div style="min-width:0"><div style="font-size:11.5px;font-weight:600;color:#e7e4f6">' + title + '</div>' +
      '<div style="font-size:10px;color:#7d7795;margin-top:1px">' + note + '</div></div>' +
      '<span class="gn-deg gn-deg-' + degree + '" style="margin-left:auto">' + (degree === 0 ? 'Out' : degree + (degree === 1 ? 'st' : degree === 2 ? 'nd' : 'rd')) + '</span>' +
      '</div>';
  }

  function btnPreview(kind, label) {
    return '<button class="gn-btn gn-btn-' + kind + ' gn-btn-sm" tabindex="-1">' + label + '</button>';
  }

  function initDemo() {
    /* ══ ROW 1 ═══════════════════════════════════════════════════════════ */
    addSection(40, '01 PROJECT CONTEXT');

    const t1 = addTitle(X0, 92, 'GraphNet', { fontSize: 62, fontWeight: 700 });
    const d1 = addText(X0, below(t1, 14),
      'A professional network where the graph is the product. Sign in, send a request, and watch a 1st, 2nd or 3rd degree network assemble itself out of edges instead of out of a list.',
      { fontSize: 14.5, maxWidth: 430 });

    const tagsY = below(d1, 18);
    const tag1 = addTag(X0, tagsY, 'Full redesign', { color: C.violet });
    const tag2 = addTag(rightOf(tag1, 8), tagsY, '4 auth steps', { color: C.cyan });
    addTag(rightOf(tag2, 8), tagsY, '5 member screens', { color: C.lav });

    /* flow diagram */
    const flow = '<svg viewBox="0 0 500 142" style="width:100%;height:100%;overflow:visible">' +
      '<defs><marker id="fl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">' +
      '<path d="M0,0 L10,5 L0,10 z" fill="rgba(148,163,209,0.55)"/></marker></defs>' +
      '<g font-family="Segoe UI, sans-serif" font-size="11">' +
      box(8, 52, 80, 26, 'Sign in', false) +
      box(116, 52, 92, 26, 'Overview', false) +
      box(244, 14, 104, 26, 'My network', false) +
      box(244, 52, 104, 26, 'Discover', false) +
      box(244, 90, 104, 26, 'Requests', false) +
      box(376, 52, 80, 26, 'Profile', false) +
      box(376, 90, 104, 26, 'Admin console', true) +
      '<path d="M88 65 H112" stroke="rgba(148,163,209,0.45)" stroke-width="1.2" marker-end="url(#fl-arrow)"/>' +
      '<path d="M208 65 H226 V27 H240" fill="none" stroke="rgba(148,163,209,0.45)" stroke-width="1.2" marker-end="url(#fl-arrow)"/>' +
      '<path d="M208 65 H240" stroke="rgba(148,163,209,0.45)" stroke-width="1.2" marker-end="url(#fl-arrow)"/>' +
      '<path d="M208 65 H226 V103 H240" fill="none" stroke="rgba(148,163,209,0.45)" stroke-width="1.2" marker-end="url(#fl-arrow)"/>' +
      '<path d="M348 65 H372" stroke="rgba(148,163,209,0.45)" stroke-width="1.2" marker-end="url(#fl-arrow)"/>' +
      '<text x="376" y="131" fill="#6d6885" font-size="9" font-family="Consolas, monospace" letter-spacing="0.06em">ADMIN ROLE ONLY</text>' +
      '</g></svg>';
    addDiagram(X0 + 470, 92, 540, 182, flow);

    const cardsY = below(tag1, 30);
    const cardW = 300;
    const card1 = addContextCard(X0, cardsY, cardW, null, 'Who it is for',
      '<ul><li><b>Members.</b> Early and mid-career professionals who need to know how reachable they are, not just who they know.</li><li><b>The operator.</b> The engineer who runs the graph and wants to see what the queries actually return.</li></ul>');
    const card2 = addContextCard(X0 + cardW + 20, cardsY, cardW, null, 'What was wrong',
      '<ul><li>Degree and mutuals are the product, but they read as body text.</li><li>28 people looked exactly like a list of 28 names.</li><li>The member screens and the admin console shared no visual language.</li></ul>');
    const card3 = addContextCard(X0 + (cardW + 20) * 2, cardsY, cardW, null, 'The move',
      '<ul><li>Radius encodes distance: 1st solid violet, 2nd dashed cyan, 3rd dotted lavender.</li><li>One encoding repeats on avatars, cards, the profile path and the admin canvas.</li><li>Mono type carries every graph number, so data reads as data.</li></ul>');
    const card4 = addContextCard(X0 + (cardW + 20) * 3, cardsY, cardW, null, 'Scope of this pass',
      '<ul><li>All six flows preserved: auth, discover, degrees, mutuals, request lifecycle, admin.</li><li>Requests becomes a first-class screen built from the sent and received states that already exist.</li><li>No new endpoints and no new profile fields.</li></ul>');

    const notesY = maxY([card1, card2, card3, card4], 22);
    const n1 = addNote(X0, notesY, 'Preserved',
      'Routes stay: <span style="font-family:Consolas,monospace">/</span>, <span style="font-family:Consolas,monospace">/connections?user_id=</span>, <span style="font-family:Consolas,monospace">/admin</span> and the four auth steps. A full connection list still unlocks only for you and your 1st degree.');
    const n2 = addNote(rightOf(n1, 20), notesY, 'Two databases, one layout',
      'SQLite holds credentials and the account table. Neo4j holds the network. The admin console keeps that split visible: graph above, users table below, never competing for the same space.');

    /* ══ ROW 2 ═══════════════════════════════════════════════════════════ */
    const r2 = maxY([card1, card2, card3, card4, n1, n2], 72);
    addSection(r2, '02 DESIGN SYSTEM');
    const dsY = r2 + 58;

    const colorCard = addDesignSystemCard(X0, dsY, 380, null, 'color', {
      title: 'Colour',
      html:
        '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px 6px">' +
        swatch('Base ink', C.ink, false) + swatch('Surface', C.surf, false) + swatch('Raised', C.raise, false) +
        swatch('Violet 500', C.violet, false) + swatch('Violet 600', C.violet2, false) +
        swatch('Cyan 400', C.cyan, false) + swatch('Lavender', C.lav, false) + swatch('Text', C.text, false) +
        swatch('Muted text', C.text3, false) + swatch('Elevated', C.raise2, false) +
        '</div>' +
        '<div style="margin-top:16px;font-size:10.5px;line-height:1.6;color:#8d87a6">' +
        'One accent carries action: violet. Cyan never becomes a button, it only marks distance and pending edges. Neutrals are navy, never grey, so the dark surface keeps a temperature.' +
        '</div>'
    });

    const typeCard = addDesignSystemCard(X0 + 404, dsY, 420, null, 'typography', {
      title: 'Typography',
      html:
        typeRow('Display', 'Bahnschrift 600', 26, 600, 'Bahnschrift, "DIN Alternate", sans-serif', 'Network has shape') +
        typeRow('H1', '27 / 600', 21, 600, 'Bahnschrift, "DIN Alternate", sans-serif', 'My network') +
        typeRow('Body', 'Segoe UI 14', 14, 400, '"Segoe UI", system-ui, sans-serif', '9 people know you directly.') +
        typeRow('Mono', 'Cascadia 12', 12, 400, '"Cascadia Mono", Consolas, monospace', '1st · 4 mutual · u_1a4d7c93', C.cyan) +
        typeRow('Label', 'mono 10 / 0.14em', 10, 600, '"Cascadia Mono", Consolas, monospace', 'NETWORK OVERVIEW', C.text3)
    });

    const degreeCard = addDesignSystemCard(X0 + 848, dsY, 340, null, 'custom', {
      title: 'Degree encoding',
      html:
        '<div style="font-size:10.5px;line-height:1.6;color:#8d87a6;margin-bottom:8px">Distance is the only thing the ring encodes. The badge repeats it for anyone who cannot read the ring.</div>' +
        degreeRow(1, 'gn-ring-1', '1st degree', 'A direct CONNECTED edge') +
        degreeRow(2, 'gn-ring-2', '2nd degree', 'One person in between') +
        degreeRow(3, 'gn-ring-3', '3rd degree', 'Two people in between') +
        degreeRow(0, 'gn-ring-0', 'Outside', 'No path within 3 hops') +
        '<div style="margin-top:12px;font-size:10px;color:#6d6885;line-height:1.6">The same three rings appear in the orbit map, on person cards, in the profile path strip and as node sizing in the admin graph.</div>'
    });

    const dsY2 = maxY([colorCard, typeCard, degreeCard], 24);

    const compCard = addDesignSystemCard(X0, dsY2, 620, null, 'components', {
      title: 'Components',
      html:
        '<div style="font-family:Consolas,monospace;font-size:8.5px;letter-spacing:0.1em;color:#6d6885;margin-bottom:8px">BUTTONS</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' +
        btnPreview('primary', 'Connect') + btnPreview('secondary', 'Ignore') +
        btnPreview('quiet', 'Withdraw') + btnPreview('ghost', 'View profile') +
        '<span class="gn-deg gn-deg-1">1st</span><span class="gn-deg gn-deg-2">2nd</span><span class="gn-deg gn-deg-3">3rd</span>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:18px">' +
        '<div>' +
        '<div style="font-family:Consolas,monospace;font-size:8.5px;letter-spacing:0.1em;color:#6d6885;margin-bottom:8px">FIELD</div>' +
        '<div class="gn-field"><label class="gn-label">Email</label>' +
        '<input class="gn-input" value="alice@demo.test" readonly tabindex="-1" style="height:36px">' +
        '<span class="gn-hint">We check this against SQLite.</span></div>' +
        '</div>' +
        '<div>' +
        '<div style="font-family:Consolas,monospace;font-size:8.5px;letter-spacing:0.1em;color:#6d6885;margin-bottom:8px">TABS + CHIP</div>' +
        '<div class="gn-tabs" style="margin-bottom:10px"><span class="gn-tab is-active">1st<span class="gn-tab-n">9</span></span>' +
        '<span class="gn-tab">2nd<span class="gn-tab-n">11</span></span></div>' +
        '<span class="gn-chip is-on">Has mutuals</span>' +
        '</div></div>' +
        '<div style="font-family:Consolas,monospace;font-size:8.5px;letter-spacing:0.1em;color:#6d6885;margin:16px 0 8px">CARD + ROW</div>' +
        '<div style="display:flex;gap:10px">' +
        '<div class="gn-person" style="width:230px;padding:12px"><div class="gn-person-top">' +
        '<span class="gn-ring gn-ring-2"><span class="gn-av gn-av-md t2">DK</span></span>' +
        '<div class="gn-person-id"><span class="gn-person-name">Dave Kessler</span>' +
        '<div class="gn-person-meta">2 mutual connections</div></div></div>' +
        '<div class="gn-person-b"><a class="gn-btn gn-btn-ghost gn-btn-xs">View profile</a></div></div>' +
        '<div class="gn-card" style="flex:1;overflow:hidden;border-radius:12px">' +
        '<div class="gn-row" style="padding:9px 12px"><span class="gn-ring gn-ring-1"><span class="gn-av gn-av-sm t1">BW</span></span>' +
        '<div class="gn-row-txt"><div class="gn-row-name" style="font-size:12px">Bob Whitfield</div>' +
        '<div class="gn-row-sub">1 mutual connection</div></div></div>' +
        '<div class="gn-row" style="padding:9px 12px"><span class="gn-ring gn-ring-3"><span class="gn-av gn-av-sm t4">EL</span></span>' +
        '<div class="gn-row-txt"><div class="gn-row-name" style="font-size:12px">Eve Lindqvist</div>' +
        '<div class="gn-row-sub">No mutual connections</div></div></div></div>' +
        '</div>'
    });

    const stateCard = addDesignSystemCard(X0 + 644, dsY2, 480, null, 'custom', {
      title: 'States',
      html:
        '<div style="display:flex;flex-direction:column;gap:12px">' +
        '<div class="gn-toast" style="max-width:none"><span class="gn-toast-ico">' + GNX.icon('circle-check', 15) + '</span><span>You and Ivan Petrov are now connected.</span></div>' +
        '<div class="gn-toast is-warn" style="max-width:none"><span class="gn-toast-ico">' + GNX.icon('circle-alert', 15) + '</span><span>Request to Kwame Asante withdrawn.</span></div>' +
        '<div class="gn-field"><input class="gn-input is-error" value="demo1234" readonly tabindex="-1" style="height:34px">' +
        '<div class="gn-err">' + GNX.icon('circle-alert', 13) + 'That password does not match this account.</div></div>' +
        '<div class="gn-empty" style="padding:16px 12px;border:1px dashed rgba(148,163,209,0.18);border-radius:12px">' +
        '<div class="gn-empty-ico" style="width:34px;height:34px;margin-bottom:6px">' + GNX.icon('compass', 17) + '</div>' +
        '<div class="gn-empty-t" style="font-size:12px">No one matches "zz"</div>' +
        '<div class="gn-empty-d" style="font-size:11px">Search matches names only. Try a first name.</div></div>' +
        '<div style="display:flex;gap:8px;align-items:center"><div class="gn-skel" style="height:10px;width:56px"></div>' +
        '<div class="gn-skel" style="height:10px;flex:1"></div><div class="gn-skel" style="height:10px;width:40px"></div></div>' +
        '</div>'
    });

    const gridCard = addDesignSystemCard(X0 + 1148, dsY2, 320, null, 'spacing', {
      title: 'Spacing + radii',
      html:
        '<div style="font-family:Consolas,monospace;font-size:8.5px;letter-spacing:0.1em;color:#6d6885;margin-bottom:10px">4 PT SCALE</div>' +
        [4, 8, 12, 16, 24, 32, 48].map(function (n) {
          return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">' +
            '<div style="width:' + n + 'px;height:8px;background:rgba(142,111,255,0.55);border-radius:2px"></div>' +
            '<span style="font-family:Consolas,monospace;font-size:9px;color:#7d7795">' + n + '</span></div>';
        }).join('') +
        '<div style="font-family:Consolas,monospace;font-size:8.5px;letter-spacing:0.1em;color:#6d6885;margin:14px 0 8px">RADII</div>' +
        '<div style="display:flex;gap:10px;align-items:flex-end">' +
        rad(28, 7, '7') + rad(28, 10, '10') + rad(28, 14, '14') + rad(28, 14, 'pill') +
        '</div>' +
        '<div style="font-family:Consolas,monospace;font-size:8.5px;letter-spacing:0.1em;color:#6d6885;margin:16px 0 8px">LAYOUT</div>' +
        '<div style="font-size:10.5px;color:#8d87a6;line-height:1.7">Sidebar 246 · top bar 58<br>Content 1216 max, 28 gutter<br>Cards 14 · controls 10 · tags pill</div>'
    });

    function box(x, y, w, h, label, dashed) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="#141226" stroke="' +
        (dashed ? 'rgba(185,168,255,0.4)' : 'rgba(142,111,255,0.32)') + '"' + (dashed ? ' stroke-dasharray="3 3"' : '') + '/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 17) + '" text-anchor="middle" fill="#cfc9e6" font-size="10.5">' + label + '</text>';
    }

    function rad(size, r, label) {
      return '<div style="text-align:center"><div style="width:' + size + 'px;height:28px;border:1px solid rgba(142,111,255,0.45);border-radius:' + (label === 'pill' ? '999px' : r + 'px') + ';background:rgba(142,111,255,0.1)"></div>' +
        '<div style="font-family:Consolas,monospace;font-size:8.5px;color:#6d677f;margin-top:5px">' + label + '</div></div>';
    }

    /* ══ ROW 3 ═══════════════════════════════════════════════════════════ */
    [colorCard, typeCard, degreeCard, compCard, stateCard, gridCard].forEach(gnify);

    const r3 = maxY([compCard, stateCard, gridCard], 84);
    addSection(r3, '03 DESIGN DELIVERABLES');
    const pagesY = r3 + 74;

    const pages = [
      { label: 'A1  Sign in · /auth/login', html: authFrame({ step: 'email' }) },
      { label: 'A2  Password · /auth/check-password', html: authFrame({ step: 'password', email: 'alice@demo.test' }) },
      { label: 'A3  Password · error state', html: authFrame({ step: 'password-error', email: 'alice@demo.test' }) },
      { label: 'A4  Create password · /auth/create-password', html: authFrame({ step: 'create', email: 'jordan@mbeki.studio', pw: 'Demo@123', strength: 4 }) },
      { label: 'A5  Your name · /auth/register', html: authFrame({ step: 'name', name: 'Jordan Mbeki' }) },
      { label: 'B1  Overview · /', html: memberFrame('dashboard') },
      { label: 'C1  My network · degree tabs', html: memberFrame('network', { tab: 'first' }) },
      { label: 'D1  Discover · search and filters', html: memberFrame('discover') },
      { label: 'E1  Requests · received and sent', html: memberFrame('requests', { requestTab: 'received' }) },
      { label: 'F1  Profile · 2nd degree, list locked', html: memberFrame('profile', { profileId: 'dave' }) },
      { label: 'F2  Profile · 1st degree, list visible', html: memberFrame('profile', { profileId: 'carol' }) },
      { label: 'G1  Admin console · Neo4j graph + SQLite users', html: GNX.screens('admin', ST, { mode: 'frame', selected: 'dave' }) }
    ];

    /* connectors, drawn behind the frames */
    const totalW = (pages.length - 1) * PAGE_STEP + PAGE_W;
    let conn = '<div style="position:absolute;inset:0">' +
      '<svg viewBox="0 0 ' + totalW + ' ' + PAGE_H + '" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible">' +
      '<defs><marker id="pg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
      '<path d="M0,0 L10,5 L0,10 z" fill="rgba(142,111,255,0.85)"/></marker></defs>';
    for (let i = 0; i < pages.length - 1; i++) {
      const x1 = i * PAGE_STEP + PAGE_W + 10;
      const x2 = (i + 1) * PAGE_STEP - 10;
      const y = PAGE_H * 0.5;
      conn += '<path d="M' + x1 + ' ' + y + ' H' + x2 + '" stroke="rgba(142,111,255,0.72)" stroke-width="2.6" marker-end="url(#pg-arrow)"/>';
    }
    conn += '</svg></div>';
    const connEl = addDiagram(X0, pagesY, totalW, PAGE_H, conn);
    connEl.style.pointerEvents = 'none';
    connEl.style.zIndex = '0';

    /* group headers */
    addText(X0, pagesY - 40, 'AUTHENTICATION', { fontSize: 10.5, color: '#9c93bb' });
    addText(X0 + 5 * PAGE_STEP, pagesY - 40, 'MEMBER APPLICATION', { fontSize: 10.5, color: '#9c93bb' });
    addText(X0 + 11 * PAGE_STEP, pagesY - 40, 'ADMIN CONSOLE', { fontSize: 10.5, color: '#9c93bb' });

    pages.forEach(function (p, i) {
      addPage(X0 + i * PAGE_STEP, pagesY, PAGE_W, PAGE_H, p.label, p.html);
    });

    /* closing note under the flow */
    addNote(X0, pagesY + PAGE_H + 64, 'What to look at first',
      'The orbit map on the overview, the shortest-path strip on a 2nd degree profile, and the admin graph. Those three carry the idea that distance is the product, and each one is computed from the same edge list.');
  }

  initDemo();
