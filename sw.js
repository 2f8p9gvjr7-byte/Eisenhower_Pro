const CACHE = 'eisenhower-pro-v1';
const ASSETS = [
  '/Eisenhower_Pro/',
  '/Eisenhower_Pro/index.html',
  '/Eisenhower_Pro/manifest.json',
  '/Eisenhower_Pro/icon-192.png',
  '/Eisenhower_Pro/icon-512.png',
  'https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200) return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => caches.match('/Eisenhower_Pro/index.html'));
    })
  );
});
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
