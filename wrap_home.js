const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

const targetStr = '<div className="w-full min-h-screen bg-gray-50 flex flex-col pt-12 sm:pt-16 px-4 pb-24">';
const replaceStr = `<div className="w-full min-h-screen bg-gray-50 flex flex-col px-4 pb-24">
      {activeTab !== 'my' && (
        <div className="pt-12 sm:pt-16 flex flex-col w-full">`;

if (c.includes(targetStr)) {
  c = c.replace(targetStr, replaceStr);
  c = c.replace('{/* 마이 메뉴 컨텐츠 */}', '</div>\n      )}\n\n      {/* 마이 메뉴 컨텐츠 */}');
  fs.writeFileSync('src/app/page.tsx', c);
  console.log('Successfully wrapped home content');
} else {
  console.log('Failed to find target wrapper');
}
