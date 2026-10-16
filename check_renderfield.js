const fs = require('fs');
const text = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8');
const idx = text.indexOf("const renderField =");
console.log(text.substring(idx, idx + 4000));
