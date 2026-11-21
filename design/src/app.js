/* ==========================================================================
   GraphNet - shared UI module
   Pure string rendering: no DOM access at module scope.
   Used by the interactive prototype (browser) and the canvas builder (build).
   ========================================================================== */
(function (root) {
  'use strict';

  var GN = {};

  /* ---------------------------------------------------------------- icons */
  /* Lucide geometries at 1.6 stroke, so each name maps 1:1 to lucide-react
     in the real Next.js app. */
  var PATHS = {
    'layout-dashboard': '<rect x="3" y="3" width="7" height="9" rx="1.4"/><rect x="14" y="3" width="7" height="5" rx="1.4"/><rect x="14" y="12" width="7" height="9" rx="1.4"/><rect x="3" y="16" width="7" height="5" rx="1.4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    search: '<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.3-4.3"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>',
    'user-minus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6"/>',
    'user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-left': '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-right': '<path d="m9 6 6 6-6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    'zoom-in': '<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>',
    'zoom-out': '<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/>',
    'rotate-cw': '<path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.9 1 6.7 2.7L21 8"/><path d="M21 3v5h-5"/>',
    maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    menu: '<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3.5 6h.01"/><path d="M3.5 12h.01"/><path d="M3.5 18h.01"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><path d="M8.5 19H15a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h2"/><circle cx="18" cy="19" r="2.5"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    'git-branch': '<path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    spark: '<path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="M5.6 5.6 7.7 7.7"/><path d="M16.3 16.3l2.1 2.1"/><path d="M18.4 5.6 16.3 7.7"/><path d="M7.7 16.3l-2.1 2.1"/>',
    'circle-check': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.4 2.4 4.6-4.8"/>',
    'circle-alert': '<circle cx="12" cy="12" r="9"/><path d="M12 8v4.5"/><path d="M12 16h.01"/>',
    dot: '<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',
    'more-h': '<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>',
    'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'trend-up': '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };

  function icon(name, size, cls) {
    var d = PATHS[name] || '';
    return '<svg class="' + (cls || '') + '" width="' + (size || 18) + '" height="' + (size || 18) +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + '</svg>';
  }

  GN.icon = icon;

  /* ----------------------------------------------------------------- data
     A sample network that mirrors the demo seed (Alice, Bob, Carol, Dave,
     Eve, Frank, Grace, Heidi, Ivan) extended with a few more people so the
     1st / 2nd / 3rd degree model is visible. Degrees, mutual counts and
     paths are computed from the edge list, never hard-coded.
     -------------------------------------------------------------------- */
  var NAMES = {
    alice: 'Alice Moreau',
    bob: 'Bob Whitfield',
    carol: 'Carol Mendes',
    dave: 'Dave Kessler',
    eve: 'Eve Lindqvist',
    frank: 'Frank Duarte',
    grace: 'Grace Achebe',
    heidi: 'Heidi Brunner',
    ivan: 'Ivan Petrov',
    priya: 'Priya Raghunathan',
    marcus: 'Marcus Oyelaran',
    yuki: 'Yuki Tanaka',
    daniel: 'Daniel Okafor',
    sofia: 'Sofia Bergstrom',
    ravi: 'Ravi Chandrasekhar',
    hana: 'Hana Kowalski',
    elena: 'Elena Vasquez',
    tomas: 'Tomas Ferreira',
    aisha: 'Aisha Bello',
    lars: 'Lars Ekstrom',
    meiling: 'Mei-Ling Chen',
    owen: 'Owen Fitzgerald',
    nadia: 'Nadia Haddad',
    jonas: 'Jonas Weber',
    felix: 'Felix Aubert',
    kwame: 'Kwame Asante',
    zoe: 'Zoe Marchetti',
    hiroshi: 'Hiroshi Sato',
    leila: 'Leila Nasser'
  };

  var ORDER = ['alice', 'bob', 'carol', 'priya', 'marcus', 'yuki', 'daniel', 'sofia', 'ravi', 'hana',
    'dave', 'grace', 'elena', 'tomas', 'meiling', 'aisha', 'lars', 'nadia', 'jonas', 'felix', 'owen',
    'eve', 'frank', 'heidi', 'ivan', 'kwame', 'zoe', 'hiroshi', 'leila'];

  var EDGE_LIST = [
    ['alice', 'bob'], ['alice', 'carol'], ['alice', 'priya'], ['alice', 'marcus'], ['alice', 'yuki'],
    ['alice', 'daniel'], ['alice', 'sofia'], ['alice', 'ravi'], ['alice', 'hana'],
    ['bob', 'carol'], ['bob', 'dave'], ['bob', 'owen'],
    ['carol', 'dave'], ['carol', 'grace'],
    ['priya', 'elena'], ['priya', 'nadia'],
    ['marcus', 'tomas'], ['marcus', 'felix'],
    ['yuki', 'meiling'],
    ['daniel', 'aisha'],
    ['sofia', 'tomas'], ['sofia', 'lars'],
    ['ravi', 'nadia'],
    ['hana', 'jonas'],
    ['dave', 'eve'], ['dave', 'frank'],
    ['grace', 'heidi'],
    ['owen', 'kwame'],
    ['frank', 'eve'], ['frank', 'ivan'],
    ['zoe', 'hiroshi']
  ];

  var REQUEST_LIST = [
    { from: 'ivan', to: 'alice' },
    { from: 'hiroshi', to: 'alice' },
    { from: 'nadia', to: 'alice' },
    { from: 'alice', to: 'kwame' },
    { from: 'alice', to: 'leila' }
  ];

  var ME = 'alice';

  function Store() {
    this.edges = EDGE_LIST.map(function (e) { return [e[0], e[1]]; });
    this.requests = REQUEST_LIST.map(function (r) { return { from: r.from, to: r.to }; });
    this._cache = null;
  }

  Store.prototype.invalidate = function () { this._cache = null; };

  Store.prototype.neighbors = function (id) {
    var out = [];
    this.edges.forEach(function (e) {
      if (e[0] === id) out.push(e[1]);
      else if (e[1] === id) out.push(e[0]);
    });
    return out;
  };

  Store.prototype.connected = function (a, b) {
    return this.edges.some(function (e) {
      return (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a);
    });
  };

  Store.prototype.degree = function (id) {
    if (id === ME) return 0;
    var n = this.neighbors(ME);
    if (n.indexOf(id) > -1) return 1;
    var seen = {}, queue = [];
    n.forEach(function (x) { seen[x] = 1; queue.push([x, 1]); });
    while (queue.length) {
      var cur = queue.shift();
      if (cur[1] >= 3) continue;
      var nexts = this.neighbors(cur[0]);
      for (var i = 0; i < nexts.length; i++) {
        var nx = nexts[i];
        if (nx === ME || seen[nx]) continue;
        seen[nx] = 1;
        if (nx === id) return cur[1] + 1;
        queue.push([nx, cur[1] + 1]);
      }
    }
    return null;
  };

  Store.prototype.mutual = function (id) {
    if (id === ME) return [];
    var mine = this.neighbors(ME);
    var theirs = this.neighbors(id);
    return theirs.filter(function (x) { return x !== ME && x !== id && mine.indexOf(x) > -1; });
  };

  Store.prototype.path = function (id) {
    if (id === ME) return [ME];
    var prev = {}, seen = {}, queue = [ME];
    seen[ME] = 1;
    while (queue.length) {
      var cur = queue.shift();
      var nexts = this.neighbors(cur);
      for (var i = 0; i < nexts.length; i++) {
        var nx = nexts[i];
        if (seen[nx]) continue;
        seen[nx] = 1;
        prev[nx] = cur;
        if (nx === id) {
          var p = [id], k = id;
          while (prev[k]) { k = prev[k]; p.unshift(k); }
          return p;
        }
        queue.push(nx);
      }
    }
    return null;
  };

  Store.prototype.status = function (id) {
    if (id === ME) return 'self';
    if (this.connected(ME, id)) return 'connected';
    if (this.requests.some(function (r) { return r.from === ME && r.to === id; })) return 'sent';
    if (this.requests.some(function (r) { return r.from === id && r.to === ME; })) return 'received';
    return 'none';
  };

  Store.prototype.person = function (id) {
    var m = this.mutual(id);
    return {
      id: id,
      name: NAMES[id],
      degree: this.degree(id),
      mutual: m.length,
      mutualIds: m,
      status: this.status(id)
    };
  };

  Store.prototype.people = function () {
    var self = this;
    return ORDER.filter(function (id) { return id !== ME; }).map(function (id) { return self.person(id); });
  };

  Store.prototype.byDegree = function () {
    var all = this.people();
    return {
      all: all,
      first: all.filter(function (p) { return p.degree === 1; }),
      second: all.filter(function (p) { return p.degree === 2; }),
      third: all.filter(function (p) { return p.degree === 3; }),
      outside: all.filter(function (p) { return p.degree === null; })
    };
  };

  Store.prototype.received = function () {
    var self = this;
    return this.requests.filter(function (r) { return r.to === ME; })
      .map(function (r) { return self.person(r.from); });
  };

  Store.prototype.sent = function () {
    var self = this;
    return this.requests.filter(function (r) { return r.from === ME; })
      .map(function (r) { return self.person(r.to); });
  };

  Store.prototype.suggested = function (n) {
    return this.people()
      .filter(function (p) { return (p.degree === 2 || p.degree === 3) && p.mutual > 0 && p.status === 'none'; })
      .sort(function (a, b) { return b.mutual - a.mutual || a.name.localeCompare(b.name); })
      .slice(0, n || 3);
  };

  Store.prototype.connect = function (id) {
    if (this.status(id) === 'received') return this.accept(id);
    this.requests.push({ from: ME, to: id });
    this.invalidate();
    return 'sent';
  };

  Store.prototype.accept = function (id) {
    this.requests = this.requests.filter(function (r) { return !(r.from === id && r.to === ME); });
    if (!this.connected(ME, id)) this.edges.push([ME, id]);
    this.invalidate();
    return 'connected';
  };

  Store.prototype.ignore = function (id) {
    this.requests = this.requests.filter(function (r) { return !(r.from === id && r.to === ME); });
    this.invalidate();
  };

  Store.prototype.withdraw = function (id) {
    this.requests = this.requests.filter(function (r) { return !(r.from === ME && r.to === id); });
    this.invalidate();
  };

  Store.prototype.remove = function (id) {
    this.edges = this.edges.filter(function (e) {
      return !((e[0] === ME && e[1] === id) || (e[1] === ME && e[0] === id));
    });
    this.invalidate();
  };

  /* One id space across both databases: the same value keys the SQLite row and
     the Neo4j node, exactly like users.id = (:User {id}) in the real app. */
  function uidFor(slug) {
    var h = 2166136261;
    for (var i = 0; i < slug.length; i++) { h ^= slug.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return 'u_' + ('0000000' + h.toString(16)).slice(-8);
  }
  GN.uidFor = uidFor;

  /* admin: whole graph */
  Store.prototype.graph = function () {
    var nodes = ORDER.map(function (id) {
      return { id: id, uid: uidFor(id), name: NAMES[id], connections: 0, incoming: 0, outgoing: 0 };
    });
    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });
    var links = [];
    this.edges.forEach(function (e) {
      links.push({ source: e[0], target: e[1], type: 'CONNECTED' });
      byId[e[0]].connections++;
      byId[e[1]].connections++;
    });
    this.requests.forEach(function (r) {
      links.push({ source: r.from, target: r.to, type: 'REQUESTED' });
      byId[r.to].incoming++;
      byId[r.from].outgoing++;
    });
    return { nodes: nodes, links: links };
  };

  /* users table (SQLite side) */
  Store.prototype.users = function () {
    var rows = [{ id: uidFor('admin'), email: 'admin@gmail.com', role: 'admin', created_at: '2025-11-03 09:12:44' }];
    ORDER.forEach(function (id, i) {
      rows.push({
        id: uidFor(id),
        email: id + '@demo.test',
        role: 'user',
        created_at: '2025-11-' + String(4 + (i % 16)).padStart(2, '0') + ' ' + String(9 + (i % 8)).padStart(2, '0') + ':' + String(10 + ((i * 7) % 48)).padStart(2, '0') + ':' + String(20 + ((i * 11) % 38)).padStart(2, '0')
      });
    });
    return rows;
  };

  GN.Store = Store;
  GN.ME = ME;
  GN.names = NAMES;
  GN.order = ORDER;
  GN.store = new Store();

  /* ------------------------------------------------------------ utilities */
  function initials(name) {
    var parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function tint(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 9973;
    return 't' + (h % 8);
  }

  function firstName(name) { return name.split(' ')[0]; }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }

  GN.initials = initials;
  GN.esc = esc;

  /* ----------------------------------------------------------- components */
  function avatar(p, size) {
    return '<span class="gn-av gn-av-' + (size || 'md') + ' ' + tint(p.name) + '">' + initials(p.name) + '</span>';
  }

  function ring(p, size) {
    var d = p.status === 'self' ? 0 : p.degree;
    var cls = 'gn-ring gn-ring-' + (d === null ? 0 : d);
    if (d === 2) cls += ' is-dashed';
    if (d === 3) cls += ' is-dotted';
    return '<span class="' + cls + '">' + avatar(p, size) + '</span>';
  }

  var DEG_TEXT = { 0: 'You', 1: '1st', 2: '2nd', 3: '3rd' };

  function degBadge(p) {
    if (p.status === 'self') return '<span class="gn-deg gn-deg-self">You</span>';
    if (p.degree === null) return '<span class="gn-deg gn-deg-0">Outside</span>';
    return '<span class="gn-deg gn-deg-' + p.degree + '">' + DEG_TEXT[p.degree] + '</span>';
  }

  function metaLine(store, p) {
    if (p.status === 'self') return 'This is you';
    if (p.status === 'received') return 'Wants to connect with you';
    if (p.status === 'connected') return plural(store.neighbors(p.id).length, 'connection');
    if (p.mutual > 0) return plural(p.mutual, 'mutual connection');
    return p.degree === null ? 'No path within 3 steps' : 'No mutual connections';
  }

  function viaText(store, p) {
    if (p.degree !== 2) return null;
    var bridges = store.neighbors(p.id).filter(function (n) {
      return n !== ME && store.degree(n) === 1;
    });
    if (!bridges.length) return null;
    var names = bridges.map(function (id) { return firstName(NAMES[id]); });
    return names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
  }

  function actions(p, opts) {
    opts = opts || {};
    var id = esc(p.id);
    var size = opts.small ? ' gn-btn-xs' : ' gn-btn-sm';
    var html = '';
    if (p.status === 'none') {
      html += '<button class="gn-btn gn-btn-primary' + size + '" data-act="connect" data-id="' + id + '">' +
        icon('user-plus', 13) + 'Connect</button>';
    } else if (p.status === 'sent') {
      html += '<span class="gn-deg gn-deg-0" style="height:22px">Pending</span>';
      html += '<button class="gn-btn gn-btn-quiet' + size + '" data-act="withdraw" data-id="' + id + '">Withdraw</button>';
    } else if (p.status === 'received') {
      html += '<button class="gn-btn gn-btn-secondary' + size + '" data-act="ignore" data-id="' + id + '">Ignore</button>';
      html += '<button class="gn-btn gn-btn-primary' + size + '" data-act="accept" data-id="' + id + '">' + icon('check', 13) + 'Accept</button>';
    } else if (p.status === 'connected') {
      html += '<button class="gn-btn gn-btn-ghost' + size + '" data-act="remove" data-id="' + id + '">' + icon('user-minus', 13) + 'Remove</button>';
    }
    return html;
  }

  function personCard(p, store, compact) {
    var via = (p.degree === 2 && viaText(store, p)) ? '<span class="gn-dim">via ' + esc(viaText(store, p)) + '</span>' : '';
    var sub = metaLine(store, p);
    return '<article class="gn-person" data-card="' + esc(p.id) + '">' +
      '<div class="gn-person-top">' + ring(p, compact ? 'md' : 'lg') +
      '<div class="gn-person-id">' +
      '<a class="gn-person-name" href="#/profile/' + esc(p.id) + '" data-nav="profile" data-id="' + esc(p.id) + '">' + esc(p.name) + '</a>' +
      '<div class="gn-person-meta">' + sub + (via ? ' ' + via : '') + '</div>' +
      '</div></div>' +
      '<span class="gn-person-badge">' + degBadge(p) + '</span>' +
      '<div class="gn-person-b">' +
      '<a class="gn-btn gn-btn-ghost gn-btn-xs" href="#/profile/' + esc(p.id) + '" data-nav="profile" data-id="' + esc(p.id) + '">View profile' + icon('arrow-up-right', 12) + '</a>' +
      '<span class="gn-spacer"></span>' + actions(p, { small: true }) +
      '</div></article>';
  }

  function personRow(p, store, opts) {
    opts = opts || {};
    var act = opts.noRemove && p.status === 'connected'
      ? '<span class="gn-tiny gn-dim">Connected</span>'
      : actions(p, { small: true });
    var via = (p.degree === 2 && viaText(store, p)) ? ' <span class="gn-dim">· via ' + esc(viaText(store, p)) + '</span>' : '';
    return '<div class="gn-row">' + ring(p, 'md') +
      '<div class="gn-row-txt">' +
      '<div class="gn-row-name"><a href="#/profile/' + esc(p.id) + '" data-nav="profile" data-id="' + esc(p.id) + '">' + esc(p.name) + '</a>' + degBadge(p) + '</div>' +
      '<div class="gn-row-sub">' + metaLine(store, p) + via + '</div>' +
      '</div><div class="gn-row-act">' + act + '</div></div>';
  }

  function statBand(counts) {
    function cell(k, v, label, extra) {
      return '<div class="gn-stat"><div class="gn-stat-v">' + v + (extra ? ' <span class="u">' + extra + '</span>' : '') + '</div>' +
        '<div class="gn-stat-l"><span class="gn-stat-k k' + k + '"></span>' + label + '</div></div>';
    }
    return '<div class="gn-stats">' +
      cell(1, counts.first, '1st degree') +
      cell(2, counts.second, '2nd degree') +
      cell(3, counts.third, '3rd degree') +
      cell(0, counts.received, 'Requests waiting') +
      '</div>';
  }

  /* orbit map: radius encodes distance, spokes show direct ties */
  function orbitMap(store, opts) {
    opts = opts || {};
    var W = 640, H = 300;
    var cx = W / 2, cy = H / 2;
    var rad = { 1: 78, 2: 112, 3: 138, out: 156 };
    var bd = store.byDegree();
    var pos = {}, ang = {};
    var first = bd.first.slice();
    first.sort(function (a, b) { return a.name.localeCompare(b.name); });
    first.forEach(function (p, i) { ang[p.id] = -Math.PI / 2 + (i / first.length) * Math.PI * 2; });
    function meanAngle(ids) {
      if (!ids.length) return -Math.PI / 2;
      var sx = 0, sy = 0;
      ids.forEach(function (id) { if (ang[id] !== undefined) { sx += Math.cos(ang[id]); sy += Math.sin(ang[id]); } });
      if (!sx && !sy) return -Math.PI / 2;
      return Math.atan2(sy, sx);
    }
    first.forEach(function (p) { pos[p.id] = { a: ang[p.id], r: rad[1], p: p }; });
    bd.second.forEach(function (p) {
      var parents = store.neighbors(p.id).filter(function (n) { return ang[n] !== undefined; });
      var a = meanAngle(parents);
      ang[p.id] = a;
      pos[p.id] = { a: a, r: rad[2], p: p };
    });
    bd.third.forEach(function (p) {
      var parents = store.neighbors(p.id).filter(function (n) { return ang[n] !== undefined; });
      var a = meanAngle(parents);
      ang[p.id] = a;
      pos[p.id] = { a: a, r: rad[3], p: p };
    });
    /* People outside the 3 hop radius are counted in the legend, not plotted:
       by definition they have no position inside the rings. */

    function xy(id) {
      var q = pos[id];
      return { x: cx + Math.cos(q.a) * q.r, y: cy + Math.sin(q.a) * q.r };
    }

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Your network by degree">';
    svg += '<circle class="orb-ring r1" cx="' + cx + '" cy="' + cy + '" r="' + rad[1] + '"/>';
    svg += '<circle class="orb-ring" cx="' + cx + '" cy="' + cy + '" r="' + rad[2] + '"/>';
    svg += '<circle class="orb-ring" cx="' + cx + '" cy="' + cy + '" r="' + rad[3] + '" stroke-dasharray="2 6"/>';

    /* ties: real edges projected onto the radius map */
    store.edges.forEach(function (e) {
      var a = e[0], b = e[1];
      if (!pos[a] || !pos[b]) return;
      if (a === ME || b === ME) return;
      var pa = pos[a].p.degree, pb = pos[b].p.degree;
      var A = xy(a), B = xy(b);
      var cls;
      if (pa === null && pb === null) cls = 'tie-3';
      else {
        var outer = Math.max(pa === null ? 9 : pa, pb === null ? 9 : pb);
        if (outer > 3) return;
        cls = outer >= 3 ? 'tie-3' : 'tie';
      }
      svg += '<line class="' + cls + '" x1="' + A.x.toFixed(1) + '" y1="' + A.y.toFixed(1) + '" x2="' + B.x.toFixed(1) + '" y2="' + B.y.toFixed(1) + '"/>';
    });

    /* spokes to first degree */
    first.forEach(function (p) {
      var q = xy(p.id);
      svg += '<line class="spoke" x1="' + cx + '" y1="' + cy + '" x2="' + q.x.toFixed(1) + '" y2="' + q.y.toFixed(1) + '"/>';
    });

    /* nodes */
    Object.keys(pos).forEach(function (id) {
      var q = xy(id), p = pos[id].p;
      var fill = p.degree === 1 ? '#1d1636' : p.degree === 2 ? '#0f2630' : p.degree === 3 ? '#1e1b33' : '#10131f';
      var stroke = p.degree === 1 ? 'rgba(142,111,255,0.85)' : p.degree === 2 ? 'rgba(53,214,222,0.7)' : p.degree === 3 ? 'rgba(185,168,255,0.45)' : 'rgba(148,163,209,0.22)';
      var dash = p.degree === 2 ? ' stroke-dasharray="3 2.4"' : p.degree === 3 ? ' stroke-dasharray="1 3"' : '';
      svg += '<g class="orb-node" data-id="' + esc(id) + '" data-nav="profile" data-act-node="1">' +
        '<title>' + esc(p.name) + ' - ' + (p.degree === null ? 'outside your network' : p.degree + ' degree, ' + plural(p.mutual, 'mutual')) + '</title>' +
        '<circle cx="' + q.x.toFixed(1) + '" cy="' + q.y.toFixed(1) + '" r="13" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.3"' + dash + '/>' +
        '<text x="' + q.x.toFixed(1) + '" y="' + (q.y + 3).toFixed(1) + '" text-anchor="middle" font-family="Cascadia Mono, Consolas, monospace" font-size="8.6" fill="#c3cbe0" pointer-events="none">' + initials(p.name) + '</text>' +
        '</g>';
    });

    /* you */
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="21" fill="#6c4bf2" stroke="rgba(196,178,255,0.85)" stroke-width="1.5"/>';
    svg += '<text x="' + cx + '" y="' + (cy + 3.5) + '" text-anchor="middle" font-family="Cascadia Mono, Consolas, monospace" font-size="10.5" font-weight="600" fill="#fff">' + initials(NAMES[ME]) + '</text>';
    svg += '</svg>';

    return '<div class="gn-orbit">' + svg + '</div>';
  }

  GN.avatar = avatar;
  GN.ring = ring;
  GN.degBadge = degBadge;
  GN.actions = actions;
  GN.personCard = personCard;
  GN.personRow = personRow;
  GN.orbitMap = orbitMap;

  /* ------------------------------------------------------------- the shell */
  var NAV = [
    { key: 'dashboard', label: 'Overview', icon: 'layout-dashboard' },
    { key: 'network', label: 'My network', icon: 'users' },
    { key: 'discover', label: 'Discover', icon: 'compass' },
    { key: 'requests', label: 'Requests', icon: 'inbox' }
  ];

  function brandMark(size) {
    return '<svg class="gn-brand-mark" width="' + (size || 26) + '" height="' + (size || 26) + '" viewBox="0 0 26 26" fill="none" aria-hidden="true">' +
      '<path d="M6.4 18.6 12.6 6.2M13.4 6.2h6.2M19.6 6.6v11.8M6.8 19.2h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>' +
      '<circle cx="12.6" cy="6.2" r="2.2" fill="currentColor"/>' +
      '<circle cx="6.4" cy="18.8" r="2.2" fill="currentColor"/>' +
      '<circle cx="19.6" cy="18.6" r="2.2" fill="currentColor"/>' +
      '<circle cx="13" cy="19" r="1.5" fill="currentColor" opacity=".5"/>' +
      '</svg>';
  }

  function topbar(store, opts) {
    var rec = store.received().length;
    return '<header class="gn-top">' +
      '<button class="gn-iconbtn" data-act="menu" aria-label="Open navigation" data-menu-btn="1">' + icon('menu', 18) + '</button>' +
      '<div class="gn-search">' + icon('search', 15, 'gn-search-ico') +
      '<input type="search" id="gn-search" placeholder="Search people" aria-label="Search people" value="' + esc(opts.query || '') + '">' +
      '<span class="gn-kbd">Ctrl K</span></div>' +
      '<div class="gn-top-right">' +
      '<button class="gn-iconbtn" data-nav="requests" aria-label="Requests' + (rec ? ', ' + rec + ' waiting' : '') + '">' + icon('inbox', 18) + (rec ? '<span class="gn-dot"></span>' : '') + '</button>' +
      '<span class="gn-top-sep"></span>' +
      '<button class="gn-userbtn" style="width:auto;padding:4px 6px 4px 4px" data-act="profile-menu" aria-haspopup="menu" aria-expanded="false">' +
      ring({ name: opts.user.name, degree: 0, status: 'self' }, 'sm') +
      '<span class="gn-userbtn-txt"><span class="gn-userbtn-name">' + esc(opts.user.name) + '</span></span>' +
      icon('chevron-down', 14) + '</button>' +
      '</div></header>';
  }

  function profileMenu(store, user) {
    return '<div class="gn-menu" id="gn-menu" role="menu">' +
      '<div class="gn-menu-head">' +
      '<div style="font-size:12.5px;font-weight:650">' + esc(user.name) + '</div>' +
      '<div class="gn-tiny gn-dim" style="margin-top:2px">' + esc(user.email) + '</div>' +
      '</div>' +
      '<a class="gn-menu-item" href="#/profile/' + ME + '" data-nav="profile" data-id="' + ME + '">' + icon('user', 15) + 'My profile</a>' +
      '<a class="gn-menu-item" href="#/network" data-nav="network">' + icon('users', 15) + 'My connections</a>' +
      '<div class="gn-menu-sep"></div>' +
      '<button class="gn-menu-item" data-act="signout">' + icon('log-out', 15) + 'Sign out</button>' +
      '</div>';
  }

  function sidebar(store, active, user) {
    var rec = store.received().length;
    var items = NAV.map(function (n) {
      var badge = n.key === 'requests' && rec ? '<span class="gn-nav-badge">' + rec + '</span>' : '';
      return '<a class="gn-nav-item' + (active === n.key ? ' is-active' : '') + '" href="#/' + n.key + '" data-nav="' + n.key + '">' +
        '<span class="gn-nav-ico">' + icon(n.icon, 17) + '</span>' + n.label + badge + '</a>';
    }).join('');
    return '<aside class="gn-side" id="gn-side">' +
      '<div class="gn-brand"><a href="#/dashboard" data-nav="dashboard" style="display:flex;align-items:center;gap:9px">' + brandMark(26) +
      '<span class="gn-wordmark">GraphNet</span></a></div>' +
      '<nav class="gn-nav" aria-label="Primary">' + items + '</nav>' +
      '</aside>';
  }

  function shell(store, opts) {
    var user = opts.user || { name: NAMES[ME], email: 'alice@demo.test' };
    return '<div class="gn gn-shell" data-mode="' + (opts.mode || 'app') + '">' +
      sidebar(store, opts.active, user) +
      '<div class="gn-main">' + topbar(store, { user: user, query: opts.query }) +
      '<div class="gn-scroll" id="gn-scroll"><div class="gn-page">' + opts.content + '</div></div>' +
      '</div>' + (opts.overlay || '') + '</div>';
  }

  GN.shell = shell;
  GN.profileMenu = profileMenu;
  GN.brandMark = brandMark;

  /* ---------------------------------------------------------------- screens */
  var Screens = {};

  Screens.dashboard = function (store) {
    var bd = store.byDegree();
    var rec = store.received();
    var sent = store.sent();
    var sug = store.suggested(3);
    var total = bd.all.length;
    var within = total - bd.outside.length;

    var head = '<div class="gn-page-head"><div class="gn-page-head-txt">' +
      '<div class="gn-eyebrow">Network overview</div>' +
      '<h1 class="gn-h1" style="margin-top:7px">Good evening, ' + firstName(NAMES[ME]) + '</h1>' +
      '<p class="gn-sub" style="margin-top:6px;max-width:520px">' + bd.first.length +
      ' people know you directly. ' + (bd.second.length + bd.third.length) +
      ' more sit one or two steps out.</p></div>' +
      '<div class="gn-page-head-actions">' +
      '<a class="gn-btn gn-btn-secondary" href="#/network" data-nav="network">' + icon('users', 15) + 'My network</a>' +
      '<a class="gn-btn gn-btn-primary" href="#/discover" data-nav="discover">' + icon('compass', 15) + 'Find people</a>' +
      '</div></div>';

    var legend = [['k1', '1st degree', bd.first.length, 'direct connections'],
      ['k2', '2nd degree', bd.second.length, 'one step out'],
      ['k3', '3rd degree', bd.third.length, 'two steps out'],
      ['k0', 'Outside', bd.outside.length, 'no path in 3']].map(function (r, i) {
        return '<div style="display:flex;align-items:center;gap:9px;padding:8px 0' + (i ? ';border-top:1px solid var(--g-line)' : '') + '">' +
          '<span class="gn-orbit-key"><i class="' + r[0] + '"></i></span>' +
          '<div style="min-width:0"><div style="font-size:11.5px;color:var(--g-text-2)">' + r[1] + '</div>' +
          '<div class="gn-tiny gn-dim" style="margin-top:1px">' + r[3] + '</div></div>' +
          '<span class="gn-num" style="margin-left:auto;color:var(--g-text)">' + r[2] + '</span></div>';
      }).join('');

    var map = '<section class="gn-card">' +
      '<div class="gn-card-h"><span class="gn-card-title">Network map</span>' +
      '<span class="gn-card-meta">' + within + ' of ' + total + ' inside 3 steps</span>' +
      '<span class="gn-card-act"><a class="gn-btn gn-btn-ghost gn-btn-xs" href="#/network" data-nav="network">Open' + icon('arrow-right', 12) + '</a></span></div>' +
      '<div class="gn-card-b gn-map-body" style="padding:10px 14px;height:300px;display:flex;gap:10px;align-items:center">' +
      '<div class="gn-map-legend" style="flex:0 0 146px;align-self:stretch;display:flex;flex-direction:column;justify-content:center">' + legend + '</div>' +
      '<div style="flex:1;min-width:0;height:100%">' + orbitMap(store) + '</div>' +
      '</div></section>';

    var sentRow = '<div class="gn-card-f" style="padding:11px 16px">' +
      '<span class="gn-tiny gn-dim"><span class="gn-num" style="color:var(--g-text-2)">' + sent.length + '</span> sent · awaiting response</span>' +
      '<button class="gn-btn gn-btn-ghost gn-btn-xs" style="margin-left:auto" data-act="open-sent">View sent' + icon('arrow-right', 12) + '</button></div>';

    var reqCard = '<section class="gn-card">' +
      '<div class="gn-card-h"><span class="gn-card-title">Requests</span>' +
      '<span class="gn-card-meta">' + rec.length + ' waiting</span>' +
      '<span class="gn-card-act"><a class="gn-btn gn-btn-ghost gn-btn-xs" href="#/requests" data-nav="requests">View all</a></span></div>' +
      (rec.length ? rec.slice(0, 3).map(function (p) {
        return '<div class="gn-row">' + ring(p, 'md') +
          '<div class="gn-row-txt"><div class="gn-row-name">' + esc(p.name) + '</div>' +
          '<div class="gn-row-sub">' + (p.mutual ? plural(p.mutual, 'mutual connection') : 'No mutual connections') + '</div></div>' +
          '<div class="gn-row-act"><button class="gn-btn gn-btn-secondary gn-btn-xs" data-act="ignore" data-id="' + p.id + '">Ignore</button>' +
          '<button class="gn-btn gn-btn-primary gn-btn-xs" data-act="accept" data-id="' + p.id + '">Accept</button></div></div>';
      }).join('') : '<div class="gn-empty" style="padding:26px"><div class="gn-empty-t">No requests waiting</div><div class="gn-empty-d">New invitations will appear here.</div></div>') +
      sentRow + '</section>';

    var sugSection = '<div class="gn-flex gn-ic" style="margin:26px 0 12px">' +
      '<h2 class="gn-h2">People you may know</h2>' +
      '<span class="gn-tiny gn-dim" style="margin-left:10px">Ranked by mutual connections</span>' +
      '<a class="gn-btn gn-btn-ghost gn-btn-sm" style="margin-left:auto" href="#/discover" data-nav="discover">See all' + icon('arrow-right', 13) + '</a>' +
      '</div>' +
      '<div class="gn-people">' + sug.map(function (p) { return personCard(p, store, true); }).join('') + '</div>';

    return head + statBand({
      first: bd.first.length, second: bd.second.length, third: bd.third.length, received: rec.length
    }) + '<div class="gn-2col" style="margin-top:14px">' + map +
      '<div class="gn-stack">' + reqCard + '</div></div>' + sugSection;
  };
  Screens.network = function (store, opts) {
    var bd = store.byDegree();
    var tab = opts.tab || 'first';
    var maps = { all: bd.all, first: bd.first, second: bd.second, third: bd.third, outside: bd.outside };
    var list = (maps[tab] || bd.first).filter(function (p) {
      if (opts.onlyMutual && p.mutual === 0) return false;
      if (opts.pendingOnly && p.status !== 'sent' && p.status !== 'received') return false;
      return true;
    });
    var titles = {
      all: 'Everyone in your network', first: 'Your 1st degree connections',
      second: 'Two steps away', third: 'Three steps away', outside: 'Outside your network'
    };

    var tabs = [['all', 'All', bd.all.length], ['first', '1st', bd.first.length], ['second', '2nd', bd.second.length],
      ['third', '3rd', bd.third.length], ['outside', 'Outside', bd.outside.length]].map(function (t) {
        return '<button class="gn-tab' + (tab === t[0] ? ' is-active' : '') + '" data-tab="' + t[0] + '" data-tabgroup="network">' +
          t[1] + '<span class="gn-tab-n">' + t[2] + '</span></button>';
      }).join('');

    var head = '<div class="gn-page-head"><div class="gn-page-head-txt">' +
      '<h1 class="gn-h1">My network</h1>' +
      '<p class="gn-sub" style="margin-top:6px">' + bd.all.length + ' people. Sort by distance, then by mutual connections.</p></div>' +
      '<div class="gn-page-head-actions">' +
      '<select class="gn-select" aria-label="Sort people">' +
      '<option>Distance, then mutuals</option><option>Most mutual connections</option><option>Name A to Z</option></select>' +
      '<div style="display:flex;gap:2px;border:1px solid var(--g-line-2);border-radius:9px;padding:2px">' +
      '<button class="gn-iconbtn" style="width:26px;height:26px;background:var(--g-violet-a);color:var(--g-violet)" aria-label="Grid view" aria-pressed="true">' + icon('grid', 14) + '</button>' +
      '<button class="gn-iconbtn" style="width:26px;height:26px" aria-label="List view" aria-pressed="false">' + icon('list', 14) + '</button>' +
      '</div></div></div>';

    var bar = '<div class="gn-tabs gn-tabs-lg">' + tabs + '</div>' +
      '<div class="gn-flex gn-ic gn-gap-8" style="margin:14px 0 16px">' +
      '<div class="gn-chips">' +
      '<button class="gn-chip' + (opts.onlyMutual ? ' is-on' : '') + '" data-act="toggle-mutual">' + icon('git-branch', 12) + 'Has mutual connections</button>' +
      '<button class="gn-chip' + (opts.pendingOnly ? ' is-on' : '') + '" data-act="toggle-pending">' + icon('clock', 12) + 'Pending</button>' +
      '</div>' +
      '<span class="gn-tiny gn-dim" style="margin-left:auto">' + titles[tab] + ' · showing ' + list.length + '</span></div>';

    var body = list.length
      ? '<div class="gn-people">' + list.map(function (p) { return personCard(p, store); }).join('') + '</div>'
      : '<div class="gn-card"><div class="gn-empty"><div class="gn-empty-ico">' + icon('users', 20) + '</div>' +
      '<div class="gn-empty-t">Nobody in this band yet</div>' +
      '<div class="gn-empty-d">Connect with more people and this view fills up.</div>' +
      '<a class="gn-btn gn-btn-primary gn-btn-sm" href="#/discover" data-nav="discover">Find people</a></div></div>';

    return head + bar + body;
  };

  Screens.discover = function (store, opts) {
    var q = (opts.query || '').trim().toLowerCase();
    var bd = store.byDegree();
    var list = bd.all.filter(function (p) {
      if (q && p.name.toLowerCase().indexOf(q) === -1) return false;
      if (opts.degreeFilter && String(p.degree) !== String(opts.degreeFilter)) return false;
      if (opts.onlyMutual && p.mutual === 0) return false;
      if (opts.pendingOnly && p.status !== 'sent' && p.status !== 'received') return false;
      return true;
    });

    /* Actionable people first, then the strongest mutual overlap, then distance. */
    var rank = { none: 0, received: 0, sent: 1, connected: 2, self: 3 };
    list.sort(function (a, b) {
      var r = rank[a.status] - rank[b.status];
      if (r) return r;
      if (b.mutual !== a.mutual) return b.mutual - a.mutual;
      var da = a.degree === null ? 9 : a.degree;
      var db = b.degree === null ? 9 : b.degree;
      if (da !== db) return da - db;
      return a.name.localeCompare(b.name);
    });

    var head = '<div class="gn-page-head"><div class="gn-page-head-txt">' +
      '<h1 class="gn-h1">Discover people</h1>' +
      '<p class="gn-sub" style="margin-top:6px">Search the whole network by name. Distance and mutual connections come from the graph.</p></div></div>';

    var searchBar = '<div class="gn-card" style="padding:14px">' +
      '<div class="gn-search" style="max-width:none;height:44px;background:#0a0d17">' + icon('search', 17, 'gn-search-ico') +
      '<input type="search" id="gn-search" placeholder="Search by first or last name" aria-label="Search people by name" value="' + esc(opts.query || '') + '" style="font-size:14px;padding-right:14px">' +
      '</div>' +
      '<div class="gn-flex gn-ic gn-gap-8" style="margin-top:12px">' +
      '<div class="gn-chips">' +
      '<button class="gn-chip' + (opts.onlyMutual ? ' is-on' : '') + '" data-act="toggle-mutual">' + icon('git-branch', 12) + 'Has mutual connections</button>' +
      '<button class="gn-chip' + (opts.pendingOnly ? ' is-on' : '') + '" data-act="toggle-pending">' + icon('clock', 12) + 'Pending only</button>' +
      '</div>' +
      '<div class="gn-ml-auto gn-flex gn-ic gn-gap-8">' +
      '<span class="gn-tiny gn-dim">Degree</span>' +
      '<select class="gn-select" data-act="degree-filter" aria-label="Filter by degree">' +
      '<option value="">Any distance</option>' +
      '<option value="1"' + (opts.degreeFilter === '1' ? ' selected' : '') + '>1st degree</option>' +
      '<option value="2"' + (opts.degreeFilter === '2' ? ' selected' : '') + '>2nd degree</option>' +
      '<option value="3"' + (opts.degreeFilter === '3' ? ' selected' : '') + '>3rd degree</option>' +
      '<option value="null"' + (opts.degreeFilter === 'null' ? ' selected' : '') + '>Outside network</option>' +
      '</select></div></div></div>';

    var results = '<section class="gn-card" style="margin-top:14px">' +
      '<div class="gn-card-h"><span class="gn-card-title">Results</span>' +
      '<span class="gn-card-meta">' + list.length + ' ' + (list.length === 1 ? 'person' : 'people') + '</span>' +
      (q ? '<span class="gn-card-act"><button class="gn-btn gn-btn-ghost gn-btn-xs" data-act="clear-search">Clear search</button></span>' : '') +
      '</div>';

    if (!list.length) {
      results += '<div class="gn-empty"><div class="gn-empty-ico">' + icon('compass', 20) + '</div>' +
        '<div class="gn-empty-t">No one matches "' + esc(opts.query || '') + '"</div>' +
        '<div class="gn-empty-d">Search matches names only. Try a first name, or clear the filters.</div>' +
        '<button class="gn-btn gn-btn-secondary gn-btn-sm" data-act="clear-search">Clear search</button></div>';
    } else {
      results += list.map(function (p) { return personRow(p, store); }).join('');
    }
    results += '</section>';

    return head + searchBar + results;
  };

  Screens.requests = function (store, opts) {
    var rec = store.received();
    var sent = store.sent();

    var head = '<div class="gn-page-head"><div class="gn-page-head-txt">' +
      '<h1 class="gn-h1">Requests</h1>' +
      '<p class="gn-sub" style="margin-top:6px">' + rec.length + ' waiting for your answer, ' + sent.length + ' sent by you.</p></div>' +
      '<div class="gn-page-head-actions">' +
      '<a class="gn-btn gn-btn-primary" href="#/discover" data-nav="discover">' + icon('compass', 15) + 'Find people</a>' +
      '</div></div>';

    var received = '<section class="gn-card">' +
      '<div class="gn-card-h"><span class="gn-card-title">Received</span>' +
      '<span class="gn-card-meta">' + rec.length + ' waiting</span></div>' +
      (rec.length ? rec.map(function (p) {
        var path = p.degree === 2 ? viaText(store, p) : null;
        return '<div class="gn-row" style="padding:14px 16px">' + ring(p, 'lg') +
          '<div class="gn-row-txt">' +
          '<div class="gn-row-name"><a href="#/profile/' + p.id + '" data-nav="profile" data-id="' + p.id + '">' + esc(p.name) + '</a>' + degBadge(p) + '</div>' +
          '<div class="gn-row-sub" style="margin-top:3px">' + (p.mutual ? plural(p.mutual, 'mutual connection') + ' with you' : 'No mutual connections') + '</div>' +
          (path ? '<div class="gn-tiny gn-dim">Reachable through ' + esc(path) + '</div>' : '') +
          '</div>' +
          '<div class="gn-row-act">' +
          '<button class="gn-btn gn-btn-secondary gn-btn-sm" data-act="ignore" data-id="' + p.id + '">Ignore</button>' +
          '<button class="gn-btn gn-btn-primary gn-btn-sm" data-act="accept" data-id="' + p.id + '">' + icon('check', 13) + 'Accept</button>' +
          '</div></div>';
      }).join('') : '<div class="gn-empty"><div class="gn-empty-ico">' + icon('inbox', 20) + '</div>' +
        '<div class="gn-empty-t">No invitations to review</div>' +
        '<div class="gn-empty-d">When someone asks to connect, their request lands here.</div>' +
        '<a class="gn-btn gn-btn-primary gn-btn-sm" href="#/discover" data-nav="discover">Find people</a></div>') +
      '</section>';

    var sentCard = '<section class="gn-card">' +
      '<div class="gn-card-h"><span class="gn-card-title">Sent</span>' +
      '<span class="gn-card-meta">' + sent.length + ' awaiting</span></div>' +
      (sent.length ? sent.map(function (p) {
        return '<div class="gn-row" style="padding:11px 16px">' + ring(p, 'sm') +
          '<div class="gn-row-txt"><div class="gn-row-name" style="font-size:12.5px">' + esc(p.name) + degBadge(p) + '</div>' +
          '<div class="gn-row-sub">No answer yet</div></div>' +
          '<button class="gn-btn gn-btn-quiet gn-btn-xs" data-act="withdraw" data-id="' + p.id + '">Withdraw</button></div>';
      }).join('') : '<div class="gn-empty" style="padding:26px"><div class="gn-empty-t">No outgoing requests</div>' +
        '<div class="gn-empty-d">Requests you send wait here until the other person answers.</div></div>') +
      '</section>';

    var aside = '<div class="gn-card"><div class="gn-card-h"><span class="gn-card-title">How a request moves</span></div>' +
      '<div class="gn-card-b" style="padding:14px 16px">' +
      '<div class="gn-flex gn-ic gn-gap-8" style="font-size:12px;color:var(--g-text-2);flex-wrap:wrap">' +
      '<span class="gn-deg gn-deg-0">Sent</span>' + icon('arrow-right', 12, 'gn-dim') +
      '<span class="gn-deg gn-deg-2">Accepted</span>' + icon('arrow-right', 12, 'gn-dim') +
      '<span class="gn-deg gn-deg-1">Connected</span></div>' +
      '<p class="gn-tiny gn-dim" style="margin-top:11px;line-height:1.6">Accepting adds a <span class="gn-mono">CONNECTED</span> edge in the graph. Ignoring or withdrawing drops the <span class="gn-mono">REQUESTED</span> edge and nothing else changes.</p>' +
      '<div class="gn-divider" style="margin:12px 0"></div>' +
      '<div class="gn-flex gn-ic gn-gap-8"><span class="gn-ic" style="color:var(--g-text-3)">' + icon('shield', 14) + '</span>' +
      '<span class="gn-tiny gn-dim">Only you and the other person can see a pending request.</span></div>' +
      '</div></div>';

    return head + '<div class="gn-2col gn-2col-requests">' +
      received + '<div class="gn-stack">' + sentCard + aside + '</div></div>';
  };
  Screens.profile = function (store, opts) {
    var id = opts.profileId || 'dave';
    var p = store.person(id);
    var path = store.path(id);
    var bd = store.byDegree();
    var isSelf = p.status === 'self';
    var canSee = isSelf || p.status === 'connected';

    var head = '<a class="gn-btn gn-btn-ghost gn-btn-sm" href="#/network" data-nav="network" style="margin-bottom:14px">' + icon('arrow-left', 14) + 'Back to my network</a>' +
      '<div class="gn-card" style="padding:22px">' +
      '<div class="gn-flex gn-ic gn-gap-16" style="align-items:flex-start">' +
      ring(p, '2xl') +
      '<div style="min-width:0;flex:1;padding-top:4px">' +
      '<div class="gn-flex gn-ic gn-gap-10"><h1 class="gn-h1" style="font-size:26px">' + esc(p.name) + '</h1>' + degBadge(p) + '</div>' +
      '<div class="gn-tiny gn-dim" style="margin-top:7px">' +
      (isSelf ? 'This is you. Your network is everything below.' :
        p.degree === null ? 'No path to you within three steps.' :
          p.degree + (p.degree === 1 ? 'st' : p.degree === 2 ? 'nd' : 'rd') + ' degree connection · ' + (p.mutual ? plural(p.mutual, 'mutual connection') : 'no mutual connections')) +
      '</div>' +
      '<div class="gn-flex gn-ic gn-gap-8" style="margin-top:16px">' +
      (isSelf
        ? '<a class="gn-btn gn-btn-secondary gn-btn-sm" href="#/network" data-nav="network">' + icon('users', 14) + 'My connections</a>'
        : actions(p, { small: true }) +
        '<a class="gn-btn gn-btn-ghost gn-btn-sm" href="#/discover" data-nav="discover">Find similar people</a>') +
      '</div></div>' +
      '<div class="gn-flex gn-gap-16" style="text-align:right">' +
      '<div><div class="gn-stat-v" style="font-size:22px">' + (isSelf ? bd.first.length : store.neighbors(id).length) + '</div><div class="gn-tiny gn-dim">connections</div></div>' +
      '<div><div class="gn-stat-v" style="font-size:22px">' + (isSelf ? bd.second.length + bd.third.length : p.mutual) + '</div><div class="gn-tiny gn-dim">' + (isSelf ? 'within 2 steps' : 'mutual') + '</div></div>' +
      '</div></div></div>';

    /* path strip */
    var pathBlock = '';
    if (!isSelf && path && path.length > 1) {
      pathBlock = '<div class="gn-card" style="margin-top:14px"><div class="gn-card-h"><span class="gn-card-title">Shortest path to you</span>' +
        '<span class="gn-card-meta">' + (path.length - 1) + (path.length - 1 === 1 ? ' step' : ' steps') + '</span></div>' +
        '<div class="gn-card-b"><div class="gn-flex gn-ic gn-gap-10" style="flex-wrap:wrap">' +
        path.map(function (pid, i) {
          var pp = store.person(pid);
          var chip = '<div class="gn-flex gn-ic gn-gap-8" style="padding:5px 9px 5px 5px;border:1px solid ' + (pid === ME ? 'rgba(142,111,255,.45)' : 'var(--g-line-2)') + ';border-radius:999px;background:' + (pid === ME ? 'var(--g-violet-a)' : 'transparent') + '">' +
            ring(pp, 'sm') + '<span style="font-size:12px;font-weight:600">' + (pid === ME ? 'You' : esc(firstName(pp.name))) + '</span></div>';
          return (i ? icon('arrow-right', 13, 'gn-dim') : '') + chip;
        }).join('') + '</div>' +
        '<p class="gn-tiny gn-dim" style="margin-top:10px">One hop means a shared <span class="gn-mono">CONNECTED</span> edge. Your degree is the length of this path.</p>' +
        '</div></div>';
    }

    var mutualBlock = '';
    if (!isSelf) {
      var mutuals = p.mutualIds.map(function (mid) { return store.person(mid); });
      mutualBlock = '<section class="gn-card" style="margin-top:14px"><div class="gn-card-h">' +
        '<span class="gn-card-title">Mutual connections</span><span class="gn-card-meta">' + mutuals.length + '</span></div>' +
        (mutuals.length ? mutuals.map(function (m) { return personRow(m, store, { noRemove: true }); }).join('') :
          '<div class="gn-empty" style="padding:28px"><div class="gn-empty-t">No mutual connections</div>' +
          '<div class="gn-empty-d">You and ' + esc(firstName(p.name)) + ' do not share a connection yet.</div></div>') +
        '</section>';
    }

    var conns;
    if (canSee) {
      var list = store.neighbors(id).map(function (x) { return store.person(x); });
      list.sort(function (a, b) { return b.mutual - a.mutual || a.name.localeCompare(b.name); });
      conns = '<section class="gn-card"><div class="gn-card-h">' +
        '<span class="gn-card-title">' + (isSelf ? 'Your connections' : firstName(p.name) + '&rsquo;s connections') + '</span>' +
        '<span class="gn-card-meta">' + list.length + '</span></div>' +
        (list.length ? list.map(function (m) { return personRow(m, store, { noRemove: true }); }).join('') :
          '<div class="gn-empty" style="padding:28px"><div class="gn-empty-t">No connections yet</div></div>') +
        '</section>';
    } else {
      conns = '<section class="gn-card"><div class="gn-card-h"><span class="gn-card-title">' + esc(firstName(p.name)) + '&rsquo;s connections</span>' +
        '<span class="gn-card-meta">hidden</span></div>' +
        '<div class="gn-empty"><div class="gn-empty-ico">' + icon('lock', 20) + '</div>' +
        '<div class="gn-empty-t">Visible after you connect</div>' +
        '<div class="gn-empty-d">GraphNet shows a full connection list only for yourself and your 1st degree connections.</div>' +
        (p.status === 'none' ? '<button class="gn-btn gn-btn-primary gn-btn-sm" data-act="connect" data-id="' + p.id + '">' + icon('user-plus', 13) + 'Connect with ' + esc(firstName(p.name)) + '</button>' : '') +
        '</div></section>';
    }

    return head + (pathBlock ? pathBlock : '') +
      '<div class="gn-2col" style="margin-top:14px"><div class="gn-stack">' + conns + '</div>' +
      '<div class="gn-stack">' + (mutualBlock || '') +
      '<div class="gn-card"><div class="gn-card-h"><span class="gn-card-title">Network position</span></div>' +
      '<div class="gn-card-b">' +
      '<div class="gn-flex gn-ic" style="justify-content:space-between;margin-bottom:9px"><span class="gn-tiny gn-dim">1st</span><span class="gn-tiny gn-mono">' + bd.first.length + '</span></div>' +
      '<div class="gn-flex gn-ic" style="justify-content:space-between;margin-bottom:9px"><span class="gn-tiny gn-dim">2nd</span><span class="gn-tiny gn-mono">' + bd.second.length + '</span></div>' +
      '<div class="gn-flex gn-ic" style="justify-content:space-between"><span class="gn-tiny gn-dim">3rd</span><span class="gn-tiny gn-mono">' + bd.third.length + '</span></div>' +
      '<div class="gn-divider" style="margin:11px 0"></div>' +
      '<p class="gn-tiny gn-dim" style="line-height:1.6">Degrees are computed per pair in Neo4j, so they change the moment a connection is accepted.</p>' +
      '</div></div></div></div>';
  };

  /* ------------------------------------------------------------------ admin */
  function relax(nodes, links, W, H, iters) {
    var pos = {}, n = nodes.length;
    nodes.forEach(function (node, i) {
      var a = i * 2.39996;
      var r = Math.sqrt(i / Math.max(n - 1, 1)) * Math.min(W, H) * 0.42;
      pos[node.id] = { x: W / 2 + Math.cos(a) * r, y: H / 2 + Math.sin(a) * r, vx: 0, vy: 0 };
    });
    var byId = {};
    nodes.forEach(function (x) { byId[x.id] = x; });
    for (var step = 0; step < (iters || 420); step++) {
      var heat = 1 - step / (iters || 420);
      var ids = Object.keys(pos);
      for (var i = 0; i < ids.length; i++) {
        for (var j = i + 1; j < ids.length; j++) {
          var a = pos[ids[i]], b = pos[ids[j]];
          var dx = b.x - a.x || 0.01, dy = b.y - a.y || 0.01;
          var d2 = Math.max(dx * dx + dy * dy, 60);
          var f = Math.min(9000 / d2, 9);
          var d = Math.sqrt(d2);
          a.vx -= (dx / d) * f; a.vy -= (dy / d) * f;
          b.vx += (dx / d) * f; b.vy += (dy / d) * f;
        }
      }
      links.forEach(function (l) {
        var a = pos[l.source], b = pos[l.target];
        if (!a || !b) return;
        var dx = b.x - a.x, dy = b.y - a.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        var target = l.type === 'REQUESTED' ? 130 : 96;
        var f = (d - target) * 0.028;
        a.vx += (dx / d) * f; a.vy += (dy / d) * f;
        b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
      });
      ids.forEach(function (id) {
        var p = pos[id];
        p.vx += (W / 2 - p.x) * 0.0036;
        p.vy += (H / 2 - p.y) * 0.0036;
        p.vx *= 0.86; p.vy *= 0.86;
        p.x = Math.max(90, Math.min(W - 300, p.x + p.vx * heat));
        p.y = Math.max(40, Math.min(H - 40, p.y + p.vy * heat));
      });
    }
    return pos;
  }

  function graphMarkup(store, opts) {
    opts = opts || {};
    var g = store.graph();
    var W = opts.w || 1400, H = opts.h || 520;
    var pos = relax(g.nodes, g.links, W, H, 460);
    var sel = opts.selected || null;
    var lit = {};
    if (sel) {
      lit[sel] = 1;
      g.links.forEach(function (l) {
        if (l.source === sel) lit[l.target] = 1;
        if (l.target === sel) lit[l.source] = 1;
      });
    }
    var svg = '<svg class="gn-graph" viewBox="0 0 ' + W + ' ' + H + '" data-graph="1" role="img" aria-label="Neo4j relationship graph">';
    svg += '<defs><marker id="g-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
      '<path d="M0,0 L10,5 L0,10 z" fill="rgba(53,214,222,0.85)"/></marker></defs>';

    g.links.forEach(function (l, i) {
      if (opts.hide && opts.hide[l.type]) return;
      var a = pos[l.source], b = pos[l.target];
      if (!a || !b) return;
      var ra = 13 + Math.min(byId(g.nodes, l.source).connections, 8) * 1;
      var rb = 13 + Math.min(byId(g.nodes, l.target).connections, 8) * 1;
      var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      var x1 = a.x + (dx / d) * ra, y1 = a.y + (dy / d) * ra;
      var x2 = b.x - (dx / d) * (rb + 3), y2 = b.y - (dy / d) * (rb + 3);
      var cls = 'g-edge' + (l.type === 'REQUESTED' ? ' req' : '');
      if (sel) cls += (l.source === sel || l.target === sel) ? ' is-lit' : ' is-dim';
      svg += '<line class="' + cls + '" data-edge="' + i + '" x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) +
        '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"' +
        (l.type === 'REQUESTED' ? ' marker-end="url(#g-arrow)"' : '') + '/>';
    });

    g.nodes.forEach(function (n) {
      var q = pos[n.id];
      var r = 13 + Math.min(n.connections, 8) * 1;
      var cls = 'g-node';
      if (sel === n.id) cls += ' is-sel';
      else if (sel && !lit[n.id]) cls += ' is-dim';
      svg += '<g class="' + cls + '" data-node="' + n.id + '" transform="translate(' + q.x.toFixed(1) + ',' + q.y.toFixed(1) + ')">' +
        '<title>' + esc(n.name) + ' · ' + n.connections + ' connections</title>' +
        '<circle class="n-body" r="' + r.toFixed(1) + '"/>' +
        '<text class="n-ini" dy="3">' + initials(n.name) + '</text>' +
        '<text class="n-name" y="' + (r + 12).toFixed(1) + '">' + esc(n.name) + '</text>' +
        '</g>';
    });
    svg += '</svg>';
    return svg;
  }

  function byId(nodes, id) {
    for (var i = 0; i < nodes.length; i++) if (nodes[i].id === id) return nodes[i];
    return { connections: 0 };
  }

  GN.relax = relax;
  GN.graphMarkup = graphMarkup;

  GN.detailMarkup = function (store, id) {
    var g = store.graph();
    var sel = id ? g.nodes.filter(function (n) { return n.id === id; })[0] : null;
    if (!sel) {
      return '<div class="gn-detail"><div class="gn-detail-b" style="padding:14px">' +
        '<div class="gn-flex gn-ic gn-gap-8" style="color:var(--g-text-3)">' + icon('route', 15) +
        '<span style="font-size:12px">Select a node</span></div>' +
        '<p class="gn-tiny gn-dim" style="margin-top:7px;line-height:1.55">Click any node to read its id, degree and pending requests. Drag to rearrange the layout.</p>' +
        '</div></div>';
    }
    return '<div class="gn-detail"><div class="gn-detail-h">' +
      '<span class="gn-ring gn-ring-1"><span class="gn-av gn-av-md ' + tint(sel.name) + '">' + initials(sel.name) + '</span></span>' +
      '<div style="min-width:0"><div style="font-size:13px;font-weight:650">' + esc(sel.name) + '</div>' +
      '<div class="gn-mono gn-dim" style="font-size:10px">:User</div></div>' +
      '<button class="gn-iconbtn" style="margin-left:auto;width:24px;height:24px" data-act="clear-select" aria-label="Clear selection">' + icon('x', 13) + '</button></div>' +
      '<div class="gn-detail-b"><dl style="margin:0">' +
      '<div class="gn-kv"><dt>node id</dt><dd style="font-size:10.5px">' + esc(sel.uid) + '</dd></div>' +
      '<div class="gn-kv"><dt>connections</dt><dd>' + sel.connections + '</dd></div>' +
      '<div class="gn-kv"><dt>requests in</dt><dd>' + sel.incoming + '</dd></div>' +
      '<div class="gn-kv"><dt>requests out</dt><dd>' + sel.outgoing + '</dd></div>' +
      '</dl>' +
      '<button class="gn-btn gn-btn-secondary gn-btn-sm gn-btn-block" style="margin-top:11px" data-act="centre-node" data-id="' + sel.id + '">Centre on node</button>' +
      '</div></div>';
  };

  Screens.admin = function (store, opts) {
    opts = opts || {};
    var g = store.graph();
    var connected = g.links.filter(function (l) { return l.type === 'CONNECTED'; }).length;
    var requested = g.links.length - connected;
    var users = store.users();
    var perPage = 6;
    var page = opts.page || 1;
    var pages = Math.ceil(users.length / perPage);
    var rows = users.slice((page - 1) * perPage, page * perPage);

    var rail = '<aside class="gn-rail">' +
      brandMark(26) +
      '<button class="gn-rail-btn is-active" aria-label="Graph view" aria-current="page">' + icon('git-branch', 18) + '</button>' +
      '<button class="gn-rail-btn" aria-label="Users table">' + icon('database', 18) + '</button>' +
      '<div class="gn-rail-sep"></div>' +
      '<button class="gn-rail-btn" aria-label="Refresh data" data-act="refresh">' + icon('rotate-cw', 17) + '</button>' +
      '<div style="margin-top:auto"></div>' +
      '<button class="gn-rail-btn" aria-label="Sign out" data-act="signout">' + icon('log-out', 17) + '</button>' +
      '</aside>';

    var bar = '<div class="gn-admin-bar">' +
      '<span class="gn-admin-title">Network graph</span>' +
      '<div class="gn-admin-counts">' +
      '<span class="gn-admin-count"><b>' + g.nodes.length + '</b>nodes</span>' +
      '<span class="gn-admin-count"><b>' + connected + '</b>connected</span>' +
      '<span class="gn-admin-count"><b>' + requested + '</b>requested</span>' +
      '</div>' +
      '<div class="gn-graph-toolbar" style="margin-left:auto">' +
      '<div class="gn-search" style="width:200px;height:28px;background:#0b0e18">' + icon('search', 13, 'gn-search-ico') +
      '<input type="search" id="gn-graph-search" placeholder="Find a node" aria-label="Find a node" style="font-size:12px;padding-right:10px">' +
      '</div>' +
      '<button class="gn-toggle' + (opts.hide && opts.hide.CONNECTED ? '' : ' is-on') + '" data-act="toggle-rel" data-rel="CONNECTED"><i></i>CONNECTED</button>' +
      '<button class="gn-toggle' + (opts.hide && opts.hide.REQUESTED ? '' : ' is-on') + '" data-act="toggle-rel" data-rel="REQUESTED"><i class="req"></i>REQUESTED</button>' +
      '<span class="gn-top-sep"></span>' +
      '<button class="gn-iconbtn" data-act="zoom-in" aria-label="Zoom in">' + icon('zoom-in', 16) + '</button>' +
      '<button class="gn-iconbtn" data-act="zoom-out" aria-label="Zoom out">' + icon('zoom-out', 16) + '</button>' +
      '<button class="gn-iconbtn" data-act="fit" aria-label="Fit graph">' + icon('maximize', 16) + '</button>' +
      '</div></div>';

    var detail = GN.detailMarkup(store, opts.selected);

    var graph = '<div class="gn-graph-wrap">' + graphMarkup(store, { selected: opts.selected, w: 1400, h: 520, hide: opts.hide }) + detail +
      '<div class="gn-graph-tools">' +
      '<button class="gn-btn gn-btn-ghost gn-btn-xs" data-act="fit">' + icon('maximize', 12) + 'Fit</button>' +
      '<span style="width:1px;height:16px;background:var(--g-line-2)"></span>' +
      '<span class="gn-tiny gn-dim" style="padding-right:6px">Drag nodes · click to inspect</span>' +
      '</div>' +
      '<div class="gn-graph-legend"><div class="lg"><i></i>CONNECTED</div><div class="lg"><i class="req"></i>REQUESTED</div></div>' +
      '</div>';

    var pager = '<div class="gn-pagination" style="margin-left:auto;padding:0">' +
      '<button class="gn-page-btn" data-act="page" data-page="' + Math.max(1, page - 1) + '"' + (page === 1 ? ' disabled' : '') + ' aria-label="Previous page">' + icon('arrow-left', 12) + '</button>' +
      Array.from({ length: pages }).map(function (_, i) {
        var n = i + 1;
        return '<button class="gn-page-btn' + (n === page ? ' is-active' : '') + '" data-act="page" data-page="' + n + '">' + n + '</button>';
      }).join('') +
      '<button class="gn-page-btn" data-act="page" data-page="' + Math.min(pages, page + 1) + '"' + (page === pages ? ' disabled' : '') + ' aria-label="Next page">' + icon('arrow-right', 12) + '</button>' +
      '</div>';

    var table = '<section style="flex:0 0 auto;border-top:1px solid var(--g-line-2);background:#070910">' +
      '<div class="gn-flex gn-ic gn-gap-12" style="padding:11px 18px 9px;border-bottom:1px solid var(--g-line)">' +
      '<span class="gn-admin-title" style="font-size:13.5px">users</span>' +
      '<span class="gn-mono gn-dim" style="font-size:10.5px">SQLite · relational</span>' +
      '<span class="gn-tiny gn-dim" style="margin-left:18px">' + users.length + ' rows · page ' + page + ' of ' + pages + '</span>' +
      '<span class="gn-tiny gn-dim" style="margin-left:14px">Password hashes stay on the server.</span>' +
      pager +
      '</div>' +
      '<div class="gn-table-wrap">' +
      '<table class="gn-table"><thead><tr><th style="width:150px">id</th><th>email</th><th style="width:92px">role</th><th style="width:210px">password_hash</th><th style="width:170px">created_at</th></tr></thead><tbody>' +
      rows.map(function (u) {
        return '<tr>' +
          '<td class="cell-id">' + u.id + '</td>' +
          '<td class="cell-strong">' + u.email + '</td>' +
          '<td><span class="gn-role gn-role-' + u.role + '">' + u.role + '</span></td>' +
          '<td class="cell-muted" style="font-family:var(--g-mono);font-size:11px">(hidden)</td>' +
          '<td class="cell-num cell-muted">' + u.created_at + '</td></tr>';
      }).join('') + '</tbody></table></div></section>';

    return '<div class="gn gn-admin" data-mode="' + (opts.mode || 'app') + '">' + rail +
      '<div class="gn-admin-main">' + bar + graph + table + '</div></div>';
  };

  /* ------------------------------------------------------------------- auth */
  function constellation(animated) {
    var cx = 260, cy = 260;
    var rings = [
      { r: 74, n: 8, size: 4.6, fill: '#151033', stroke: 'rgba(142,111,255,0.85)', width: 1.3 },
      { r: 124, n: 11, size: 3.2, fill: '#08131c', stroke: 'rgba(53,214,222,0.6)', width: 1 },
      { r: 172, n: 8, size: 2.8, fill: '#0d0b1a', stroke: 'rgba(185,168,255,0.42)', width: 1 }
    ];
    var pos = rings.map(function (ring, ri) {
      var arr = [];
      for (var i = 0; i < ring.n; i++) {
        var a = -Math.PI / 2 + (i / ring.n) * Math.PI * 2 + ri * 0.34;
        arr.push({ x: cx + Math.cos(a) * ring.r, y: cy + Math.sin(a) * ring.r });
      }
      return arr;
    });

    var svg = '<svg class="gn-const" viewBox="0 0 520 520" fill="none" aria-hidden="true">' +
      '<defs><radialGradient id="gnc" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="#6c4bf2" stop-opacity="0.20"/>' +
      '<stop offset="55%" stop-color="#6c4bf2" stop-opacity="0.06"/>' +
      '<stop offset="100%" stop-color="#6c4bf2" stop-opacity="0"/>' +
      '</radialGradient></defs>' +
      '<circle cx="260" cy="260" r="225" fill="url(#gnc)"/>';
    svg += '<circle cx="260" cy="260" r="74" stroke="rgba(142,111,255,0.30)" stroke-width="1"/>';
    svg += '<circle cx="260" cy="260" r="124" stroke="rgba(53,214,222,0.20)" stroke-width="1" stroke-dasharray="2 7"/>';
    svg += '<circle cx="260" cy="260" r="172" stroke="rgba(185,168,255,0.16)" stroke-width="1" stroke-dasharray="1 8"/>';

    /* spokes from the centre to the first ring */
    pos[0].forEach(function (p) {
      svg += '<line class="c-edge" x1="' + cx + '" y1="' + cy + '" x2="' + p.x.toFixed(1) + '" y2="' + p.y.toFixed(1) + '" stroke="rgba(142,111,255,0.30)"/>';
    });
    /* ties outward */
    var ties = [[0, 1], [1, 2]];
    ties.forEach(function (pair) {
      var from = pos[pair[0]], to = pos[pair[1]];
      from.forEach(function (p, i) {
        var j = Math.round((i / from.length) * to.length) % to.length;
        [j, (j + 1) % to.length].forEach(function (k) {
          var q = to[k];
          svg += '<line x1="' + p.x.toFixed(1) + '" y1="' + p.y.toFixed(1) + '" x2="' + q.x.toFixed(1) + '" y2="' + q.y.toFixed(1) + '" stroke="' +
            (pair[0] === 0 ? 'rgba(53,214,222,0.30)' : 'rgba(185,168,255,0.20)') + '" stroke-dasharray="2 4"/>';
        });
      });
    });

    pos.forEach(function (ring, ri) {
      ring.forEach(function (p, i) {
        svg += '<circle class="c-node" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + rings[ri].size + '" fill="' + rings[ri].fill +
          '" stroke="' + rings[ri].stroke + '" stroke-width="' + rings[ri].width + '"' +
          (animated ? ' style="animation:gn-pulse 5s ease-in-out ' + ((ri * 0.4 + i * 0.13).toFixed(2)) + 's infinite"' : '') + '/>';
      });
    });

    svg += '<circle cx="260" cy="260" r="19" fill="rgba(142,111,255,0.16)"/>';
    svg += '<circle cx="260" cy="260" r="10" fill="#6c4bf2" stroke="rgba(200,186,255,0.9)" stroke-width="1.4"/>';
    svg += '</svg>';
    return svg;
  }

  function authShell(inner, opts) {
    opts = opts || {};
    return '<div class="gn gn-auth" data-mode="' + (opts.mode || 'app') + '">' +
      '<div class="gn-auth-art"><div class="gn-brand" style="padding:0">' + brandMark(28) +
      '<span class="gn-wordmark" style="font-size:17px">GraphNet</span></div>' +
      '<div class="gn-auth-art-mid">' + constellation(opts.animated) + '</div>' +
      '<div class="gn-auth-claim">' +
      '<h2>Your network is not a list. It has a shape.</h2>' +
      '<p>GraphNet maps who you know, who they know, and how far apart you really are. Every connection is an edge you can see.</p>' +
      '<div class="gn-auth-proof">' +
      '<span class="gn-pf">' + icon('git-branch', 13) + 'Three degrees, mapped</span>' +
      '<span class="gn-pf">' + icon('database', 13) + 'Neo4j graph core</span>' +
      '</div></div></div>' +
      '<div class="gn-auth-panel"><div class="gn-auth-form">' + inner + '</div></div></div>';
  }

  function authMark() {
    return '<div class="gn-auth-brand">' + brandMark(24) + '<span class="gn-wordmark" style="font-size:15px">GraphNet</span></div>';
  }

  Screens.auth = function (a, b) {
    /* Called as auth(opts) from the prototype and auth(store, opts) from the
       canvas builder. Normalise so both get the same object. */
    var opts = (b !== undefined ? b : a) || {};
    var step = opts.step || 'email';
    var email = opts.email || '';
    var body = '', title = '', sub = '', foot = '', stepBar = '';

    if (step === 'email') {
      title = 'Sign in or create an account';
      sub = 'Enter your email. We check it against the account table, then take you to the right next step.';
      body = '<div class="gn-field"><label class="gn-label" for="auth-email">Email</label>' +
        '<input class="gn-input" id="auth-email" name="email" type="email" autocomplete="email" placeholder="you@company.com" value="' + esc(email) + '">' +
        (opts.err ? '<div class="gn-err">' + icon('circle-alert', 14) + esc(opts.err) + '</div>' : '') + '</div>' +
        '<button class="gn-btn gn-btn-primary gn-btn-lg gn-btn-block" data-act="auth-email" style="margin-top:4px">Continue</button>' +
        '<div class="gn-auth-demo"><span class="gn-mono">alice@demo.test</span><span class="gn-dim">or</span><span class="gn-mono">admin@gmail.com</span></div>';
      foot = 'By continuing you agree to the terms of use and the privacy notice.';
    } else if (step === 'password' || step === 'password-error') {
      title = 'Enter your password';
      sub = 'Signing in as ' + esc(email || 'alice@demo.test') + '.';
      body = '<div class="gn-field"><div class="gn-flex gn-ic"><label class="gn-label" for="auth-pw">Password</label>' +
        '<button class="gn-btn gn-btn-ghost gn-btn-xs gn-ml-auto" data-act="auth-change-email">Change email</button></div>' +
        '<input class="gn-input' + (step === 'password-error' ? ' is-error' : '') + '" id="auth-pw" name="password" type="password" autocomplete="current-password" placeholder="Your password" value="' + (step === 'password-error' ? 'demo1234' : '') + '">' +
        (step === 'password-error' ? '<div class="gn-err">' + icon('circle-alert', 14) + 'That password does not match this account.</div>' : '') +
        '</div>' +
        '<button class="gn-btn gn-btn-primary gn-btn-lg gn-btn-block" data-act="auth-signin">Sign in</button>' +
        '<div class="gn-auth-demo"><span class="gn-dim">Demo password</span><span class="gn-mono">Demo@123</span></div>';
      foot = 'Trouble signing in? Ask an admin to reset your account.';
    } else if (step === 'create') {
      title = 'Create a password';
      sub = 'New account for ' + esc(email || 'jordan@mbeki.studio') + '.';
      var strength = opts.strength || 0;
      var labels = ['', 'Weak', 'Fair', 'Strong', 'Very strong'];
      stepBar = '<div class="gn-auth-step"><i class="on"></i><i class="on"></i><i></i><span>Step 2 of 3</span></div>';
      body = '<div class="gn-field"><label class="gn-label" for="auth-new">Password</label>' +
        '<input class="gn-input" id="auth-new" name="new-password" type="password" autocomplete="new-password" placeholder="6 to 64 characters" value="' + (opts.pw || '') + '">' +
        (opts.err ? '<div class="gn-err">' + icon('circle-alert', 14) + esc(opts.err) + '</div>' : '') +
        '</div>' +
        '<div><div class="gn-flex gn-ic" style="justify-content:space-between"><span class="gn-hint">Password strength</span>' +
        '<span class="gn-tiny" style="font-weight:600;color:' + (strength >= 3 ? 'var(--g-ok)' : strength === 2 ? 'var(--g-violet-3)' : 'var(--g-text-3)') + '">' + (labels[strength] || 'Too short') + '</span></div>' +
        '<div class="gn-meter" style="margin-top:7px"><i style="width:' + (strength / 4 * 100) + '%;background:' + (strength >= 3 ? 'var(--g-ok)' : strength === 2 ? 'var(--g-violet)' : 'var(--g-danger)') + '"></i></div></div>' +
        '<ul class="gn-tiny gn-dim" style="display:flex;flex-direction:column;gap:6px">' +
        ['6 to 64 characters', 'Letters and numbers', 'One special character'].map(function (t, i) {
          var on = strength > i;
          return '<li class="gn-flex gn-ic gn-gap-6" style="color:' + (on ? 'var(--g-text-2)' : 'var(--g-text-3)') + '">' +
            '<span style="color:' + (on ? 'var(--g-ok)' : '#4b5470') + '">' + icon(on ? 'circle-check' : 'dot', 13) + '</span>' + t + '</li>';
        }).join('') + '</ul>' +
        '<button class="gn-btn gn-btn-primary gn-btn-lg gn-btn-block" data-act="auth-create">Continue</button>';
      foot = 'Passwords are hashed with bcrypt and stored in SQLite only.';
    } else if (step === 'name') {
      title = 'What should people call you?';
      sub = 'This name sits on your node in the graph and on every connection card.';
      stepBar = '<div class="gn-auth-step"><i class="on"></i><i class="on"></i><i class="on"></i><span>Step 3 of 3</span></div>';
      body = '<div class="gn-field"><label class="gn-label" for="auth-name">Full name</label>' +
        '<input class="gn-input" id="auth-name" name="name" type="text" autocomplete="name" placeholder="Jordan Mbeki" value="' + esc(opts.name || '') + '" maxlength="60">' +
        '<span class="gn-hint">Between 3 and 60 characters.</span>' +
        (opts.err ? '<div class="gn-err">' + icon('circle-alert', 14) + esc(opts.err) + '</div>' : '') + '</div>' +
        '<div class="gn-card" style="padding:13px;display:flex;align-items:center;gap:11px;background:var(--g-surface-2)">' +
        '<span class="gn-ring gn-ring-0"><span class="gn-av gn-av-md ' + tint(opts.name || 'New Person') + '">' + initials(opts.name || 'New Person') + '</span></span>' +
        '<div><div class="gn-tiny gn-dim">Your node preview</div>' +
        '<div style="font-size:12.5px;font-weight:600;margin-top:2px">' + esc(opts.name || 'New Person') + '</div></div>' +
        icon('git-branch', 15, 'gn-dim') + '</div>' +
        '<button class="gn-btn gn-btn-primary gn-btn-lg gn-btn-block" data-act="auth-finish">Create account</button>';
      foot = 'You start with no connections. Discover people to send your first request.';
    }

    var inner = authMark() + stepBar +
      '<h1 class="gn-auth-title">' + title + '</h1>' +
      '<p class="gn-auth-sub">' + sub + '</p>' +
      '<div class="gn-auth-body">' + body + '</div>' +
      (foot ? '<p class="gn-auth-foot">' + foot + '</p>' : '');
    return authShell(inner, { mode: opts.mode, animated: opts.animated });
  };
  GN.Screens = Screens;
  GN.screens = function (name, store, opts) {
    return Screens[name] ? Screens[name](store || GN.store, opts || {}) : '';
  };

  root.GN = GN;
})(typeof window !== 'undefined' ? window : globalThis);
