const fs = require('fs');

const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Home, User to imports if not present
if (!content.includes('Home, User')) {
  content = content.replace(
    "import { Search, Package, Copy, ExternalLink, Check } from 'lucide-react';",
    "import { Search, Package, Copy, ExternalLink, Check, Home, User } from 'lucide-react';"
  );
}

// 2. Add 'my' tab logic
// Before the closing div
const bottomNav = `
      {/* 🔹 모바일 하단 네비게이션바 (홈 / 마이) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-50 h-16 sm:h-auto sm:static sm:hidden">
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

if (!content.includes('모바일 하단 네비게이션바')) {
  // To avoid cutting off the container, let's insert it before the last </div>
  // Wait, let's look at the end of the file.
  
  // Replace the exact ending:
  const ending = `      </div>
      
    </div>
  );
}`;
  
  const newEnding = `      </div>
${bottomNav}
    </div>
  );
}`;

  content = content.replace(ending, newEnding);
  fs.writeFileSync(file, content);
  console.log("Added bottom nav");
}
