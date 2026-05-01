// ============================================================
//  TEMBEA LAIKIPIA — Service Worker (sw.js)
//  Enables offline use, caching, and app-like behaviour
// ============================================================

const CACHE_NAME = 'tembea-laikipia-v1';

// All assets to cache on install so the app works offline
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap'
];

// ── INSTALL: cache all core assets ──────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: remove old caches ─────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: cache-first for local, network-first for external ─
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // For navigation requests (page loads), serve index.html from cache
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cached) => cached || fetch(request))
    );
    return;
  }

  // Cache-first strategy for same-origin assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached || fetch(request).then((response) => {
          // Cache new assets on the fly
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
      )
    );
    return;
  }

  // Network-first for external (fonts, WhatsApp links, images)
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// ── BACKGROUND SYNC placeholder (future: offline booking queue) ─
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    console.log('[SW] Background sync: bookings');
  }
});
