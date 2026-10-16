const fs = require('fs');
const lines = fs.readFileSync('src/app/form-builder/page.tsx', 'utf8').split('\n');
const idx = lines.findLastIndex(l => l.includes('ssakdaform_draft'));
console.log(lines.slice(idx - 10, idx + 15).join('\n'));
