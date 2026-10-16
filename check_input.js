const fs = require('fs');
const text = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8');
const idx = text.indexOf("field.type === 'time'");
console.log(text.substring(idx - 1000, idx + 1500));
