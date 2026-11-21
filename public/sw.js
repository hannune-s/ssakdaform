const CACHE_NAME = 'ssakdaform-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 네트워크 요청을 가로채서 평문 에러 페이지로 덮어쓰지 않도록 패스스루 유지
self.addEventListener('fetch', () => {
  return;
});
