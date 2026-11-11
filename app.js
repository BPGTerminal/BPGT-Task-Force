/* =========================================================================
   app.js — screens, navigation and interactions
   ========================================================================= */

/* Practical quick-pick labels, based on the supplied terminal ordinance.
   The free-text field remains available; a label is not a legal finding. */
const VIOLATION_CHOICES = [
  "Unauthorized Loading",
  "Unauthorized Unloading",
  "No Special Pass",
  "No Loading/Unloading Area",
  "Illegal Terminal",
  "Disregarding Terminal Authority",
  "Disruption or Hindering Terminal Ordinance Implementation",
  "Obstruction",
  "Non-Payment of Arkabala",
  "Non-Payment of Special Pass",
  "Refusal to Enter the Terminal",
  "Counterflow",
  "Littering",
  "Illegal Parking",
  "Exceeding the Speed Limit of 30 kph",
  "Reckless Driving Inside the Terminal",
  "Disregarding Terminal/Traffic Signs",
  "Unauthorized Use of Terminal Bay",
  "Hawking of Passengers",
  "Rude Behavior",
  "Illegal Vending",
  "Untidy Area",
  "Smoking or Vaping Outside Designated Area",
  "Dispatching Without a Valid Permit",
  "Vehicle Washing or Repairs in Terminal",
  "No Driver or Staff Uniform / ID",
  "Unauthorized Structure in Terminal",
  "Sale of Prohibited Items",
  "Gambling in Terminal",
  "Overloading",
  "Trip-cutting / Colorum",
  "No / expired franchise",
  "No helmet (tricycle)"
];

/* ------------------------------------------------------------------ icons */
const ICONS = {
  home:   '<path d="M3 10.6 12 3l9 7.6"/><path d="M5.5 9.4V21h13V9.4"/><path d="M9.8 21v-6h4.4v6"/>',
  edit:   '<path d="M12.5 20.5H21"/><path d="M16.6 3.6a2.2 2.2 0 0 1 3.1 3.1L7.6 18.8 3.4 20l1.2-4.2Z"/>',
  list:   '<path d="M8.5 6h12.5M8.5 12h12.5M8.5 18h12.5"/><circle cx="4" cy="6" r="1.3"/><circle cx="4" cy="12" r="1.3"/><circle cx="4" cy="18" r="1.3"/>',
  monitor:'<rect x="2.5" y="4" width="19" height="13" rx="2.2"/><path d="M8.5 21h7M12 17.2V21"/>',
  chart:  '<path d="M4 20V4"/><path d="M4 20h16"/><rect x="7.5" y="11.5" width="3" height="5.5"/><rect x="13" y="7.5" width="3" height="9.5"/><rect x="18" y="9.8" width="3" height="7.2"/>',
  users:  '<circle cx="9" cy="8" r="3.2"/><path d="M2.6 20a6.4 6.4 0 0 1 12.8 0"/><path d="M16.2 5.6a3 3 0 0 1 0 5.4"/><path d="M17.6 14.5a6.5 6.5 0 0 1 3.8 5.5"/>',
  gear:   '<circle cx="12" cy="12" r="3.1"/><path d="M12 2.6v2.8M12 18.6v2.8M2.6 12h2.8M18.6 12h2.8M5.4 5.4l2 2M16.6 16.6l2 2M18.6 5.4l-2 2M7.4 16.6l-2 2"/>',
  check:  '<path d="m4.5 12.5 5 5 10-10.5"/>',
  back:   '<path d="M15 5l-7 7 7 7"/>',
  plus:   '<path d="M12 5v14M5 12h14"/>',
  print:  '<path d="M6.5 9V3.5h11V9"/><rect x="3" y="9" width="18" height="7.5" rx="1.6"/><path d="M6.5 14h11v6.5h-11z"/>',
  mail:   '<rect x="2.6" y="5" width="18.8" height="14" rx="2.2"/><path d="m3 6.5 9 6.5 9-6.5"/>',
  down:   '<path d="M12 3.5v12"/><path d="m7 11 5 5 5-5"/><path d="M4.5 20.5h15"/>',
  trash:  '<path d="M4 7h16"/><path d="M9.5 7V4.6h5V7"/><path d="M6.2 7l.9 13h9.8l.9-13"/>',
  sync:   '<path d="M20.5 12a8.5 8.5 0 0 1-14.6 6"/><path d="M3.5 12a8.5 8.5 0 0 1 14.6-6"/><path d="M18 3.2v3.4h-3.4"/><path d="M6 20.8v-3.4h3.4"/>',
  lock:   '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  doc:    '<path d="M14 3.5H7.5A2 2 0 0 0 5.5 5.5v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8Z"/><path d="M14 3.5V8h4.5"/>',
  out:    '<path d="M15.5 8.5V5.8a2 2 0 0 0-2-2H6.2a2 2 0 0 0-2 2v12.4a2 2 0 0 0 2 2h7.3a2 2 0 0 0 2-2V15.5"/><path d="M10 12h11"/><path d="m18 9 3 3-3 3"/>',
  eye:    '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  send:   '<path d="M21 3 10.5 13.5"/><path d="M21 3l-7 18-3.5-7.5L3 10Z"/>',
  bell:   '<path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5"/><path d="M10.2 19a2 2 0 0 0 3.6 0"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2.2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M7.5 13.5h3M13.5 13.5h3M7.5 17h3"/>',
  camera: '<path d="M4 8.5h3l1.6-2.4h6.8L17 8.5h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z"/><circle cx="12" cy="13.6" r="3.3"/>',
  image:  '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.7" cy="10.1" r="1.5"/><path d="m3.8 17.4 4.7-4.4 3.2 3 2.7-2.6 5.8 5.2"/>',
  more:   '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  check2: '<path d="m3 12.5 5.5 5.5L21 5"/>',
  trash2: '<path d="M4 7h16"/><path d="M9.5 7V4.6h5V7"/><path d="M6.2 7l.9 13h9.8l.9-13"/>'
};
const icon = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

/* ------------------------------------------------------------------ state */
const App = {
  view: 'dashboard',
  params: {},
  draft: null,        // report being encoded
  filters: { team: 'ALL', status: 'ALL', range: 'period' },
  monDate: U.today(),
  monTeam: 'ALL',
  monthly: { team: 'Alpha', monthKey: Monthly.currentPeriod().monthKey },
  dutyTab: 'schedule',
  dutyWeek: null,
  deferredInstall: null
};

const me = () => API.currentUser();
const isMember = () => me()?.role === 'member';
const canMonitor = () => ['leader', 'supervisor', 'admin'].includes(me()?.role);
const isAdmin = () => me()?.role === 'admin';

/* ================================================================= boot == */
document.addEventListener('DOMContentLoaded', init);

async function init() {
  seedDemoData();
  BP.API_URL = DB.load().settings.apiUrl || BP.API_URL;
  document.getElementById('app-ver').textContent = BP.APP_VERSION;
  paintModePill();

  document.getElementById('login-form').addEventListener('submit', onLogin);
  document.getElementById('toggle-pin').addEventListener('click', () => {
    const p = document.getElementById('pin');
    const on = p.type === 'password';
    p.type = on ? 'text' : 'password';
    document.getElementById('toggle-pin').textContent = on ? 'HIDE' : 'SHOW';
  });
  document.getElementById('avatar-btn').addEventListener('click', openAccount);
  window.addEventListener('hashchange', () => {
    const v = location.hash.replace('#/', '') || 'dashboard';
    if (v !== App.view && me()) go(v);
  });
  window.addEventListener('online', () => { updateSyncPill(); syncNow(true); });
  window.addEventListener('offline', updateSyncPill);
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); App.deferredInstall = e; render();
  });

  registerSW();

  // resume session
  const u = me();
  if (u) { enterApp(u); }
  else { document.getElementById('login-screen').hidden = false; }

  setInterval(() => { if (me() && API.isCloud()) syncNow(true); }, BP.SYNC_INTERVAL_MS);
  setInterval(updateSyncPill, 15000);
}

function paintModePill() {
  const el = document.getElementById('mode-pill');
  const cloud = !!BP.API_URL;
  el.className = 'mode-pill' + (cloud ? ' cloud' : '');
  el.textContent = cloud ? 'Connected · Google Sheets' : 'Local mode';
  el.title = cloud ? BP.API_URL : 'Data stays on this device until the Google Sheets connection is configured (see SETUP.md).';
  document.getElementById('demo-box').hidden = cloud;
}

async function onLogin(ev) {
  ev.preventDefault();
  const btn = document.getElementById('login-btn');
  const err = document.getElementById('login-error');
  const username = document.getElementById('username').value.trim();
  const pin = document.getElementById('pin').value.trim();
  err.hidden = true; btn.disabled = true; btn.textContent = 'Signing in…';
  try {
    const u = await API.login(username, pin);
    document.getElementById('login-screen').hidden = true;
    document.getElementById('pin').value = '';
    enterApp(u);
    if (u.mustChange) setTimeout(() => openAccount(true), 600);
  } catch (e) {
    err.textContent = e.message || 'Sign-in failed';
    err.hidden = false;
  } finally {
    btn.disabled = false; btn.textContent = 'Sign in';
  }
}

function enterApp(u) {
  document.getElementById('login-screen').hidden = true;
  document.getElementById('app').hidden = false;
  const role = BP.ROLES[u.role]?.label || u.role;
  document.getElementById('top-sub').textContent = `${u.name} · ${role}${u.team && u.team !== 'BOTH' ? ' · ' + u.team : ''}`;
  document.getElementById('avatar-btn').textContent = initials(u.name);
  document.getElementById('avatar-btn').style.background = u.team === 'Zulu' ? '#c9b8ff' : (u.team === 'Alpha' ? '#f4b23e' : '#ffd8a8');

  const allowed = BP.NAV[u.role] || ['dashboard'];
  if (!allowed.includes(App.view)) App.view = 'dashboard';
  go(App.view);
  updateSyncPill();
  syncNow(true);
}

const shortDate = iso => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return `${d.getDate()} ${U.MON3[d.getMonth()]} ${d.getFullYear()}`;
};

const initials = n => (n || 'TF').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

function registerSW() {
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW not registered', e.message));
}

/* ================================================================ router = */
function go(view, params = {}) {
  const allowed = BP.NAV[me()?.role] || ['dashboard'];
  if (!allowed.includes(view)) view = 'dashboard';
  if (view === 'encode' && !params.editId && App.draft?._editMode) {
    App.draft = null;
  }
  App.view = view; App.params = params;
  if (location.hash !== '#/' + view) history.replaceState(null, '', '#/' + view);
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  if (!me()) return;
  renderNav();
  const v = {
    dashboard: viewDashboard,
    encode: viewEncode,
    monitoring: viewMonitoring,
    reports: viewReports,
    monthly: viewMonthly,
    users: viewUsers,
    settings: viewSettings,
    notices: viewNotices,
    duty: viewDuty
  }[App.view] || viewDashboard;
  document.getElementById('view').innerHTML = v();
  bindView();
  paintInstallBanner();
}

const NAV_LABELS = {
  dashboard:  ['Dashboard', 'home'],
  encode:     ['Encode report', 'edit'],
  monitoring: ['Monitoring', 'monitor'],
  reports:    ['Reports', 'list'],
  monthly:    ['Monthly summary', 'chart'],
  notices:    ['Notices', 'bell'],
  duty:       ['Duty &amp; leave', 'calendar'],
  users:      ['Accounts', 'users'],
  settings:   ['Settings', 'gear']
};

function renderNav() {
  const items = (BP.NAV[me().role] || []).map(id => {
    const [label, ic] = NAV_LABELS[id] || ['—', 'list'];
    return { id, label, ic };
  });

  const visible = items.slice(0, 4);
  const extra = items.slice(4);
  document.getElementById('tabbar').innerHTML =
    visible.map(it => `
      <button data-nav="${it.id}" class="${App.view === it.id ? 'active' : ''}">
        ${icon(it.ic)}<span>${it.label.split(' ')[0]}</span>
      </button>`).join('') +
    `<button data-action="more-nav" class="${extra.some(i => i.id === App.view) ? 'active' : ''}">
       ${icon('more')}<span>More</span>
     </button>`;

  document.getElementById('side-nav').innerHTML =
    `<div class="head">Menu</div>` +
    items.map(it => `<button data-nav="${it.id}" class="${App.view === it.id ? 'active' : ''}">${icon(it.ic)}<span>${it.label}</span></button>`).join('') +
    `<div class="head" style="margin-top:auto">Account</div>
     <button data-action="account">${icon('lock')}<span>PIN &amp; profile</span></button>
     <button data-action="sync">${icon('sync')}<span>Sync now</span></button>`;
}

/* one delegated binder for every screen */
function bindView() {
  const root = document.getElementById('view');
  root.oninput = null;
  root.onchange = null;
  root.onclick = e => {
    const nav = e.target.closest('[data-nav]');
    if (nav) return go(nav.dataset.nav);
    const act = e.target.closest('[data-action]');
    if (act) return handleAction(act.dataset.action, act.dataset, act, e);
    const rep = e.target.closest('[data-report]');
    if (rep) return openReport(rep.dataset.report);
  };
  const tb = document.getElementById('tabbar');
  tb.onclick = e => {
    const act = e.target.closest('[data-action]');
    if (act) { e.preventDefault(); return handleAction(act.dataset.action, { ...act.dataset }, act, e); }
    const b = e.target.closest('[data-nav]');
    if (b) go(b.dataset.nav);
  };
  const sn = document.getElementById('side-nav');
  sn.onclick = e => {
    const b = e.target.closest('[data-nav]'); if (b) return go(b.dataset.nav);
    const a = e.target.closest('[data-action]'); if (!a) return;
    if (a.dataset.action === 'account') openAccount();
    if (a.dataset.action === 'sync') syncNow(false);
  };
  const specific = {
    dashboard: bindDashboard, encode: bindEncode, monitoring: bindMonitoring,
    reports: bindReports, monthly: bindMonthly, users: bindUsers, settings: bindSettings,
    notices: bindNotices, duty: bindDuty
  }[App.view];
  if (specific) specific(root);
}

/* ================================================================ shared = */
function periodBadge() {
  const p = Monthly.currentPeriod();
  return `<span class="badge gold">Period ${U.esc(p.label)}</span>`;
}

function reportCard(r, showMember = true) {
  const d = U.parseISO(r.date);
  const st = BP.STATUS[r.status] || {};
  const entries = (r.rows || []).length;
  const vios = (r.rows || []).filter(x => x.violation).length;
  const title = showMember
    ? r.memberName
    : `${U.weekday(r.date)} duty report`;
  return `<button class="rep" data-report="${U.esc(r.id)}">
    <div class="date"><b>${d.getDate()}</b><span>${U.MON3[d.getMonth()]}</span></div>
    <div class="body">
      <div class="name">${U.esc(title)}</div>
      <div class="meta">
        <span class="badge team-${U.esc(r.team)}">${U.esc(r.team)}</span>
        <span class="badge ${st.cls}">${U.esc(st.label || r.status)}</span>
        <span>${entries} entr${entries === 1 ? 'y' : 'ies'}</span>
        ${vios ? `<span>· ${vios} violation${vios > 1 ? 's' : ''}</span>` : ''}
        ${r._dirty ? '<span title="waiting to sync">· <b>unsynced</b></span>' : ''}
      </div>
    </div>
  </button>`;
}

