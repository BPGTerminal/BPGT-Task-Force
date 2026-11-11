/* =========================================================================
   api.js — data layer
   -------------------------------------------------------------------------
   Two interchangeable backends behind one API:

     LOCAL  (BP.API_URL empty)  -> everything in localStorage.
                                   Use this to demo the app on a phone or PC
                                   with no internet. Clearly marked DEMO.

     CLOUD  (BP.API_URL set)    -> Google Apps Script Web App bound to the
                                   "BPGT TF Reports" spreadsheet inside
                                   bpgrandterminal@gmail.com.

   The app is OFFLINE-FIRST: reports are always written to the local cache
   first and pushed to the Sheet when a connection is available.

   Note on transport: Apps Script Web Apps do not send CORS headers, so a
   normal fetch() cannot read the reply. Cloud calls therefore use JSONP
   (a <script> tag) — no CORS, works from any origin, including file://
   ========================================================================= */

/* ------------------------------------------------------------------ cache */
const DB = (() => {
  const KEY = 'bpgtDB_v1';
  let db = null;

  function blank() {
    return {
      users: [], reports: [], audit: [],
      notices: [], schedules: [], leaves: [], outbox: [],
      session: null,
      settings: { apiUrl: BP.API_URL || '', lastSync: null, seeded: false, autoPdfSeen: {} }
    };
  }

  function load() {
    if (db) return db;
    try { db = JSON.parse(localStorage.getItem(KEY)) || blank(); }
    catch (e) { db = blank(); }
    db.settings = Object.assign(blank().settings, db.settings || {});
    ['notices', 'schedules', 'leaves', 'outbox', 'audit', 'reports', 'users'].forEach(k => {
      if (!Array.isArray(db[k])) db[k] = [];
    });
    return db;
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(db)); }
  function reset() { db = blank(); save(); }

  function audit(action, detail) {
    const d = load();
    d.audit.unshift({ at: new Date().toISOString(), by: d.session?.name || 'system', action, detail: detail || '' });
    d.audit = d.audit.slice(0, 500);
    save();
  }

  return { load, save, reset, audit, blank };
})();

