/* =========================================================================
   sw.js — service worker
   App-shell precache + runtime cache so the PWA opens with no signal.
   Reports themselves live in localStorage (see js/api.js) and are pushed to
   Google Sheets by the app when a connection returns.
   ========================================================================= */

const VERSION = 'bpgt-v1.1.3';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'app.css',
  'config.js',
  'util.js',
  'api.js',
  'photos.js',
  'report.js',
  'app.js',
  'bpgt-logo-128.png',
  'bpgt-logo-256.png',
  'tf-shield-256.png',
  'icon-192.png',
  'icon-512.png',
  'maskable-192.png',
  'favicon.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.all(SHELL.map(async url => {
      try { await cache.add(new Request(url, { cache: 'reload' })); } catch (err) { /* ignore single misses */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache Apps Script API traffic
  if (url.hostname.endsWith('script.google.com') || url.searchParams.has('callback')) return;

  // Navigations: network first, fall back to the cached shell (offline)
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(VERSION);
        cache.put('index.html', fresh.clone());
        return fresh;
      } catch (err) {
        return (await caches.match('index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Static assets: cache first, then network
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && url.origin === location.origin) {
        const cache = await caches.open(VERSION);
        cache.put(req, res.clone());
      }
      return res;
    } catch (err) {
      return hit || Response.error();
    }
  })());
});
