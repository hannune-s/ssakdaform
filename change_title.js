const fs = require('fs');
let page = fs.readFileSync('src/app/store/[slug]/page.tsx', 'utf8');

page = page.replace(
  '이벤트 & 기획전 (커스텀 폼 예시)',
  '매장 맞춤 신청서'
);

fs.writeFileSync('src/app/store/[slug]/page.tsx', page);
console.log('Successfully changed the title');
