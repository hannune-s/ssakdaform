const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /,\s*\{\s*title:\s*'고객 홍보 \(링크 & QR\)',\s*desc:\s*'우리 매장 전용 링크 및 QR코드 다운로드',\s*color:\s*'bg-pink-500'\s*\}/;

if (regex.test(page)) {
  page = page.replace(regex, '');
  fs.writeFileSync('src/app/page.tsx', page);
  console.log('Successfully removed customer promotion QR menu');
} else {
  console.log('Regex did not match!');
}
