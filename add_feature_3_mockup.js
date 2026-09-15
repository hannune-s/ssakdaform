const fs = require('fs');

const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetBlock = `<div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-emerald-50 rounded-[2.5rem] transform rotate-2 scale-105" />
                <img src="https://placehold.co/800x600/dcfce7/16a34a?text=Customer+CRM+List" alt="고객 관리 시스템 화면" className="relative rounded-3xl shadow-2xl border border-gray-100 w-full object-cover" />
                <p className="text-center text-sm text-gray-400 mt-3 font-medium">※ 어드민의 검색 기능과 리스트 화면을 캡처해 주세요.</p>
              </div>`;

const newBlock = `<div className="flex-1 w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-emerald-50 rounded-[2.5rem] transform rotate-2 scale-105" />
                
                {/* Admin CRM List Mockup */}
                <div className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.15)] border border-gray-100 overflow-hidden z-10 hover:scale-[1.02] transition-transform duration-500">
                  
                  {/* Mockup Header (Search/Tabs) */}
                  <div className="p-4 sm:p-5 border-b border-gray-100 bg-white">
                    <div className="flex gap-2 mb-4">
                      <div className="px-3 py-1.5 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-200">택배접수 (12)</div>
                      <div className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[11px] font-semibold rounded-full border border-gray-200">예약접수 (5)</div>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 border-[1.5px] border-gray-400 rounded-full" />
                      <div className="absolute left-[14px] top-1/2 mt-[3px] ml-[3px] w-1.5 h-1.5 border-l-[1.5px] border-gray-400 transform -rotate-45" />
                      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl h-10 pl-9 pr-3 flex items-center">
                        <span className="text-[12px] text-gray-800 font-medium">김철</span>
                        <div className="w-[1.5px] h-4 bg-blue-500 animate-pulse ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Mockup Table */}
                  <div className="bg-white overflow-hidden pb-2">
                    <table className="w-full text-left">
                      <thead className="bg-green-50/50 border-y border-green-100/50">
                        <tr>
                          <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 tracking-wider">이름</th>
                          <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 tracking-wider hidden sm:table-cell">연락처</th>
                          <th className="px-4 py-2.5 text-center text-[10px] font-extrabold text-gray-500 tracking-wider">상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50 transition-colors bg-green-50/20">
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900 text-[12px]">김철수</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 sm:hidden">010-1234-****</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">오늘 14:30</div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="text-[11px] font-bold text-gray-600">010-1234-5678</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">결제완료</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900 text-[12px]">이영희</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 sm:hidden">010-9876-****</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">오늘 11:20</div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="text-[11px] font-semibold text-gray-600">010-9876-5432</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-[10px] font-bold">접수대기</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900 text-[12px]">박민수</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 sm:hidden">010-5555-****</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">어제 16:45</div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="text-[11px] font-semibold text-gray-600">010-5555-6666</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">결제완료</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Small floating badge */}
                <div className="absolute bottom-6 -left-2 sm:-left-6 bg-white px-4 py-3 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-gray-100 z-20 flex items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-black text-gray-900">단골고객 발견!</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">이전 주문 이력: 3회</div>
                  </div>
                </div>
              </div>`;

if (c.includes(targetBlock)) {
    c = c.replace(targetBlock, newBlock);
    fs.writeFileSync(file, c);
    console.log('Successfully added mockup to feature 3');
} else {
    console.log('Could not find target block in page.tsx');
}