/* --------------------------------------------------------- demo seed data */
function seedDemoData(force = false) {
  const db = DB.load();
  if (db.settings.seeded && !force) return;

  // 1. accounts (PIN hashed on first use — see Local.ensureHashes)
  db.users = BP.users.map(u => ({
    ...u, active: true, pinHash: null, mustChange: false, createdAt: new Date().toISOString()
  }));

  // 2. a handful of believable reports inside the current reporting period
  const posts = BP.POSTS.slice(0, 10);
  const drivers = ['R. Delos Santos', 'J. Villanueva', 'M. Tapang', 'A. Cabrera', 'E. Balbin',
                   'L. Fernandez', 'N. Salvacion', 'F. Padul', 'G. Manlavi', 'T. Aborot'];
  const violations = ['Illegal parking', 'Obstruction', 'Trip-cutting / Colorum', 'Overloading',
                      'No / expired franchise', 'Reckless driving', ''];
  const plates = ['PBB 1234', 'ABC 5678', 'BMW 902', 'PND 4411', 'TRK 889', 'EMV 3311', 'BLU 7742', 'PQR 6610'];

  const pick = (a, i) => a[i % a.length];
  const members = BP.users.filter(u => u.role === 'member');
  const reports = [];
  const now = new Date();

  for (let back = 7; back >= 1; back--) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back);
    const dateStr = U.iso(day);
    const period = U.periodFor(dateStr);
    // keep the demo inside the open period
    if (dateStr < period.from || dateStr > period.to) continue;

    members.forEach((m, mi) => {
      if ((back + mi) % 3 === 0) return;            // some members skip a day
      const rows = [];
      const rowCount = 1 + ((back + mi) % 3);
      for (let r = 0; r < rowCount; r++) {
        const withViolation = (back + mi + r) % 3 !== 1;
        rows.push({
          time: pick(['06:30', '07:15', '09:00', '11:45', '14:20', '16:05', '17:30'], back + r),
          post: pick(posts, mi + r + back),
          postOther: '',
          violation: withViolation ? pick(violations, mi + r + back + 2) : '',
          plate: withViolation || r === 0 ? pick(plates, mi * 3 + r + back) : '',
          driver: pick(drivers, mi + r + back),
          ct: withViolation && r === 0 ? 'CT-' + (1000 + ((back * 7 + mi * 13 + r) % 900)) : '',
          remarks: withViolation
            ? pick(['Instructed driver to move', 'Warned and released', 'Referred to TF office', 'Settled on the spot'], back + r)
            : 'Routine monitoring'
        });
      }
      const t = {
        vehicles: 18 + ((back * 5 + mi * 7) % 40),
        passengers: 60 + ((back * 11 + mi * 9) % 180),
        arkabala: 5 + ((back + mi) % 12),
        violations: rows.filter(r => r.violation).length,
        incidents: (back + mi) % 4 === 0 ? 1 : 0,
        tickets: rows.filter(r => r.ct).length
      };
      const status = back > 3 ? 'approved' : (back === 3 ? 'reviewed' : 'submitted');
      reports.push({
        id: 'R-' + dateStr.replace(/-/g, '') + '-' + m.username,
        date: dateStr, team: m.team, memberId: m.id, memberName: m.name, memberUsername: m.username,
        rows, tally: t,
        narrative: (back + mi) % 5 === 0
          ? 'Concern: undisciplined drivers at the ' + pick(posts, mi) + ' post during peak hours. ' +
            'Recommendation: request additional traffic signage and one enforcer during 4–6 PM.'
          : '',
        status,
        leaderNote: status !== 'submitted' ? 'Verified by TL.' : '',
        supervisorNote: status === 'approved' ? 'Approved.' : '',
        createdBy: m.id, createdAt: dateStr + 'T08:00:00', updatedAt: dateStr + 'T17:00:00',
        updatedBy: m.id, _dirty: false, _syncedAt: dateStr + 'T17:00:00'
      });
    });
  }

  // a couple of reports for TODAY so the monitoring screen has a mix of
  // "filed" and "not yet filed" on first opening
  const todayStr = U.iso(now);
  [['gado', 0], ['montemor', 0]].forEach(([username]) => {
    const m = members.find(x => x.username === username);
    if (!m) return;
    const rows = [{
      time: '07:30', post: 'PTT', postOther: '', violation: 'Illegal parking',
      plate: 'PBB 1234', driver: 'R. Delos Santos', ct: 'CT-1042', remarks: 'Instructed driver to move'
    }];
    reports.push({
      id: 'R-' + todayStr.replace(/-/g, '') + '-' + m.username,
      date: todayStr, team: m.team, memberId: m.id, memberName: m.name, memberUsername: m.username,
      rows, tally: { vehicles: 24, passengers: 88, arkabala: 7, violations: 1, incidents: 0, tickets: 1 },
      narrative: '', status: 'submitted', leaderNote: '', supervisorNote: '',
      createdBy: m.id, createdAt: todayStr + 'T07:45:00', updatedAt: todayStr + 'T07:45:00',
      updatedBy: m.id, _dirty: false, _syncedAt: todayStr + 'T07:45:00'
    });
  });

  // an announcement, a duty schedule and a leave request so the new screens
  // are not empty on first run
  const nowIso = new Date().toISOString();
  db.notices = [{
    id: 'n-demo-1',
    title: 'Peak-season deployment — all hands on 15–20 December',
    body: 'All Task Force members are reminded that the Christmas rush deployment starts 15 December. ' +
          'Alpha Team takes the AM shift, Zulu Team the PM shift. Report 15 minutes before your shift, ' +
          'wear the complete uniform and bring your citation ticket booklet. Post assignments are in the ' +
          'Duty Schedule screen.',
    audience: 'ALL', priority: 'urgent', pinned: true,
    createdBy: 'u-heredero', createdByName: 'Joey S Heredero', createdAt: nowIso, acks: []
  }, {
    id: 'n-demo-2',
    title: 'Encode reports before going off duty',
    body: 'Daily reports must be encoded before the end of your duty day so the Team Leader can verify ' +
          'them the same evening. Photo documentation is now required for every apprehension.',
    audience: 'ALL', priority: 'normal', pinned: false,
    createdBy: 'u-bacalla', createdByName: 'Danny Bacalla', createdAt: nowIso, acks: []
  }];

  db.schedules = [];
  const shiftKeys = ['AM', 'PM'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const dateStr2 = U.iso(d);
    members.forEach((m, mi) => {
      if ((mi + i) % 4 === 0) return;
      db.schedules.push({
        id: 's-demo-' + dateStr2 + '-' + m.username,
        date: dateStr2, team: m.team, memberId: m.id, memberName: m.name,
        shift: m.team === 'Alpha' ? 'AM' : 'PM',
        post: posts[(mi + i) % posts.length],
        note: mi % 5 === 0 ? 'Post assignment may change on the day' : '',
        createdAt: nowIso
      });
    });
  }

  db.leaves = [{
    id: 'lv-demo-1', memberId: 'u-quitain', memberName: 'Bernard Quitain', team: 'Zulu',
    type: 'Sick leave', from: U.iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2)),
    to: U.iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3)),
    reason: 'Medical check-up at the Provincial Hospital.',
    status: 'pending', createdAt: nowIso, decidedBy: '', decisionNote: ''
  }];

  db.reports = reports;
  db.settings.seeded = true;
  DB.save();
}

