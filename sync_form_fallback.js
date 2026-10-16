const fs = require('fs');

let page = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8');

page = page.replace(
  "if (savedStoreInfo) { setStoreInfo(JSON.parse(savedStoreInfo)); }",
  `if (savedStoreInfo) { 
        setStoreInfo(JSON.parse(savedStoreInfo)); 
      } else {
        setStoreInfo({
          name: '싹다폼 (데모 상호명)',
          ownerName: '홍길동',
          address: '서울시 서초구 (데모 주소)',
          phone: '010-1234-5678',
          hours: '09:00 ~ 18:00',
          closedDays: '일요일',
          paymentLink: ''
        });
      }`
);

fs.writeFileSync('src/app/form/[id]/page.tsx', page);
console.log('Added fallback store info to form page');
