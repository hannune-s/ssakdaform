const fs = require('fs');

const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// Add LogOut import
if (!c.includes('LogOut')) {
  c = c.replace(
    "import { Search, Package, Copy, ExternalLink, Check, Home, User, ChevronRight, ArrowLeft } from 'lucide-react';",
    "import { Search, Package, Copy, ExternalLink, Check, Home, User, ChevronRight, ArrowLeft, LogOut } from 'lucide-react';"
  );
}

// Replace the old Customer Service block
const oldCustomerServiceRegex = /<div className="mt-10 mb-4">\s*<h3 className="text-lg font-bold text-gray-900">고객 서비스<\/h3>\s*<\/div>\s*<div className="bg-white rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.03\)\] border border-gray-100\/80 flex items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors">\s*<div className="ml-2 flex-1">\s*<h3 className="font-extrabold text-gray-900 text-\[15px\] sm:text-\[16px\] tracking-tight">고객 센터<\/h3>\s*<p className="text-\[13px\] text-gray-500 mt-0\.5">자주 묻는 질문 및 1:1 문의<\/p>\s*<\/div>\s*<ChevronRight className="w-5 h-5 text-gray-300 transition-colors" \/>\s*<\/div>/;

const newCustomerServiceBlock = `<div className="mt-10 mb-3">
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight px-1">고객 서비스</h3>
          </div>
          
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100/80 overflow-hidden divide-y divide-gray-100/80">
            {[
              { title: '이용 가이드', type: 'normal' },
              { title: '1:1 문의', type: 'normal' },
              { title: '본사 공지사항', type: 'notice' },
              { title: '로그아웃', type: 'logout' }
            ].map((menu, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className={\`font-bold text-[15px] sm:text-[16px] \${menu.type === 'logout' ? 'text-red-500' : 'text-gray-900'}\`}>
                    {menu.title}
                  </span>
                  {menu.type === 'notice' && (
                    <span className="flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full leading-none mt-0.5">
                      N
                    </span>
                  )}
                </div>
                {menu.type === 'logout' ? (
                  <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 mb-20 flex flex-col items-center justify-center space-y-2">
            <span className="text-[12px] font-medium text-gray-400 tracking-wide">싹다폼 v1.0.0</span>
            <button className="text-[12px] font-medium text-gray-400 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-500 pb-0.5">
              서비스 탈퇴하기
            </button>
          </div>`;

if (c.match(oldCustomerServiceRegex)) {
  c = c.replace(oldCustomerServiceRegex, newCustomerServiceBlock);
  fs.writeFileSync(file, c);
  console.log('Successfully updated customer service menus!');
} else {
  console.log('Regex did not match.');
  // Fallback
  const startIndex = c.indexOf('<div className="mt-10 mb-4">');
  if (startIndex !== -1) {
    const endStr = '</div>\n        </div>\n      )}\n\n    </div>';
    const endIndex = c.indexOf(endStr);
    if (endIndex !== -1) {
      c = c.substring(0, startIndex) + newCustomerServiceBlock + '\n        </div>\n      )}\n\n    </div>\n  );\n}';
      fs.writeFileSync(file, c);
      console.log('Updated via fallback');
    }
  }
}
