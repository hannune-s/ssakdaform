const fs = require('fs');

const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const bottomNav = `
      {/* 🔹 하단 네비게이션바 (홈 / 마이) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-50 h-16 sm:h-16">
        <button 
          onClick={() => setActiveTab('builder')}
          className={\`flex flex-col items-center justify-center w-full h-full space-y-1 \${activeTab !== 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}\`}
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">홈</span>
        </button>
        <button 
          onClick={() => setActiveTab('my')}
          className={\`flex flex-col items-center justify-center w-full h-full space-y-1 \${activeTab === 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}\`}
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">마이</span>
        </button>
      </div>
      
      {/* My Tab Content (Simple Placeholder) */}
      {activeTab === 'my' && (
        <div className="w-full max-w-md mx-auto mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-800">마이 페이지</h2>
          <p className="text-sm text-gray-500 mt-2">내 상점 정보 및 계정 설정 기능이 업데이트될 예정입니다.</p>
        </div>
      )}
`;

// Insert it right before the last </div>
const match = content.match(/(<\/div>\s*<\/div>\s*\);\s*\})/);
if (match) {
  content = content.replace(match[0], `  </div>\n${bottomNav}\n    </div>\n  );\n}`);
  fs.writeFileSync(file, content);
  console.log("Successfully appended bottom nav!");
} else {
  console.log("Failed to match the end of the file!");
}
