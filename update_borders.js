const fs = require('fs');
const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/border border-indigo-100\/70/g, 'border border-indigo-200 shadow-sm');
c = c.replace(/border border-gray-200 rounded-xl/g, 'border border-gray-300 rounded-xl shadow-sm');

fs.writeFileSync(file, c);
console.log('Successfully updated borders');
