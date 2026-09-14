const fs = require('fs');

const file = 'src/app/form-builder/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">\s*<h3 className="font-semibold text-\[15px\] text-gray-800 mb-3 border-b pb-2">기본 정보 설정<\/h3>/;
const newStr = `<div className="bg-indigo-50/50 p-4 sm:p-5 rounded-xl border border-indigo-100 shadow-sm">\n            <h3 className="font-semibold text-[15px] text-indigo-900 mb-3 border-b border-indigo-100 pb-2">기본 정보 설정</h3>`;

if (content.match(regex)) {
  content = content.replace(regex, newStr);
  fs.writeFileSync(file, content);
  console.log("Header fixed!");
} else {
  console.log("Still no match for header");
}