function emptyState(msg, sub = '') {
  return `<div class="empty">${icon('doc')}<div>${U.esc(msg)}</div>${sub ? `<div class="small" style="margin-top:4px">${U.esc(sub)}</div>` : ''}</div>`;
}

function kpi(label, value, sub = '', cls = '') {
  return `<div class="kpi ${cls}"><div class="k">${U.esc(label)}</div><div class="v">${value}</div><div class="s">${sub}</div></div>`;
}

/* ============================================================= dashboard = */
function viewDashboard() {
  const u = me();
  const p = Monthly.currentPeriod();
  const all = API.query({ from: p.from, to: p.to });
  const mine = isMember() ? all.filter(r => r.memberId === u.id) : all;
  const todayRep = all.filter(r => r.date === U.today());

  const teamMembers = API.users().filter(x => x.role === 'member' && (isMember() ? x.team === u.team : true));
  const submittedToday = new Set(todayRep.map(r => r.memberId));
  const pending = all.filter(r => r.status === 'submitted').length;
  const violations = U.sum(mine, r => (r.rows || []).filter(x => x.violation).length);
  const entries = U.sum(mine, r => (r.rows || []).length);
  const returned = mine.filter(r => r.status === 'returned');

  const unacked = API.notices().filter(n => !API.hasAcked(n));
  const noticeBanner = unacked.length ? `
    <div class="banner ${unacked[0].priority === 'urgent' ? '' : 'navy'}">
      <div class="ic">${unacked[0].priority === 'urgent' ? '!' : 'i'}</div>
      <div style="flex:1;min-width:0">
        <b>${U.esc(unacked[0].title)}</b>
        <p>${U.esc((unacked[0].body || '').slice(0, 150))}${(unacked[0].body || '').length > 150 ? '…' : ''}</p>
        <p class="small" style="margin-top:4px">${U.esc(unacked[0].createdByName || '')} · ${U.esc(shortDate(unacked[0].createdAt))}${unacked.length > 1 ? ` · ${unacked.length - 1} more notice(s)` : ''}</p>
        <div class="btn-row" style="margin-top:9px">
          <button class="btn sm primary" data-nav="notices">Read &amp; acknowledge</button>
        </div>
      </div>
    </div>` : '';

  const today = new Date();
  const day = today.getDate();
  const periodEndingSoon = day >= BP.PERIOD.endDay - 2 && day <= BP.PERIOD.endDay;
  const closingBanner = periodEndingSoon && canMonitor() ? `
    <div class="banner">
      <div class="ic">!</div>
      <div>
        <b>Reporting period ${U.esc(p.name)} closes on ${U.fmtLong(p.to)}</b>
        <p>The monthly summary (${U.esc(p.label)}) will be generated as PDF and e-mailed to ${U.esc(BP.org.googleAccount)} on the ${BP.AUTO_PDF_DAY}th. Review and approve pending reports before then.</p>
        <div class="btn-row" style="margin-top:9px">
          <button class="btn sm primary" data-nav="monthly">Open monthly summary</button>
          ${canMonitor() ? `<button class="btn sm ghost" data-nav="monitoring">Review pending (${pending})</button>` : ''}
        </div>
      </div>
    </div>` : '';

  const d = new Date();
  const hour = d.getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return `
  <div class="view-head">
    <div style="min-width:0">
      <h2>${greet}, ${U.esc(u.name.split(' ')[0])}</h2>
      <p>${U.esc(BP.ROLES[u.role].label)}${u.team !== 'BOTH' ? ' · ' + U.esc(u.team) + ' Team' : ''} · ${U.fmtLong(U.today())}</p>
      <div style="margin-top:8px">${periodBadge()}</div>
    </div>
    <div class="btn-row">
      ${isMember() ? `<button class="btn primary" data-nav="encode">${icon('plus')} Encode today</button>` : ''}
      ${canMonitor() ? `<button class="btn ghost" data-nav="monitoring">${icon('monitor')} Monitor</button>` : ''}
    </div>
  </div>
  ${noticeBanner}
  ${closingBanner}
  ${returned.length ? `<div class="banner"><div class="ic">!</div><div><b>${returned.length} report${returned.length > 1 ? 's were' : ' was'} returned for correction</b>
      <p>${U.esc(returned[0].returnNote || 'Please review the remarks and re-submit.')}</p>
      <div class="btn-row" style="margin-top:9px"><button class="btn sm primary" data-report="${U.esc(returned[0].id)}">Open report</button></div></div></div>` : ''}

  <div class="kpis">
    ${kpi("Today's submissions", `${submittedToday.size}<span style="font-size:14px;color:#8a97b3"> / ${teamMembers.length}</span>`, isMember() ? `${u.team} Team members who filed` : 'members who filed today', 'navy')}
    ${kpi('Period entries', U.nf(entries), U.esc(p.name))}
    ${kpi('Violations noted', U.nf(violations), 'apprehension entries')}
    ${canMonitor()
      ? kpi('Awaiting review', pending, pending ? 'submitted, not yet verified' : 'all clear', pending ? 'gold' : '')
      : kpi('My reports', U.nf(mine.length), 'this period')}
  </div>

  ${statsHTML(isMember() ? mine : all)}

  ${canMonitor() ? `
  <div class="card">
    <h3>Member submission status — today</h3>
    <p class="hint">Who has filed their daily report for ${U.fmtLong(U.today())}</p>
    ${teamMembers.map(m => `
      <div class="session-row">
        <span class="dot ${submittedToday.has(m.id) ? 'on' : 'off'}"></span>
        <div style="flex:1">
          <div style="font-size:13.5px;font-weight:600">${U.esc(m.name)}</div>
          <div class="small">${U.esc(m.team)} Team</div>
        </div>
        ${submittedToday.has(m.id)
          ? `<span class="badge ok">Filed</span>`
          : `<span class="badge draft">No report</span>`}
      </div>`).join('')}
  </div>` : ''}

  <div class="card">
    <h3>${isMember() ? 'My recent reports' : 'Latest submissions'}</h3>
    <p class="hint">${isMember() ? 'Tap a report to review or edit it' : 'Tap to verify, return or approve'}</p>
    ${(() => {
      const list = (isMember() ? mine : all).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
      return list.length ? list.map(r => reportCard(r, !isMember())).join('')
        : emptyState('No reports yet', isMember() ? 'Tap “Encode today” to file your first report.' : 'Submissions will appear here.');
    })()}
    ${(isMember() ? mine : all).length > 6 ? `<div style="text-align:center;margin-top:10px"><button class="btn ghost sm" data-nav="reports">See all reports</button></div>` : ''}
  </div>

  ${App.deferredInstall ? `<div class="banner navy"><div class="ic">↓</div><div><b>Install this app</b><p>Add BPGT TF Reports to your home screen so it works even without a signal.</p>
    <div class="btn-row" style="margin-top:9px"><button class="btn sm primary" data-action="install">Install app</button></div></div></div>` : ''}
  `;
}
function bindDashboard() {}

/* ================================================================ encode = */
function blankRow() {
  return { time: '', post: '', postOther: '', violation: '', plate: '', driver: '', ct: '', remarks: '', photos: [] };
}

/** the report id a draft will be saved under (used to file photos early) */
function draftReportId() {
  const d = App.draft;
  if (!d) return '';
  return `R-${String(d.date).replace(/-/g, '')}-${d.memberUsername || me()?.username || 'tf'}`;
}

function existingReportForDraft(d) {
  if (!d || !d.date) return null;
  const candidateId = `R-${String(d.date).replace(/-/g, '')}-${d.memberUsername || me()?.username || 'tf'}`;
  return API.localReports().find(r => r.id === candidateId) ||
         API.localReports().find(r => r.date === d.date && r.memberId === d.memberId) || null;
}

function newDraft(opts = {}) {
  const u = me();
  const editId = opts.editId || App.params?.editId;
  if (editId) {
    const existing = API.localReports().find(r => r.id === editId);
    if (existing) {
      const cloned = U.clone(existing);
      cloned._editMode = true;
      if (!Array.isArray(cloned.rows) || !cloned.rows.length) cloned.rows = [blankRow()];
      return cloned;
    }
  }
  const members = API.users().filter(x => x.role === 'member');
  const defaultTeam = opts.team || (u.team === 'BOTH' ? 'Alpha' : u.team);
  let target = u;
  if (opts.memberId) {
    target = API.userById(opts.memberId) || u;
  } else if (u.role !== 'member' && members.length) {
    target = members.find(m => m.team === defaultTeam) || members[0];
  }
  return {
    id: '',
    date: opts.date || U.today(),
    team: target.team === 'BOTH' ? defaultTeam : (target.team || defaultTeam),
    memberId: target.id,
    memberName: target.name,
    memberUsername: target.username,
    rows: [blankRow()],
    tally: { vehicles: '', passengers: '', arkabala: '', violations: '', incidents: '', tickets: '' },
    narrative: '',
    status: 'draft',
    leaderNote: '', supervisorNote: '', returnNote: '',
    _editMode: false
  };
}

