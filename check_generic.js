const fs = require('fs');
const lines = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('type={field.type === \'phone\' ? \'tel\' : field.type}'));
console.log(lines.slice(idx - 5, idx + 10).join('\n'));
