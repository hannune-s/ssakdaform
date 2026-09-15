const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = `싹다폼 어드민 체험하기 <ArrowRight className="w-5 h-5" />`;
const newStr = `무료로 시작하기 <ArrowRight className="w-5 h-5" />`;

c = c.replace(target, newStr);

// update the href from /demo to /signup for that button
c = c.replace(/href="\/demo"(\s+className="inline-flex items-center gap-2 bg-blue-600)/g, 'href="/signup"$1');

fs.writeFileSync(file, c);
console.log('Successfully updated landing bottom CTA');