function viewEncode() {
  if (!isMember() && !canMonitor()) return emptyState('Encode is for task force members');
  if (!App.draft) App.draft = newDraft();
  const d = App.draft;
  const members = API.users().filter(x => x.role === 'member');
  const existing = existingReportForDraft(d);
  const locked = (d._editMode ? d.status : existing?.status) && ['reviewed', 'approved'].includes(d._editMode ? d.status : existing?.status);
  const existingCount = existing ? (existing.rows || []).length : 0;

  return `
  <div class="view-head">
    <div><h2>${d._editMode ? 'Edit saved report' : 'Encode daily report'}</h2>
      <p>${d._editMode
        ? `Editing all saved entries and totals for ${U.fmtLong(d.date)}.`
        : 'Start with a blank entry pad. Each submission is added to this day’s report and clears the pad for your next entry.'}</p></div>
    <div class="btn-row">${periodBadge()}</div>
  </div>

  ${d._editMode ? `
  <div class="banner navy" id="edit-mode-banner">
    <div class="ic">✎</div>
    <div style="flex:1">
      <b>Editing saved report for ${U.fmtLong(d.date)} (${(d.rows || []).length} entr${(d.rows || []).length === 1 ? 'y' : 'ies'})</b>
      <p>Changes you save here update the entire daily report for ${U.esc(d.memberName)}.</p>
      <div class="btn-row" style="margin-top:8px">
        <button type="button" class="btn sm ghost" data-action="reset-encode-pad">Back to blank entry pad</button>
      </div>
    </div>
  </div>` : (existing ? `
  <div class="banner navy" id="existing-report-banner">
    <div class="ic">✓</div>
    <div style="flex:1">
      <b>${existingCount} entr${existingCount === 1 ? 'y' : 'ies'} already saved for ${U.fmtLong(d.date)}</b>
      <p>The input pad below is blank and ready. Submitting a new entry adds it to ${U.esc(d.memberName)}’s daily report.</p>
      <div class="btn-row" style="margin-top:8px">
        <button type="button" class="btn sm ghost" data-report="${U.esc(existing.id)}">${icon('eye')} View saved report</button>
        <button type="button" class="btn sm ghost" data-action="edit-report" data-id="${U.esc(existing.id)}">${icon('edit')} Edit saved entries (${existingCount})</button>
      </div>
    </div>
  </div>` : '')}

  ${locked ? `<div class="banner"><div class="ic">!</div><div><b>This report is already ${U.esc(d._editMode ? d.status : existing?.status)}</b>
      <p>Adding or editing entries will send it back to “Submitted”. Ask your Team Leader if a correction is needed.</p></div></div>` : ''}

  <div class="card">
    <h3>Report details</h3>
    <p class="hint">One report per duty day. New entries are added to the selected member and date.</p>
    <div class="form-grid form-2">
      <div>
        <label class="lbl" for="f-date">Date of duty</label>
        <input class="input" type="date" id="f-date" value="${U.esc(d.date)}" max="${U.today()}">
      </div>
      <div>
        <label class="lbl" for="f-team">Team</label>
        <select class="input" id="f-team" ${isMember() ? 'disabled' : ''}>
          ${BP.TEAMS.map(t => `<option ${d.team === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      ${canMonitor() ? `<div class="full">
        <label class="lbl" for="f-member">Member (filing on behalf)</label>
        <select class="input" id="f-member">
          ${members.map(m => `<option value="${U.esc(m.id)}" ${d.memberId === m.id ? 'selected' : ''}>${U.esc(m.name)} — ${U.esc(m.team)}</option>`).join('')}
        </select>
      </div>` : ''}
    </div>
  </div>

  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
      <div><h3>Duty activity log</h3><p class="hint" style="margin:0 0 6px">Time · post · violation · plate · driver · CT number · remarks</p></div>
      <button type="button" class="btn soft sm" data-action="add-row" ${d.rows.length >= 40 ? 'disabled' : ''}>${icon('plus')} Add row</button>
    </div>
    <div id="rows" style="margin-top:11px">${d.rows.map((r, i) => rowHTML(r, i)).join('')}</div>
    ${d.rows.length === 0 ? emptyState('No entry rows on the pad', 'Tap “+ Add entry row” below to add an apprehension or activity, or submit tally/notes only.') : ''}
    <div style="margin-top:10px">
      <button type="button" class="btn soft add-row-bottom" data-action="add-row" ${d.rows.length >= 40 ? 'disabled' : ''}>
        ${icon('plus')} ${d.rows.length ? 'Add another row' : 'Add entry row'}
      </button>
    </div>
  </div>

  <div class="card">
    <h3>Summary tally</h3>
    <p class="hint">${d._editMode
      ? 'Page 2 of the form — full totals for this duty day.'
      : (existing
          ? 'Optional — leave blank if unchanged. Any numbers entered here will be added to today’s saved tally.'
          : 'Optional — totals for this duty day (you can enter these now or update them later today).')}</p>
    <div class="tally-grid">
      ${BP.TALLY_FIELDS.map(f => {
        const val = d.tally[f.key];
        const disp = (val === '' || val === null || val === undefined) ? '' : U.num(val);
        const savedVal = (!d._editMode && existing) ? U.num(existing.tally?.[f.key]) : null;
        return `
        <div class="t">
          <label for="t-${f.key}">${U.esc(f.label)}${savedVal ? ` <span class="tally-saved-pill">Saved: ${U.nf(savedVal)}</span>` : ''}</label>
          <input class="input" type="number" min="0" inputmode="numeric" id="t-${f.key}" data-tally="${f.key}" value="${disp}" placeholder="0">
        </div>`;
      }).join('')}
    </div>
    <button type="button" class="btn ghost sm" style="margin-top:10px" data-action="auto-violations">Count violations from pad (${d.rows.filter(r => r.violation).length})</button>
  </div>

  <div class="card">
    <h3>Incidents / concerns / recommendations</h3>
    <p class="hint">${(!d._editMode && existing && existing.narrative)
      ? `Saved note today: “${U.esc(existing.narrative)}” — Anything typed below will be added to today’s notes.`
      : 'Anything the Team Leader, Supervisor or Terminal Administrator should know.'}</p>
    <textarea class="input" id="f-narrative" rows="4" placeholder="e.g. Concern: illegal parking along the Rotunda post during peak hours. Recommendation: request additional signage.">${U.esc(d.narrative)}</textarea>
  </div>

  <div class="card">
    <div class="btn-row" style="justify-content:space-between">
      <div class="btn-row">
        <button type="button" class="btn ghost" data-action="save-draft">Save draft</button>
        <button type="button" class="btn ghost" data-action="reset-encode-pad">Clear pad</button>
      </div>
      <div class="btn-row">
        ${(d._editMode ? d.status : existing?.status) === 'returned' ? '<span class="badge danger" style="align-self:center">Returned — re-submit after correcting</span>' : ''}
        <button type="button" class="btn primary" data-action="submit">${icon('send')} ${d._editMode ? 'Save changes' : 'Submit report'}</button>
      </div>
    </div>
  </div>`;
}

function rowHTML(r, i) {
  const isEdit = Boolean(App.draft?._editMode);
  return `<div class="log-row" data-row="${i}">
    <div class="rhead"><b>${isEdit ? 'Entry' : 'New entry'} ${i + 1}</b><button type="button" class="del" data-action="del-row" data-idx="${i}">Remove</button></div>
    <div class="g">
      <div><label class="lbl">Time</label><input class="input" type="time" data-row="${i}" data-field="time" value="${U.esc(r.time)}"></div>
      <div><label class="lbl">Post</label>
        <select class="input" data-row="${i}" data-field="post">
          <option value="" ${!r.post ? 'selected' : ''}>Select post…</option>
          ${BP.POSTS.map(p => `<option value="${U.esc(p)}" ${r.post === p ? 'selected' : ''}>${p}</option>`).join('')}
        </select>
      </div>
      ${r.post === 'OTHERS' ? `<div class="full"><label class="lbl">Post name</label><input class="input" data-row="${i}" data-field="postOther" value="${U.esc(r.postOther)}" placeholder="Specify post"></div>` : ''}
      <div><label class="lbl">Plate number</label><input class="input" data-row="${i}" data-field="plate" value="${U.esc(r.plate)}" placeholder="ABC 1234" autocapitalize="characters"></div>
      <div class="full"><label class="lbl" for="violation-pick-${i}">Type of violation</label>
        <select class="input" id="violation-pick-${i}" data-violation-pick="${i}">
          <option value="">Select a violation, or type below</option>
          ${VIOLATION_CHOICES.map(v => `<option value="${U.esc(v)}" ${r.violation === v ? 'selected' : ''}>${U.esc(v)}</option>`).join('')}
        </select>
        <input class="input" style="margin-top:8px" aria-label="Violation details or other violation" data-row="${i}" data-field="violation" value="${U.esc(r.violation)}" placeholder="Or type another violation">
      </div>
      <div><label class="lbl">Driver</label><input class="input" data-row="${i}" data-field="driver" value="${U.esc(r.driver)}" placeholder="Full name"></div>
      <div><label class="lbl">CT number</label><input class="input" data-row="${i}" data-field="ct" value="${U.esc(r.ct)}" placeholder="CT-0000"></div>
      <div class="full"><label class="lbl">BPGT TF remarks</label><input class="input" data-row="${i}" data-field="remarks" value="${U.esc(r.remarks)}" placeholder="Action taken"></div>
      <div class="full">
        <label class="lbl">Photo documentation</label>
        <div class="shots" data-shots="${i}"></div>
        <div class="shot-actions">
          <label class="shot-add">${icon('camera')} Take photo
            <input type="file" accept="image/*" capture="environment" multiple hidden data-photo-row="${i}">
          </label>
          <label class="shot-add">${icon('image')} From gallery
            <input type="file" accept="image/*" multiple hidden data-photo-row="${i}">
          </label>
        </div>
        <p class="hint">You can choose a photo taken earlier. Save the report, then check the photo upload when you have signal.</p>
      </div>
    </div>
  </div>
  `;
}

function bindEncode(root) {
  hydrateShots();

  const syncField = el => {
    const d = App.draft;
    const rowsEl = root.querySelector('#rows');
    const i = +el.dataset.row, f = el.dataset.field;
    if (!d || isNaN(i) || !f || !d.rows[i]) return;
    d.rows[i][f] = el.value;
    if (f === 'violation') {
      const pick = el.parentElement.querySelector('[data-violation-pick]');
      if (pick) pick.value = VIOLATION_CHOICES.includes(el.value) ? el.value : '';
    }
    if (f === 'post' && rowsEl) {
      rowsEl.innerHTML = d.rows.map((r, k) => rowHTML(r, k)).join('');
      hydrateShots();
    }
  };

  root.oninput = e => {
    const d = App.draft;
    if (!d) return;
    if (e.target.dataset.field) syncField(e.target);
    else if (e.target.dataset.tally) d.tally[e.target.dataset.tally] = e.target.value === '' ? '' : U.num(e.target.value);
    else if (e.target.id === 'f-narrative') d.narrative = e.target.value;
    else if (e.target.id === 'f-date') d.date = e.target.value;
  };

  root.onchange = async e => {
    const d = App.draft;
    if (!d) return;
    if (e.target.matches('[data-violation-pick]')) {
      const idx = +e.target.dataset.violationPick;
      if (!d.rows[idx] || !e.target.value) return;
      d.rows[idx].violation = e.target.value;
      const input = e.target.parentElement.querySelector('[data-field="violation"]');
      if (input) input.value = e.target.value;
      return;
    }
    if (e.target.matches('[data-photo-row]')) {
      const idx = +e.target.dataset.photoRow;
      const files = Array.from(e.target.files || []);
      e.target.value = '';
      await addPhotos(idx, files);
      return;
    }
    if (e.target.dataset.field) syncField(e.target);
    else if (e.target.id === 'f-date') {
      collectDraftSoft();
      d.date = e.target.value;
      if (!d._editMode) render();
    }
    else if (e.target.id === 'f-team') {
      collectDraftSoft();
      d.team = e.target.value;
      if (canMonitor()) {
        const list = API.users().filter(x => x.role === 'member' && x.team === d.team);
        if (list.length) {
          d.memberId = list[0].id; d.memberName = list[0].name; d.memberUsername = list[0].username;
        }
      }
      if (!d._editMode) render();
    }
    else if (e.target.id === 'f-member') {
      collectDraftSoft();
      const m = API.userById(e.target.value);
      if (m) {
        d.memberId = m.id; d.memberName = m.name; d.memberUsername = m.username; d.team = m.team;
      }
      if (!d._editMode) render();
    }
  };
}

function isRowMeaningful(r) {
  if (!r) return false;
  return Boolean(
    (r.time && String(r.time).trim()) ||
    (r.post && String(r.post).trim()) ||
    (r.postOther && String(r.postOther).trim()) ||
    (r.violation && String(r.violation).trim()) ||
    (r.plate && String(r.plate).trim()) ||
    (r.driver && String(r.driver).trim()) ||
    (r.ct && String(r.ct).trim()) ||
    (r.remarks && String(r.remarks).trim()) ||
    (r.photos && r.photos.length)
  );
}

async function saveDraft(submit) {
  collectDraftSoft();
  const d = App.draft;
  if (!d || !d.date) return U.toast('Choose the duty date', 'err');
  const meaningful = (d.rows || []).map(r => ({ ...r })).filter(isRowMeaningful);
  const hasTally = BP.TALLY_FIELDS.some(f => {
    const v = d.tally?.[f.key];
    return v !== '' && v !== null && v !== undefined && U.num(v) > 0;
  });
  const hasNarrative = Boolean((d.narrative || '').trim());
  if (!meaningful.length && !hasTally && !hasNarrative) {
    return U.toast('Add at least one log entry, a tally or a note', 'err');
  }

  const reportId = d.id || `R-${d.date.replace(/-/g, '')}-${d.memberUsername || me()?.username || 'tf'}`;

  if (!d._editMode && API.isCloud() && !API.localReports().find(r => r.id === reportId)) {
    try { await API.fetchReports({ from: d.date, to: d.date, memberId: d.memberId }); } catch (e) {}
  }

  const existing = API.localReports().find(r => r.id === reportId);
  if (existing && existing.memberId && d.memberId && existing.memberId !== d.memberId) {
    return U.toast('Another report already exists for that member and date', 'err');
  }

  let reportToSave;
  if (!d._editMode && existing) {
    const prevRows = U.clone(existing.rows || []);
    const mergedRows = [...prevRows, ...meaningful];
    const mergedTally = {};
    BP.TALLY_FIELDS.forEach(f => {
      const k = f.key;
      const prevVal = U.num(existing.tally?.[k]);
      const typedRaw = d.tally?.[k];
      const hasTyped = typedRaw !== '' && typedRaw !== null && typedRaw !== undefined;
      if (hasTyped) {
        mergedTally[k] = prevVal + U.num(typedRaw);
      } else if (k === 'violations') {
        mergedTally[k] = prevVal + meaningful.filter(r => r.violation).length;
      } else if (k === 'tickets') {
        mergedTally[k] = prevVal + meaningful.filter(r => r.ct).length;
      } else {
        mergedTally[k] = prevVal;
      }
    });
    const prevNarr = (existing.narrative || '').trim();
    const newNarr = (d.narrative || '').trim();
    const mergedNarrative = prevNarr && newNarr
      ? (prevNarr === newNarr ? prevNarr : `${prevNarr}\n${newNarr}`)
      : (newNarr || prevNarr);

    reportToSave = {
      ...U.clone(existing),
      id: reportId,
      date: d.date,
      team: d.team,
      memberId: d.memberId,
      memberName: d.memberName || existing.memberName || me().name,
      memberUsername: d.memberUsername || existing.memberUsername || me().username,
      rows: mergedRows,
      tally: mergedTally,
      narrative: mergedNarrative,
      status: submit ? 'submitted' : (existing.status === 'returned' ? 'returned' : (existing.status || 'draft')),
      returnNote: submit ? '' : (existing.returnNote || '')
    };
  } else {
    const computedTally = {};
    BP.TALLY_FIELDS.forEach(f => {
      const k = f.key;
      const typedRaw = d.tally?.[k];
      const hasTyped = typedRaw !== '' && typedRaw !== null && typedRaw !== undefined;
      if (hasTyped) {
        computedTally[k] = U.num(typedRaw);
      } else if (k === 'violations') {
        computedTally[k] = meaningful.filter(r => r.violation).length;
      } else if (k === 'tickets') {
        computedTally[k] = meaningful.filter(r => r.ct).length;
      } else {
        computedTally[k] = 0;
      }
    });
    reportToSave = {
      ...(existing ? U.clone(existing) : {}),
      id: reportId,
      date: d.date,
      team: d.team,
      memberId: d.memberId,
      memberName: d.memberName || me().name,
      memberUsername: d.memberUsername || me().username,
      rows: meaningful,
      tally: computedTally,
      narrative: (d.narrative || '').trim(),
      status: submit ? 'submitted' : (d.status === 'returned' ? 'returned' : 'draft'),
      leaderNote: d.leaderNote || existing?.leaderNote || '',
      supervisorNote: d.supervisorNote || existing?.supervisorNote || '',
      returnNote: submit ? '' : (d.returnNote || existing?.returnNote || '')
    };
  }

  await fileDraftPhotos(reportToSave).catch(() => {});
  const saved = await API.saveReport(reportToSave);
  if (API.isCloud()) {
    try { Photos.uploadPending(DB.load().session?.token).catch(() => {}); } catch (e) {}
  }

  const nextContext = {
    date: reportToSave.date,
    team: reportToSave.team,
    memberId: reportToSave.memberId,
    memberName: reportToSave.memberName,
    memberUsername: reportToSave.memberUsername
  };
  App.params = {};
  App.draft = newDraft(nextContext);
  const totalEntries = (saved.rows || []).length;
  U.toast(
    submit
      ? `Report submitted (${totalEntries} entr${totalEntries === 1 ? 'y' : 'ies'} in daily report) — Input pad is empty and ready for next entry`
      : `Draft saved (${totalEntries} entr${totalEntries === 1 ? 'y' : 'ies'}) — Input pad is empty and ready for next entry`,
    'ok',
    3600
  );
  go('encode');
}

/* ============================================================= monitoring = */
function viewMonitoring() {
  const date = App.monDate;
  const team = App.monTeam;
  const members = API.users().filter(u => u.role === 'member' && (team === 'ALL' || u.team === team));
  const dayReps = API.query({ from: date, to: date, team });
  const byMember = id => dayReps.find(r => r.memberId === id);
  const p = Monthly.currentPeriod();
  const period = API.query({ from: p.from, to: p.to, team });
  const pending = period.filter(r => r.status === 'submitted');

  const perMember = members.map(m => {
    const mine = period.filter(r => r.memberId === m.id);
    return {
      m, days: new Set(mine.map(r => r.date)).size,
      entries: U.sum(mine, r => (r.rows || []).length),
      vios: U.sum(mine, r => (r.rows || []).filter(x => x.violation).length),
      tickets: U.sum(mine, r => U.num(r.tally?.tickets)),
      last: mine.map(r => r.date).sort().pop() || '—'
    };
  });

  return `
  <div class="view-head">
    <div><h2>Daily monitoring</h2><p>${U.esc(BP.ROLES[me().role].label)} view · ${U.esc(p.name)} period</p></div>
    <div class="btn-row">${periodBadge()}</div>
  </div>

  <div class="filters">
    <div class="seg" style="flex:1">
      ${['ALL', 'Alpha', 'Zulu'].map(t => `<button data-action="mon-team" data-team="${t}" class="${team === t ? 'active' : ''}">${t === 'ALL' ? 'All teams' : t}</button>`).join('')}
    </div>
    <input class="input" type="date" id="mon-date" value="${U.esc(date)}" style="max-width:190px">
  </div>

  <div class="kpis">
    ${kpi('Filed on this date', `${dayReps.length}<span style="font-size:14px;color:#8a97b3"> / ${members.length}</span>`, U.fmtLong(date), 'navy')}
    ${kpi('Entries', U.nf(U.sum(dayReps, r => (r.rows || []).length)), 'duty activity rows')}
    ${kpi('Violations', U.nf(U.sum(dayReps, r => (r.rows || []).filter(x => x.violation).length)), 'noted on this date')}
    ${kpi('Awaiting review', pending.length, 'this period', pending.length ? 'gold' : '')}
  </div>

  <div class="card">
    <h3>Who filed — ${U.fmtLong(date)}</h3>
    <p class="hint">Tap a name to open that member's report and verify it.</p>
    ${members.map(m => {
      const r = byMember(m.id);
      const st = r ? (BP.STATUS[r.status] || {}) : null;
      return `<div class="session-row">
        <span class="dot ${r ? 'on' : 'off'}"></span>
        <div style="flex:1">
          <div style="font-size:13.5px;font-weight:600">${U.esc(m.name)} <span class="badge team-${U.esc(m.team)}" style="margin-left:4px">${U.esc(m.team)}</span></div>
          <div class="small">${r ? `${(r.rows || []).length} entries · ${(r.rows || []).filter(x => x.violation).length} violations` : 'No report filed'}</div>
        </div>
        ${r ? `<button class="btn sm ghost" data-report="${U.esc(r.id)}"><span class="badge ${st.cls}">${U.esc(st.label)}</span></button>` : `<span class="badge draft">Missing</span>`}
      </div>`;
    }).join('')}
  </div>

  <div class="card">
    <h3>Pending verification — ${U.esc(p.name)}</h3>
    <p class="hint">Submitted reports waiting for the Team Leader / Supervisor.</p>
    ${pending.length ? U.sortBy(pending, r => r.date).reverse().map(r => reportCard(r)).join('') : emptyState('Nothing pending', 'All reports in this period are verified.')}
  </div>

  <div class="card">
    <h3>Per-member performance — this period</h3>
    <p class="hint">${U.esc(p.label)}</p>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>Member</th><th>Team</th><th>Days filed</th><th>Entries</th><th>Violations</th><th>Tickets</th><th>Last filed</th></tr></thead>
        <tbody>${perMember.map(x => `<tr>
          <td><b>${U.esc(x.m.name)}</b></td>
          <td><span class="badge team-${U.esc(x.m.team)}">${U.esc(x.m.team)}</span></td>
          <td>${x.days}</td><td>${x.entries}</td><td>${x.vios}</td><td>${x.tickets}</td>
          <td>${x.last === '—' ? '—' : U.fmtLong(x.last)}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>
  </div>`;
}

function bindMonitoring(root) {
  const dEl = root.querySelector('#mon-date');
  if (dEl) dEl.addEventListener('change', e => { App.monDate = e.target.value; render(); });
}

/* ================================================================ reports = */
function rangeFor(kind) {
  const p = Monthly.currentPeriod();
  if (kind === 'period') return { from: p.from, to: p.to, label: p.label };
  if (kind === 'prev') {
    const pp = Monthly.periodByMonth(...(function () {
      const [y, m] = p.monthKey.split('-').map(Number);
      const d = new Date(y, m - 2, 1);
      return [d.getFullYear(), d.getMonth() + 1];
    })());
    return { from: pp.from, to: pp.to, label: pp.label };
  }
  if (kind === 'month') {
    const now = new Date();
    const from = U.iso(new Date(now.getFullYear(), now.getMonth(), 1));
    return { from, to: U.today(), label: U.fmtMonthYear(from) };
  }
  return { from: '', to: '', label: 'All time' };
}

function viewReports() {
  const f = App.filters;
  const range = rangeFor(f.range);
  let list = API.query({ from: range.from, to: range.to, team: f.team, status: f.status });
  if (isMember()) list = list.filter(r => r.memberId === me().id);
  const members = API.users().filter(u => u.role === 'member' && (f.team === 'ALL' || u.team === f.team));

  return `
  <div class="view-head">
    <div><h2>${isMember() ? 'My reports' : 'All reports'}</h2>
      <p>${U.esc(range.label)} · ${list.length} report${list.length === 1 ? '' : 's'}</p></div>
    <div class="btn-row">${isMember() ? `<button class="btn primary sm" data-nav="encode">${icon('plus')} New report</button>` : ''}</div>
  </div>

  <div class="filters">
    <div class="seg grow">
      ${[['period', 'This period'], ['prev', 'Previous'], ['month', 'This month'], ['all', 'All']].map(([k, l]) =>
        `<button data-action="range" data-range="${k}" class="${f.range === k ? 'active' : ''}">${l}</button>`).join('')}
    </div>
    <select class="input" id="f-team-filter" style="max-width:140px">
      ${['ALL', ...BP.TEAMS].map(t => `<option value="${t}" ${f.team === t ? 'selected' : ''}>${t === 'ALL' ? 'All teams' : t}</option>`).join('')}
    </select>
    <select class="input" id="f-status-filter" style="max-width:160px">
      ${[['ALL', 'Any status'], ['submitted', 'Submitted'], ['reviewed', 'Verified'], ['approved', 'Approved'], ['returned', 'Returned'], ['draft', 'Drafts']]
        .map(([k, l]) => `<option value="${k}" ${f.status === k ? 'selected' : ''}>${l}</option>`).join('')}
    </select>
  </div>

  <div class="card">
    ${list.length ? list.map(r => reportCard(r, !isMember())).join('') : emptyState('No reports found', 'Try a different period or status filter.')}
  </div>`;
}

function bindReports(root) {
  const t = root.querySelector('#f-team-filter');
  const s = root.querySelector('#f-status-filter');
  if (t) t.addEventListener('change', e => { App.filters.team = e.target.value; render(); });
  if (s) s.addEventListener('change', e => { App.filters.status = e.target.value; render(); });
}

/* =============================================================== monthly = */
function viewMonthly() {
  const periods = Monthly.periodOptions(18);
  const mk = App.monthly.monthKey, team = App.monthly.team;
  const period = Monthly.MONTHKEY_NAMES(mk);
  const data = Monthly.aggregate(team, period);
  const canDeliver = API.isCloud() && ['admin', 'supervisor', 'leader'].includes(me().role);

  return `
  <div class="view-head">
    <div><h2>Monthly summary</h2><p>26th of the preceding month to the 25th of the closing month.</p></div>
    <div class="btn-row">${periodBadge()}</div>
  </div>

  <div class="filters">
    <select class="input" id="m-period" style="flex:1;min-width:190px">
      ${periods.map(p => `<option value="${p.monthKey}" ${p.monthKey === mk ? 'selected' : ''}>${p.name} (${p.label})</option>`).join('')}
    </select>
    <select class="input" id="m-team" style="max-width:210px">
      ${BP.TEAMS.map(t => `<option value="${t}" ${t === team ? 'selected' : ''}>${t} Team</option>`).join('')}
      <option value="ALL" ${team === 'ALL' ? 'selected' : ''}>Alpha + Zulu (combined)</option>
    </select>
  </div>

  <div class="kpis">
    ${kpi('Log entries', U.nf(data.rows.length), `${data.submissions} report${data.submissions === 1 ? '' : 's'}`, 'navy')}
    ${kpi('Vehicles', U.nf(data.totals.vehicles), 'monitored')}
    ${kpi('Passengers', U.nf(data.totals.passengers), 'assisted')}
    ${kpi('Arkabala', U.nf(data.totals.arkabala), 'checked')}
    ${kpi('Violations', U.nf(data.totals.violations), 'noted')}
    ${kpi('Tickets', U.nf(data.totals.tickets), 'citation issued')}
  </div>

  <div class="card">
    <h3>${team === 'ALL' ? 'Alpha + Zulu (combined)' : U.esc(team) + ' Team'} — ${U.esc(period.name)}</h3>
    <p class="hint">${U.esc(period.label)}${data.excludedCount ? ` · ${data.excludedCount} draft/returned report(s) excluded` : ''} · ${data.rows.length} log entries · <span id="photo-count">checking photos…</span></p>
    <div class="btn-row">
      <button class="btn primary" data-action="preview-doc">${icon('eye')} Preview document</button>
      <button class="btn gold" data-action="print-doc">${icon('print')} Print / Save as PDF</button>
      <button class="btn ghost" data-action="csv">${icon('down')} Export CSV</button>
      ${canDeliver ? `<button class="btn ghost" data-action="email-pdf">${icon('mail')} Save to Drive &amp; e-mail PDF</button>` : ''}
    </div>
    ${!API.isCloud() ? `<p class="sig-note" style="margin-top:9px">Drive delivery activates once the Google Sheets connection is configured (step 5 of SETUP.md). Printing to PDF already works offline.</p>` : ''}
  </div>

  ${data.included.length === 0 ? `<div class="card">${emptyState('No reports in this period', 'Choose another period, or ask members to encode their reports.')}</div>` : ''}

  ${data.included.length ? `
  <div class="card">
    <h3>Duty activity log — preview</h3>
    <p class="hint">All ${data.rows.length} entries are included in the PDF.</p>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>Date</th><th>Time</th><th>Post</th><th>Violation</th><th>Plate</th><th>Driver</th><th>CT No.</th><th>Remarks</th></tr></thead>
        <tbody>${data.rows.slice(0, 12).map(r => `<tr>
          <td>${U.esc(Monthly.dshort(r.date))}</td><td>${U.esc(r.time)}</td><td>${U.esc(r.post)}</td>
          <td>${U.esc(r.violation)}</td><td>${U.esc(r.plate)}</td><td>${U.esc(r.driver)}</td>
          <td>${U.esc(r.ct)}</td><td>${U.esc(r.remarks)}</td></tr>`).join('')}</tbody>
      </table>
    </div>
    ${data.rows.length > 12 ? `<p class="sig-note" style="margin-top:8px">Showing 12 of ${data.rows.length} entries — all of them print in the PDF.</p>` : ''}
  </div>

  <div class="card">
    <h3>Per-member tally</h3>
    <p class="hint">Who filed, and what they reported.</p>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>Member</th><th>Days</th><th>Entries</th>${BP.TALLY_FIELDS.map(f => `<th>${U.esc(f.short)}</th>`).join('')}</tr></thead>
        <tbody>${data.perMember.map(x => `<tr>
          <td><b>${U.esc(x.name)}</b></td><td>${x.days}</td><td>${x.entries}</td>
          ${BP.TALLY_FIELDS.map(f => `<td>${U.nf(x.totals[f.key] || 0)}</td>`).join('')}
        </tr>`).join('')}</tbody>
      </table>
    </div>
  </div>

  ${data.narrative.length ? `<div class="card"><h3>Incidents / concerns / recommendations</h3>
    <p class="hint">Carried into the PDF verbatim.</p>
    ${data.narrative.map(n => `<div style="padding:9px 0;border-bottom:1px solid #f0f3f9">
      <div class="small"><b>${U.esc(Monthly.dshort(n.date))}</b> · ${U.esc(n.member)}</div>
      <div style="font-size:13.5px">${U.esc(n.text)}</div></div>`).join('')}
  </div>` : ''}

  <div class="card">
    <h3>Signatories</h3>
    <p class="hint">Printed at the end of the document.</p>
    <div class="small" style="line-height:2">
      ${data.members.map(m => `${U.esc(m.name.toUpperCase())} — ${U.esc(m.position || 'Para-traffic Enforcer')}`).join('<br>')}
      <br>${BP.officials.map(o => `${U.esc(o.name)} — ${U.esc(o.role)}`).join('<br>')}
    </div>
  </div>` : ''}`;
}

function bindMonthly(root) {
  const p = root.querySelector('#m-period');
  const t = root.querySelector('#m-team');
  if (p) p.addEventListener('change', e => { App.monthly.monthKey = e.target.value; render(); });
  if (t) t.addEventListener('change', e => { App.monthly.team = e.target.value; render(); });

  // photo count for the appendix (IndexedDB is async)
  (async () => {
    const el = root.querySelector('#photo-count');
    if (!el) return;
    const period = Monthly.MONTHKEY_NAMES(App.monthly.monthKey);
    const data = Monthly.aggregate(App.monthly.team, period);
    try {
      const n = (await Photos.byReports(data.included.map(r => r.id))).length;
      el.textContent = n ? `${n} photo(s) in the appendix` : 'no photos in this period';
    } catch (e) { el.textContent = 'photos unavailable'; }
  })();
}

async function getLogos() {
  if (getLogos.cache) return getLogos.cache;
  const toDataUrl = src => new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      try { res(c.toDataURL('image/png')); } catch (e) { res(src); }
    };
    img.onerror = () => res(src);
    img.src = src;
  });
  getLogos.cache = {
    logo: await toDataUrl('assets/bpgt-logo-128.png'),
    shield: await toDataUrl('assets/tf-shield-256.png')
  };
  return getLogos.cache;
}

