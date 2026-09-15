const fs = require('fs');
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace('manifest: "/manifest.json?v=4"', 'manifest: "/manifest.json?v=5"');
fs.writeFileSync('src/app/layout.tsx', layout);
console.log('Updated cache buster to v5');
