const fs = require('fs');
const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix missing div
  content = content.replace(
    /\{\/\* Pagination Controls \*\/\}/,
    `</div>\n      {/* Pagination Controls */}`
  );

  fs.writeFileSync(file, content);
}
