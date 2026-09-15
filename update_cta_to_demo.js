const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

let lines = c.split('\n');

const btn1Idx = lines.findIndex(l => l.includes('무료로 시작하기') && l.includes('<ArrowRight'));
if (btn1Idx !== -1) {
  lines[btn1Idx] = lines[btn1Idx].replace('무료로 시작하기', '어드민 체험하기');
  // Find href slightly above
  let hrefIdx = btn1Idx;
  while (hrefIdx > 0 && !lines[hrefIdx].includes('href="/signup"')) {
    hrefIdx--;
  }
  if (hrefIdx > 0) {
    lines[hrefIdx] = lines[hrefIdx].replace('href="/signup"', 'href="/demo"');
  }
}

const btn2Idx = lines.findIndex((l, i) => i > btn1Idx && l.includes('무료로 시작하기') && l.includes('<ArrowRight'));
if (btn2Idx !== -1) {
  lines[btn2Idx] = lines[btn2Idx].replace('무료로 시작하기', '어드민 체험하기');
  let hrefIdx = btn2Idx;
  while (hrefIdx > 0 && !lines[hrefIdx].includes('href="/signup"')) {
    hrefIdx--;
  }
  if (hrefIdx > 0) {
    lines[hrefIdx] = lines[hrefIdx].replace('href="/signup"', 'href="/demo"');
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Successfully updated landing page buttons to demo');
