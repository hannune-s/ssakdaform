const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/href="\/"(\s+className="text-sm font-bold text-gray-600)/g, 'href="/login"$1');

fs.writeFileSync(file, c);
console.log('Successfully updated login link in landing page');
