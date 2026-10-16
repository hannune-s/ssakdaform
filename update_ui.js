const fs = require('fs');

const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx',
  'src/app/custom-list/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Regex to match the wrapping div around the status button
  const statusRegex = /<div className="flex flex-col gap-1\.5 items-start">([\s\S]*?)<button\s+onClick=\{\(\) => cancelStatus[\s\S]*?<\/button>\s*\)\}\s*<\/div>/;
  
  const match = content.match(statusRegex);
  if (match) {
    const buttonOnly = match[1].trim(); // This is just the status button
    content = content.replace(statusRegex, buttonOnly);
  }

  // Regex to match the action td (상세 내용)
  const actionRegex = /<td className="px-4 py-3 text-right align-middle">\s*<button[\s\S]*?상세 내용\s*<\/button>\s*<\/td>/;
  
  const newAction = `<td className="px-4 py-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-2">
                          {res.status !== '취소됨' && (
                            <button 
                              onClick={() => cancelStatus(res.id)} 
                              className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-[12px] font-bold transition-all"
                            >
                              주문 취소
                            </button>
                          )}
                          <button 
                            onClick={() => openDetails(res)}
                            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                          >
                            상세 내용
                          </button>
                        </div>
                      </td>`;

  content = content.replace(actionRegex, newAction);

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
});
