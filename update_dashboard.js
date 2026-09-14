const fs = require('fs');
let d = fs.readFileSync('src/app/components/DashboardWidget.tsx', 'utf8');

d = d.replace(/name: '택배'/g, "name: '택배접수'");
d = d.replace(/name: '예약'/g, "name: '예약접수'");
d = d.replace(/name: '주문'/g, "name: '상품접수'");
d = d.replace(/name: '맞춤'/g, "name: '간편폼접수'");

fs.writeFileSync('src/app/components/DashboardWidget.tsx', d);
console.log('Updated DashboardWidget stats');
