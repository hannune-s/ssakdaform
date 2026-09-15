const fs = require('fs');

let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

const targetScript = `if ('serviceWorker' in navigator) {`;
const newScript = `
            window.deferredPrompt = null;
            window.addEventListener('beforeinstallprompt', function(e) {
              e.preventDefault();
              window.deferredPrompt = e;
            });
            if ('serviceWorker' in navigator) {`;
            
layout = layout.replace(targetScript, newScript);
fs.writeFileSync('src/app/layout.tsx', layout);
console.log('Fixed layout.tsx global deferredPrompt');
