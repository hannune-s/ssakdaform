const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  
  const pattern1 = /<div key=\{key\}>\s*<div className=\"text-xs font-bold text-\[?#[a-zA-Z0-9]+\]? mb-1\.5\">\s*(\{.*?\})\s*<\/div>\s*<div className=\"text-sm text-\[?#[a-zA-Z0-9]+\]? font-medium bg-white border border-\[?#[a-zA-Z0-9]+\]? p-3 rounded-xl whitespace-pre-wrap\">\s*\{value \|\| \'\-\'\}\s*<\/div>\s*<\/div>/g;
  
  const pattern2 = /<div key=\{key\}>\s*<div className=\"text-xs font-bold text-[a-zA-Z0-9]+-500 mb-1\.5\">\s*(\{.*?\})\s*<\/div>\s*<div className=\"text-sm text-[a-zA-Z0-9]+-900 font-medium bg-white border border-[a-zA-Z0-9]+-200 p-3 rounded-xl whitespace-pre-wrap\">\s*\{value \|\| \'\-\'\}\s*<\/div>\s*<\/div>/g;

  function repl(match, keyExp) {
    return `{(() => {
                                const isHighlight = /이름|고객명|연락처|입금자명|전화번호|상품명|예약 날짜|예약 시간/.test(key);
                                return (
                                  <div key={key} className="flex flex-col mb-1.5">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="w-1 h-3.5 bg-indigo-500 rounded-full"></div>
                                      <div className="text-[14px] font-extrabold text-gray-800">{${keyExp.replace(/[{}]/g, '')}}</div>
                                    </div>
                                    <div className={\`p-3.5 rounded-xl border \${isHighlight ? 'bg-indigo-50 border-indigo-200 text-indigo-900 text-[15px] font-extrabold shadow-sm' : 'bg-gray-50/80 border-gray-100 text-gray-800 text-[14px]'} whitespace-pre-wrap\`}>
                                      {value || '-'}
                                    </div>
                                  </div>
                                );
                              })()}`;
  }
                              
  content = content.replace(pattern1, repl);
  content = content.replace(pattern2, repl);

  fs.writeFileSync(path, content, 'utf8');
}

processFile('src/app/delivery-list/page.tsx');
processFile('src/app/reservation-list/page.tsx');
processFile('src/app/order-list/page.tsx');
