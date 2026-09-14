const fs = require('fs');
let file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Add ChevronRight import
if (!c.includes('ChevronRight')) {
  c = c.replace(
    "import { Search, Package, Copy, ExternalLink, Check, Home, User } from 'lucide-react';",
    "import { Search, Package, Copy, ExternalLink, Check, Home, User, ChevronRight } from 'lucide-react';"
  );
}

// 2. Replace the My Menu block
const oldBlockRegex = /\{\/\* My Tab Content \(Simple Placeholder\) \*\/\}\s*\{activeTab === 'my' && \(\s*<div className="w-full max-w-md mx-auto mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">\s*<User className="w-12 h-12 text-gray-300 mx-auto mb-3" \/>\s*<h2 className="text-lg font-bold text-gray-800">마이 페이지<\/h2>\s*<p className="text-sm text-gray-500 mt-2">내 상점 정보 및 계정 설정 기능이 업데이트될 예정입니다\.<\/p>\s*<\/div>\s*\)\}/;

const newBlock = `{/* 마이 메뉴 컨텐츠 */}
      {activeTab === 'my' && (
        <div className="w-full max-w-4xl mx-auto mt-6 px-2 sm:px-0 pb-10">
          <div className="mb-6">
            <h2 className="text-[22px] sm:text-2xl font-bold text-gray-900">마이 메뉴</h2>
            <p className="text-sm text-gray-500 mt-1">계정 정보 및 설정을 관리하세요.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: '계정 정보',
                desc: '관리자 아이디 및 비밀번호 변경',
                color: 'bg-purple-900'
              },
              {
                title: '구독 및 결제 관리',
                desc: '이용권 상태, 카드 변경, 결제 내역',
                color: 'bg-purple-900'
              },
              {
                title: '설정',
                desc: '가게 정보(영업시간, 주소 등) 관리',
                color: 'bg-purple-900'
              },
              {
                title: '고객 홍보 (링크 & QR)',
                desc: '우리 매장 전용 링크 및 QR코드 다운로드',
                color: 'bg-pink-500'
              }
            ].map((menu, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100/80 flex items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group"
              >
                <div className={\`absolute left-0 top-0 bottom-0 w-1.5 \${menu.color}\`}></div>
                <div className="ml-2 flex-1">
                  <h3 className="font-extrabold text-gray-900 text-[15px] sm:text-[16px] tracking-tight">{menu.title}</h3>
                  <p className="text-[13px] text-gray-500 mt-0.5">{menu.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            ))}
          </div>

          <div className="mt-10 mb-4">
            <h3 className="text-lg font-bold text-gray-900">고객 서비스</h3>
          </div>
          
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100/80 flex items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="ml-2 flex-1">
              <h3 className="font-extrabold text-gray-900 text-[15px] sm:text-[16px] tracking-tight">고객 센터</h3>
              <p className="text-[13px] text-gray-500 mt-0.5">자주 묻는 질문 및 1:1 문의</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 transition-colors" />
          </div>
        </div>
      )}`;

if (c.match(oldBlockRegex)) {
  c = c.replace(oldBlockRegex, newBlock);
  fs.writeFileSync(file, c);
  console.log('Successfully replaced My Menu block');
} else {
  // If regex fails due to escaping, use a more lenient approach
  console.log("Regex didn't match. Using string split method...");
  const startSplit = "{/* My Tab Content (Simple Placeholder) */}";
  const endSplit = ")}";
  const startIndex = c.indexOf(startSplit);
  if (startIndex !== -1) {
    const nextCloseIdx = c.indexOf(endSplit, startIndex);
    if (nextCloseIdx !== -1) {
      const before = c.substring(0, startIndex);
      const after = c.substring(nextCloseIdx + endSplit.length);
      c = before + newBlock + after;
      fs.writeFileSync(file, c);
      console.log("Successfully replaced via split method");
    }
  } else {
    console.log("Failed entirely.");
  }
}
