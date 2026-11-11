/* =========================================================================
   photos.js — photo documentation for every apprehension
   -------------------------------------------------------------------------
   • Images are compressed on the phone (thumb 520px + full 1280px, JPEG)
   • Stored in IndexedDB (not localStorage) so hundreds of photos fit
   • In CLOUD mode they are pushed to the Drive folder "BPGT Photos" with an
     old-school multipart form POST into a hidden iframe — the only way to
     cross the Apps Script origin without CORS. Apps Script answers with a
     tiny page that postMessage()s the Drive link back to us.
   ========================================================================= */

const Photos = (() => {
  const DB_NAME = 'bpgt-photos';
  const STORE = 'photos';
  let dbPromise = null;

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('This browser cannot store photos'));
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const os = db.createObjectStore(STORE, { keyPath: 'id' });
          os.createIndex('reportId', 'reportId', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function tx(mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      const store = t.objectStore(STORE);
      let out;
      try { out = fn(store); } catch (e) { reject(e); return; }
      t.oncomplete = () => resolve(out && out.result !== undefined ? out.result : out);
      t.onerror = () => reject(t.error);
    });
  }

  /* ---------------- compression ---------------------------------------- */
  function readAsDataURL(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = () => rej(fr.error);
      fr.readAsDataURL(file);
    });
  }

  function shrink(dataUrl, maxDim, quality) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        let out = c.toDataURL('image/jpeg', quality);
        // keep it small enough for the JSONP/PDF pipeline
        let q = quality;
        while (out.length > 420 * 1024 && q > 0.4) { q -= 0.1; out = c.toDataURL('image/jpeg', q); }
        res({ dataUrl: out, w, h });
      };
      img.onerror = () => rej(new Error('That file is not a readable image'));
      img.src = dataUrl;
    });
  }

  /* ---------------- public API ----------------------------------------- */
  async function add(file, meta = {}) {
    const raw = await readAsDataURL(file);
    const [full, thumb] = await Promise.all([shrink(raw, 1280, 0.78), shrink(raw, 520, 0.68)]);
    const rec = {
      id: U.uid('ph'),
      reportId: meta.reportId || '',
      rowIndex: meta.rowIndex ?? 0,
      caption: meta.caption || '',
      post: meta.post || '',
      plate: meta.plate || '',
      date: meta.date || U.today(),
      team: meta.team || '',
      member: meta.member || '',
      violation: meta.violation || '',
      full: full.dataUrl, thumb: thumb.dataUrl,
      w: full.w, h: full.h,
      createdAt: new Date().toISOString(),
      driveId: '', driveUrl: '', uploadedAt: ''
    };
    await tx('readwrite', s => s.put(rec));
    return rec;
  }

  const get = id => tx('readonly', s => s.get(id));
  const remove = id => tx('readwrite', s => s.delete(id));

  async function byReport(reportId) {
    const all = await tx('readonly', s => s.getAll ? s.getAll() : null) || [];
    return all.filter(p => p.reportId === reportId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async function all() {
    return tx('readonly', s => s.getAll()) || [];
  }

  async function byReports(ids) {
    const set = new Set(ids);
    const list = await all();
    return list.filter(p => set.has(p.reportId));
  }

  async function countAll() {
    try { return (await all()).length; } catch (e) { return 0; }
  }

  /* clean up when a report is deleted */
  async function removeByReport(reportId) {
    const list = await byReport(reportId);
    for (const p of list) await remove(p.id);
    return list.length;
  }

  /* ---------------- upload to Drive ------------------------------------ */
  function uploadViaForm(rec, meta, token) {
    return new Promise((resolve, reject) => {
      if (!BP.API_URL) return reject(new Error('Cloud connection is not configured'));
      const frameName = 'bpgt_up_' + rec.id;
      const iframe = document.createElement('iframe');
      iframe.name = frameName;
      iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;left:-9999px';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = BP.API_URL;
      form.target = frameName;
      form.enctype = 'multipart/form-data';
      form.style.display = 'none';

      const add = (name, value) => {
        const i = document.createElement('input');
        i.type = 'hidden'; i.name = name;
        i.value = value == null ? '' : String(value);
        form.appendChild(i);
      };
      add('action', 'uploadPhoto');
      add('token', token || '');
      add('photoId', rec.id);
      add('reportId', rec.reportId || '');
      add('date', rec.date);
      add('team', rec.team);
      add('member', rec.member);
      add('post', rec.post);
      add('plate', rec.plate);
      add('violation', rec.violation);
      add('data', rec.full);

      document.body.appendChild(form);

      let done = false;
      const finish = (err, res) => {
        if (done) return;
        done = true;
        window.removeEventListener('message', onMsg);
        form.remove(); iframe.remove();
        err ? reject(err) : resolve(res);
      };
      const onMsg = ev => {
        const d = ev.data;
        if (!d || d.type !== 'bpgt-photo' || d.photoId !== rec.id) return;
        if (d.ok) finish(null, d); else finish(new Error(d.error || 'Upload failed'));
      };
      window.addEventListener('message', onMsg);
      setTimeout(() => finish(new Error('Photo upload timed out')), 90000);

      form.submit();
    });
  }

  async function uploadPending(token, limit = 6) {
    if (!BP.API_URL) return { uploaded: 0, failed: 0 };
    const list = (await all()).filter(p => !p.driveId).slice(0, limit);
    let uploaded = 0, failed = 0;
    for (const p of list) {
      try {
        const res = await uploadViaForm(p, {}, token);
        const fresh = await get(p.id);
        if (fresh) {
          fresh.driveId = res.fileId || '';
          fresh.driveUrl = res.url || '';
          fresh.uploadedAt = new Date().toISOString();
          await tx('readwrite', s => s.put(fresh));
        }
        uploaded++;
      } catch (e) {
        failed++;
        if (/token|sign in|session/i.test(e.message)) break;
      }
    }
    return { uploaded, failed };
  }

  async function pendingCount() {
    try { return (await all()).filter(p => !p.driveId).length; } catch (e) { return 0; }
  }

  return { add, get, put: rec => tx('readwrite', st => st.put(rec)), remove, byReport, byReports,
           all, countAll, removeByReport, uploadPending, pendingCount };
})();
