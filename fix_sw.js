const fs = require('fs');

const swCode = `
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
`;

fs.writeFileSync('public/sw.js', swCode);

let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
if (!layout.includes('rel="manifest"')) {
    // Inject literal link tag to avoid Next.js metadata caching issues
    const headInjection = `
        <link rel="manifest" href="/manifest.json?v=3" />
        <meta name="theme-color" content="#4f46e5" />
    `;
    layout = layout.replace('<head>', '<head>' + headInjection);
    fs.writeFileSync('src/app/layout.tsx', layout);
}

console.log('Fixed SW and Layout');
