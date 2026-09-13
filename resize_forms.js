const fs = require('fs');

const files = [
  'src/app/form/[id]/page.tsx',
  'src/app/preview/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Container width
  content = content.replace(/max-w-lg/g, 'max-w-md');

  // Header padding
  content = content.replace(/px-5 sm:px-8 py-10 sm:py-12/g, 'px-5 sm:px-6 py-8 sm:py-9');

  // Main body padding
  content = content.replace(/px-4 sm:px-10 py-6 sm:py-10/g, 'px-4 sm:px-6 py-5 sm:py-7');

  // Field margin
  content = content.replace(/mb-5 last:mb-0/g, 'mb-4 last:mb-0');

  // Group padding
  content = content.replace(/p-4 sm:p-7/g, 'p-4 sm:p-5');

  // Group spacing
  content = content.replace(/space-y-8/g, 'space-y-5');

  // Group title
  content = content.replace(/mb-5 text-lg flex items-center/g, 'mb-3.5 text-base flex items-center');
  
  // Input padding/text size
  content = content.replace(/p-3\.5 sm:p-4 text-\[15px\]/g, 'p-3 sm:p-3.5 text-[14px] sm:text-[15px]');
  
  // Input min-height
  content = content.replace(/min-h-\[50px\] sm:min-h-\[56px\]/g, 'min-h-[46px] sm:min-h-[50px]');

  fs.writeFileSync(file, content);
}
console.log('Resized forms successfully');