async function currentReportHTML() {
  const period = Monthly.MONTHKEY_NAMES(App.monthly.monthKey);
  const data = Monthly.aggregate(App.monthly.team, period);
  const logos = await getLogos();
  let photos = [];
  try {
    const ids = data.included.map(r => r.id);
    const found = await Photos.byReports(ids);
    photos = found.slice(0, 30).map(p => ({
      thumb: p.thumb, date: p.date, post: p.post, plate: p.plate,
      violation: p.violation, member: p.member
    }));
  } catch (e) {}
  return { html: Monthly.buildHTML(data, logos, photos), data, photos };
}

const abs = p => new URL(p, location.href).href;

async function previewDocument() {
  const { html } = await currentReportHTML();
  const doc = html.replace('<head>', `<head><base href="${abs('')}">`);
  openModal({
    title: 'Monthly summary — document preview',
    size: 'wide',
    body: `<div class="frame-wrap"><div id="doc-shell"><iframe id="doc-frame"></iframe></div></div>
           <p class="sig-note" style="margin:9px 2px 0">A4 portrait — this is exactly what prints / saves as PDF.</p>`,
    footer: `<button class="btn ghost" data-action="csv">${icon('down')} CSV</button>
             <button class="btn primary" data-action="print-doc">${icon('print')} Print / Save as PDF</button>
             <button class="btn gold" data-action="close-modal">Close</button>`
  });
  const frame = document.getElementById('doc-frame');
  const shell = document.getElementById('doc-shell');
  const A4 = 794;                                     // A4 @ 96dpi
  frame.style.width = A4 + 'px';
  frame.style.transformOrigin = 'top left';
  frame.style.border = '0';
  frame.style.background = '#fff';
  frame.style.boxShadow = '0 2px 12px rgba(13,33,89,.14)';

  const fit = () => {
    const scale = Math.min(1, (shell.clientWidth - 4) / A4);
    frame.style.transform = `scale(${scale})`;
    let h = 1123;
    try { h = frame.contentDocument.documentElement.scrollHeight || 1123; } catch (e) {}
    frame.style.height = h + 'px';
    shell.style.height = Math.round(h * scale) + 'px';
    shell.style.overflow = 'hidden';
  };
  frame.onload = () => setTimeout(fit, 120);
  frame.srcdoc = doc;
  window.addEventListener('resize', fit);
}

