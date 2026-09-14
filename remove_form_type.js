const fs = require('fs');

let c = fs.readFileSync('src/app/custom-list/page.tsx', 'utf8');

// Replace table header
c = c.replace(
  /<th className="px-4 py-3 text-left text-\[12px\] font-extrabold text-gray-500 tracking-wider">이름 \/ 폼 종류<\/th>/g,
  '<th className="px-4 py-3 text-left text-[12px] font-extrabold text-gray-500 tracking-wider">이름</th>'
);

// Remove the formTitle div
c = c.replace(
  /<div className="text-\[11px\] font-medium text-gray-400 mt-0\.5 truncate max-w-\[120px\]" title=\{formTitle\}>\{formTitle\}<\/div>\s*/g,
  ''
);

fs.writeFileSync('src/app/custom-list/page.tsx', c);
console.log('Removed form type from CustomList');
