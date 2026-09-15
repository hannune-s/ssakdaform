const fs = require('fs');
const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// Add import
c = c.replace("import { Search, Package, Copy, ExternalLink, Check, Home, User, ChevronRight, ArrowLeft, LogOut, QrCode } from 'lucide-react';", 
              "import { Search, Package, Copy, ExternalLink, Check, Home, User, ChevronRight, ArrowLeft, LogOut, QrCode, Smartphone } from 'lucide-react';");

// Add handler
const handlerStr = `  const handleCopy = async () => {`;
const newHandlerStr = `  const handleInstallApp = () => {
    alert('📱 모바일 홈 화면 추가 방법\\n\\n[아이폰 (Safari)]\\n하단의 공유(보내기) ⍗ 버튼을 누른 후 "홈 화면에 추가"를 선택하세요.\\n\\n[안드로이드 (Chrome)]\\n상단 메뉴(⋮)를 누른 후 "홈 화면에 추가"를 선택하세요.');
  };

  const handleCopy = async () => {`;
if (c.includes(handlerStr)) {
  c = c.replace(handlerStr, newHandlerStr);
}

// Add button
const logoStr = `      {/* 상단 로고 및 타이틀 */}
      <div className="text-center mb-10">`;
const newLogoStr = `      {/* 상단 로고 및 타이틀 */}
      <div className="text-center mb-10 relative">
        <button 
          onClick={handleInstallApp} 
          className="absolute top-0 right-0 sm:-top-4 sm:right-4 text-[12px] font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-200 shadow-sm flex items-center gap-1.5 hover:bg-indigo-50 transition-colors active:scale-95 z-10"
        >
          <Smartphone className="w-3.5 h-3.5" /> 
          홈 화면에 추가
        </button>`;

if (c.includes(logoStr)) {
  c = c.replace(logoStr, newLogoStr);
  fs.writeFileSync(file, c);
  console.log('Successfully added install button to admin page');
} else {
  console.log('Target string not found in admin page');
}
