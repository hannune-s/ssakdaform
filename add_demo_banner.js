const fs = require('fs');
const file = 'src/app/demo/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = `<div className="w-full min-h-screen bg-gray-50 flex flex-col px-4 pb-24">`;
const newStr = `<div className="w-full min-h-screen bg-gray-50 flex flex-col px-4 pb-24 pt-12 sm:pt-0">
      
      {/* 체험판 안내 상단 배너 */}
      <div className="fixed top-0 left-0 right-0 bg-indigo-600 text-white py-2.5 px-4 z-[100] flex items-center justify-center gap-2 sm:gap-4 shadow-md">
         <span className="text-[13px] sm:text-sm font-medium opacity-90 hidden sm:inline">현재 데모(체험용) 어드민 화면을 보고 계십니다.</span>
         <span className="text-[13px] sm:text-sm font-medium opacity-90 sm:hidden">데모 체험 모드입니다.</span>
         <a href="/signup" className="text-[12px] sm:text-[13px] font-bold bg-white text-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-50 transition-colors shadow-sm active:scale-95 shrink-0">
           지금 바로 시작하기
         </a>
      </div>
`;

if (c.includes(target)) {
  c = c.replace(target, newStr);
  fs.writeFileSync(file, c);
  console.log('Successfully added top conversion banner to demo page');
} else {
  console.log('Target string not found in demo page');
}
