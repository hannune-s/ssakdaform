const fs = require('fs');

const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx'
];

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');

  // Replace text-[12px] text-gray-500 mt-0.5 with text-[12.5px] font-bold text-indigo-600 mt-0.5
  // I will use text-[12.5px] font-semibold text-indigo-600 to make it slightly larger, bolder, and colored
  
  c = c.replace(/className="text-\[12px\] text-gray-500 mt-0\.5"/g, 'className="text-[12.5px] font-semibold text-indigo-600 mt-0.5"');
  
  fs.writeFileSync(file, c);
  console.log(`Updated secondary text in ${file}`);
}
