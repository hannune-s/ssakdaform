const fs = require('fs');

let page = fs.readFileSync('src/app/store/[slug]/page.tsx', 'utf8');

page = page.replace(
  "if (savedStoreInfo) { setStoreInfo(JSON.parse(savedStoreInfo)); }",
  `if (savedStoreInfo) { 
        setStoreInfo(JSON.parse(savedStoreInfo)); 
      } else {
        setStoreInfo({
          name: '싹다폼 (데모 상호명)',
          address: '서울시 서초구 (데모 주소)',
          phone: '010-1234-5678',
          hours: '09:00 ~ 18:00',
          closedDays: '일요일',
          paymentLink: ''
        });
      }`
);

fs.writeFileSync('src/app/store/[slug]/page.tsx', page);

let preview = fs.readFileSync('src/app/preview/page.tsx', 'utf8');

preview = preview.replace(
  "if (savedStoreInfo) { setStoreInfo(JSON.parse(savedStoreInfo)); }",
  `if (savedStoreInfo) { 
        setStoreInfo(JSON.parse(savedStoreInfo)); 
      } else {
        setStoreInfo({
          name: '싹다폼 (데모 상호명)',
          address: '서울시 서초구 (데모 주소)',
          phone: '010-1234-5678',
          hours: '09:00 ~ 18:00',
          closedDays: '일요일',
          paymentLink: ''
        });
      }`
);

fs.writeFileSync('src/app/preview/page.tsx', preview);

console.log('Added fallback store data');
