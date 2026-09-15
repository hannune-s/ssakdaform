const fs = require('fs');

const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetRegex = /\{\/\* 🔹 하단 네비게이션바 \(홈 \/ 마이\) \*\/\}[\s\S]*?<\/div>\s*<\/div>/;

const newBottomNav = `{/* 🔹 하단 네비게이션바 (홈 / 랜딩) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-50 h-16 sm:h-16">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={\`flex flex-col items-center justify-center w-full h-full space-y-1 \${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}\`}
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">대시보드</span>
        </button>
        <button 
          onClick={() => window.location.href = '/landing'}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-600"
        >
          <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">소개 페이지</span>
        </button>
      </div>`;

if (targetRegex.test(c)) {
    c = c.replace(targetRegex, newBottomNav);
    fs.writeFileSync(file, c);
    console.log('Successfully updated bottom nav');
} else {
    console.log('Could not find bottom nav block');
}
