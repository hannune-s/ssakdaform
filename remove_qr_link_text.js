const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace("'아날로그 접수 혁신 (QR/링크 결제)'", "'아날로그 접수 혁신'");

fs.writeFileSync(file, c);
console.log('Successfully updated pricing benefits text');
