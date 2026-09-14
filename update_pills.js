const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

c = c.replace(/>\s*맞춤형 폼 만들기\s*<\/button>/g, '>간편폼 만들기</button>');
c = c.replace(/>\s*택배현황\s*<\/button>/g, '>택배접수</button>');
c = c.replace(/>\s*예약현황\s*<\/button>/g, '>예약접수</button>');
c = c.replace(/>\s*주문현황\s*<\/button>/g, '>상품접수</button>');
c = c.replace(/>\s*맞춤현황\s*<\/button>/g, '>간편폼접수</button>');

fs.writeFileSync('src/app/page.tsx', c);
console.log('Updated pill buttons in page.tsx');