/* ================================================================== LOCAL */
const Local = {
  async ensureHashes() {
    const db = DB.load();
    let changed = false;
    for (const u of db.users) {
      if (!u.pinHash) {
        u.pinHash = await U.sha256(BP.DEFAULT_PIN + ':' + u.username);
        changed = true;
      }
    }
    if (changed) DB.save();
  },

  async call(action, p = {}) {
    const db = DB.load();
    await Local.ensureHashes();

    switch (action) {

      case 'login': {
        const un = String(p.username || '').trim().toLowerCase();
        const u = db.users.find(x => x.username.toLowerCase() === un && x.active !== false);
        if (!u) throw new Error('Username not found. Check with your Team Leader.');
        const h = await U.sha256(String(p.pin || '') + ':' + u.username);
        if (h !== u.pinHash) throw new Error('Incorrect PIN. Please try again.');
        db.session = { userId: u.id, token: 'local:' + u.id, at: Date.now() };
        DB.save();
        DB.audit('login', u.username);
        return { token: db.session.token, user: Local.pub(u) };
      }

      case 'logout':
        if (db.session) DB.audit('logout', db.session.userId);
        db.session = null; DB.save();
        return { ok: true };

      case 'me': {
        const u = db.users.find(x => x.id === db.session?.userId);
        if (!u) throw new Error('Session expired');
        return { user: Local.pub(u) };
      }

      case 'changePin': {
        const u = db.users.find(x => x.id === p.userId);
        if (!u) throw new Error('User not found');
        if (await U.sha256(String(p.oldPin) + ':' + u.username) !== u.pinHash) throw new Error('Current PIN is incorrect');
        if (!/^\d{4,8}$/.test(String(p.newPin))) throw new Error('PIN must be 4–8 digits');
        u.pinHash = await U.sha256(String(p.newPin) + ':' + u.username);
        u.mustChange = false;
        DB.save(); DB.audit('changePin', u.username);
        return { ok: true };
      }

      case 'resetPin': {
        const u = db.users.find(x => x.id === p.userId);
        if (!u) throw new Error('User not found');
        const pin = String(p.newPin || BP.DEFAULT_PIN);
        u.pinHash = await U.sha256(pin + ':' + u.username);
        u.mustChange = true;
        DB.save(); DB.audit('resetPin', u.username);
        return { ok: true, pin };
      }

      case 'listUsers':
        return { users: db.users.map(Local.pub) };

      case 'saveUser': {
        const u = U.clone(p.user);
        const ex = db.users.find(x => x.id === u.id);
        if (ex) {
          Object.assign(ex, u, { pinHash: ex.pinHash });
          if (p.pin) { ex.pinHash = await U.sha256(p.pin + ':' + ex.username); ex.mustChange = true; }
        } else {
          u.id = u.id || U.uid('u');
          u.pinHash = await U.sha256((p.pin || BP.DEFAULT_PIN) + ':' + u.username);
          u.active = u.active !== false;
          u.mustChange = true;
          db.users.push(u);
        }
        DB.save(); DB.audit('saveUser', u.username);
        return { user: Local.pub(db.users.find(x => x.id === u.id || x.username === u.username)) };
      }

      case 'listReports': {
        let list = db.reports.slice();
        if (p.from) list = list.filter(r => r.date >= p.from);
        if (p.to) list = list.filter(r => r.date <= p.to);
        if (p.team && p.team !== 'ALL') list = list.filter(r => r.team === p.team);
        if (p.memberId) list = list.filter(r => r.memberId === p.memberId);
        if (p.status && p.status !== 'ALL') list = list.filter(r => r.status === p.status);
        return { reports: list };
      }

      case 'saveReport': {
        const r = U.clone(p.report);
        const ex = db.reports.find(x => x.id === r.id);
        r.updatedAt = new Date().toISOString();
        r._dirty = false; r._syncedAt = r.updatedAt;
        if (ex) Object.assign(ex, r); else db.reports.push(r);
        DB.save(); DB.audit('saveReport', `${r.date} ${r.team} ${r.memberName} (${r.status})`);
        return { report: r };
      }

      case 'setStatus': {
        const r = db.reports.find(x => x.id === p.id);
        if (!r) throw new Error('Report not found');
        r.status = p.status;
        if (p.note) r[p.status === 'returned' ? 'returnNote' : (p.role === 'leader' ? 'leaderNote' : 'supervisorNote')] = p.note;
        r.updatedAt = new Date().toISOString();
        r.updatedBy = db.session?.userId;
        r._dirty = true;                 // still needs pushing to the Sheet
        DB.save(); DB.audit('setStatus', `${r.id} -> ${p.status}`);
        return { report: r };
      }

      case 'deleteReport': {
        db.reports = db.reports.filter(x => x.id !== p.id);
        DB.save(); DB.audit('deleteReport', p.id);
        return { ok: true };
      }

      case 'pdfNow':
        throw new Error('PDF delivery to Drive needs the cloud connection (SETUP.md step 5).');

      /* ---------------- announcements / directives ------------------ */
      case 'listNotices': return { notices: db.notices.slice() };

      case 'saveNotice': {
        const n = U.clone(p.notice || {});
        const me_ = db.users.find(u => u.id === db.session?.userId) || {};
        if (!n.id) {
          n.id = U.uid('n');
          n.createdAt = new Date().toISOString();
          n.createdBy = me_.id;
          n.createdByName = me_.name;
          n.acks = [];
          db.notices.unshift(n);
        } else {
          const ex = db.notices.find(x => x.id === n.id);
          if (ex) Object.assign(ex, n);
        }
        DB.save(); DB.audit('saveNotice', n.title);
        return { notice: db.notices.find(x => x.id === n.id) };
      }

      case 'deleteNotice':
        db.notices = db.notices.filter(n => n.id !== p.id);
        DB.save(); DB.audit('deleteNotice', p.id);
        return { ok: true };

      case 'ackNotice': {
        const n = db.notices.find(x => x.id === p.id);
        const me_ = db.users.find(u => u.id === db.session?.userId) || {};
        if (n) {
          n.acks = n.acks || [];
          if (!n.acks.some(a => a.userId === me_.id)) {
            n.acks.push({ userId: me_.id, name: me_.name, at: new Date().toISOString() });
            DB.save();
          }
        }
        return { notice: n };
      }

      /* ---------------- duty schedule ------------------------------- */
      case 'listSchedule': {
        let list = db.schedules.slice();
        if (p.from) list = list.filter(x => x.date >= p.from);
        if (p.to) list = list.filter(x => x.date <= p.to);
        if (p.team && p.team !== 'ALL') list = list.filter(x => x.team === p.team);
        return { slots: list };
      }

      case 'saveSlot': {
        const slot = U.clone(p.slot || {});
        if (!slot.id) {
          slot.id = U.uid('s');
          slot.createdAt = new Date().toISOString();
          db.schedules.push(slot);
        } else {
          const ex = db.schedules.find(x => x.id === slot.id);
          if (ex) Object.assign(ex, slot);
        }
        DB.save(); DB.audit('saveSlot', `${slot.date} ${slot.memberName}`);
        return { slot: db.schedules.find(x => x.id === slot.id) };
      }

      case 'deleteSlot':
        db.schedules = db.schedules.filter(x => x.id !== p.id);
        DB.save(); DB.audit('deleteSlot', p.id);
        return { ok: true };

      /* ---------------- leave requests ------------------------------ */
      case 'listLeaves': {
        let list = db.leaves.slice();
        if (p.memberId) list = list.filter(x => x.memberId === p.memberId);
        if (p.team && p.team !== 'ALL') list = list.filter(x => x.team === p.team);
        return { leaves: list };
      }

      case 'saveLeave': {
        const l = U.clone(p.leave || {});
        const me_ = db.users.find(u => u.id === db.session?.userId) || {};
        if (!l.id) {
          l.id = U.uid('lv');
          l.status = 'pending';
          l.createdAt = new Date().toISOString();
          l.memberId = l.memberId || me_.id;
          l.memberName = l.memberName || me_.name;
          l.team = l.team || me_.team;
          db.leaves.unshift(l);
        } else {
          const ex = db.leaves.find(x => x.id === l.id);
          if (ex) Object.assign(ex, l);
        }
        DB.save(); DB.audit('saveLeave', `${l.type} ${l.from}..${l.to} ${l.memberName}`);
        return { leave: db.leaves.find(x => x.id === l.id) };
      }

      case 'setLeaveStatus': {
        const l = db.leaves.find(x => x.id === p.id);
        const me_ = db.users.find(u => u.id === db.session?.userId) || {};
        if (!l) throw new Error('Leave request not found');
        l.status = p.status;
        l.decidedBy = me_.name || '';
        l.decidedAt = new Date().toISOString();
        l.decisionNote = p.note || '';
        DB.save(); DB.audit('setLeaveStatus', `${l.memberName} -> ${p.status}`);
        return { leave: l };
      }

      case 'ping': return { ok: true, mode: 'local', time: new Date().toISOString() };

      default: throw new Error('Unknown action: ' + action);
    }
  },

  pub(u) {
    const { pinHash, ...rest } = u;
    return rest;
  }
};

