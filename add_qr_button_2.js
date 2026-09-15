const fs = require('fs');
const file = 'src/app/page.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const rs = lines.findIndex(l => l.includes('우리 매장 통합 링크'));
const startIdx = lines.findIndex((l, i) => i > rs && l.includes('<div className="flex flex-row gap-2 w-full md:w-auto shrink-0">'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('</div>'));

if (startIdx !== -1 && endIdx !== -1) {
  const newButtons = `            <div className="flex flex-row flex-wrap md:flex-nowrap gap-2 w-full md:w-auto shrink-0">
                <button 
                  onClick={handleCopy}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-sm active:scale-95 text-[13.5px] sm:text-[14px] whitespace-nowrap"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '복사완료' : '링크 복사'}
                </button>
                <button 
                  onClick={() => alert('QR 코드 이미지 다운로드가 실행됩니다.\\n(데모 버전 안내)')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 font-bold transition-all shadow-sm active:scale-95 text-[13.5px] sm:text-[14px] whitespace-nowrap"
                >
                  <QrCode className="w-4 h-4" />
                  QR 다운로드
                </button>
                <a 
                  href="/store/demo"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-white border border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-50 font-bold transition-all shadow-sm active:scale-95 text-[13.5px] sm:text-[14px] whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4" />
                  고객화면
                </a>
            </div>`;
  
  lines.splice(startIdx, endIdx - startIdx + 1, newButtons);
  
  // Also fix import
  const importIdx = lines.findIndex(l => l.includes('import { Search, Package, Copy, ExternalLink, Check, Home, User, ChevronRight, ArrowLeft, LogOut } from \'lucide-react\';'));
  if (importIdx !== -1) {
    lines[importIdx] = "import { Search, Package, Copy, ExternalLink, Check, Home, User, ChevronRight, ArrowLeft, LogOut, QrCode } from 'lucide-react';";
  }
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Successfully added QR button (array approach)');
} else {
  console.log('Target string not found');
}
