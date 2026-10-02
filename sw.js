/* SV Mörlenbach Store · Service Worker: schnell starten, offline die letzte Ansicht, Push-Nachrichten */
const V = '71525a8c';
const KERN = ['./', 'app.css?v=71525a8c', 'app.js?v=71525a8c', 'img/icon-192.png', 'img/favicon.svg', 'fonts/archivo.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open('kern-' + V).then(c => c.addAll(KERN)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => !n.endsWith(V) && !n.startsWith('bilder')).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin || /\/(backoffice|vendor)\//.test(u.pathname)) return;      // Datenbank, Zahlungsseite, Backoffice: nie aus dem Zwischenspeicher
  if (r.mode === 'navigate') {                                                                  // Seiten: frisch aus dem Netz, offline die gespeicherte Startseite
    e.respondWith(fetch(r).catch(() => caches.match('./', { ignoreSearch: true }).then(x => x || caches.match(r))));
    return;
  }
  if (/\.(webp|png|jpg|svg|woff2)$/.test(u.pathname)) {                                         // Bilder und Schriften: sofort aus dem Speicher, im Hintergrund auffrischen
    e.respondWith(caches.open('bilder').then(async c => { const hit = await c.match(r); const neu = fetch(r).then(x => { if (x.ok) c.put(r, x.clone()); return x; }).catch(() => hit);
      return hit || neu; }));
    return;
  }
  if (/\.(js|css)$/.test(u.pathname)) e.respondWith(caches.match(r).then(x => x || fetch(r).then(y => { if (y.ok) caches.open('kern-' + V).then(c => c.put(r, y.clone())); return y; })));
});
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { d = { titel: 'SV Mörlenbach Store', text: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titel || 'SV Mörlenbach Store', { body: d.text || '', icon: 'img/icon-192.png', badge: 'img/badge-96.png', image: d.bild || undefined,
    tag: d.tag || 'shop', renotify: true, data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close(); const ziel = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(L => { for (const c of L) { if ('navigate' in c && new URL(c.url).origin === location.origin) return c.navigate(ziel).then(x => (x || c).focus()); } return self.clients.openWindow(ziel); }));
});
