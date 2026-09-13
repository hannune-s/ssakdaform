const fs = require('fs');

const file = 'src/app/preview/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\s*accounts\.length > 0 && \([\s\S]*?<\/div>\s*\)\s*\}/;

const newBlock = `{accounts.length > 0 && (
            <div className="mb-8 bg-[#F0F4FF] border border-indigo-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3.5">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <h2 className="font-bold text-indigo-900 text-[14px]">계좌 안내</h2>
              </div>
              
              <div className="space-y-3">
                {accounts.map((acc, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 flex-1">
                      <span className="text-[13px] font-bold text-indigo-600">{acc.bank}</span>
                      <span className="text-[17px] font-bold font-mono text-gray-900 tracking-tight">{acc.accountNumber}</span>
                      <span className="text-[13px] font-medium text-gray-500">{acc.holder}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleCopyAccount(acc.accountNumber)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm border border-indigo-50"
                    >
                      {copiedAccount === acc.accountNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      <span>{copiedAccount === acc.accountNumber ? '복사됨' : '복사'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}`;

content = content.replace(regex, newBlock);
fs.writeFileSync(file, content);
console.log('Replaced successfully');
