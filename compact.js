const fs = require('fs');

function compactList(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  // Title section
  c = c.replace(/className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">[\s\S]*?<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">/g, 
    'className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-3">\n        <div>\n          <h1 className="text-[19px] md:text-xl font-bold text-gray-900 mb-1">');
  
  c = c.replace(/<p className="text-gray-500">/g, '<p className="text-[13px] text-gray-500">');
  
  // Table headers
  c = c.replace(/className="bg-indigo-50 border-b border-indigo-100"/g, 'className="bg-indigo-50/70 border-b border-indigo-100"');
  c = c.replace(/<th className="px-5 py-4 text-sm/g, '<th className="px-4 py-3 text-[13px]');
  
  // Table rows hover
  c = c.replace(/className="hover:bg-gray-50\/50 transition"/g, 'className="hover:bg-gray-50 transition-colors group"');
  
  // Table columns padding
  c = c.replace(/<td className="px-5 py-4">/g, '<td className="px-4 py-3 align-middle">');
  c = c.replace(/<td className="px-5 py-4 text-right">/g, '<td className="px-4 py-3 text-right align-middle">');

  // Buttons
  c = c.replace(/className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border transition-colors/g, 
    'className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors');
  c = c.replace(/className="w-3.5 h-3.5 mr-1"/g, 'className="w-3 h-3 mr-1"');
  c = c.replace(/className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold/g, 
    'className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-[12px] font-bold');

  // Formatting text sizes inside td
  c = c.replace(/text-sm text-gray-900 font-medium/g, 'font-semibold text-gray-900 text-[13px]');
  c = c.replace(/text-xs text-gray-500 mt-1/g, 'text-[12px] text-gray-500 mt-0.5');
  
  c = c.replace(/text-sm font-bold text-slate-800 mb-1/g, 'font-bold text-gray-900 text-[13px]');
  c = c.replace(/text-sm text-slate-500 font-mono/g, 'text-[12px] text-gray-500 mt-0.5');
  
  c = c.replace(/text-sm font-bold text-\[\#5C4D3C\] mb-1/g, 'font-bold text-gray-900 text-[13px]');
  c = c.replace(/text-sm text-gray-600/g, 'text-[12px] text-gray-500 mt-0.5');
  
  // Title attribute on button
  c = c.replace(/title="상태를 변경하려면 클릭하세요"/g, 'title="상태를 변경하시려면 클릭하세요"');

  fs.writeFileSync(filePath, c);
}

compactList('src/app/order-list/page.tsx');
compactList('src/app/reservation-list/page.tsx');
