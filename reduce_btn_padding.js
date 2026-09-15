const fs = require('fs');

let page = fs.readFileSync('src/app/store/[slug]/page.tsx', 'utf8');

page = page.replace(
  'className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm border border-indigo-50"',
  'className="flex items-center justify-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm border border-indigo-50"'
);

fs.writeFileSync('src/app/store/[slug]/page.tsx', page);
console.log('Updated store page copy button padding');
