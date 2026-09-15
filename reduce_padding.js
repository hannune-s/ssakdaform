const fs = require('fs');

let page = fs.readFileSync('src/app/store/[slug]/page.tsx', 'utf8');

// Replace padding and spacing
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

fs.writeFileSync('src/app/store/[slug]/page.tsx', page);
console.log('Updated store page padding');
