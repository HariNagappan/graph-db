/* ==========================================================================
   GraphNet prototype controller
   Single-page, state in memory, no network calls.
   ========================================================================== */
(function () {
  'use strict';

  var GN = window.GN;
  var store = GN.store;
  var root = document.getElementById('root');

  var GW = 1400, GH = 520;

  var state = {
    route: 'dashboard',
    profileId: 'dave',
    tab: 'first',
    requestTab: 'received',
    query: '',
    degreeFilter: '',
    onlyMutual: false,
    pendingOnly: false,
    admin: { selected: null, page: 1, zoom: 1, hide: {} },
    auth: { step: 'email', email: '', name: '', pw: '', strength: 0, err: '' },
    menu: false,
    drawer: false,
    modal: null,
    toasts: []
  };

  /* ------------------------------------------------------------- rendering */
  function screenContent() {
    var opts = {
      tab: state.tab,
      requestTab: state.requestTab,
      query: state.query,
      degreeFilter: state.degreeFilter,
      onlyMutual: state.onlyMutual,
      pendingOnly: state.pendingOnly,
      profileId: state.profileId
    };
    if (state.route === 'profile') return GN.Screens.profile(store, opts);
    if (GN.Screens[state.route]) return GN.Screens[state.route](store, opts);
    return GN.Screens.dashboard(store, opts);
  }

  function overlays() {
    var html = '<div class="gn gn-layer">';
    if (state.menu) html += '<div id="gn-menu-layer">' + GN.profileMenu(store, { name: 'Alice Moreau', email: 'alice@demo.test' }) + '</div>';
    if (state.modal) {
      var p = store.person(state.modal);
      html += '<div class="gn-modal-veil" data-act="close-modal"><div class="gn-modal" role="dialog" aria-modal="true" aria-labelledby="gn-modal-t">' +
        '<div class="gn-modal-title" id="gn-modal-t">Remove connection?</div>' +
        '<div class="gn-modal-body">' + GN.esc(p.name) + ' will drop out of your 1st degree network. Mutual counts for both of you update right away. You can send a new request later.</div>' +
        '<div class="gn-modal-act"><button class="gn-btn gn-btn-secondary gn-btn-sm" data-act="close-modal">Cancel</button>' +
        '<button class="gn-btn gn-btn-primary gn-btn-sm" data-act="confirm-remove" data-id="' + p.id + '">Remove connection</button></div>' +
        '</div></div>';
    }
    if (state.toasts.length) {
      html += '<div class="gn-toasts">' + state.toasts.map(function (t) {
        return '<div class="gn-toast' + (t.kind === 'warn' ? ' is-warn' : '') + '" role="status">' +
          '<span class="gn-toast-ico">' + GN.icon(t.kind === 'warn' ? 'circle-alert' : 'circle-check', 15) + '</span>' +
          '<span>' + GN.esc(t.text) + '</span></div>';
      }).join('') + '</div>';
    }
    return html + '</div>';
  }

  function render() {
    var active = document.activeElement;
    var focusId = active && active.id ? active.id : null;
    var caret = null;
    try { if (active && active.selectionStart != null) caret = active.selectionStart; } catch (e) { caret = null; }

    var html;
    if (state.route === 'auth') {
      html = GN.Screens.auth({
        mode: 'app', animated: true, step: state.auth.step, email: state.auth.email,
        name: state.auth.name, pw: state.auth.pw, strength: state.auth.strength, err: state.auth.err
      });
    } else if (state.route === 'admin') {
      html = GN.Screens.admin(store, {
        mode: 'app', selected: state.admin.selected, page: state.admin.page, hide: state.admin.hide
      });
    } else {
      html = GN.shell(store, { active: state.route, mode: 'app', query: state.query, content: screenContent() });
    }
    root.innerHTML = html + overlays();

    if (state.menu) {
      var menu = document.getElementById('gn-menu');
      if (menu) {
        menu.style.position = 'fixed';
        menu.style.top = '54px';
        menu.style.right = '16px';
      }
    }
    if (state.drawer) {
      var side = document.getElementById('gn-side');
      if (side) side.classList.add('is-open');
    }
    if (focusId) {
      var el = document.getElementById(focusId);
      if (el) {
        el.focus({ preventScroll: true });
        if (caret != null && el.setSelectionRange) {
          try { el.setSelectionRange(caret, caret); } catch (e) { /* search inputs */ }
        }
      }
    }
    applyZoom();
  }

  /* ---------------------------------------------------------------- toasts */
  function toast(text, kind) {
    var id = ++state._tid || (state._tid = 1);
    state.toasts.push({ id: id, text: text, kind: kind || 'ok' });
    render();
    setTimeout(function () {
      state.toasts = state.toasts.filter(function (t) { return t.id !== id; });
      render();
    }, 3600);
  }

  /* ------------------------------------------------------------ navigation */
  function navigate(route, id, opts) {
    opts = opts || {};
    state.menu = false;
    state.drawer = false;
    if (route === 'profile') {
      state.profileId = id || GN.ME;
      state.route = 'profile';
    } else if (route === 'admin') {
      state.route = 'admin';
    } else if (route === 'auth') {
      state.route = 'auth';
    } else {
      state.route = route;
      if (route !== 'discover') state.query = route === 'discover' ? state.query : state.query;
    }
    if (opts.keepQuery !== true && route !== 'discover') state.query = '';
    render();
  }

  /* -------------------------------------------------------------- actions */
  function handleAct(act, el, ev) {
    var id = el.getAttribute('data-id');
    var p;

    switch (act) {
      case 'profile-menu':
        state.menu = !state.menu;
        render();
        return true;
      case 'menu':
        state.drawer = !state.drawer;
        render();
        return true;
      case 'signout':
        state.route = 'auth';
        state.auth = { step: 'email', email: '', name: '', pw: '', strength: 0, err: '' };
        state.menu = false;
        render();
        return true;

      case 'connect':
        p = store.person(id);
        var r = store.connect(id);
        toast(r === 'connected' ? 'You and ' + p.name + ' are now connected.' : 'Request sent to ' + p.name + '.');
        render();
        return true;
      case 'accept':
        p = store.person(id);
        store.accept(id);
        toast('You and ' + p.name + ' are now connected.');
        render();
        return true;
      case 'ignore':
        p = store.person(id);
        store.ignore(id);
        toast('Request from ' + p.name + ' ignored.', 'warn');
        render();
        return true;
      case 'withdraw':
        p = store.person(id);
        store.withdraw(id);
        toast('Request to ' + p.name + ' withdrawn.', 'warn');
        render();
        return true;
      case 'remove':
        state.modal = id;
        render();
        return true;
      case 'close-modal':
        if (ev && ev.target !== el) return true; /* ignore clicks inside the dialog */
        state.modal = null;
        render();
        return true;
      case 'confirm-remove':
        p = store.person(id);
        store.remove(id);
        state.modal = null;
        toast(p.name + ' removed from your connections.', 'warn');
        render();
        return true;

      case 'toggle-mutual':
        state.onlyMutual = !state.onlyMutual;
        render();
        return true;
      case 'open-sent':
        state.requestTab = 'sent';
        state.route = 'requests';
        state.menu = false;
        render();
        return true;
      case 'toggle-pending':
        state.pendingOnly = !state.pendingOnly;
        render();
        return true;
      case 'clear-search':
        state.query = '';
        state.degreeFilter = '';
        state.onlyMutual = false;
        state.pendingOnly = false;
        render();
        return true;

      case 'auth-email': {
        var input = document.getElementById('auth-email');
        var email = (input && input.value || '').trim().toLowerCase();
        if (!email || email.indexOf('@') < 1) {
          state.auth.err = 'Enter a valid email address.';
          render();
          return true;
        }
        state.auth.email = email;
        state.auth.err = '';
        state.auth.step = (email === 'alice@demo.test' || email === 'admin@gmail.com') ? 'password' : 'create';
        render();
        return true;
      }
      case 'auth-change-email':
        state.auth.step = 'email';
        state.auth.err = '';
        render();
        return true;
      case 'auth-signin': {
        var pwEl = document.getElementById('auth-pw');
        var pw = pwEl ? pwEl.value : '';
        if (pw !== 'Demo@123' && pw !== 'admin123') {
          state.auth.step = 'password-error';
          render();
          return true;
        }
        if (state.auth.email === 'admin@gmail.com') {
          state.route = 'admin';
          state.admin.selected = null;
          render();
          return true;
        }
        state.route = 'dashboard';
        toast('Signed in as Alice Moreau.');
        render();
        return true;
      }
      case 'auth-create': {
        var nEl = document.getElementById('auth-new');
        var np = nEl ? nEl.value : '';
        state.auth.pw = np;
        state.auth.strength = strength(np);
        if (np.length < 6 || state.auth.strength < 2) {
          state.auth.err = 'Use 6 to 64 characters with letters, numbers and one symbol.';
          render();
          return true;
        }
        state.auth.err = '';
        state.auth.step = 'name';
        render();
        return true;
      }
      case 'auth-finish': {
        var nmEl = document.getElementById('auth-name');
        var nm = (nmEl ? nmEl.value : '').trim();
        if (nm.length < 3 || nm.length > 60) {
          state.auth.err = 'A name needs 3 to 60 characters.';
          render();
          return true;
        }
        state.auth.err = '';
        state.route = 'dashboard';
        toast('Account created. You are browsing the demo network as Alice.');
        render();
        return true;
      }

      case 'page':
        state.admin.page = parseInt(el.getAttribute('data-page'), 10) || 1;
        render();
        return true;
      case 'zoom-in':
        state.admin.zoom = Math.min(3, state.admin.zoom * 1.3);
        applyZoom();
        return true;
      case 'zoom-out':
        state.admin.zoom = Math.max(1, state.admin.zoom / 1.3);
        applyZoom();
        return true;
      case 'fit':
        state.admin.zoom = 1;
        applyZoom();
        return true;
      case 'refresh':
        toast('Graph reloaded from Neo4j.');
        return true;
      case 'toggle-rel': {
        var rel = el.getAttribute('data-rel');
        state.admin.hide[rel] = !state.admin.hide[rel];
        render();
        return true;
      }
      case 'clear-select':
        state.admin.selected = null;
        render();
        return true;
      case 'centre-node':
        centreOn(id);
        return true;
      case 'focus-node':
        centreOn(id);
        return true;
      default:
        return false;
    }
  }

  /* -------------------------------------------------------- graph viewport */
  function applyZoom() {
    var svg = document.querySelector('.gn-graph');
    if (!svg) return;
    var k = state.admin.zoom;
    var w = GW / k, h = GH / k;
    svg.setAttribute('viewBox', ((GW - w) / 2).toFixed(1) + ' ' + ((GH - h) / 2).toFixed(1) + ' ' + w.toFixed(1) + ' ' + h.toFixed(1));
  }

  function centreOn(id) {
    var el = document.querySelector('.gn-graph .g-node[data-node="' + id + '"]');
    var svg = document.querySelector('.gn-graph');
    if (!el || !svg) return;
    var m = /translate\(([-\d.]+),([-\d.]+)\)/.exec(el.getAttribute('transform') || '');
    if (!m) return;
    var x = parseFloat(m[1]), y = parseFloat(m[2]);
    var k = 1.7;
    var w = GW / k, h = GH / k;
    svg.setAttribute('viewBox', (x - w / 2).toFixed(1) + ' ' + (y - h / 2).toFixed(1) + ' ' + w.toFixed(1) + ' ' + h.toFixed(1));
    state.admin.zoom = k;
  }

  function selectGraphNode(id) {
    state.admin.selected = id;
    var g = store.graph();
    var lit = {};
    lit[id] = 1;
    g.links.forEach(function (l) {
      if (l.source === id) lit[l.target] = 1;
      if (l.target === id) lit[l.source] = 1;
    });
    var nodes = document.querySelectorAll('.gn-graph .g-node');
    for (var i = 0; i < nodes.length; i++) {
      var nid = nodes[i].getAttribute('data-node');
      nodes[i].classList.toggle('is-sel', nid === id);
      nodes[i].classList.toggle('is-dim', nid !== id && !lit[nid]);
    }
    var edges = document.querySelectorAll('.gn-graph .g-edge');
    var drawn = g.links.filter(function (l) { return !state.admin.hide[l.type]; });
    for (var j = 0; j < edges.length; j++) {
      var l = drawn[j];
      if (!l) continue;
      var on = l.source === id || l.target === id;
      edges[j].classList.toggle('is-lit', on);
      edges[j].classList.toggle('is-dim', !on);
    }
    var d = document.querySelector('.gn-detail');
    if (d) d.outerHTML = GN.detailMarkup(store, id);
  }

  /* ---------------------------------------------------------------- events */
  function closeMenu() {
    if (!state.menu) return;
    state.menu = false;
    var layer = document.getElementById('gn-menu-layer');
    if (layer) layer.remove();
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;

    if (!t.closest('#gn-menu') && !t.closest('[data-act="profile-menu"]')) closeMenu();

    var nodeEl = t.closest('.gn-graph .g-node');
    if (nodeEl) {
      selectGraphNode(nodeEl.getAttribute('data-node'));
      return;
    }

    var actEl = t.closest('[data-act]');
    if (actEl) {
      if (handleAct(actEl.getAttribute('data-act'), actEl, e)) {
        e.preventDefault();
        return;
      }
    }

    var tabEl = t.closest('[data-tab]');
    if (tabEl) {
      var group = tabEl.getAttribute('data-tabgroup');
      if (group === 'requests') state.requestTab = tabEl.getAttribute('data-tab');
      else state.tab = tabEl.getAttribute('data-tab');
      e.preventDefault();
      render();
      return;
    }

    var navEl = t.closest('[data-nav]');
    if (navEl) {
      e.preventDefault();
      navigate(navEl.getAttribute('data-nav'), navEl.getAttribute('data-id'));
      return;
    }
  });

  document.addEventListener('input', function (e) {
    var t = e.target;
    if (!(t instanceof HTMLInputElement)) return;

    if (t.id === 'gn-search') {
      state.query = t.value;
      if (state.route !== 'discover') {
        state.route = 'discover';
        render();
      } else {
        render();
      }
      return;
    }

    if (t.id === 'gn-graph-search') {
      var q = t.value.trim().toLowerCase();
      if (!q) return;
      var hit = GN.order.filter(function (id) { return GN.names[id].toLowerCase().indexOf(q) > -1; })[0];
      if (hit) selectGraphNode(hit);
      return;
    }

    if (t.id === 'auth-new') {
      state.auth.pw = t.value;
      state.auth.strength = strength(t.value);
      state.auth.err = '';
      render();
      return;
    }
    if (t.id === 'auth-name') {
      state.auth.name = t.value;
      return;
    }
    if (t.id === 'auth-email') {
      state.auth.email = t.value;
      return;
    }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.getAttribute && t.getAttribute('data-act') === 'degree-filter') {
      state.degreeFilter = t.value;
      render();
    }
  });

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    var isField = t instanceof Element && t.closest('input, textarea, select');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      var s = document.getElementById('gn-search');
      if (s) { s.focus(); s.select(); }
      return;
    }
    if (e.key === 'Enter' && t && t.id === 'auth-email') { handleAct('auth-email', t, e); e.preventDefault(); return; }
    if (e.key === 'Enter' && t && t.id === 'auth-pw') { handleAct('auth-signin', t, e); e.preventDefault(); return; }
    if (e.key === 'Enter' && t && t.id === 'auth-name') { handleAct('auth-finish', t, e); e.preventDefault(); return; }
    if (e.key === 'Enter' && t && t.id === 'gn-graph-search') {
      var q = t.value.trim().toLowerCase();
      var hit = GN.order.filter(function (id) { return GN.names[id].toLowerCase().indexOf(q) > -1; })[0];
      if (hit) selectGraphNode(hit);
      e.preventDefault();
      return;
    }
    if (e.key === 'Escape') {
      if (state.modal) { state.modal = null; render(); return; }
      if (state.menu) { state.menu = false; render(); return; }
      if (state.drawer) { state.drawer = false; render(); return; }
    }
    if (!isField && e.key === '/') {
      e.preventDefault();
      var s2 = document.getElementById('gn-search');
      if (s2) s2.focus();
    }
  });

  /* pointer drag on graph nodes */
  (function graphDrag() {
    var drag = null;
    document.addEventListener('pointerdown', function (e) {
      var g = e.target instanceof Element ? e.target.closest('.gn-graph .g-node') : null;
      if (!g) return;
      var m = /translate\(([-\d.]+),([-\d.]+)\)/.exec(g.getAttribute('transform') || '');
      if (!m) return;
      drag = { el: g, x0: e.clientX, y0: e.clientY, ox: parseFloat(m[1]), oy: parseFloat(m[2]), moved: false };
      g.setPointerCapture && g.setPointerCapture(e.pointerId);
      g.style.cursor = 'grabbing';
    });
    document.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      var svg = document.querySelector('.gn-graph');
      var scale = svg ? svg.getBoundingClientRect().width / (GW / state.admin.zoom) : 1;
      var nx = drag.ox + dx / (scale || 1), ny = drag.oy + dy / (scale || 1);
      drag.el.setAttribute('transform', 'translate(' + nx.toFixed(1) + ',' + ny.toFixed(1) + ')');
    });
    document.addEventListener('pointerup', function () {
      if (!drag) return;
      drag.el.style.cursor = '';
      drag = null;
    });
  })();

  /* ------------------------------------------------------------------ boot */
  function strength(pwd) {
    var s = 0;
    if (pwd.length >= 6) s++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) s++;
    if (/\d/.test(pwd)) s++;
    if (/[\W_]/.test(pwd)) s++;
    return s;
  }

  /* A small hook so a reviewer can jump straight to any screen from the console:
     GNPrototype.go('network') or GNPrototype.go('profile', 'carol') */
  window.GNPrototype = {
    go: function (route, id) { navigate(route, id); },
    signedOut: function () {
      state.auth = { step: 'email', email: '', name: '', pw: '', strength: 0, err: '' };
      navigate('auth');
    },
    state: state
  };

  render();
})();
