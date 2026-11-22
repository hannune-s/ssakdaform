// Ssakdaform Service Worker (v3 - Web Push Notification Support, NO fetch hijack)

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('push', (event) => {
  let payload = {
    title: '🔥 단골 깜짝 특가 알림!',
    body: '새로운 실시간 특가가 도착했습니다. 지금 바로 확인해보세요!',
    url: '/',
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'ssakdaform-sale-push-' + (payload.storeId || 'default'),
    renotify: true,
    requireInteraction: true,
    silent: false,
    vibrate: [300, 100, 300, 100, 400],
    data: {
      url: payload.url || '/',
      storeId: payload.storeId,
      timestamp: Date.now(),
    },
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(payload.title, options),
      // Also notify any open tab immediately so it can play an in-app bell sound & open the sale popup
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        clientList.forEach((client) => {
          client.postMessage({
            type: 'SSAKDAFORM_SALE_PUSH',
            payload,
          });
        });
      }),
    ])
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl.split('?')[0]) && 'focus' in client) {
          client.postMessage({ type: 'SSAKDAFORM_OPEN_SALE_MODAL' });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
