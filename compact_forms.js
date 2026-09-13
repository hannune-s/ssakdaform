const fs = require('fs');

const files = [
  'src/app/form/[id]/page.tsx',
  'src/app/preview/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Slimmer inputs
  content = content.replace(/w-full px-4 py-3 rounded-xl/g, 'w-full px-3.5 py-2.5 text-[14px] rounded-xl');

  // 2. Smaller labels
  content = content.replace(/block text-sm font-bold mb-2/g, 'block text-[13px] font-bold mb-1.5');

  // 3. Tighter field margins
  content = content.replace(/mb-4 last:mb-0/g, 'mb-3.5 last:mb-0');

  // 4. Smaller group padding on mobile
  content = content.replace(/p-4 sm:p-5/g, 'p-3.5 sm:p-5');

  // 5. Smaller header height
  content = content.replace(/px-5 sm:px-6 py-8 sm:py-9/g, 'px-4 sm:px-6 py-6 sm:py-8');

  // 6. Smaller header title
  content = content.replace(/text-2xl sm:text-3xl font-extrabold/g, 'text-xl sm:text-2xl font-extrabold');

  // 7. Smaller inner container padding
  content = content.replace(/px-4 sm:px-6 py-5 sm:py-7/g, 'px-3 sm:px-6 py-4 sm:py-7');
  
  // 8. Tighter checkbox padding
  content = content.replace(/gap-3 p-4 rounded-xl/g, 'gap-2.5 p-3 rounded-xl');
  content = content.replace(/w-5 h-5 mt-0\.5/g, 'w-4.5 h-4.5 mt-0.5');

  fs.writeFileSync(file, content);
}
console.log('Done!');
