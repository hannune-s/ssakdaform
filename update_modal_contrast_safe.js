const fs = require('fs');

const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Change modal content wrapper background from #F8FAFC to #F3F4F6 (gray-100)
  content = content.replace(/bg-\[#F8FAFC\]/g, 'bg-gray-100');
  
  // Enhance status card
  content = content.replace(
    /bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100 flex justify-between items-center/g, 
    'bg-white rounded-2xl p-5 mb-6 shadow-md shadow-gray-200/50 flex justify-between items-center'
  );

  // Enhance renderSection cards
  // delivery-list uses isReceiver
  content = content.replace(
    /className=\{\`bg-white border \$\{isReceiver \? 'border-indigo-100' : 'border-gray-200'\} rounded-2xl p-6 shadow-sm\`\}/g,
    'className={`bg-white rounded-2xl p-6 shadow-md ${isReceiver ? "shadow-indigo-100/50 border border-indigo-100" : "shadow-gray-200/50 border border-transparent"}`}'
  );

  // reservation-list and order-list use isHighlightStyle
  content = content.replace(
    /className=\{\`bg-white border \$\{isHighlightStyle \? 'border-indigo-100' : 'border-gray-200'\} rounded-2xl p-6 shadow-sm\`\}/g,
    'className={`bg-white rounded-2xl p-6 shadow-md ${isHighlightStyle ? "shadow-indigo-100/50 border border-indigo-100" : "shadow-gray-200/50 border border-transparent"}`}'
  );

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
}
