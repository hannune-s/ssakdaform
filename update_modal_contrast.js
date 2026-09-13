const fs = require('fs');

const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Change modal content wrapper background
  content = content.replace(/bg-\[#F8FAFC\]/g, 'bg-gray-100');
  
  // Change status card shadow and border
  content = content.replace(/shadow-sm border border-gray-100 flex justify-between items-center/g, 'shadow-md border-0 ring-1 ring-gray-200/60 flex justify-between items-center');

  // Change renderSection cards to have better 3D depth
  // The line looks like: <div className={`bg-white border ${isHighlightStyle ? 'border-indigo-100' : 'border-gray-200'} rounded-2xl p-6 shadow-sm`}>
  // or <div className={`bg-white border ${isReceiver ? 'border-indigo-100' : 'border-gray-200'} rounded-2xl p-6 shadow-sm`}> // in delivery-list
  content = content.replace(/rounded-2xl p-6 shadow-sm/g, 'rounded-2xl p-6 shadow-md shadow-gray-200/50 border-0 ring-1 ring-gray-200/70');

  // For delivery-list which has isReceiver instead of isHighlightStyle
  content = content.replace(/\${isReceiver \? 'border-indigo-100' : 'border-gray-200'}/g, `\${isReceiver ? 'ring-indigo-100 shadow-indigo-100/50' : ''}`);
  
  // For reservation and order which have isHighlightStyle
  content = content.replace(/\${isHighlightStyle \? 'border-indigo-100' : 'border-gray-200'}/g, `\${isHighlightStyle ? 'ring-indigo-100 shadow-indigo-100/50' : ''}`);

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
}
