const fs = require('fs');

const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetBlock = `<div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-fuchsia-50 rounded-[2.5rem] transform -rotate-3 scale-105" />
                <img src="https://placehold.co/800x600/f3e8ff/9333ea?text=Premium+Form+Design" alt="고급스러운 브랜드 폼 화면" className="relative rounded-3xl shadow-2xl border border-gray-100 w-full object-cover" />
                <p className="text-center text-sm text-gray-400 mt-3 font-medium">※ 매장 로고와 상호명이 적용된 실제 고객용 폼 화면을 캡처해 주세요.</p>
              </div>`;

const newBlock = `<div className="flex-1 w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-fuchsia-50 rounded-[2.5rem] transform -rotate-3 scale-105" />
                
                {/* Premium Brand Mockup */}
                <div className="relative w-64 bg-[#FAFAFA] rounded-[2rem] shadow-[0_20px_50px_rgba(147,51,234,0.15)] border-4 border-white overflow-hidden z-10 hover:scale-105 transition-transform duration-500">
                  
                  {/* Mockup Header (Brand) */}
                  <div className="bg-white px-6 pt-8 pb-6 text-center border-b border-gray-100 shadow-sm relative z-10">
                    <div className="w-16 h-16 mx-auto bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3 shadow-inner border border-purple-100">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-gray-900 tracking-tight">우아한 베이커리</h4>
                    <p className="text-[11px] text-gray-400 mt-1 font-medium">프리미엄 수제 디저트 전문점</p>
                  </div>
                  
                  {/* Mockup Body (Form) */}
                  <div className="p-5 space-y-4 bg-gray-50/50">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="text-[11.5px] font-bold text-gray-800 mb-2.5">예약자 정보</div>
                      <div className="space-y-2">
                        <div className="h-8 bg-gray-50 border border-gray-200 rounded-lg px-3 flex items-center"><span className="text-[11px] text-gray-400">성함을 입력해주세요</span></div>
                        <div className="h-8 bg-gray-50 border border-gray-200 rounded-lg px-3 flex items-center"><span className="text-[11px] text-gray-400">연락처를 입력해주세요</span></div>
                      </div>
                    </div>
                    
                    <div className="h-11 bg-purple-600 rounded-xl flex items-center justify-center text-white text-[13px] font-bold shadow-md shadow-purple-200 hover:bg-purple-700 transition-colors cursor-pointer">
                      예약 완료하기
                    </div>
                  </div>
                  
                </div>
                
                {/* Small floating badge */}
                <div className="absolute top-[20%] -right-2 sm:-right-6 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 z-20 flex items-center gap-2 animate-bounce">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-[12px] font-bold text-gray-700">고급스러운 브랜드 인지도 상승!</span>
                </div>
              </div>`;

if (c.includes(targetBlock)) {
    c = c.replace(targetBlock, newBlock);
    fs.writeFileSync(file, c);
    console.log('Successfully added mockup to feature 2');
} else {
    console.log('Could not find target block in page.tsx');
}
