/* Offline cache. Bump CACHE on every deploy so clients pick up changes. */
const CACHE = 'btcc-startline-v7';

const ASSETS = [
  'index.html',
  'countdown.html',
  'adverse.html',
  'support.html',
  'photo.html',
  'nav.css',
  'nav.js',
  'manifest.webmanifest',
  'img/barc.png',
  'img/btcc.png',
  'img/icon-180.png',
  'img/icon-192.png',
  'img/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first: instant + fully offline. Falls back to network for anything uncached.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      return hit || fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('index.html'));
    })
  );
});
