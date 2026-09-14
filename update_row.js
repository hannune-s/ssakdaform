const fs = require('fs');

const file = 'src/app/settings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// Regex to find the whole account map loop body
const regex = /<div key=\{index\} className="p-4 border border-gray-200 rounded-xl bg-gray-50\/50 flex flex-col md:flex-row md:items-end gap-3 relative group">([\s\S]*?)<\/button>\s*<\/div>/g;

const newBlock = `<div key={index} className="p-3 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-row items-end gap-1.5 relative group w-full">
                <div className="w-[25%] shrink-0">
                  <label className="block text-[10px] sm:text-[11px] font-semibold text-gray-500 mb-1">은행명</label>
                  <input 
                    type="text" 
                    value={account.bank}
                    onChange={(e) => handleChange(index, 'bank', e.target.value)}
                    className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm"
                    placeholder="국민은행"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] sm:text-[11px] font-semibold text-gray-500 mb-1">계좌번호</label>
                  <input 
                    type="text" 
                    value={account.accountNumber}
                    onChange={(e) => handleChange(index, 'accountNumber', e.target.value)}
                    className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm font-mono"
                    placeholder="123-456-7890"
                  />
                </div>
                
                <div className="w-[22%] sm:w-[25%] shrink-0">
                  <label className="block text-[10px] sm:text-[11px] font-semibold text-gray-500 mb-1">예금주</label>
                  <input 
                    type="text" 
                    value={account.holder}
                    onChange={(e) => handleChange(index, 'holder', e.target.value)}
                    className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm"
                    placeholder="홍길동"
                  />
                </div>

                <button 
                  onClick={() => handleRemoveAccount(index)}
                  className="p-1.5 mb-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="계좌 삭제"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>`;

if (c.match(regex)) {
  c = c.replace(regex, newBlock);
  fs.writeFileSync(file, c);
  console.log("Successfully updated account input layout.");
} else {
  console.log("Could not match the block. Dumping context to manually verify.");
}
