const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/href="\/demo"/g, 'href="/signup"');

fs.writeFileSync(file, c);
console.log('Successfully updated all demo links to signup in landing page');
