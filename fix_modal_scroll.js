const fs = require('fs');

const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx'
];

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');

  // Fix flexbox scrolling bug by adding min-h-0
  c = c.replace(
    'className="p-6 overflow-y-auto print-area bg-gray-100 flex-1"',
    'className="p-6 overflow-y-auto print-area bg-gray-100 flex-1 min-h-0"'
  );

  fs.writeFileSync(file, c);
  console.log(`Added min-h-0 to ${file}`);
}