/* ================================================================== CLOUD */
const Cloud = {
  jsonp(action, params = {}, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const cb = 'bpgtcb_' + Math.random().toString(36).slice(2);
      const url = new URL(BP.API_URL);
      url.searchParams.set('action', action);
      url.searchParams.set('callback', cb);
      url.searchParams.set('payload', JSON.stringify(params));
      const s = document.createElement('script');
      let done = false;
      const cleanup = () => {
        done = true; clearTimeout(t);
        delete window[cb];
        s.remove();
      };
      const t = setTimeout(() => { if (!done) { cleanup(); reject(new Error('No response from the server. Check your connection.')); } }, timeout);
      window[cb] = data => {
        cleanup();
        if (!data) return reject(new Error('Empty server response'));
        if (data.ok === false) return reject(new Error(data.error || 'Server error'));
        resolve(data.data ?? data);
      };
      s.onerror = () => { if (!done) { cleanup(); reject(new Error('Cannot reach the reporting server.')); } };
      s.src = url.toString();
      document.head.appendChild(s);
    });
  },

  async call(action, params = {}) {
    const db = DB.load();
    const token = db.session?.token || '';
    return Cloud.jsonp(action, { ...params, token });
  }
};

/* ============================================================== FACADE /// */
const API = {
  mode() { return (DB.load().settings.apiUrl || BP.API_URL) ? 'cloud' : 'local'; },
  isCloud() { return API.mode() === 'cloud'; },

  async call(action, params = {}) {
    if (!API.isCloud()) return Local.call(action, params);
    return Cloud.call(action, params);
  },

  setApiUrl(url) {
    const db = DB.load();
    db.settings.apiUrl = (url || '').trim();
    BP.API_URL = db.settings.apiUrl;
    DB.save();
  },

  /* ---------------- session ------------------------------------------ */
  session() {
    const db = DB.load();
    if (!db.session?.userId) return null;
    return db.users.find(u => u.id === db.session.userId) ? db.session : null;
  },

  currentUser() {
    const s = API.session();
    if (!s) return null;
    const db = DB.load();
    const u = db.users.find(x => x.id === s.userId);
    return u ? Local.pub(u) : null;
  },

  async login(username, pin) {
    const res = await API.call('login', { username, pin });
    const db = DB.load();
    db.session = { userId: res.user.id, token: res.token, at: Date.now() };
    // make sure the roster is cached locally so the app opens offline
    const u = db.users.find(x => x.id === res.user.id);
    if (u) Object.assign(u, res.user); else db.users.push({ ...res.user, pinHash: 'cloud' });
    DB.save();
    await API.refreshUsers().catch(() => {});
    await API.pull().catch(() => {});
    return API.currentUser();
  },

  async logout() {
    try { await API.call('logout', {}); } catch (e) {}
    const db = DB.load();
    db.session = null;
    DB.save();
  },

  async refreshUsers() {
    const res = await API.call('listUsers', {});
    const db = DB.load();
    (res.users || []).forEach(u => {
      const ex = db.users.find(x => x.id === u.id || x.username === u.username);
      if (ex) Object.assign(ex, u); else db.users.push({ ...u, pinHash: 'cloud' });
    });
    DB.save();
    return db.users.map(u => Local.pub(u));
  },

  users() { return DB.load().users.map(u => Local.pub(u)).filter(u => u.active !== false); },
  allUsers() { return DB.load().users.map(u => Local.pub(u)); },
  userById(id) { const u = DB.load().users.find(x => x.id === id); return u ? Local.pub(u) : null; },

  /* ---------------- reports (local cache is the source of truth) ------ */
  localReports() { return DB.load().reports; },

  async fetchReports(opts = {}) {
    if (API.isCloud()) {
      try {
        const res = await API.call('listReports', opts);
        API.mergeReports(res.reports || []);
      } catch (e) { console.warn('offline — using cached reports', e.message); }
    }
    return API.query(opts);
  },

  query(opts = {}) {
    let list = DB.load().reports.slice();
    if (opts.from) list = list.filter(r => r.date >= opts.from);
    if (opts.to) list = list.filter(r => r.date <= opts.to);
    if (opts.team && opts.team !== 'ALL') list = list.filter(r => r.team === opts.team);
    if (opts.memberId) list = list.filter(r => r.memberId === opts.memberId);
    if (opts.status && opts.status !== 'ALL') list = list.filter(r => r.status === opts.status);
    if (opts.statuses) list = list.filter(r => opts.statuses.includes(r.status));
    return U.sortBy(list, r => r.date + ' ' + (r.memberName || '')).reverse();
  },

  mergeReports(incoming) {
    const db = DB.load();
    incoming.forEach(r => {
      const ex = db.reports.find(x => x.id === r.id);
      if (!ex) db.reports.push(r);
      else if (!ex._dirty && (r.updatedAt || '') >= (ex.updatedAt || '')) Object.assign(ex, r, { _dirty: false });
    });
    DB.save();
  },

  async saveReport(report) {
    const db = DB.load();
    const r = U.clone(report);
    r.updatedAt = new Date().toISOString();
    r.updatedBy = db.session?.userId;
    r._dirty = true;
    const ex = db.reports.find(x => x.id === r.id);
    if (ex) Object.assign(ex, r); else db.reports.push(r);
    DB.save();

    if (API.isCloud()) {
      try {
        const res = await API.call('saveReport', { report: r });
        const saved = db.reports.find(x => x.id === r.id);
        if (saved) { saved._dirty = false; saved._syncedAt = new Date().toISOString(); DB.save(); }
        return res.report || r;
      } catch (e) {
        U.toast('Saved on this device — will sync when online', 'warn');
        return r;
      }
    }
    return r;
  },

  async setStatus(id, status, note) {
    const db = DB.load();
    const me = API.currentUser();
    const r = db.reports.find(x => x.id === id);
    if (!r) throw new Error('Report not found');
    r.status = status;
    if (note) {
      if (status === 'returned') r.returnNote = note;
      else if (me?.role === 'member') r.leaderNote = note;
      else if (me?.role === 'leader') r.leaderNote = note;
      else r.supervisorNote = note;
    }
    r.updatedAt = new Date().toISOString();
    r.updatedBy = me?.id;
    r._dirty = true;
    DB.save();

    if (API.isCloud()) {
      try { await API.call('setStatus', { id, status, note }); r._dirty = false; DB.save(); }
      catch (e) { U.toast('Will sync when online', 'warn'); }
    }
    return r;
  },

  async deleteReport(id) {
    const db = DB.load();
    db.reports = db.reports.filter(x => x.id !== id);
    DB.save();
    if (API.isCloud()) { try { await API.call('deleteReport', { id }); } catch (e) {} }
  },

  /* ---------------- sync --------------------------------------------- */
  pendingCount() {
    const db = DB.load();
    return db.reports.filter(r => r._dirty).length + db.outbox.length;
  },

  async pull() {
    if (!API.isCloud()) return { pulled: 0 };
    const from = U.periodFor(U.today()).from;
    const res = await API.call('listReports', { from });
    API.mergeReports(res.reports || []);
    const db = DB.load();
    db.settings.lastSync = new Date().toISOString();
    DB.save();
    return { pulled: (res.reports || []).length };
  },

  async sync() {
    if (!API.isCloud()) {
      const db = DB.load(); db.settings.lastSync = new Date().toISOString(); DB.save();
      return { pushed: 0, pulled: 0, local: true };
    }
    const db = DB.load();
    let outbox = 0;
    try { outbox = await API.flushOutbox(); } catch (e) {}
    try { await Photos.uploadPending(db.session?.token); } catch (e) {}
    try {
      await API.refreshNotices();
      await API.refreshLeaves();
      const p = Monthly.currentPeriod();
      await API.refreshSchedule(p.from, p.to);
    } catch (e) {}
    const dirty = db.reports.filter(r => r._dirty);
    let pushed = 0;
    for (const r of dirty) {
      try {
        await API.call('saveReport', { report: r });
        r._dirty = false; r._syncedAt = new Date().toISOString(); pushed++;
      } catch (e) { console.warn('push failed', r.id, e.message); break; }
    }
    DB.save();
    let pulled = 0;
    try { pulled = (await API.pull()).pulled; } catch (e) {}
    db.settings.lastSync = new Date().toISOString();
    DB.save();
    return { pushed, pulled, outbox };
  },

  async requestPdf(team, monthKey) {
    return API.call('pdfNow', { team, monthKey });
  },

  /* ================= announcements / directives ====================== */
  notices() {
    const db = DB.load();
    const u = API.currentUser();
    return db.notices
      .filter(n => n && !n.archived)
      .filter(n => {
        if (n.audience === 'ALL' || !n.audience) return true;
        if (n.audience === 'OFFICIALS') return ['leader', 'supervisor', 'admin'].includes(u?.role);
        return n.audience === u?.team;
      })
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
                      (b.priority === 'urgent' ? 1 : 0) - (a.priority === 'urgent' ? 1 : 0) ||
                      String(b.createdAt).localeCompare(String(a.createdAt)));
  },

  async refreshNotices() {
    if (!API.isCloud()) return API.notices();
    try { API.mergeCollection('notices', (await API.call('listNotices', {})).notices); }
    catch (e) {}
    return API.notices();
  },

  async saveNotice(notice) {
    const db = DB.load();
    const n = U.clone(notice);
    if (!n.id) {
      n.id = U.uid('n');
      n.createdAt = new Date().toISOString();
      n.createdBy = API.currentUser()?.id;
      n.createdByName = API.currentUser()?.name;
      n.acks = [];
      db.notices.unshift(n);
    } else {
      const ex = db.notices.find(x => x.id === n.id);
      if (ex) Object.assign(ex, n);
    }
    DB.save();
    return API.pushAux('saveNotice', { notice: n }, () => {
      const ex = db.notices.find(x => x.id === n.id);
      return ex || n;
    });
  },

  async deleteNotice(id) {
    const db = DB.load();
    db.notices = db.notices.filter(n => n.id !== id);
    DB.save();
    return API.pushAux('deleteNotice', { id }, () => ({ ok: true }));
  },

  async ackNotice(id) {
    const db = DB.load();
    const n = db.notices.find(x => x.id === id);
    const u = API.currentUser();
    if (n) {
      n.acks = n.acks || [];
      if (!n.acks.some(a => a.userId === u.id)) {
        n.acks.push({ userId: u.id, name: u.name, at: new Date().toISOString() });
        DB.save();
      }
    }
    return API.pushAux('ackNotice', { id }, () => ({ ok: true }));
  },

  hasAcked(n) {
    const u = API.currentUser();
    return !!(n.acks || []).some(a => a.userId === u?.id);
  },

  /* ======================= duty schedule ============================= */
  schedule(from, to, team) {
    return DB.load().schedules
      .filter(x => (!from || x.date >= from) && (!to || x.date <= to))
      .filter(x => !team || team === 'ALL' || x.team === team)
      .sort((a, b) => (a.date + (a.shift || '')).localeCompare(b.date + (b.shift || '')));
  },

  async refreshSchedule(from, to) {
    if (!API.isCloud()) return;
    try { API.mergeCollection('schedules', (await API.call('listSchedule', { from, to })).slots, 'id'); }
    catch (e) {}
  },

  async saveSlot(slot) {
    const db = DB.load();
    const s = U.clone(slot);
    if (!s.id) { s.id = U.uid('s'); s.createdAt = new Date().toISOString(); db.schedules.push(s); }
    else {
      const ex = db.schedules.find(x => x.id === s.id);
      if (ex) Object.assign(ex, s); else db.schedules.push(s);
    }
    DB.save();
    return API.pushAux('saveSlot', { slot: s }, () => ({ slot: s }));
  },

  async deleteSlot(id) {
    const db = DB.load();
    db.schedules = db.schedules.filter(x => x.id !== id);
    DB.save();
    return API.pushAux('deleteSlot', { id }, () => ({ ok: true }));
  },

  /* ========================== leave ================================= */
  leaves() {
    return DB.load().leaves.slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  },

  async refreshLeaves() {
    if (!API.isCloud()) return API.leaves();
    try { API.mergeCollection('leaves', (await API.call('listLeaves', {})).leaves, 'id'); }
    catch (e) {}
    return API.leaves();
  },

  async requestLeave(leave) {
    const db = DB.load();
    const me_ = API.currentUser();
    const l = U.clone(leave);
    l.id = l.id || U.uid('lv');
    l.memberId = l.memberId || me_.id;
    l.memberName = l.memberName || me_.name;
    l.team = l.team || me_.team;
    l.status = 'pending';
    l.createdAt = new Date().toISOString();
    db.leaves.unshift(l);
    DB.save();
    await API.pushAux('saveLeave', { leave: l }, () => ({ leave: l }));
    return l;
  },

  async setLeaveStatus(id, status, note) {
    const db = DB.load();
    const l = db.leaves.find(x => x.id === id);
    if (l) {
      l.status = status;
      l.decidedBy = API.currentUser()?.name || '';
      l.decidedAt = new Date().toISOString();
      l.decisionNote = note || '';
      DB.save();
    }
    return API.pushAux('setLeaveStatus', { id, status, note }, () => ({ ok: true }));
  },

  /* ================= generic helpers (outbox) ======================== */
  mergeCollection(key, incoming, idField = 'id') {
    if (!Array.isArray(incoming)) return;
    const db = DB.load();
    incoming.forEach(item => {
      const ex = db[key].find(x => x[idField] === item[idField]);
      if (ex) Object.assign(ex, item); else db[key].push(item);
    });
    DB.save();
  },

  queue(action, payload) {
    const db = DB.load();
    db.outbox.push({ action, payload, at: new Date().toISOString() });
    DB.save();
  },

  async pushAux(action, payload, localResult) {
    if (!API.isCloud()) return localResult ? localResult() : { ok: true };
    try {
      await API.call(action, payload);
      return localResult ? localResult() : { ok: true };
    } catch (e) {
      API.queue(action, payload);
      U.toast('Saved here — will send to Google when you are back online', 'warn');
      return localResult ? localResult() : { ok: true };
    }
  },

  async flushOutbox() {
    const db = DB.load();
    if (!db.outbox.length || !API.isCloud()) return 0;
    let sent = 0;
    const remaining = [];
    for (const item of db.outbox) {
      try { await API.call(item.action, item.payload); sent++; }
      catch (e) { remaining.push(item); }
    }
    db.outbox = remaining;
    DB.save();
    return sent;
  },

  outboxCount() { return DB.load().outbox.length; }
};
