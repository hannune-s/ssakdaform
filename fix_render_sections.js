const fs = require('fs');
let c = fs.readFileSync('src/app/custom-list/page.tsx', 'utf8');

c = c.replace(
  /\{renderSection\('상품 및 주문 정보', orderEntries, true\)\}\s*\{renderSection\('고객 정보', customerEntries, false\)\}\s*\{renderSection\('기타 요청사항', otherEntries, false\)\}/,
  `{renderSection("고객 정보", customerEntries, true)}\n                        {renderSection("상세 입력 내용", otherEntries, false)}`
);

fs.writeFileSync('src/app/custom-list/page.tsx', c);
console.log('Fixed render sections');
