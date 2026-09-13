const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      const content = fs.readFileSync(p, 'utf8');
      if (content.includes('type="time"') || content.includes("type='time'")) {
        console.log('FOUND IN:', p);
      }
    }
  }
}
walk('src');
console.log('Search done');
