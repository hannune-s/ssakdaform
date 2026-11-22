// Ssakdaform Service Worker (v4 - Always trigger fresh heads-up banner notification on mobile)

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
    timestamp: Date.now(),
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }

  // 매 전송마다 고유 tag를 부여하여 안드로이드/iOS가 기존 알림 갱신이 아닌 '새 상단 헤드업 배너'로 무조건 띄우도록 처리
  const uniqueTag = 'ssakdaform-sale-' + (payload.timestamp || Date.now());

  const options = {
    body: payload.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: uniqueTag,
    renotify: true,
    requireInteraction: true,
    silent: false,
    timestamp: payload.timestamp || Date.now(),
    vibrate: [400, 120, 400, 120, 500],
    actions: [
      {
        action: 'open_sale',
        title: '특가 바로 보기',
      },
    ],
    data: {
      url: payload.url || '/',
      storeId: payload.storeId,
      timestamp: payload.timestamp || Date.now(),
    },
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(payload.title, options),
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
