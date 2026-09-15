const fs = require('fs');

function addInstallButton(file) {
  let lines = fs.readFileSync(file, 'utf8').split('\n');

  // Add import if not present
  const importIdx = lines.findIndex(l => l.includes("from 'lucide-react'"));
  if (importIdx !== -1 && !lines[importIdx].includes('Smartphone')) {
    lines[importIdx] = lines[importIdx].replace(" } from 'lucide-react'", ", Smartphone } from 'lucide-react'");
  }

  // Add handler
  const handlerIdx = lines.findIndex(l => l.includes('const handleCopy = async () => {'));
  if (handlerIdx !== -1) {
    const handler = `  const handleInstallApp = () => {
    alert('📱 모바일 홈 화면 추가 방법\\n\\n[아이폰 (Safari)]\\n하단의 공유(보내기) ⍗ 버튼을 누른 후 "홈 화면에 추가"를 선택하세요.\\n\\n[안드로이드 (Chrome)]\\n상단 메뉴(⋮)를 누른 후 "홈 화면에 추가"를 선택하세요.');
  };
`;
    // ensure we don't add it twice
    if (!lines.some(l => l.includes('handleInstallApp'))) {
        lines.splice(handlerIdx, 0, handler);
    }
  }

  // Add button
  const logoIdx = lines.findIndex(l => l.includes('<div className="text-center mb-10">'));
  if (logoIdx !== -1) {
    lines[logoIdx] = lines[logoIdx].replace('<div className="text-center mb-10">', '<div className="text-center mb-10 relative">');
    const btn = `        <button 
          onClick={handleInstallApp} 
          className="absolute top-0 right-0 sm:-top-4 sm:right-4 text-[12px] font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-200 shadow-sm flex items-center gap-1.5 hover:bg-indigo-50 transition-colors active:scale-95 z-10"
        >
          <Smartphone className="w-3.5 h-3.5" /> 
          홈 화면에 추가
        </button>`;
    if (!lines.some(l => l.includes('홈 화면에 추가</button>'))) {
        lines.splice(logoIdx + 1, 0, btn);
    }
  }

  fs.writeFileSync(file, lines.join('\n'));
  console.log('Successfully updated ' + file);
}

addInstallButton('src/app/page.tsx');
addInstallButton('src/app/demo/page.tsx');