async function printDocument() {
  const { html } = await currentReportHTML();
  const doc = html.replace('<head>', `<head><base href="${abs('')}">`);
  const frame = document.getElementById('print-frame');
  const w = frame.contentWindow;
  frame.srcdoc = doc;
  const fire = () => {
    try { w.focus(); w.print(); } catch (e) { U.toast('Open the app in Chrome to print / save as PDF', 'err'); }
  };
  frame.onload = () => setTimeout(fire, 450);
  // belt & braces if onload does not fire (srcdoc on some browsers)
  setTimeout(() => { if (frame.dataset.printed !== '1') { frame.dataset.printed = '1'; } }, 1200);
}

function exportCSV() {
  const { data } = { data: Monthly.aggregate(App.monthly.team, Monthly.MONTHKEY_NAMES(App.monthly.monthKey)) };
  U.download(`BPGT-${App.monthly.team}-${data.period.monthKey}.csv`, Monthly.toCSV(data), 'text/csv');
  U.toast('CSV exported', 'ok');
}

async function emailPdf() {
  const team = App.monthly.team, mk = App.monthly.monthKey;
  try {
    U.toast('Building the PDF on the server…', 'info', 6000);
    const res = await API.requestPdf(team, mk);
    openModal({
      title: 'PDF saved & e-mailed',
      body: `<dl class="kv">
        <dt>File</dt><dd>${U.esc(res.fileName || 'BPGT monthly summary.pdf')}</dd>
        <dt>Drive folder</dt><dd>${U.esc(res.folder || 'BPGT Monthly Reports')}</dd>
        <dt>E-mailed to</dt><dd>${U.esc(res.email || BP.org.googleAccount)}</dd>
        <dt>Entries</dt><dd>${U.nf(res.entries || 0)}</dd>
      </dl>
      ${res.link ? `<p style="margin-top:12px"><a class="btn ghost sm" href="${U.esc(res.link)}" target="_blank" rel="noopener">Open in Google Drive</a></p>` : ''}`,
      footer: `<button class="btn primary" data-action="close-modal">Done</button>`
    });
  } catch (e) {
    U.toast(e.message || 'Could not reach the server', 'err', 5000);
  }
}

/* ================================================================= users = */
function viewUsers() {
  const users = API.allUsers();
  return `
  <div class="view-head">
    <div><h2>Accounts</h2><p>${users.length} accounts · task force members, leaders and officials</p></div>
    <div class="btn-row"><button class="btn primary sm" data-action="add-user">${icon('plus')} Add account</button></div>
  </div>
  <div class="card">
    ${BP.TEAMS.concat(['BOTH']).map(team => {
      const group = users.filter(u => u.team === team);
      if (!group.length) return '';
      return `<div class="u-group">${team === 'BOTH' ? 'Officials &amp; supervision' : team + ' Team'}</div>
        ${group.map(u => `
        <div class="urow">
          <div class="u-main">
            <div class="u-name">${U.esc(u.name)}</div>
            <div class="u-sub">${U.esc(u.position || BP.ROLES[u.role]?.label || '')} · <span class="mono">${U.esc(u.username)}</span></div>
            <div class="u-badges">
              <span class="badge">${U.esc(BP.ROLES[u.role]?.short || u.role)}</span>
              ${u.team !== 'BOTH' ? `<span class="badge team-${U.esc(u.team)}">${U.esc(u.team)}</span>` : ''}
              ${u.active === false ? '<span class="badge danger">Inactive</span>' : '<span class="badge ok">Active</span>'}
              ${u.mustChange ? '<span class="badge warn">Default PIN</span>' : ''}
            </div>
          </div>
          <div class="u-actions">
            <button class="btn sm ghost" data-action="edit-user" data-id="${U.esc(u.id)}">Edit</button>
            <button class="btn sm ghost" data-action="reset-pin" data-id="${U.esc(u.id)}">Reset PIN</button>
          </div>
        </div>`).join('')}`;
    }).join('')}
    <p class="sig-note" style="margin-top:12px">Default PIN after a reset is <b>${U.esc(BP.DEFAULT_PIN)}</b>; the member is asked to change it on next sign-in. In cloud mode the roster lives in the <b>Users</b> sheet.</p>
  </div>`;
}

function bindUsers() {}

function userFormHTML(u = {}) {
  const roles = Object.entries(BP.ROLES).map(([k, v]) => `<option value="${k}" ${u.role === k ? 'selected' : ''}>${v.label}</option>`).join('');
  return `
  <div class="form-grid form-2">
    <div class="full"><label class="lbl">Full name</label><input class="input" id="u-name" value="${U.esc(u.name || '')}" placeholder="Juan Dela Cruz"></div>
    <div><label class="lbl">Username</label><input class="input" id="u-username" value="${U.esc(u.username || '')}" autocapitalize="none" placeholder="delacruz"></div>
    <div><label class="lbl">Role</label><select class="input" id="u-role">${roles}</select></div>
    <div><label class="lbl">Team</label><select class="input" id="u-team">
      ${['Alpha', 'Zulu', 'BOTH'].map(t => `<option ${u.team === t ? 'selected' : ''}>${t}</option>`).join('')}
    </select></div>
    <div><label class="lbl">Position on report</label><input class="input" id="u-position" value="${U.esc(u.position || 'Para-traffic Enforcer')}"></div>
    <div class="full"><label class="lbl">PIN ${u.id ? '(leave blank to keep current)' : `(default ${BP.DEFAULT_PIN})`}</label>
      <input class="input" id="u-pin" inputmode="numeric" maxlength="8" placeholder="4–8 digits"></div>
  </div>`;
}

function openUserModal(u) {
  openModal({
    title: u ? 'Edit account' : 'New account',
    body: userFormHTML(u || {}),
    footer: `<button class="btn ghost" data-action="close-modal">Cancel</button>
             <button class="btn primary" data-action="save-user" data-id="${U.esc(u?.id || '')}">Save</button>`
  });
}

/* ============================================================== settings = */
function viewSettings() {
  const s = DB.load().settings;
  const cloud = API.isCloud();
  return `
  <div class="view-head"><div><h2>Settings</h2><p>Connection, automation and account</p></div></div>

  <div class="card">
    <h3>Google Sheets connection</h3>
    <p class="hint">Paste the Apps Script Web App URL deployed from ${U.esc(BP.org.googleAccount)} (SETUP.md step 4). Leave empty to keep working offline on this device.</p>
    <label class="lbl">Web App URL</label>
    <input class="input" id="s-api" placeholder="https://script.google.com/macros/s/AKfy…/exec" value="${U.esc(s.apiUrl || '')}" autocapitalize="none" spellcheck="false">
    <div class="btn-row" style="margin-top:11px">
      <button class="btn primary sm" data-action="save-api">Save connection</button>
      <button class="btn ghost sm" data-action="test-api">Test connection</button>
      <span class="badge ${cloud ? 'ok' : 'warn'}" style="align-self:center">${cloud ? 'Connected' : 'Local / demo mode'}</span>
    </div>
    <p class="sig-note" style="margin-top:10px">Worksheet tabs: <b>Users</b>, <b>Reports</b>, <b>AuditLog</b>. Monthly PDFs are stored in the Drive folder <b>BPGT Monthly Reports</b>.</p>
  </div>

  <div class="card">
    <h3>Automatic monthly PDF</h3>
    <p class="hint">A time-driven trigger in Apps Script runs on the <b>${BP.AUTO_PDF_DAY}th of every month at 6:00 PM</b>. For each team it builds the summary covering the 26th → 25th, saves the PDF to Drive and e-mails it to ${U.esc(BP.org.googleAccount)}.</p>
    <div class="session-row"><span class="dot ${cloud ? 'on' : 'off'}"></span><div style="flex:1">
      <div style="font-size:13.5px;font-weight:600">Scheduled trigger</div>
      <div class="small">${cloud ? 'Runs server-side — the app does not need to be open.' : 'Configure the connection, then run installTriggers() once in Apps Script.'}</div></div></div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn ghost sm" data-action="email-pdf" ${cloud ? '' : 'disabled title="Connect Google Sheets first"'}>Generate &amp; e-mail now</button>
      <span class="sig-note" style="align-self:center">${cloud ? 'Runs immediately, for the current period.' : 'Available after the connection is configured.'}</span>
    </div>
  </div>

  <div class="card">
    <h3>Offline &amp; install</h3>
    <p class="hint">The app caches itself and every report you encode, then syncs automatically.</p>
    <div class="session-row"><span class="dot ${navigator.onLine ? 'on' : 'off'}"></span><div style="flex:1">
      <div style="font-size:13.5px;font-weight:600">${navigator.onLine ? 'Online' : 'Offline'}</div>
      <div class="small">Last sync: ${s.lastSync ? U.esc(new Date(s.lastSync).toLocaleString('en-PH')) : 'never'} · ${API.pendingCount()} unsynced change(s)</div></div></div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn primary sm" data-action="sync">${icon('sync')} Sync now</button>
      <button class="btn ghost sm" data-action="install">Install app</button>
      <button class="btn ghost sm" data-action="export-json">Export backup (JSON)</button>
    </div>
    <p class="sig-note" style="margin-top:10px">On Android: Chrome menu → “Install app”. On iPhone: Share → “Add to Home Screen”.</p>
  </div>

  <div class="card">
    <h3>Photo storage</h3>
    <p class="hint">Photos are compressed on the phone and kept in the app's own database, then copied to the Drive folder <b>BPGT Photos</b>.</p>
    <div class="session-row"><span class="dot ${API.isCloud() ? 'on' : 'off'}"></span><div style="flex:1">
      <div style="font-size:13.5px;font-weight:600"><span id="photo-stat">counting…</span></div>
      <div class="small">${API.isCloud() ? 'Uploads continue automatically while online' : 'Local mode — photos stay on this device'}</div></div></div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn ghost sm" data-action="upload-photos">Upload pending photos</button>
    </div>
  </div>

  <div class="card">
    <h3>Data</h3>
    <p class="hint">Local cache on this device.</p>
    <div class="btn-row">
      <button class="btn ghost sm" data-action="export-json">Export all reports</button>
    </div>
  </div>

  <div class="card help">
    <h3>Help</h3>
    <h4>Roles</h4>
    <ul>
      <li><b>Member</b> — encodes the daily apprehension report for their own duty day.</li>
      <li><b>Team Leader</b> — monitors daily filing per member, verifies (or returns) reports.</li>
      <li><b>Supervisor</b> — reviews verified reports and approves them for the period.</li>
      <li><b>Terminal Administrator</b> — general supervision, accounts, and the monthly PDF.</li>
    </ul>
    <h4>New in v1.1</h4>
    <ul>
      <li><b>Notices &amp; directives</b> — the Administrator posts an announcement; everyone can acknowledge it, and acknowledgements are recorded.</li>
      <li><b>Duty &amp; leave</b> — weekly shift/post assignments plus leave requests with approval.</li>
      <li><b>Photo documentation</b> — attach up to 4 photos per apprehension (stored on the phone, copied to Drive when connected).</li>
      <li><b>Combined PDF</b> — choose “Alpha + Zulu (combined)” in the Monthly summary.</li>
      <li><b>Statistics</b> — violations per post and weekly activity on the dashboard.</li>
    </ul>
    <h4>Reporting period</h4>
    <p class="small" style="margin:0">A month of reporting runs from the <b>26th of the preceding month</b> to the <b>25th of the closing month</b>. Example: the November 2026 summary covers 26 Oct 2026 – 25 Nov 2026.</p>
  </div>`;
}

function bindSettings(root) {
  (async () => {
    const el = root.querySelector('#photo-stat');
    if (!el) return;
    try {
      const total = await Photos.countAll();
      const pending = await Photos.pendingCount();
      el.textContent = `${total} photo(s) on this device · ${pending} waiting to upload`;
    } catch (e) { el.textContent = 'photos unavailable in this browser'; }
  })();
}

