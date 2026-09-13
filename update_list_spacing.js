const fs = require('fs');

const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Add pb-12 to the main wrapper
  content = content.replace(/className="max-w-6xl mx-auto"/g, 'className="max-w-6xl mx-auto pb-12"');

  // Add min-height and flex to the list card
  content = content.replace(/className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"/g, 'className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]"');

  // Add flex-1 to the table wrapper so it pushes pagination down
  // Note: we only want to replace the first overflow-x-auto which is the table wrapper, but wait, is there another one?
  // Let's replace the one right after the card
  content = content.replace(/<div className="overflow-x-auto">/g, '<div className="overflow-x-auto flex-1">');

  fs.writeFileSync(file, content);
  console.log('Updated layout spacing in ' + file);
}
