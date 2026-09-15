const fs = require('fs');
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace('manifest: "/manifest.json?v=2"', 'manifest: "/manifest.json?v=3"');
fs.writeFileSync('src/app/layout.tsx', layout);
console.log('Updated cache buster to v3');