/* ============================================================== actions == */
async function handleAction(action, data, el, ev) {
  switch (action) {

    /* --- navigation-ish ------------------------------------------------ */
    case 'more-nav': return openMoreNav();
    case 'account': return openAccount();
    case 'sync': return syncNow(false);
    case 'install': return doInstall();
    case 'close-modal': return closeModal();

    /* --- notices ------------------------------------------------------- */
    case 'add-notice': return openNoticeModal(null);
    case 'edit-notice': return openNoticeModal(DB.load().notices.find(n => n.id === data.id));
    case 'save-notice': {
      const title = document.getElementById('n-title').value.trim();
      const body = document.getElementById('n-body').value.trim();
      if (!title || !body) return U.toast('Title and message are required', 'err');
      const existing = data.id ? DB.load().notices.find(n => n.id === data.id) : null;
      await API.saveNotice({
        ...(existing || {}), id: data.id || '',
        title, body,
        audience: document.getElementById('n-audience').value,
        priority: document.getElementById('n-priority').value,
        pinned: document.getElementById('n-pinned').checked
      });
      closeModal(); render(); U.toast('Notice posted', 'ok');
      return;
    }
    case 'del-notice': {
      if (!confirm('Delete this notice?')) return;
      await API.deleteNotice(data.id); render(); U.toast('Notice deleted', 'ok');
      return;
    }
    case 'ack-notice': {
      await API.ackNotice(data.id); render(); U.toast('Acknowledged — thank you', 'ok');
      return;
    }

    /* --- duty & leave --------------------------------------------------- */
    case 'duty-tab': App.dutyTab = data.tab; return render();
    case 'duty-week': {
      const base = weekStart(App.dutyWeek || new Date());
      const dir = +data.dir;
      App.dutyWeek = dir === 0 ? new Date() : new Date(base.getTime() + dir * 7 * 864e5);
      return render();
    }
    case 'add-slot': {
      const slot = { date: data.date || U.today(), team: me().team === 'BOTH' ? 'Alpha' : me().team,
                     shift: 'AM', post: 'PTT', memberId: '', memberName: '', note: '' };
      return openSlotModal(null, slot);
    }
    case 'edit-slot': {
      const slot = API.schedule('', '', 'ALL').find(x => x.id === data.id);
      return openSlotModal(slot);
    }
    case 'save-slot': {
      const memberId = document.getElementById('s-member').value;
      const m = API.userById(memberId);
      await API.saveSlot({
        id: data.id || '',
        date: document.getElementById('s-date').value,
        shift: document.getElementById('s-shift').value,
        post: document.getElementById('s-post').value,
        note: document.getElementById('s-note').value,
        memberId, memberName: m ? m.name : '', team: m ? m.team : 'Alpha'
      });
      closeModal(); render(); U.toast('Assignment saved', 'ok');
      return;
    }
    case 'del-slot': {
      await API.deleteSlot(data.id);
      closeModal(); render(); U.toast('Assignment removed', 'ok');
      return;
    }
    case 'file-leave': return leaveModal();
    case 'save-leave': {
      const from = document.getElementById('lv-from').value;
      const to = document.getElementById('lv-to').value;
      if (!from || !to) return U.toast('Choose the dates', 'err');
      if (to < from) return U.toast('End date cannot be before the start date', 'err');
      await API.requestLeave({
        type: document.getElementById('lv-type').value,
        reason: document.getElementById('lv-reason').value.trim(),
        from, to
      });
      closeModal(); render(); U.toast('Leave request sent', 'ok');
      return;
    }
    case 'leave-decide': {
      const note = prompt(data.status === 'approved' ? 'Approval note (optional)' : 'Reason for declining (optional)') || '';
      await API.setLeaveStatus(data.id, data.status, note);
      render(); U.toast(data.status === 'approved' ? 'Leave approved' : 'Leave declined', 'ok');
      return;
    }

    /* --- photos --------------------------------------------------------- */
    case 'lightbox': return openLightbox(String(data.ids).split(','), +data.index);
    case 'del-photo': {
      if (!confirm('Remove this photo?')) return;
      await Photos.remove(data.id);
      const row = App.draft?.rows[+data.row];
      if (row) row.photos = (row.photos || []).filter(x => x !== data.id);
      hydrateShots();
      return;
    }

    /* --- encode -------------------------------------------------------- */
    case 'add-row': {
      if (!App.draft) App.draft = newDraft();
      collectDraftSoft();
      if (App.draft.rows.length >= 40) return U.toast('A daily report holds up to 40 entries — file the rest tomorrow', 'warn');
      App.draft.rows.push(blankRow());
      const newIdx = App.draft.rows.length - 1;
      render();
      const newRowEl = document.querySelector(`#rows .log-row[data-row="${newIdx}"]`);
      if (newRowEl) {
        newRowEl.classList.add('row-just-added');
        newRowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = newRowEl.querySelector('input, select');
        if (firstInput) setTimeout(() => firstInput.focus({ preventScroll: true }), 220);
      }
      U.toast(`Entry ${newIdx + 1} added below`, 'ok', 1800);
      return;
    }
    case 'del-row': {
      collectDraftSoft();
      App.draft.rows.splice(+data.idx, 1);
      render();
      return;
    }
    case 'reset-encode-pad': {
      const ctx = App.draft ? {
        date: App.draft.date,
        team: App.draft.team,
        memberId: App.draft.memberId,
        memberName: App.draft.memberName,
        memberUsername: App.draft.memberUsername
      } : {};
      App.params = {};
      App.draft = newDraft(ctx);
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      U.toast('Input pad cleared and ready', 'info', 1800);
      return;
    }
    case 'auto-violations': {
      if (!App.draft) return;
      collectDraftSoft();
      const n = App.draft.rows.filter(r => r.violation).length;
      App.draft.tally.violations = n;
      render();
      U.toast(`Violations set to ${n}`, 'ok');
      return;
    }
    case 'save-draft': return saveDraft(false);
    case 'submit': return saveDraft(true);

    /* --- monitoring / filters ------------------------------------------ */
    case 'mon-team': App.monTeam = data.team; return render();
    case 'range': App.filters.range = data.range; return render();

    /* --- monthly ------------------------------------------------------- */
    case 'preview-doc': return previewDocument();
    case 'print-doc': return printDocument();
    case 'csv': return exportCSV();
    case 'email-pdf': return emailPdf();

    /* --- users --------------------------------------------------------- */
    case 'add-user': return openUserModal(null);
    case 'edit-user': return openUserModal(API.userById(data.id));
    case 'reset-pin': {
      const u = API.userById(data.id);
      if (!confirm(`Reset the PIN of ${u.name} to ${BP.DEFAULT_PIN}?`)) return;
      try { await API.call('resetPin', { userId: u.id, newPin: BP.DEFAULT_PIN }); U.toast(`PIN reset to ${BP.DEFAULT_PIN}`, 'ok'); }
      catch (e) { U.toast(e.message, 'err'); }
      return;
    }
    case 'save-user': {
      const name = document.getElementById('u-name').value.trim();
      const username = document.getElementById('u-username').value.trim().toLowerCase().replace(/\s+/g, '');
      const role = document.getElementById('u-role').value;
      const team = document.getElementById('u-team').value;
      const position = document.getElementById('u-position').value.trim();
      const pin = document.getElementById('u-pin').value.trim();
      if (!name || !username) return U.toast('Name and username are required', 'err');
      if (pin && !/^\d{4,8}$/.test(pin)) return U.toast('PIN must be 4–8 digits', 'err');
      const existingUser = data.id ? API.userById(data.id) : null;
      if (existingUser && existingUser.username.toLowerCase() !== username && !pin) {
        return U.toast('When changing a username, please also enter a PIN in the PIN field', 'err', 4000);
      }
      try {
        await API.call('saveUser', { user: { id: data.id || '', name, username, role, team, position, active: true }, pin: pin || undefined });
        await API.refreshUsers().catch(() => {});
        closeModal(); render(); U.toast('Account saved', 'ok');
      } catch (e) { U.toast(e.message, 'err'); }
      return;
    }

    /* --- settings ------------------------------------------------------ */
    case 'save-api': {
      const url = document.getElementById('s-api').value.trim();
      if (url && !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(url)) {
        return U.toast('That does not look like an Apps Script /exec URL', 'err', 4200);
      }
      API.setApiUrl(url);
      paintModePill(); render();
      U.toast(url ? 'Connection saved' : 'Cleared — local mode', 'ok');
      if (url) syncNow(true);
      return;
    }
    case 'test-api': {
      try {
        const r = await API.call('ping', {});
        U.toast(`Connected · server time ${new Date(r.time || Date.now()).toLocaleTimeString('en-PH')}`, 'ok', 4000);
      } catch (e) { U.toast(e.message || 'Connection failed', 'err', 5000); }
      return;
    }
    case 'upload-photos': {
      if (!API.isCloud()) return U.toast('Connect Google Sheets first', 'warn');
      U.toast('Uploading photos…', 'info', 3000);
      const r = await Photos.uploadPending(DB.load().session?.token, 20);
      U.toast(`${r.uploaded} uploaded${r.failed ? `, ${r.failed} failed` : ''}`, r.failed ? 'warn' : 'ok');
      render();
      return;
    }
    case 'export-json': {
      const db = DB.load();
      U.download(`bpgt-backup-${U.today()}.json`, JSON.stringify({ users: db.users, reports: db.reports, audit: db.audit, exportedAt: new Date().toISOString() }, null, 2));
      U.toast('Backup exported', 'ok');
      return;
    }
    case 'logout': {
      await API.logout();
      location.reload();
      return;
    }
    case 'change-pin': return changePinModal();

    /* --- report actions ------------------------------------------------ */
    case 'verify': return setStatus(data.id, 'reviewed');
    case 'approve': return setStatus(data.id, 'approved');
    case 'return': return returnModal(data.id);
    case 'edit-report': {
      const found = API.localReports().find(r => r.id === data.id);
      if (!found) return U.toast('Report not found', 'err');
      App.draft = U.clone(found);
      App.draft._editMode = true;
      if (!Array.isArray(App.draft.rows) || !App.draft.rows.length) App.draft.rows = [blankRow()];
      App.params = { editId: data.id };
      closeModal(); go('encode', { editId: data.id });
      return;
    }
    case 'delete-report': {
      if (!confirm('Delete this report permanently?')) return;
      await API.deleteReport(data.id);
      closeModal(); render(); U.toast('Report deleted', 'ok');
      return;
    }
  }
}

/* keep typed values when the row list is re-rendered */
function collectDraftSoft() {
  if (!App.draft) return;
  document.querySelectorAll('#view [data-field]').forEach(el => {
    const i = +el.dataset.row, f = el.dataset.field;
    if (!isNaN(i) && f && App.draft.rows[i]) App.draft.rows[i][f] = el.value;
  });
  document.querySelectorAll('#view [data-tally]').forEach(el => {
    App.draft.tally[el.dataset.tally] = el.value === '' ? '' : U.num(el.value);
  });
  const n = document.getElementById('f-narrative');
  if (n) App.draft.narrative = n.value;
  const dt = document.getElementById('f-date');
  if (dt) App.draft.date = dt.value;
}

