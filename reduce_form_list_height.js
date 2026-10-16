const fs = require('fs');

let page = fs.readFileSync('src/app/form-builder/page.tsx', 'utf8');

// 1. Reduce space between items
page = page.replace('className="space-y-3"', 'className="space-y-2"');

// 2. Reduce vertical padding of each item from p-4 to px-4 py-2.5
page = page.replace(
  /className="flex items-center justify-between p-4 rounded-xl/g,
  'className="flex items-center justify-between px-4 py-2.5 rounded-xl'
);

// 3. Reduce button vertical padding from py-2 to py-1.5
page = page.replace(
  /className="px-3 sm:px-4 py-2 text-sm font-bold text-red-600/g,
  'className="px-3 sm:px-4 py-1.5 text-[13px] font-bold text-red-600'
);

fs.writeFileSync('src/app/form-builder/page.tsx', page);
console.log('Successfully reduced vertical height of saved forms list items');
