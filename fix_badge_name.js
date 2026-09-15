const fs = require('fs');
const file = 'src/app/components/DashboardWidget.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/type: '주문', name: '김철수 님'/, "type: '상품', name: '김철수 님'");
fs.writeFileSync(file, c);
console.log('Fixed type name from 주문 to 상품');
