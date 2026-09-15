const fs = require('fs');

const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// Ensure Printer and Download are imported
if (!c.includes('Printer')) {
    c = c.replace("from 'lucide-react';", "Printer, Download, from 'lucide-react';");
    c = c.replace(", from", ",");
}

const targetBlock = `<div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-pink-50 rounded-[2.5rem] transform rotate-3 scale-105" />
                <img src="https://placehold.co/800x600/ffe4e6/e11d48?text=Mobile+App+View" alt="모바일 최적화 화면" className="relative rounded-3xl shadow-2xl border border-gray-100 w-full object-cover" />
                <p className="text-center text-sm text-gray-400 mt-3 font-medium">※ 스마트폰에서 접속한 어드민 화면을 캡처해 주세요.</p>
              </div>`;

const newBlock = `<div className="flex-1 w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-pink-50 rounded-[2.5rem] transform rotate-3 scale-105" />
                
                {/* Mobile Admin Mockup */}
                <div className="relative w-64 bg-gray-50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(225,29,72,0.15)] border-[8px] border-white overflow-hidden z-10 hover:-translate-y-2 transition-transform duration-500 h-[420px] flex flex-col">
                  
                  {/* Top Bar with Export/Print */}
                  <div className="bg-white p-4 border-b border-gray-100 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[15px] font-black text-gray-900 tracking-tight">상세 현황 관리</span>
                      <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100"><Sparkles className="w-3.5 h-3.5" /></div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <div className="flex-1 py-2 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:bg-emerald-100 transition-colors">
                        <Download className="w-3.5 h-3.5" /> 엑셀 다운로드
                      </div>
                      <div className="flex-1 py-2 bg-gray-800 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:bg-gray-900 transition-colors">
                        <Printer className="w-3.5 h-3.5 text-gray-300" /> 인쇄하기
                      </div>
                    </div>
                  </div>

                  {/* List Content */}
                  <div className="flex-1 p-3 space-y-3 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 z-10 pointer-events-none" />
                    
                    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 relative z-0">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[12px] font-bold text-gray-900">김철수 고객님</span>
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full">결제완료</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-3/4 bg-gray-100 rounded" />
                        <div className="h-2 w-1/2 bg-gray-100 rounded" />
                      </div>
                    </div>
                    
                    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 relative z-0">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[12px] font-bold text-gray-900">이영희 고객님</span>
                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-full border border-yellow-100">접수대기</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-gray-100 rounded" />
                        <div className="h-2 w-2/3 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation Mockup */}
                  <div className="bg-white border-t border-gray-100 p-3 flex justify-around items-center px-4 pb-5 relative z-20">
                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                      <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center"><Smartphone className="w-3.5 h-3.5" /></div>
                      <div className="text-[9px] font-bold text-rose-600">홈</div>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40 cursor-pointer">
                      <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center"><BarChart3 className="w-3.5 h-3.5 text-gray-500" /></div>
                      <div className="text-[9px] font-bold text-gray-500">통계</div>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40 cursor-pointer">
                      <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center"><CreditCard className="w-3.5 h-3.5 text-gray-500" /></div>
                      <div className="text-[9px] font-bold text-gray-500">설정</div>
                    </div>
                  </div>
                </div>
                
                {/* Small floating badge */}
                <div className="absolute top-1/4 -right-4 sm:-right-8 bg-white px-4 py-3 rounded-2xl shadow-[0_15px_30px_rgba(225,29,72,0.15)] border border-rose-100 z-20 flex items-center gap-3 animate-bounce">
                  <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-black text-gray-900">버튼 클릭 한 번으로!</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">엑셀 다운 & 출력 완벽 지원</div>
                  </div>
                </div>
              </div>`;

if (c.includes(targetBlock)) {
    c = c.replace(targetBlock, newBlock);
    fs.writeFileSync(file, c);
    console.log('Successfully added mockup to feature 5');
} else {
    console.log('Could not find target block in page.tsx');
}
