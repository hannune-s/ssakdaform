const fs = require('fs');
let c = fs.readFileSync('src/app/landing/page.tsx', 'utf8');
c = c.replace('1년 치를 한 번에 결제하시면<br/>', '1년 치를 한 번에 결제하시면<br className="hidden sm:block" />');
fs.writeFileSync('src/app/landing/page.tsx', c);
console.log('Replaced line 561 br');
