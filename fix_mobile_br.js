const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// The lines we want to change:
const targets = [
  "고무장갑 벗고 전화할 필요 없는,<br />1초 만에 끝나는 스마트 접수",
  "우리 매장의 품격을 높이는<br />고급스러운 브랜드 경험",
  "버려지던 종이 조각이 '단골 자산'으로!<br />자동 고객 관리 시스템",
  "어떤 현장이든 내 입맛대로 뚝딱!<br />무한 확장 '간편폼 만들기'",
  "스마트폰 홈 화면에 톡!<br />언제 어디서나 확인하고 척척 출력",
  "더 이상 아날로그 접수에<br />시간 뺏기지 마세요"
];

targets.forEach(t => {
  const repl = t.replace("<br />", "<br className=\"hidden sm:block\" />");
  c = c.replace(t, repl);
});

// For hero section
c = c.replace("접수부터 관리까지<br />", "접수부터 관리까지<br className=\"hidden sm:block\" />");

fs.writeFileSync(file, c);
console.log('Fixed mobile br tags');
