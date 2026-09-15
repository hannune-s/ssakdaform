
const CACHE_NAME = 'ssakdaform-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('네트워크 연결이 끊겼습니다.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })
  );
});
