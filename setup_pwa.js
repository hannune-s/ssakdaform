const fs = require('fs');
const path = require('path');

// 1. Create manifest.json
const manifestPath = path.join('public', 'manifest.json');
const manifestContent = {
  "name": "싹다폼 어드민",
  "short_name": "싹다폼",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "icons": [
    {
      "src": "https://www.w3.org/Graphics/SVG/Test/20110816/harness/htmlObjectTiff/resources/magnify.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    },
    {
      "src": "https://www.w3.org/Graphics/SVG/Test/20110816/harness/htmlObjectTiff/resources/magnify.svg",
      "sizes": "512x512",
      "type": "image/svg+xml"
    }
  ]
};
fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2));

// 2. Create dummy sw.js
const swPath = path.join('public', 'sw.js');
const swContent = `
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('fetch', (e) => {
  // dummy fetch handler to pass PWA criteria
});
`;
fs.writeFileSync(swPath, swContent);

// 3. Update layout.tsx
let layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
if (!layoutContent.includes('manifest.json')) {
  // Find where to insert manifest link or just add it to metadata if possible.
  // In app router, it's better to add manifest field to metadata export.
  if (layoutContent.includes('export const metadata')) {
      layoutContent = layoutContent.replace(
        'export const metadata: Metadata = {', 
        'export const metadata: Metadata = {\n  manifest: "/manifest.json",'
      );
  }
  
  // also inject service worker registration
  const bodyCloseIdx = layoutContent.lastIndexOf('</body>');
  if (bodyCloseIdx !== -1) {
    const script = `
        <script dangerouslySetInnerHTML={{
          __html: \`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('SW registered');
                }, function(err) {
                  console.log('SW registration failed: ', err);
                });
              });
            }
          \`
        }} />\n`;
    layoutContent = layoutContent.substring(0, bodyCloseIdx) + script + layoutContent.substring(bodyCloseIdx);
  }
  fs.writeFileSync('src/app/layout.tsx', layoutContent);
}

// 4. Update page.tsx and demo/page.tsx with beforeinstallprompt logic
function updatePage(file) {
  let c = fs.readFileSync(file, 'utf8');
  
  if (!c.includes('beforeinstallprompt')) {
      // Import useEffect if needed
      if (c.includes("import { useState } from 'react';")) {
          c = c.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
      } else if (c.includes("import { useState, useEffect }") === false) {
          c = c.replace("import { useState ", "import { useState, useEffect ");
      }

      // Add deferredPrompt state
      const stateInsertPoint = c.indexOf('const handleInstallApp');
      if (stateInsertPoint !== -1) {
          const logic = `
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  `;
          c = c.substring(0, stateInsertPoint) + logic + c.substring(stateInsertPoint);
      }

      // Modify handleInstallApp
      const oldHandler = `alert('📱 모바일 홈 화면 추가 방법\\n\\n[아이폰 (Safari)]\\n하단의 공유(보내기) ⍗ 버튼을 누른 후 "홈 화면에 추가"를 선택하세요.\\n\\n[안드로이드 (Chrome)]\\n상단 메뉴(⋮)를 누른 후 "홈 화면에 추가"를 선택하세요.');`;
      const newHandler = `if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    } else {
      alert('📱 아이폰(Safari) 또는 앱 내 브라우저에서는 하단의 공유(보내기) ⍗ 버튼을 누른 후 "홈 화면에 추가"를 직접 선택해주세요.');
    }`;
      
      c = c.replace(oldHandler, newHandler);
      fs.writeFileSync(file, c);
  }
}

updatePage('src/app/page.tsx');
updatePage('src/app/demo/page.tsx');

console.log('PWA setup complete');
