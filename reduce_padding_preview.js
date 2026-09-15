const fs = require('fs');

let page = fs.readFileSync('src/app/preview/page.tsx', 'utf8');

page = page.replace(
  'className="mb-8 bg-[#F0F4FF] border border-indigo-200 rounded-2xl p-5"',
  'className="mb-8 bg-[#F0F4FF] border border-indigo-200 rounded-2xl px-4 py-3.5"'
);

page = page.replace(
  'className="flex items-center gap-2 mb-3.5"',
  'className="flex items-center gap-2 mb-2"'
);

page = page.replace(
  '<div className="space-y-3">',
  '<div className="space-y-1.5">'
);

page = page.replace(
  'className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm border border-indigo-50"',
  'className="flex items-center justify-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm border border-indigo-50"'
);

fs.writeFileSync('src/app/preview/page.tsx', page);
console.log('Updated preview page padding');