/* =============================================================== modals = */
function openModal({ title, body, footer = '', size = '' }) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="modal-back" data-back="1">
    <div class="modal" style="${size === 'wide' ? 'max-width:900px' : ''}">
      <div class="mhead"><h3>${U.esc(title)}</h3><button class="x" data-action="close-modal">×</button></div>
      <div class="mbody">${body}</div>
      ${footer ? `<div class="mfoot">${footer}</div>` : ''}
    </div></div>`;
  root.querySelector('.modal-back').addEventListener('click', e => {
    if (e.target.dataset.back) closeModal();
  });
  root.querySelectorAll('[data-action]').forEach(b => {
    b.addEventListener('click', ev => {
      ev.preventDefault();
      handleAction(b.dataset.action, { ...b.dataset }, b, ev);
    });
  });
  root.querySelectorAll('[data-nav]').forEach(b => {
    b.addEventListener('click', ev => {
      ev.preventDefault();
      closeModal();
      go(b.dataset.nav);
    });
  });
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-root').innerHTML = '';
  document.body.style.overflow = '';
}

function reportDetailHTML(r, photos = []) {
  const st = BP.STATUS[r.status] || {};
  const u = me();
  const owner = u.id === r.memberId;
  const rows = (r.rows || []);
  return `
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
    <span class="badge team-${U.esc(r.team)}">${U.esc(r.team)} Team</span>
    <span class="badge ${st.cls}">${U.esc(st.label || r.status)}</span>
    <span class="badge">${U.fmtLong(r.date)} · ${U.esc(U.weekday(r.date))}</span>
    ${r._dirty ? '<span class="badge warn">Unsynced</span>' : ''}
  </div>
  <dl class="kv">
    <dt>Member</dt><dd>${U.esc(r.memberName)}</dd>
    <dt>Filed</dt><dd>${U.esc(new Date(r.createdAt || r.updatedAt || Date.now()).toLocaleString('en-PH'))}</dd>
    <dt>Last update</dt><dd>${U.esc(r.updatedAt ? new Date(r.updatedAt).toLocaleString('en-PH') : '—')}</dd>
  </dl>

  <h4 style="margin:16px 0 6px;font-size:13px;letter-spacing:.4px;text-transform:uppercase;color:#59668a">Duty activity log</h4>
  ${rows.length ? rows.map((x, i) => `
    <div class="entry">
      <div class="e-top">
        <b>${U.esc(x.time || '—')}</b>
        <span class="badge">${U.esc(x.post === 'OTHERS' ? (x.postOther || 'OTHERS') : (x.post || '—'))}</span>
        ${x.plate ? `<span class="badge gold">${U.esc(x.plate)}</span>` : ''}
        <span class="e-n">#${i + 1}</span>
      </div>
      ${x.violation ? `<div class="e-v">${U.esc(x.violation)}</div>` : ''}
      <div class="e-d">
        ${x.driver ? `<span><i>Driver:</i> ${U.esc(x.driver)}</span>` : ''}
        ${x.ct ? `<span><i>CT No.:</i> ${U.esc(x.ct)}</span>` : ''}
      </div>
      ${x.remarks ? `<div class="e-r">${U.esc(x.remarks)}</div>` : ''}
    </div>`).join('')
    : '<p class="small">No log entries.</p>'}

  <h4 style="margin:16px 0 6px;font-size:13px;letter-spacing:.4px;text-transform:uppercase;color:#59668a">Summary tally</h4>
  <div class="tally-grid">
    ${BP.TALLY_FIELDS.map(f => `<div class="kpi" style="padding:10px"><div class="k">${U.esc(f.label)}</div><div class="v" style="font-size:19px">${U.nf(U.num(r.tally?.[f.key]))}</div></div>`).join('')}
  </div>

  ${photos.length ? `<h4 style="margin:16px 0 6px;font-size:13px;letter-spacing:.4px;text-transform:uppercase;color:#59668a">Photo documentation <span style="color:#9aa5bd">(${photos.length})</span></h4>
    <div class="gallery">${photos.map((ph, k) => `
      <button class="gshot" data-action="lightbox" data-index="${k}" data-ids="${photos.map(x => x.id).join(',')}">
        <img src="${ph.thumb}" alt="">
        <span>${U.esc(ph.plate || ph.post || '')}</span>
      </button>`).join('')}</div>` : ''}

  ${r.narrative ? `<h4 style="margin:16px 0 4px;font-size:13px;letter-spacing:.4px;text-transform:uppercase;color:#59668a">Incidents / concerns / recommendations</h4>
    <p style="margin:0;font-size:13.5px;white-space:pre-wrap">${U.esc(r.narrative)}</p>` : ''}

  ${r.leaderNote ? `<div class="banner navy" style="margin-top:14px"><div class="ic">✓</div><div><b>Team Leader note</b><p>${U.esc(r.leaderNote)}</p></div></div>` : ''}
  ${r.supervisorNote ? `<div class="banner navy" style="margin-top:8px"><div class="ic">✓</div><div><b>Supervisor note</b><p>${U.esc(r.supervisorNote)}</p></div></div>` : ''}
  ${r.returnNote ? `<div class="banner" style="margin-top:8px"><div class="ic">!</div><div><b>Returned for correction</b><p>${U.esc(r.returnNote)}</p></div></div>` : ''}
  `;
}

async function openReport(id) {
  const r = API.localReports().find(x => x.id === id);
  if (!r) return U.toast('Report not found', 'err');
  let photos = [];
  try {
    const byId = new Map();
    const ids = (r.rows || []).flatMap(x => x.photos || []);
    for (const pid of ids) { const p = await Photos.get(pid); if (p) byId.set(p.id, p); }
    if (!byId.size) (await Photos.byReports([r.id])).forEach(p => byId.set(p.id, p));
    photos = Array.from(byId.values()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } catch (e) {}
  const role = me().role;
  const owner = me().id === r.memberId;
  const canVerify = ['leader', 'supervisor', 'admin'].includes(role) && r.status === 'submitted';
  const canApprove = ['supervisor', 'admin'].includes(role) && r.status === 'reviewed';
  const canReturn = ['leader', 'supervisor', 'admin'].includes(role) && !['returned', 'draft'].includes(r.status);
  const canEdit = owner && ['draft', 'returned', 'submitted', 'reviewed'].includes(r.status) ||
                  (role === 'admin' && r.status !== 'approved');

  openModal({
    title: `${r.memberName} — ${U.fmtLong(r.date)}`,
    body: reportDetailHTML(r, photos),
    footer: `
      ${canEdit ? `<button class="btn ghost sm" data-action="edit-report" data-id="${U.esc(r.id)}">Edit</button>` : ''}
      ${isAdmin() ? `<button class="btn danger sm" data-action="delete-report" data-id="${U.esc(r.id)}">Delete</button>` : ''}
      ${canReturn ? `<button class="btn ghost sm" data-action="return" data-id="${U.esc(r.id)}">Return</button>` : ''}
      ${canVerify ? `<button class="btn primary sm" data-action="verify" data-id="${U.esc(r.id)}">${icon('check')} Verify</button>` : ''}
      ${canApprove ? `<button class="btn primary sm" data-action="approve" data-id="${U.esc(r.id)}">${icon('check')} Approve</button>` : ''}
      <button class="btn gold sm" data-action="close-modal">Close</button>`
  });
}

async function setStatus(id, status) {
  try {
    await API.setStatus(id, status);
    closeModal(); render();
    U.toast(status === 'reviewed' ? 'Report verified' : status === 'approved' ? 'Report approved' : 'Updated', 'ok');
  } catch (e) { U.toast(e.message, 'err'); }
}

function returnModal(id) {
  const r = API.localReports().find(x => x.id === id);
  openModal({
    title: 'Return for correction',
    body: `<p class="small" style="margin-top:0">Tell ${U.esc(r.memberName)} what to correct. They will see this note on their dashboard.</p>
           <label class="lbl">Reason / instruction</label>
           <textarea class="input" id="return-note" rows="4" placeholder="e.g. Please complete the plate numbers for entries 2 and 3."></textarea>`,
    footer: `<button class="btn ghost" data-action="close-modal">Cancel</button>
             <button class="btn primary" data-action="confirm-return" data-id="${U.esc(id)}">Return report</button>`
  });
  // wire the extra button
  document.querySelector('[data-action="confirm-return"]').addEventListener('click', async () => {
    const note = document.getElementById('return-note').value.trim();
    if (!note) return U.toast('Please state the reason', 'err');
    await API.setStatus(id, 'returned', note);
    closeModal(); render(); U.toast('Returned to member', 'ok');
  });
}

function openAccount(forcePin = false) {
  const u = me();
  openModal({
    title: 'My account',
    body: `
      <dl class="kv">
        <dt>Name</dt><dd>${U.esc(u.name)}</dd>
        <dt>Username</dt><dd class="mono">${U.esc(u.username)}</dd>
        <dt>Role</dt><dd>${U.esc(BP.ROLES[u.role].label)}</dd>
        <dt>Team</dt><dd>${U.esc(u.team)}</dd>
        <dt>Connection</dt><dd>${API.isCloud() ? 'Google Sheets' : 'Local (this device)'}</dd>
      </dl>
      ${forcePin ? '<div class="banner" style="margin-top:14px"><div class="ic">!</div><div><b>Set your own PIN</b><p>You are using the default PIN. Please change it now.</p></div></div>' : ''}
      <div class="btn-row" style="margin-top:16px">
        <button class="btn soft sm" data-action="change-pin">Change PIN</button>
        <button class="btn ghost sm" data-action="sync">Sync now</button>
        <button class="btn danger sm" data-action="logout">Sign out</button>
      </div>`,
    footer: `<button class="btn primary" data-action="close-modal">Close</button>`
  });
}

function changePinModal() {
  openModal({
    title: 'Change PIN',
    body: `<div class="form-grid">
      <div><label class="lbl">Current PIN</label><input class="input" id="p-old" type="password" inputmode="numeric" maxlength="8"></div>
      <div><label class="lbl">New PIN (4–8 digits)</label><input class="input" id="p-new" type="password" inputmode="numeric" maxlength="8"></div>
      <div><label class="lbl">Repeat new PIN</label><input class="input" id="p-new2" type="password" inputmode="numeric" maxlength="8"></div>
    </div>`,
    footer: `<button class="btn ghost" data-action="close-modal">Cancel</button>
             <button class="btn primary" data-action="save-pin">Save PIN</button>`
  });
  document.querySelector('[data-action="save-pin"]').addEventListener('click', async () => {
    const oldPin = document.getElementById('p-old').value.trim();
    const n1 = document.getElementById('p-new').value.trim();
    const n2 = document.getElementById('p-new2').value.trim();
    if (n1 !== n2) return U.toast('The new PINs do not match', 'err');
    if (!/^\d{4,8}$/.test(n1)) return U.toast('PIN must be 4–8 digits', 'err');
    try {
      await API.call('changePin', { userId: me().id, oldPin, newPin: n1 });
      closeModal(); U.toast('PIN updated', 'ok');
    } catch (e) { U.toast(e.message, 'err'); }
  });
}

/* ================================================================ sync === */
async function syncNow(quiet) {
  if (!me()) return;
  updateSyncPill(true);
  try {
    const r = await API.sync();
    if (!quiet) {
      if (r.local) U.toast('Local mode — data is saved on this device', 'info');
      else U.toast(`Synced — ${r.pushed} sent, ${r.pulled} received`, 'ok');
    }
    updateSyncPill();
    if (!quiet && ['dashboard', 'reports', 'monitoring'].includes(App.view)) render();
  } catch (e) {
    updateSyncPill();
    if (!quiet) U.toast(e.message || 'Sync failed', 'err');
  }
}

function updateSyncPill(busy) {
  const pill = document.getElementById('sync-pill');
  if (!pill) return;
  const text = document.getElementById('sync-text');
  const pending = API.pendingCount();
  const cloud = API.isCloud();
  pill.className = 'sync-pill' + (!cloud ? ' offline' : pending ? ' pending' : '');
  text.textContent = busy ? 'Syncing…' : !cloud ? 'Local' : pending ? `${pending} pending` : 'Synced';
  pill.title = cloud
    ? (pending ? `${pending} change(s) waiting for the Google Sheet` : 'All data is in the Google Sheet')
    : 'Local mode — data saved on this device only';
}

/* ============================================================= install == */
async function doInstall() {
  if (App.deferredInstall) {
    App.deferredInstall.prompt();
    const r = await App.deferredInstall.userChoice;
    if (r.outcome === 'accepted') U.toast('Installing…', 'ok');
    App.deferredInstall = null;
    return;
  }
  openModal({
    title: 'Install BPGT TF Reports',
    body: `<div class="help">
      <h4>Android (Chrome)</h4>
      <ol><li>Open this page in Chrome.</li><li>Tap the ⋮ menu → <b>Install app</b> (or “Add to Home screen”).</li><li>Confirm — the BPGT logo appears on your home screen.</li></ol>
      <h4>iPhone / iPad (Safari)</h4>
      <ol><li>Tap the Share button.</li><li>Choose <b>Add to Home Screen</b> → Add.</li></ol>
      <h4>Windows / Mac (Chrome or Edge)</h4>
      <ol><li>Click the install icon in the address bar, or menu → <b>Install BPGT TF Reports</b>.</li></ol>
      <p class="sig-note">Once installed it opens full-screen and keeps working without a signal; reports sync when you are back online.</p>
    </div>`,
    footer: `<button class="btn primary" data-action="close-modal">Got it</button>`
  });
}

function paintInstallBanner() { /* reserved: install banner lives in the dashboard */ }

/* =========================================================================
   STATISTICS — violations per post + weekly activity (plain HTML/CSS bars)
   ========================================================================= */
function barRow(label, value, total, cls = '') {
  const pct = total ? Math.max(2, Math.round((value / total) * 100)) : 0;
  return `<div class="brow">
    <div class="blabel" title="${U.esc(label)}">${U.esc(label)}</div>
    <div class="btrack"><span class="bfill ${cls}" style="width:${pct}%"></span></div>
    <div class="bval">${U.nf(value)}</div>
  </div>`;
}

function statsHTML(reports) {
  const live = reports.filter(r => !['draft', 'returned'].includes(r.status));
  if (!live.length) return '';

  // 1. violations / entries per post
  const perPost = {};
  live.forEach(r => (r.rows || []).forEach(x => {
    const post = x.post === 'OTHERS' ? (x.postOther || 'OTHERS') : (x.post || '—');
    perPost[post] = perPost[post] || { entries: 0, violations: 0 };
    perPost[post].entries++;
    if (x.violation) perPost[post].violations++;
  }));
  const posts = Object.entries(perPost)
    .sort((a, b) => b[1].violations - a[1].violations || b[1].entries - a[1].entries)
    .slice(0, 8);
  const maxVio = Math.max(1, ...posts.map(([, v]) => v.violations));

  // 2. weekly buckets from the start of the reporting period
  const p = Monthly.currentPeriod();
  const start = U.parseISO(p.from);
  const wk = {};
  live.forEach(r => {
    const idx = Math.min(5, Math.floor((U.parseISO(r.date) - start) / (7 * 864e5)));
    wk[idx] = wk[idx] || { entries: 0, violations: 0, label: '' };
    const d = new Date(start.getTime() + idx * 7 * 864e5);
    wk[idx].label = `Week ${idx + 1}`;
    wk[idx].entries += (r.rows || []).length;
    wk[idx].violations += (r.rows || []).filter(x => x.violation).length;
  });
  const weeks = Object.keys(wk).sort((a, b) => a - b).map(k => ({ k: +k, ...wk[k] }));
  const maxEnt = Math.max(1, ...weeks.map(w => w.entries));

  if (!posts.length) return '';

  return `
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
      <div><h3>Violations by post</h3><p class="hint" style="margin:0 0 10px">${U.esc(p.name)} reporting period</p></div>
      <span class="badge">${U.nf(posts.reduce((t, [, v]) => t + v.violations, 0))} violations</span>
    </div>
    ${posts.map(([post, v]) => barRow(post, v.violations, maxVio, 'vio')).join('')}
  </div>

  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
      <div><h3>Weekly activity</h3><p class="hint" style="margin:0 0 10px">Entries logged vs violations noted, by week</p></div>
      <div class="legend"><span class="lg1"></span>entries <span class="lg2"></span>violations</div>
    </div>
    ${weeks.map(w => `<div class="wkrow">
        <div class="blabel">${U.esc(w.label)}</div>
        <div class="wkbars">
          <div class="btrack"><span class="bfill ent" style="width:${Math.max(2, Math.round(w.entries / maxEnt * 100))}%"></span></div>
          <div class="btrack thin"><span class="bfill vio" style="width:${w.entries ? Math.max(2, Math.round(w.violations / w.entries * 100)) : 0}%"></span></div>
        </div>
        <div class="bval">${U.nf(w.entries)}<span class="small"> / ${U.nf(w.violations)}</span></div>
      </div>`).join('')}
  </div>`;
}

/* =========================================================================
   NOTICES / DIRECTIVES
   ========================================================================= */
function viewNotices() {
  const list = API.notices();
  const admin = isAdmin();
  const totalReaders = API.users().filter(u => u.role !== 'member' || true).length;
  const me_ = me();

  return `
  <div class="view-head">
    <div><h2>Notices &amp; directives</h2><p>Instructions from the Administrator and Team Leader</p></div>
    <div class="btn-row">
      ${admin ? `<button class="btn primary sm" data-action="add-notice">${icon('plus')} New notice</button>` : ''}
    </div>
  </div>

  ${list.length ? list.map(n => {
    const acked = API.hasAcked(n);
    const pr = BP.NOTICE_PRIORITY[n.priority] || BP.NOTICE_PRIORITY.normal;
    return `<div class="card notice ${n.priority === 'urgent' ? 'urgent' : ''}">
      <div class="n-head">
        <div style="flex:1;min-width:0">
          <div class="n-badges">
            <span class="${pr.cls}">${U.esc(pr.label)}</span>
            <span class="badge">${U.esc(BP.NOTICE_AUDIENCE[n.audience] || 'Everyone')}</span>
            ${n.pinned ? '<span class="badge gold">Pinned</span>' : ''}
          </div>
          <h3 style="margin:7px 0 3px">${U.esc(n.title)}</h3>
          <div class="small">${U.esc(n.createdByName || 'Administrator')} · ${U.esc(shortDate(n.createdAt))}</div>
        </div>
      </div>
      <p class="n-body">${U.esc(n.body)}</p>
      <div class="n-foot">
        <div class="small">${(n.acks || []).length} acknowledgement(s)${admin ? ` of ${totalReaders}` : ''}</div>
        <div class="btn-row">
          ${acked
            ? `<span class="badge ok">${icon('check2')} Acknowledged</span>`
            : `<button class="btn sm primary" data-action="ack-notice" data-id="${U.esc(n.id)}">Acknowledge</button>`}
          ${admin ? `<button class="btn sm ghost" data-action="edit-notice" data-id="${U.esc(n.id)}">Edit</button>
                     <button class="btn sm danger" data-action="del-notice" data-id="${U.esc(n.id)}">Delete</button>` : ''}
        </div>
      </div>
      ${admin && (n.acks || []).length ? `<details class="acklist"><summary>Who acknowledged (${n.acks.length})</summary>
        ${n.acks.map(a => `<div class="small">${U.esc(a.name)} — ${U.esc(new Date(a.at).toLocaleString('en-PH'))}</div>`).join('')}
      </details>` : ''}
    </div>`;
  }).join('') : `<div class="card">${emptyState('No notices yet', admin ? 'Post the first directive for the teams.' : 'Announcements from the office will appear here.')}</div>`}`;
}
function bindNotices() {}

function noticeFormHTML(n = {}) {
  return `<div class="form-grid">
    <div><label class="lbl">Title</label><input class="input" id="n-title" value="${U.esc(n.title || '')}" placeholder="e.g. Peak-season deployment"></div>
    <div><label class="lbl">Directive / message</label>
      <textarea class="input" id="n-body" rows="5" placeholder="State the instruction clearly.">${U.esc(n.body || '')}</textarea></div>
    <div class="row-line">
      <div><label class="lbl">Audience</label>
        <select class="input" id="n-audience">
          ${Object.entries(BP.NOTICE_AUDIENCE).map(([k, v]) => `<option value="${k}" ${n.audience === k ? 'selected' : ''}>${U.esc(v)}</option>`).join('')}
        </select></div>
      <div><label class="lbl">Priority</label>
        <select class="input" id="n-priority">
          <option value="normal" ${n.priority !== 'urgent' ? 'selected' : ''}>Routine</option>
          <option value="urgent" ${n.priority === 'urgent' ? 'selected' : ''}>Urgent directive</option>
        </select></div>
    </div>
    <div><label class="lbl"><input type="checkbox" id="n-pinned" ${n.pinned ? 'checked' : ''}> Pin to the top of every dashboard</label></div>
  </div>`;
}

function openNoticeModal(n) {
  openModal({
    title: n ? 'Edit notice' : 'New notice',
    body: noticeFormHTML(n || {}),
    footer: `<button class="btn ghost" data-action="close-modal">Cancel</button>
             <button class="btn primary" data-action="save-notice" data-id="${U.esc(n?.id || '')}">Post notice</button>`
  });
}

/* =========================================================================
   DUTY SCHEDULE & LEAVE
   ========================================================================= */
const weekStart = (d = new Date()) => {
  const day = (d.getDay() + 6) % 7;                      // Monday = 0
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
};

function viewDuty() {
  const tab = App.dutyTab || 'schedule';
  return `
  <div class="view-head">
    <div><h2>Duty &amp; leave</h2><p>Shift assignments and leave requests</p></div>
    <div class="btn-row">
      <div class="seg">
        <button data-action="duty-tab" data-tab="schedule" class="${tab === 'schedule' ? 'active' : ''}">Duty schedule</button>
        <button data-action="duty-tab" data-tab="leave" class="${tab === 'leave' ? 'active' : ''}">Leave requests</button>
      </div>
    </div>
  </div>
  ${tab === 'schedule' ? dutyScheduleHTML() : dutyLeaveHTML()}`;
}

function dutyScheduleHTML() {
  const start = weekStart(App.dutyWeek || new Date());
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const from = U.iso(days[0]), to = U.iso(days[6]);
  const team = me().team === 'BOTH' ? 'ALL' : me().team;
  const slots = API.schedule(from, to, 'ALL');
  const canEdit = canMonitor();
  const mine = me();

  const myNext = API.schedule(U.today(), U.iso(new Date(Date.now() + 7 * 864e5)), 'ALL')
    .filter(s => s.memberId === mine.id)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return `
  <div class="kpis">
    ${kpi('My next duty', myNext ? U.esc(U.DAYS[U.parseISO(myNext.date).getDay()].slice(0, 3)) : '—',
        myNext ? `${U.esc(U.fmtLong(myNext.date))} · ${U.esc(myNext.shift)}` : 'no assignment yet', 'navy')}
    ${kpi('Slots this week', slots.length, `${U.esc(U.fmtLong(from))} – ${U.esc(U.fmtLong(to))}`)}
  </div>

  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:9px;flex-wrap:wrap">
      <div><h3>Week of ${U.esc(U.fmtLong(from))}</h3><p class="hint" style="margin:0 0 8px">Tap a day to add or change an assignment</p></div>
      <div class="btn-row">
        <button class="btn ghost sm" data-action="duty-week" data-dir="-1">${icon('back')} Prev</button>
        <button class="btn ghost sm" data-action="duty-week" data-dir="0">This week</button>
        <button class="btn ghost sm" data-action="duty-week" data-dir="1">Next</button>
        ${canEdit ? `<button class="btn primary sm" data-action="add-slot" data-date="${from}">${icon('plus')} Assign</button>` : ''}
      </div>
    </div>

    <div class="week">
      ${days.map(d => {
        const ds = U.iso(d);
        const daySlots = slots.filter(s => s.date === ds);
        const isToday = ds === U.today();
        return `<div class="wday ${isToday ? 'today' : ''}">
          <div class="wd-head">
            <b>${U.DAYS[d.getDay()].slice(0, 3)}</b>
            <span>${d.getDate()} ${U.MON3[d.getMonth()]}</span>
          </div>
          <div class="slots">${daySlots.length ? daySlots.map(s => {
            const shift = BP.SHIFTS.find(x => x.key === s.shift) || { label: s.shift, time: '' };
            const isMine = s.memberId === mine.id;
            return `<div class="slot ${isMine ? 'mine' : ''} ${s.team === 'Zulu' ? 'zulu' : 'alpha'}" ${canEdit ? `data-action="edit-slot" data-id="${U.esc(s.id)}"` : ''}>
              <div class="sl-shift">${U.esc(s.shift)} <span>${U.esc(s.post || '')}</span></div>
              <div class="sl-name">${U.esc(s.memberName)}</div>
              <div class="sl-team">${U.esc(s.team)} · ${U.esc(shift.time || '')}</div>
            </div>`;
          }).join('') : `<div class="slot none">—</div>`}</div>
          ${canEdit ? `<button class="wadd" data-action="add-slot" data-date="${ds}">+</button>` : ''}
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function dutyLeaveHTML() {
  const all = API.leaves();
  const mine_ = me();
  const canDecide = canMonitor();
  const list = canDecide ? all : all.filter(l => l.memberId === mine_.id);
  const pending = list.filter(l => l.status === 'pending');

  return `
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:9px;flex-wrap:wrap">
      <div><h3>Leave requests</h3><p class="hint" style="margin:0 0 8px">${canDecide ? `${pending.length} awaiting action` : 'File a leave and track its approval'}</p></div>
      <button class="btn primary sm" data-action="file-leave">${icon('plus')} File leave</button>
    </div>
    ${list.length ? list.map(l => {
      const st = BP.LEAVE_STATUS[l.status] || BP.LEAVE_STATUS.pending;
      return `<div class="lv">
        <div class="lv-top">
          <div>
            <div class="lv-name">${U.esc(l.memberName)} <span class="badge team-${U.esc(l.team)}">${U.esc(l.team)}</span></div>
            <div class="small">${U.esc(l.type)} · ${U.esc(U.fmtLong(l.from))}${l.from !== l.to ? ' – ' + U.esc(U.fmtLong(l.to)) : ''}</div>
          </div>
          <span class="badge ${st.cls}">${U.esc(st.label)}</span>
        </div>
        ${l.reason ? `<div class="lv-reason">${U.esc(l.reason)}</div>` : ''}
        ${l.decidedBy ? `<div class="small">${U.esc(l.status === 'approved' ? 'Approved' : 'Declined')} by ${U.esc(l.decidedBy)}${l.decisionNote ? ' — ' + U.esc(l.decisionNote) : ''}</div>` : ''}
        ${canDecide && l.status === 'pending' ? `<div class="btn-row" style="margin-top:8px">
          <button class="btn sm ok" data-action="leave-decide" data-id="${U.esc(l.id)}" data-status="approved">Approve</button>
          <button class="btn sm danger" data-action="leave-decide" data-id="${U.esc(l.id)}" data-status="declined">Decline</button>
        </div>` : ''}
      </div>`;
    }).join('') : emptyState('No leave requests', 'Requests filed here are seen by the Team Leader and Supervisor.')}
  </div>`;
}
function bindDuty() {}

function slotModal(slot) {
  const members = API.users ? API.users().filter(u => u.role === 'member') : [];
  const s = slot || { date: U.today(), team: 'Alpha', shift: 'AM', post: 'PTT', memberId: '', memberName: '', note: '' };
  return `<div class="form-grid form-2">
    <div><label class="lbl">Date</label><input class="input" type="date" id="s-date" value="${U.esc(s.date)}"></div>
    <div><label class="lbl">Shift</label><select class="input" id="s-shift">
      ${BP.SHIFTS.map(x => `<option value="${x.key}" ${s.shift === x.key ? 'selected' : ''}>${x.label} · ${x.time}</option>`).join('')}
    </select></div>
    <div><label class="lbl">Member</label><select class="input" id="s-member">
      ${members.map(m => `<option value="${U.esc(m.id)}" ${s.memberId === m.id ? 'selected' : ''}>${U.esc(m.name)} — ${U.esc(m.team)}</option>`).join('')}
    </select></div>
    <div><label class="lbl">Post</label><select class="input" id="s-post">
      ${BP.POSTS.map(p => `<option ${s.post === p ? 'selected' : ''}>${p}</option>`).join('')}
    </select></div>
    <div class="full"><label class="lbl">Note</label><input class="input" id="s-note" value="${U.esc(s.note || '')}" placeholder="optional"></div>
  </div>`;
}

function openSlotModal(slot, template) {
  const base = slot || template || null;
  openModal({
    title: slot ? 'Edit assignment' : 'Assign duty',
    body: slotModal(base),
    footer: `${slot ? `<button class="btn danger sm" data-action="del-slot" data-id="${U.esc(slot.id)}">Remove</button>` : ''}
             <button class="btn ghost" data-action="close-modal">Cancel</button>
             <button class="btn primary" data-action="save-slot" data-id="${U.esc(slot?.id || '')}">Save</button>`
  });
}

function leaveModal() {
  openModal({
    title: 'File a leave / absence',
    body: `<div class="form-grid form-2">
      <div><label class="lbl">Type</label><select class="input" id="lv-type">
        ${BP.LEAVE_TYPES.map(t => `<option>${U.esc(t)}</option>`).join('')}</select></div>
      <div><label class="lbl">Reason</label><input class="input" id="lv-reason" placeholder="short reason"></div>
      <div><label class="lbl">From</label><input class="input" type="date" id="lv-from" value="${U.today()}"></div>
      <div><label class="lbl">To</label><input class="input" type="date" id="lv-to" value="${U.today()}"></div>
    </div>`,
    footer: `<button class="btn ghost" data-action="close-modal">Cancel</button>
             <button class="btn primary" data-action="save-leave">Send request</button>`
  });
}

/* =========================================================================
   PHOTOS — strip, upload, lightbox
   ========================================================================= */
async function hydrateShots() {
  const boxes = document.querySelectorAll('#view [data-shots]');
  if (!boxes.length || !App.draft) return;
  for (const box of boxes) {
    const idx = +box.dataset.shots;
    const row = App.draft.rows[idx];
    if (!row) continue;
    const rawIds = Array.from(new Set(row.photos || []));
    if (!rawIds.length) { box.innerHTML = '<span class="shot-none">No photo yet</span>'; continue; }
    const items = [];
    const seenThumbs = new Set();
    const cleanIds = [];
    for (const id of rawIds) {
      try {
        const p = await Photos.get(id);
        if (p) {
          if (seenThumbs.has(p.thumb)) {
            await Photos.remove(id).catch(() => {});
            continue;
          }
          seenThumbs.add(p.thumb);
          cleanIds.push(p.id);
          items.push(p);
        }
      } catch (e) {}
    }
    row.photos = cleanIds;
    if (!items.length) { box.innerHTML = '<span class="shot-none">No photo yet</span>'; continue; }
    box.innerHTML = items.map((p, k) => `
      <span class="shot">
        <img src="${p.thumb}" alt="" data-action="lightbox" data-ids="${cleanIds.join(',')}" data-index="${k}">
        <button type="button" class="shot-x" data-action="del-photo" data-id="${p.id}" data-row="${idx}" title="Remove">×</button>
      </span>`).join('');
  }
}

async function addPhotos(rowIndex, files) {
  if (!App.draft || !files || !files.length || addPhotos._busy) return;
  const d = App.draft;
  const row = d.rows[rowIndex];
  if (!row) return;
  addPhotos._busy = true;
  try {
    row.photos = Array.from(new Set(row.photos || []));
    const existingThumbs = new Set();
    for (const id of row.photos) {
      try { const p = await Photos.get(id); if (p?.thumb) existingThumbs.add(p.thumb); } catch (e) {}
    }
    const uniqueFiles = [];
    const seenFileKeys = new Set();
    for (const f of Array.from(files)) {
      const k = `${f.name || ''}|${f.size || 0}|${f.lastModified || 0}`;
      if (!seenFileKeys.has(k)) {
        seenFileKeys.add(k);
        uniqueFiles.push(f);
      }
    }
    U.toast('Saving photo…', 'info', 1600);
    for (const f of uniqueFiles.slice(0, 4)) {
      try {
        const rec = await Photos.add(f, {
          reportId: draftReportId(), rowIndex, date: d.date, team: d.team, member: d.memberName,
          post: row.post === 'OTHERS' ? (row.postOther || 'OTHERS') : row.post,
          plate: row.plate, violation: row.violation
        });
        if (existingThumbs.has(rec.thumb)) {
          await Photos.remove(rec.id).catch(() => {});
          continue;
        }
        existingThumbs.add(rec.thumb);
        row.photos.push(rec.id);
      } catch (e) { U.toast(e.message || 'Could not read that photo', 'err'); }
    }
    await hydrateShots();
    U.toast('Photo attached', 'ok');
  } finally {
    addPhotos._busy = false;
  }
}

async function fileDraftPhotos(d) {
  for (let i = 0; i < (d.rows || []).length; i++) {
    for (const id of (d.rows[i].photos || [])) {
      const p = await Photos.get(id);
      if (p && (p.reportId !== d.id || p.rowIndex !== i)) {
        p.reportId = d.id; p.rowIndex = i;
        await Photos.put(p);
      }
    }
  }
}

async function openLightbox(ids, index) {
  const list = [];
  for (const id of ids) { const p = await Photos.get(id); if (p) list.push(p); }
  if (!list.length) return;
  const p = list[Math.max(0, Math.min(index, list.length - 1))];
  openModal({
    title: `${p.plate || p.post || 'Photo'} — ${U.fmtLong(p.date)}`,
    size: 'wide',
    body: `<div style="text-align:center;background:#0b1730;border-radius:12px;padding:8px">
        <img src="${p.full}" alt="" style="max-width:100%;max-height:62dvh;border-radius:8px">
      </div>
      <dl class="kv" style="margin-top:12px">
        <dt>Member</dt><dd>${U.esc(p.member || '—')}</dd>
        <dt>Post</dt><dd>${U.esc(p.post || '—')}</dd>
        <dt>Violation</dt><dd>${U.esc(p.violation || '—')}</dd>
        <dt>Saved to Drive</dt><dd>${p.driveUrl ? `<a href="${U.esc(p.driveUrl)}" target="_blank" rel="noopener">Open</a>` : (API.isCloud() ? 'pending upload' : 'this device only')}</dd>
      </dl>`,
    footer: list.length > 1
      ? `<button class="btn ghost sm" data-action="lightbox" data-ids="${ids.join(',')}" data-index="${Math.max(0, index - 1)}">‹ Prev</button>
         <button class="btn ghost sm" data-action="lightbox" data-ids="${ids.join(',')}" data-index="${Math.min(list.length - 1, index + 1)}">Next ›</button>
         <button class="btn gold sm" data-action="close-modal">Close</button>`
      : `<button class="btn gold" data-action="close-modal">Close</button>`
  });
}

/* =========================================================================
   "MORE" MENU (phones) — everything that does not fit in the tab bar
   ========================================================================= */
function openMoreNav() {
  const items = (BP.NAV[me().role] || []).map(id => {
    const [label, ic] = NAV_LABELS[id] || ['—', 'list'];
    return { id, label, ic };
  });
  openModal({
    title: 'Menu',
    body: `<div class="morelist">
      ${items.map(it => `<button class="moreitem ${App.view === it.id ? 'active' : ''}" data-nav="${it.id}">
        ${icon(it.ic)}<span>${it.label}</span>${App.view === it.id ? '<b>•</b>' : ''}
      </button>`).join('')}
    </div>
    <div class="morelist" style="margin-top:12px;border-top:1px solid var(--line);padding-top:10px">
      <button class="moreitem" data-action="account">${icon('lock')}<span>PIN &amp; profile</span></button>
      <button class="moreitem" data-action="sync">${icon('sync')}<span>Sync now</span></button>
      <button class="moreitem" data-action="logout">${icon('out')}<span>Sign out</span></button>
    </div>`
  });
}
