const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /(<div className="w-full max-w-6xl mx-auto flex-1">[\s\S]*?<\/div>)\s*\{\/\* 앱 하단 네비게이션 바 \(홈 \/ 마이\) \*\/\}[\s\S]*?<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-\[0_-5px_15px_-10px_rgba\(0,0,0,0\.05\)\] z-50 h-16 sm:h-16">[\s\S]*?<\/div>\s*<\/div>\s*\)\}/;

const match = c.match(regex);
if (match) {
  const contentArea = match[1];
  const replacement = contentArea + `
        </div>
      )}

      {/* 앱 하단 네비게이션 바 (홈 / 마이) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-50 h-16 sm:h-16">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={\`flex flex-col items-center justify-center w-full h-full space-y-1 \${activeTab !== 'my' && activeTab !== 'account' && activeTab !== 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}\`}
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">홈</span>
        </button>
        <button 
          onClick={() => setActiveTab('my')}
          className={\`flex flex-col items-center justify-center w-full h-full space-y-1 \${activeTab === 'my' || activeTab === 'account' || activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}\`}
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">마이</span>
        </button>
      </div>`;
      
  c = c.replace(regex, replacement);
  fs.writeFileSync('src/app/page.tsx', c);
  console.log("Successfully fixed the bottom nav!");
} else {
  console.log("Failed to match regex in JS.");
}
