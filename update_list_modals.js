const fs = require('fs');

function updateReservationModal() {
  const file = 'src/app/reservation-list/page.tsx';
  let content = fs.readFileSync(file, 'utf8');

  const modalRegex = /\{selectedResponse && \([\s\S]*?<\/[dD]iv>\s*\)\}\s*<\/div>\s*\);\s*\}/;

  const newModal = `{selectedResponse && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-black/5">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                예약 상세 정보
              </h2>
              <button 
                onClick={() => setSelectedResponse(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto print-area bg-[#F8FAFC] flex-1">
              <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">접수 일시</p>
                  <p className="text-sm font-bold text-gray-900">{new Date(selectedResponse.submitted_at).toLocaleString('ko-KR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 mb-1">현재 상태</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold">
                    {selectedResponse.status === '예약완료' || selectedResponse.status === '완료' ? <CheckCircle className="w-4 h-4" /> : null}
                    {selectedResponse.status || '접수됨'}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {(() => {
                  const dataEntries = Object.entries(selectedResponse.data || { '안내': '내용이 없습니다.' });
                  const personEntries = dataEntries.filter(([k]) => k.includes('예약자') || k.includes('연락처') || k.includes('인원'));
                  const dateEntries = dataEntries.filter(([k]) => k.includes('날짜') || k.includes('시간'));
                  const otherEntries = dataEntries.filter(([k]) => !k.includes('예약자') && !k.includes('연락처') && !k.includes('인원') && !k.includes('날짜') && !k.includes('시간'));

                  const renderSection = (title, entries, isHighlightStyle) => {
                    if (entries.length === 0) return null;
                    return (
                      <div className={\`bg-white border \${isHighlightStyle ? 'border-indigo-100' : 'border-gray-200'} rounded-2xl p-6 shadow-sm\`}>
                        <h3 className={\`text-sm font-extrabold mb-5 pb-3 border-b-2 \${isHighlightStyle ? 'text-indigo-900 border-indigo-900' : 'text-gray-900 border-gray-900'} flex items-center gap-2\`}>
                           {title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                          {entries.map(([key, value]) => {
                            const isFullWidth = /주소|요청사항|상세|메모|내용|인원/.test(key) || (value && String(value).length > 25);
                            const isHighlightText = /이름|연락처|전화번호|고객|날짜|시간/.test(key);

                            return (
                              <div key={key} className={isFullWidth ? "col-span-1 sm:col-span-2" : ""}>
                                <p className="text-[13px] font-semibold text-gray-500 mb-1.5">{key}</p>
                                <p className={\`text-gray-900 \${isHighlightText ? 'text-[17px] font-extrabold tracking-tight' : 'text-[15px] font-medium'} leading-relaxed whitespace-pre-wrap\`}>
                                  {value || '-'}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div className="space-y-6">
                      {renderSection('예약 일정', dateEntries, true)}
                      {renderSection('예약자 정보', personEntries, false)}
                      {renderSection('기타 요청사항', otherEntries, false)}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-[20px]">
              <button 
                onClick={() => setSelectedResponse(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                닫기
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-7 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all font-bold shadow-md"
              >
                <Printer className="w-4 h-4" />
                출력 / PDF 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

  content = content.replace(modalRegex, newModal);
  if (!content.includes('import { CheckCircle')) {
     content = content.replace("import { Calendar, Trash2, Printer, RotateCcw, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';", "import { Calendar, Trash2, Printer, RotateCcw, X, Search, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';");
  }
  fs.writeFileSync(file, content);
  console.log('Updated reservation modal');
}

function updateOrderModal() {
  const file = 'src/app/order-list/page.tsx';
  let content = fs.readFileSync(file, 'utf8');

  const modalRegex = /\{selectedResponse && \([\s\S]*?<\/[dD]iv>\s*\)\}\s*<\/div>\s*\);\s*\}/;

  const newModal = `{selectedResponse && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-black/5">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                주문 상세 정보
              </h2>
              <button 
                onClick={() => setSelectedResponse(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto print-area bg-[#F8FAFC] flex-1">
              <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">접수 일시</p>
                  <p className="text-sm font-bold text-gray-900">{new Date(selectedResponse.submitted_at).toLocaleString('ko-KR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 mb-1">현재 상태</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold">
                    {selectedResponse.status === '입금확인' || selectedResponse.status === '완료' ? <CheckCircle className="w-4 h-4" /> : null}
                    {selectedResponse.status || '접수됨'}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {(() => {
                  const dataEntries = Object.entries(selectedResponse.data || { '안내': '내용이 없습니다.' });
                  const orderEntries = dataEntries.filter(([k]) => k.includes('상품명') || k.includes('주문 날짜'));
                  const customerEntries = dataEntries.filter(([k]) => k.includes('고객명') || k.includes('연락처') || k.includes('입금자명') || k.includes('주소'));
                  const otherEntries = dataEntries.filter(([k]) => !k.includes('상품명') && !k.includes('주문 날짜') && !k.includes('고객명') && !k.includes('연락처') && !k.includes('입금자명') && !k.includes('주소'));

                  const renderSection = (title, entries, isHighlightStyle) => {
                    if (entries.length === 0) return null;
                    return (
                      <div className={\`bg-white border \${isHighlightStyle ? 'border-indigo-100' : 'border-gray-200'} rounded-2xl p-6 shadow-sm\`}>
                        <h3 className={\`text-sm font-extrabold mb-5 pb-3 border-b-2 \${isHighlightStyle ? 'text-indigo-900 border-indigo-900' : 'text-gray-900 border-gray-900'} flex items-center gap-2\`}>
                           {title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                          {entries.map(([key, value]) => {
                            const isFullWidth = /주소|요청사항|상세|메모|내용|상품명/.test(key) || (value && String(value).length > 25);
                            const isHighlightText = /이름|연락처|전화번호|고객|날짜|상품|입금자/.test(key);

                            return (
                              <div key={key} className={isFullWidth ? "col-span-1 sm:col-span-2" : ""}>
                                <p className="text-[13px] font-semibold text-gray-500 mb-1.5">{key}</p>
                                <p className={\`text-gray-900 \${isHighlightText ? 'text-[17px] font-extrabold tracking-tight' : 'text-[15px] font-medium'} leading-relaxed whitespace-pre-wrap\`}>
                                  {value || '-'}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div className="space-y-6">
                      {renderSection('상품 및 주문 정보', orderEntries, true)}
                      {renderSection('고객 정보', customerEntries, false)}
                      {renderSection('기타 요청사항', otherEntries, false)}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-[20px]">
              <button 
                onClick={() => setSelectedResponse(null)}
                className="classNamepx-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                닫기
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-7 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all font-bold shadow-md"
              >
                <Printer className="w-4 h-4" />
                출력 / PDF 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

  content = content.replace(modalRegex, newModal);
  if (!content.includes('import { CheckCircle')) {
     content = content.replace("import { ShoppingCart, Trash2, Printer, RotateCcw, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';", "import { ShoppingCart, Trash2, Printer, RotateCcw, X, Search, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';");
  }
  fs.writeFileSync(file, content);
  console.log('Updated order modal');
}

updateReservationModal();
updateOrderModal();
