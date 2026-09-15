const fs = require('fs');
const file = 'src/app/subscription/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace('매월 정기 결제됩니다.', '1개월 이용권이 1회 단독 결제됩니다.');

fs.writeFileSync(file, c);
console.log('Successfully updated subscription text');
