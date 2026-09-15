const fs = require('fs');

const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetBlock = `<div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-amber-50 rounded-[2.5rem] transform -rotate-2 scale-105" />
                <img src="https://placehold.co/800x600/ffedd5/ea580c?text=Form+Builder+Screenshot" alt="간편폼 만들기 화면" className="relative rounded-3xl shadow-2xl border border-gray-100 w-full object-cover" />
                <p className="text-center text-sm text-gray-400 mt-3 font-medium">※ 실제 어드민의 '간편폼 만들기' 기능 화면을 캡처해 주세요.</p>
              </div>`;

const newBlock = `<div className="flex-1 w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-amber-50 rounded-[2.5rem] transform -rotate-2 scale-105" />
                
                {/* Form Builder Mockup */}
                <div className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(234,88,12,0.15)] border border-gray-100 overflow-hidden z-10 hover:scale-[1.02] transition-transform duration-500 flex flex-col h-[340px]">
                  
                  {/* Mockup Header */}
                  <div className="p-4 border-b border-gray-100 bg-orange-50/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center border border-orange-200">
                        <PlusSquare className="w-4 h-4" />
                      </div>
                      <span className="text-[14px] font-bold text-gray-900">새 간편폼 만들기</span>
                    </div>
                    <div className="px-4 py-1.5 bg-gray-900 text-white text-[12px] font-bold rounded-xl shadow-sm">저장하기</div>
                  </div>

                  {/* Mockup Body */}
                  <div className="flex-1 p-4 bg-gray-50/50 flex gap-4 overflow-hidden relative">
                    
                    {/* Left/Main Column - Fields List */}
                    <div className="flex-1 space-y-3">
                      {/* Form Title */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm relative">
                        <div className="text-[13px] font-bold text-gray-800 mb-1">제목 없는 폼</div>
                        <div className="text-[11px] text-gray-400">폼 설명을 입력해 주세요.</div>
                        <div className="absolute right-4 top-4 w-4 h-4 text-gray-300">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </div>
                      </div>

                      {/* Draggable Field 1 */}
                      <div className="bg-white p-3.5 rounded-2xl border-l-[6px] border-l-orange-500 border border-gray-200 shadow-sm flex items-start gap-3 relative">
                        <div className="w-4 h-4 text-gray-300 flex flex-col gap-[3px] justify-center mt-1 cursor-move">
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[12px] font-bold text-gray-700 mb-2 flex justify-between">
                            <span>고객 성함 (단답형)</span>
                            <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-bold">필수</span>
                          </div>
                          <div className="h-7 bg-gray-50 border border-gray-100 rounded-lg" />
                        </div>
                      </div>

                      {/* Draggable Field 2 */}
                      <div className="bg-white p-3.5 rounded-2xl border-l-[6px] border-l-gray-300 border border-gray-200 shadow-sm flex items-start gap-3 relative opacity-70">
                        <div className="w-4 h-4 text-gray-300 flex flex-col gap-[3px] justify-center mt-1 cursor-move">
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[12px] font-bold text-gray-700 mb-2">방문 목적 (객관식)</div>
                          <div className="flex gap-3">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border border-gray-300 bg-white" /><div className="h-2 w-10 bg-gray-200 rounded" /></div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border border-gray-300 bg-white" /><div className="h-2 w-10 bg-gray-200 rounded" /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Add Field Button Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <div className="px-5 py-3 bg-gray-900 text-white text-[13px] font-bold rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2)] flex items-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors">
                        <PlusSquare className="w-4 h-4 text-orange-400" />
                        새 항목 추가
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Small floating badge */}
                <div className="absolute top-10 -left-2 sm:-left-6 bg-white px-4 py-3 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] border border-gray-100 z-20 flex flex-col items-center gap-1 animate-[bounce_3s_infinite]">
                  <div className="text-[13px] font-black text-orange-600">내 마음대로 뚝딱!</div>
                  <div className="text-[11px] font-medium text-gray-500">객관식, 주소, 이미지까지</div>
                </div>
              </div>`;

if (c.includes(targetBlock)) {
    c = c.replace(targetBlock, newBlock);
    fs.writeFileSync(file, c);
    console.log('Successfully added mockup to feature 4');
} else {
    console.log('Could not find target block in page.tsx');
}
