const fs = require('fs');

let c = fs.readFileSync('src/app/page.tsx', 'utf8');

c = c.replace(
    /'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'/g,
    "'bg-indigo-50/60 text-indigo-800 hover:bg-indigo-100/60 border border-indigo-100/70'"
);

fs.writeFileSync('src/app/page.tsx', c);
console.log('Pill buttons updated to pastel tone');
