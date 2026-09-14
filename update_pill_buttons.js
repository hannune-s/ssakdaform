const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

c = c.replace(/>\s*택배 신청 현황\s*<\/button>/g, '>택배현황</button>');
c = c.replace(/>\s*매장 예약 현황\s*<\/button>/g, '>예약현황</button>');
c = c.replace(/>\s*상품 주문 현황\s*<\/button>/g, '>주문현황</button>');
c = c.replace(/>\s*맞춤 주문 현황\s*<\/button>/g, '>맞춤현황</button>');

fs.writeFileSync('src/app/page.tsx', c);
console.log('Updated button text');
