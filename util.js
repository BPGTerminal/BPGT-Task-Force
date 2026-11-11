/* =========================================================================
   util.js — small helpers (dates, formatting, escaping, toasts, crypto)
   ========================================================================= */

const U = (() => {

  const pad = n => String(n).padStart(2, '0');

  /* ---------- dates ---------------------------------------------------- */
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => iso(new Date());
  const parseISO = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  const fmtLong = s => { const d = parseISO(s); return `${d.getDate()} ${MON3[d.getMonth()]} ${d.getFullYear()}`; };
  const fmtMonthYear = s => { const d = parseISO(s); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
  const weekday = s => DAYS[parseISO(s).getDay()];

  /**
   * Reporting period that contains `date`:
   *   startDay 26 of previous month  →  endDay 25 of current month
   * e.g. 10 Nov 2026  ->  26 Oct 2026 – 25 Nov 2026
   */
  function periodFor(dateStr, startDay = BP.PERIOD.startDay, endDay = BP.PERIOD.endDay) {
    const d = parseISO(dateStr);
    const start = new Date(d.getFullYear(), d.getMonth(), startDay);
    const end = new Date(d.getFullYear(), d.getMonth(), endDay);
    let from, to, label;
    if (d.getDate() <= endDay) {
      // first half of the calendar month -> period opened last month
      from = new Date(d.getFullYear(), d.getMonth() - 1, startDay);
      to = end;
    } else {
      from = start;
      to = new Date(d.getFullYear(), d.getMonth() + 1, endDay);
    }
    label = `${from.getDate()} ${MON3[from.getMonth()]} ${from.getFullYear()} – ${to.getDate()} ${MON3[to.getMonth()]} ${to.getFullYear()}`;
    // the period is named after the month it closes in
    const name = `${MONTHS[to.getMonth()]} ${to.getFullYear()}`;
    return { from: iso(from), to: iso(to), label, name, monthKey: `${to.getFullYear()}-${pad(to.getMonth() + 1)}` };
  }

  /* ---------- escaping / dom ------------------------------------------- */
  const esc = v => String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const uid = (prefix = 'id') =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const num = v => { const n = parseInt(String(v ?? '').replace(/[^0-9-]/g, ''), 10); return isNaN(n) ? 0 : n; };

  const nf = n => (n ?? 0).toLocaleString('en-PH');

  /* ---------- toast ---------------------------------------------------- */
  let toastTimer = null;
  function toast(msg, kind = 'info', ms = 3000) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
    el.className = `toast show ${kind}`;
    el.innerHTML = `<span class="toast-dot"></span><span>${esc(msg)}</span>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.className = 'toast'; }, ms);
  }

  /* ---------- sha256 (used for PIN hashing in cloud mode) -------------- */
  async function sha256(text) {
    if (!window.crypto?.subtle) return 'plain:' + text;   // very old browser fallback
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /* ---------- misc ----------------------------------------------------- */
  const clone = o => JSON.parse(JSON.stringify(o));
  const sortBy = (arr, fn) => arr.slice().sort((a, b) => (fn(a) > fn(b) ? 1 : fn(a) < fn(b) ? -1 : 0));
  const sum = (arr, fn) => arr.reduce((t, x) => t + (fn ? fn(x) : x), 0);

  function download(filename, text, mime = 'application/json') {
    const blob = new Blob([text], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  return { pad, iso, today, parseISO, fmtLong, fmtMonthYear, weekday, periodFor,
           MONTHS, MON3, DAYS, esc, $, $$, uid, num, nf, toast, sha256, clone, sortBy, sum, download };
})();
