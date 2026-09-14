const fs = require('fs');

const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Add ArrowLeft import
if (!c.includes('ArrowLeft')) {
  c = c.replace(
    "import { Search, Package, Copy, ExternalLink, Check, Home, User, ChevronRight } from 'lucide-react';",
    "import { Search, Package, Copy, ExternalLink, Check, Home, User, ChevronRight, ArrowLeft } from 'lucide-react';"
  );
}

// 2. Add the back button to the header
const oldHeader = `<div className="mb-6">
            <h2 className="text-[22px] sm:text-2xl font-bold text-gray-900">마이 메뉴</h2>
            <p className="text-sm text-gray-500 mt-1">계정 정보 및 설정을 관리하세요.</p>
          </div>`;

const newHeader = `<div className="mb-6 flex items-start sm:items-center gap-1 sm:gap-3">
            <button 
              onClick={() => setActiveTab('builder')}
              className="p-1.5 -ml-2 text-gray-400 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-200 active:scale-95 mt-0.5 sm:mt-0"
              aria-label="이전으로 돌아가기"
            >
              <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <div>
              <h2 className="text-[22px] sm:text-2xl font-bold text-gray-900 leading-tight">마이 메뉴</h2>
              <p className="text-[13px] sm:text-sm text-gray-500 mt-1">계정 정보 및 설정을 관리하세요.</p>
            </div>
          </div>`;

if (c.includes(oldHeader)) {
  c = c.replace(oldHeader, newHeader);
  fs.writeFileSync(file, c);
  console.log("Successfully added the back button!");
} else {
  console.log("Could not find the target header to replace.");
}
