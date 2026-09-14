const fs = require('fs');

const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx'
];

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');

  // Replace z-50 with z-[100] for the modal wrapper
  c = c.replace(
    /className="fixed inset-0 bg-gray-900\/40 backdrop-blur-sm z-50/g,
    'className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100]'
  );

  fs.writeFileSync(file, c);
  console.log(`Updated z-index in ${file}`);
}
