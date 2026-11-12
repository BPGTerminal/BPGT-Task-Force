/* =========================================================================
   report.js — monthly summary: aggregation + printable/PDF document
   -------------------------------------------------------------------------
   The layout mirrors the official BPGT TF Daily Reporting Form (page 1 duty
   activity log + page 2 summary & signatories) but consolidated for a whole
   reporting period: 26th of the preceding month → 25th of the current month.
   Only <table> based markup is used so the very same HTML renders correctly
   in Chrome/Android "Save as PDF" AND in Apps Script's HTML→PDF converter.
   ========================================================================= */

const Monthly = (() => {

  /* Period that CLOSES in the given calendar month (1-12) ---------------- */
  function periodByMonth(year, month) {
    const from = new Date(year, month - 2, BP.PERIOD.startDay);
    const to = new Date(year, month - 1, BP.PERIOD.endDay);
    return {
      from: U.iso(from), to: U.iso(to),
      label: `${from.getDate()} ${U.MON3[from.getMonth()]} ${from.getFullYear()} – ${to.getDate()} ${U.MON3[to.getMonth()]} ${to.getFullYear()}`,
      name: `${U.MONTHS[to.getMonth()]} ${to.getFullYear()}`,
      monthKey: `${year}-${U.pad(month)}`
    };
  }

  const currentPeriod = () => U.periodFor(U.today());

  /* Last 18 periods, newest first (for the picker) ----------------------- */
  function periodOptions(n = 18) {
    const t = new Date();
    const out = [];
    for (let i = 0; i < n; i++) {
      const d = new Date(t.getFullYear(), t.getMonth() - i, 1);
      out.push(periodByMonth(d.getFullYear(), d.getMonth() + 1));
    }
    return out;
  }

  const MONTHKEY_NAMES = k => {
    const [y, m] = k.split('-').map(Number);
    return periodByMonth(y, m);
  };

  /* ==================================================================
     AGGREGATION
     ================================================================== */
  function aggregate(team, period) {
    const included = API.query({ from: period.from, to: period.to, team })
      .filter(r => !['draft', 'returned'].includes(r.status));

    // duty activity log rows
    const rows = [];
    included.forEach(r => {
      (r.rows || []).forEach(x => {
        if (!x.time && !x.violation && !x.plate && !x.remarks) return;   // ignore blank rows
        rows.push({
          date: r.date,
          time: x.time || '',
          post: x.post === 'OTHERS' && x.postOther ? x.postOther : (x.post || ''),
          violation: x.violation || '',
          plate: x.plate || '',
          driver: x.driver || '',
          ct: x.ct || '',
          remarks: x.remarks || '',
          member: r.memberName,
          team: r.team
        });
      });
    });
    rows.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

    // summary counters
    const totals = {};
    BP.TALLY_FIELDS.forEach(f => {
      totals[f.key] = U.sum(included, r => U.num(r.tally?.[f.key]));
    });
    // fall back to auto-counts when nobody keyed the tallies
    if (!totals.violations) totals.violations = rows.filter(x => x.violation).length;
    if (!totals.tickets) totals.tickets = rows.filter(x => x.ct).length;

    // incidents / concerns / recommendations
    const narrative = [];
    U.sortBy(included, r => r.date).forEach(r => {
      if (r.narrative && r.narrative.trim()) {
        narrative.push({ date: r.date, member: r.memberName, text: r.narrative.trim() });
      }
    });

    // keep the official roster order (same order as the signature blocks of the form)
    const rosterOrder = id => {
      const i = BP.users.findIndex(x => x.id === id);
      return i === -1 ? 999 : i;
    };
    const members = API.users()
      .filter(u => u.role === 'member' && (team === 'ALL' || u.team === team))
      .sort((a, b) => rosterOrder(a.id) - rosterOrder(b.id));

    const perMember = members.map(m => {
      const mine = included.filter(r => r.memberId === m.id);
      return {
        ...m,
        days: new Set(mine.map(r => r.date)).size,
        entries: U.sum(mine, r => (r.rows || []).filter(x => x.violation || x.plate || x.remarks).length),
        totals: BP.TALLY_FIELDS.reduce((o, f) => (o[f.key] = U.sum(mine, r => U.num(r.tally?.[f.key])), o), {})
      };
    });

    return {
      team, period,
      included: U.sortBy(included, r => r.date),
      excludedCount: API.query({ from: period.from, to: period.to, team }).filter(r => ['draft', 'returned'].includes(r.status)).length,
      rows, totals, narrative, members, perMember,
      submissions: included.length,
      activeDays: new Set(included.map(r => r.date)).size
    };
  }

  /* ==================================================================
     PRINTABLE DOCUMENT
     ================================================================== */
  const dshort = s => { const d = U.parseISO(s); return `${d.getDate()} ${U.MON3[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`; };

  function photoSection(photos) {
    if (!photos || !photos.length) return '';
    const cell = p => `<td class="ph">
        <img src="${p.thumb}" alt="">
        <div class="phcap"><b>${U.esc(dshort(p.date))}</b> · ${U.esc(p.post || '—')}
          ${p.plate ? ' · ' + U.esc(p.plate) : ''}<br>
          <span class="phvio">${U.esc(p.violation || 'Documentation')}</span>
          ${p.member ? `<br><span class="phmem">${U.esc(p.member)}</span>` : ''}
        </div>
      </td>`;
    const rows = [];
    for (let i = 0; i < photos.length; i += 3) {
      const slice = photos.slice(i, i + 3);
      while (slice.length < 3) slice.push(null);
      rows.push(`<tr>${slice.map(p => p ? cell(p) : '<td class="ph empty"></td>').join('')}</tr>`);
    }
    return `<div class="pagebreak"></div>
      <div class="sect">PHOTO DOCUMENTATION <span style="font-weight:normal;font-size:8pt">(${photos.length} photo${photos.length === 1 ? '' : 's'})</span></div>
      <table class="phgrid">${rows.join('')}</table>`;
  }

  function buildHTML(data, logos = {}, photos = []) {
    const o = BP.org;
    const teamName = data.team === 'ALL' ? 'ALPHA &amp; ZULU' : data.team.toUpperCase();
    const logoSrc = logos.logo || 'assets/bpgt-logo-128.png';
    const shieldSrc = logos.shield || 'assets/tf-shield-256.png';

    const rowsHTML = data.rows.length
      ? data.rows.map(r => `<tr>
          <td class="c nowrap">${U.esc(dshort(r.date))}</td>
          <td class="c">${U.esc(r.time)}</td>
          <td class="c">${U.esc(r.post)}</td>
          <td>${U.esc(r.violation)}</td>
          <td class="c">${U.esc(r.plate)}</td>
          <td>${U.esc(r.driver)}</td>
          <td class="c">${U.esc(r.ct)}</td>
          <td>${U.esc(r.remarks)}</td>
        </tr>`).join('')
      : `<tr><td colspan="8" class="empty">No apprehension / activity entries were recorded for this period.</td></tr>`;

    const narrHTML = data.narrative.length
      ? data.narrative.map(n => `<div class="nar"><b>${U.esc(dshort(n.date))} — ${U.esc(n.member)}:</b> ${U.esc(n.text)}</div>`).join('')
      : `<div class="nar muted">—</div>`;

    const cell = key => U.nf(data.totals[key] ?? 0);

    const summaryHTML = `
      <table class="sum">
        <tr>
          <td class="lbl">Vehicles Monitored:</td><td class="val">${cell('vehicles')}</td>
          <td class="lbl">Passengers Assisted:</td><td class="val">${cell('passengers')}</td>
          <td class="lbl">Arkabala Checked:</td><td class="val">${cell('arkabala')}</td>
        </tr>
        <tr>
          <td class="lbl">Violations Noted:</td><td class="val">${cell('violations')}</td>
          <td class="lbl">Incidents/SOS:</td><td class="val">${cell('incidents')}</td>
          <td class="lbl">Citation Tickets Issued:</td><td class="val">${cell('tickets')}</td>
        </tr>
      </table>`;

    const sigCell = m => `<td class="sig"><div class="sigline"></div>
        <div class="signame">${U.esc(m.name.toUpperCase())}</div>
        <div class="sigrole">${U.esc(m.position || 'Para-traffic Enforcer')}</div></td>`;

    const memberRows = [];
    const allMembers = data.members.length ? data.members : [];
    for (let i = 0; i < allMembers.length; i += 4) {
      memberRows.push(`<table class="sigs" style="margin-top:${i === 0 ? 0 : 22}px"><tr>${allMembers.slice(i, i + 4).map(sigCell).join('')}</tr></table>`);
    }
    const memberSigs = memberRows.join('') || `<table class="sigs"><tr>${sigCell({ name: '—', position: '' })}</tr></table>`;

    const officialSigs = BP.officials.map(p => `<td class="sig"><div class="sigline"></div>
        <div class="signame">${U.esc(p.name)}</div>
        <div class="sigrole">${U.esc(p.role)}</div></td>`).join('');

    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>BPGT TF Monthly Summary — ${U.esc(data.period.name)} — ${U.esc(teamName)}</title>
<style>
  @page { size: A4 portrait; margin: 10mm 9mm 12mm 9mm; }
  * { box-sizing: border-box; }
  body { font-family: "Times New Roman", Times, Georgia, serif; margin: 0; color: #111; font-size: 9pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .navy { color: #0d2159; }
  table { border-collapse: collapse; width: 100%; }

  /* ---------- letterhead ---------- */
  .head td { vertical-align: middle; }
  .head .l { width: 84px; text-align: left; }
  .head .r { width: 84px; text-align: right; }
  .head img { width: 76px; height: 76px; object-fit: contain; }
  .head .mid { text-align: center; line-height: 1.28; }
  .head .mid .r1, .head .mid .r2 { font-size: 9pt; }
  .head .mid .muni { font-family: Arial, Helvetica, sans-serif; font-weight: bold; font-size: 12.5pt; letter-spacing: .2px; }
  .head .mid .unit { font-family: Arial, Helvetica, sans-serif; font-weight: bold; font-size: 11pt; color: #0d2159; }
  .head .mid .form { font-family: Arial, Helvetica, sans-serif; font-weight: bold; font-size: 10pt; letter-spacing: 1px; }
  .rule { border-top: 2px solid #0d2159; border-bottom: 1px solid #0d2159; height: 3px; margin: 4px 0 8px; }

  /* ---------- meta rows ---------- */
  .meta { margin-bottom: 8px; font-size: 9pt; }
  .meta td { border: 1px solid #333; padding: 3px 6px; }
  .meta .k { background: #dbe3f0; font-weight: bold; width: 15%; }
  .meta .v { width: 35%; }
  .chk { font-family: Arial, Helvetica, sans-serif; }
  .box { display: inline-block; width: 9px; height: 9px; border: 1px solid #333; margin: 0 3px 0 8px; text-align: center; line-height: 8px; font-size: 8pt; vertical-align: -1px; }

  /* ---------- section titles ---------- */
  .sect { font-family: Arial, Helvetica, sans-serif; font-weight: bold; font-size: 9.5pt; color: #0d2159;
          border-bottom: 1px solid #0d2159; padding-bottom: 1px; margin: 9px 0 3px; letter-spacing: .4px; }

  /* ---------- duty log ---------- */
  .log th { background: #17356f; color: #fff; font-family: Arial, Helvetica, sans-serif; font-size: 7.4pt;
            border: 1px solid #17356f; padding: 3px 2px; letter-spacing: .2px; }
  .log td { border: 1px solid #666; padding: 2.6px 3px; font-size: 8pt; height: 15px; }
  .log tr:nth-child(even) td { background: #f6f8fc; }
  .log .c { text-align: center; }
  .log .nowrap { white-space: nowrap; }
  .log .empty { text-align: center; font-style: italic; color: #666; padding: 14px 0; }
  thead { display: table-header-group; }

  /* ---------- summary ---------- */
  .sum { margin-top: 2px; }
  .sum td { border: 1px solid #333; padding: 5px 6px; font-size: 8.6pt; }
  .sum .lbl { background: #dbe3f0; font-weight: bold; width: 20%; }
  .sum .val { width: 13.3%; text-align: right; font-weight: bold; }

  /* ---------- narrative ---------- */
  .narbox { border: 1px solid #333; min-height: 185px; padding: 6px 8px; font-size: 8.6pt; }
  .narbox .nar { margin-bottom: 5px; text-align: justify; }
  .muted { color: #777; }

  /* ---------- signatures ---------- */
  .sigs { margin-top: 16px; }
  .sigs td.sig { text-align: center; padding: 0 8px; vertical-align: bottom; width: 25%; }
  .sigline { border-bottom: 1px solid #000; margin: 0 4px 2px; height: 18px; }
  .signame { font-family: Arial, Helvetica, sans-serif; font-weight: bold; font-size: 8.4pt; }
  .sigrole { font-size: 8pt; }
  .sigs.official td.sig { width: 33.33%; }
  .pagebreak { page-break-before: always; }
  .foot { margin-top: 10px; border-top: 1px solid #999; padding-top: 3px; font-size: 7pt; color: #555;
          font-family: Arial, Helvetica, sans-serif; display: flex; justify-content: space-between; }
  .sigblock { page-break-inside: avoid; }
  .phgrid td.ph { border: 1px solid #999; padding: 4px; width: 33.33%; vertical-align: top; }
  .phgrid td.ph.empty { border: 1px dashed #ccc; }
  .phgrid img { width: 100%; height: 150px; object-fit: cover; display: block; }
  .phcap { font-size: 7.6pt; margin-top: 3px; line-height: 1.25; }
  .phvio { color: #8f2318; font-weight: bold; }
  .phmem { color: #555; }
</style></head>
<body>

  <table class="head">
    <tr>
      <td class="l"><img src="${logoSrc}" alt="BPGT"></td>
      <td class="mid">
        <div class="r1">${o.republic}</div>
        <div class="r2">${o.province}</div>
        <div class="muni navy">${o.municipality}</div>
        <div class="r2">${o.office}</div>
        <div class="unit">${o.unit}</div>
        <div class="form">${o.reportTitle}</div>
        <div class="r2" style="font-size:8pt;letter-spacing:.3px">(Consolidated ${o.formTitle})</div>
      </td>
      <td class="r"><img src="${shieldSrc}" alt="TF"></td>
    </tr>
  </table>
  <div class="rule"></div>

  <table class="meta">
    <tr>
      <td class="k">Reporting Month</td>
      <td class="v"><b>${U.esc(data.period.name)}</b></td>
      <td class="k">Covered Period</td>
      <td class="v">${U.esc(data.period.label)}</td>
    </tr>
    <tr>
      <td class="k">Team</td>
      <td class="v chk" colspan="3">
        <span class="box">${data.team === 'Alpha' || data.team === 'ALL' ? '&#10003;' : ''}</span>Alpha
        <span class="box">${data.team === 'Zulu' || data.team === 'ALL' ? '&#10003;' : ''}</span>Zulu
        &nbsp;&nbsp;|&nbsp;&nbsp; Submissions: <b>${data.submissions}</b>
        &nbsp;&nbsp;|&nbsp;&nbsp; Duty days covered: <b>${data.activeDays}</b>
        &nbsp;&nbsp;|&nbsp;&nbsp; Log entries: <b>${data.rows.length}</b>
      </td>
    </tr>
  </table>

  <div class="sect">DUTY ACTIVITY LOG</div>
  <table class="log">
    <thead><tr>
      <th style="width:9%">DATE</th><th style="width:7%">TIME</th><th style="width:10%">POST</th>
      <th style="width:17%">VIOLATION</th><th style="width:10%">PLATE NUMBER</th>
      <th style="width:15%">DRIVER</th><th style="width:10%">CT NUMBER</th><th>BPGT TF REMARKS</th>
    </tr></thead>
    <tbody>${rowsHTML}</tbody>
  </table>

  <div class="pagebreak"></div>

  <div class="sect">SUMMARY</div>
  ${summaryHTML}

  <div class="sect">INCIDENTS / CONCERNS / RECOMMENDATIONS</div>
  <div class="narbox">${narrHTML}</div>

  ${photoSection(photos)}

  <div class="sigblock">
    <div class="sect" style="margin-top:18px">CONFORME / SIGNATORIES</div>
    <table class="sigs"><tr>${memberSigs}</tr></table>
    <table class="sigs official" style="margin-top:22px"><tr>${officialSigs}</tr></table>
  </div>

  <div class="foot">
    <span>&copy; Brooke's Point Grand Terminal 2026 — ${o.reportTitle} (${U.esc(data.period.name)}, ${U.esc(data.period.label)})</span>
    <span>v${BP.APP_VERSION} · Generated ${U.esc(new Date().toLocaleString('en-PH'))}</span>
  </div>
</body></html>`;
  }

  /* ---------- CSV export (for the sheet / offline backup) -------------- */
  function toCSV(data) {
    const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const head = ['DATE', 'TIME', 'POST', 'VIOLATION', 'PLATE NUMBER', 'DRIVER', 'CT NUMBER', 'BPGT TF REMARKS', 'MEMBER', 'TEAM'];
    const lines = [head.map(q).join(',')];
    data.rows.forEach(r => lines.push([r.date, r.time, r.post, r.violation, r.plate, r.driver, r.ct, r.remarks, r.member, r.team].map(q).join(',')));
    lines.push('');
    BP.TALLY_FIELDS.forEach(f => lines.push([q(f.label), q(data.totals[f.key])].join(',')));
    return lines.join('\r\n');
  }

  return { periodByMonth, currentPeriod, periodOptions, MONTHKEY_NAMES, aggregate, buildHTML, toCSV, dshort };
})();
