const fs = require('fs');
const file = 'src/app/form/[id]/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = "formDescription: '주문 전에 반드시 공지사항을 확인해주세요. 제작 기간은 영업일 기준 3~5일 소요됩니다.',\n";

if (c.includes(target)) {
    c = c.replace(target, '');
} else {
    // Try matching without newline just in case
    const targetFallback = "formDescription: '주문 전에 반드시 공지사항을 확인해주세요. 제작 기간은 영업일 기준 3~5일 소요됩니다.',";
    c = c.replace(targetFallback, '');
}

fs.writeFileSync(file, c);
console.log('Removed formDescription from order-preset');
