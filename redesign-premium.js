const fs = require('fs');

const path = 'src/app/delivery-list/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const startIndex = content.indexOf('{selectedResponse && (');
if (startIndex !== -1) {
  const newModal = `{selectedResponse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-[#F4F6F8] rounded-[28px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_24px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden ring-1 ring-white/10">
            
            {/* 1. 브랜드 프리미엄 헤더 영역 (그라데이션 & 다크 모드 스타일) */}
            <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-6 sm:p-8 shrink-0">
              <div className="absolute top-5 right-5">
                <button 
                  onClick={() => setSelectedResponse(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-start justify-between mt-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold mb-3 backdrop-blur-md border border-white/20 tracking-wider">
                    {selectedResponse.status === '발송완료' ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                    {selectedResponse.status === '발송완료' ? '발송완료' : '접수대기'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                    택배 접수 내역
                  </h2>
                  <p className="text-blue-100 text-sm font-medium opacity-90">
                    접수일시: {new Date(selectedResponse.submitted_at).toLocaleString('ko-KR')}
                  </p>
                </div>
                <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                  <Package className="w-7 h-7 text-white opacity-90" />
                </div>
              </div>
            </div>
            
            {/* 2. 본문 영역 (핀테크 영수증 스타일의 Row-based Layout) */}
            <div className="p-4 sm:p-6 overflow-y-auto print-area flex-1 space-y-5">
              {(() => {
                const dataEntries = Object.entries(selectedResponse.data || { '안내': '내용이 없습니다.' });
                const senderEntries = dataEntries.filter(([k]) => k.includes('보내는 분'));
                const receiverEntries = dataEntries.filter(([k]) => k.includes('받는 분'));
                const otherEntries = dataEntries.filter(([k]) => !k.includes('보내는 분') && !k.includes('받는 분'));

                const renderSection = (title: string, entries: any[], accentColor: string) => {
                  if (entries.length === 0) return null;
                  return (
                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                      {/* 섹션 헤더 */}
                      <div className="bg-gray-50/50 px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
                        <span className={\`w-2 h-2 rounded-full \${accentColor}\`}></span>
                        <h3 className="font-bold text-gray-900 text-[15px]">{title}</h3>
                      </div>
                      
                      {/* 섹션 데이터 (행 단위) */}
                      <div className="px-5 py-2">
                        {entries.map(([key, value]: any) => {
                          const cleanKey = key.replace(/보내는 분 - |받는 분 - /g, '');
                          const isLongText = /주소|요청사항|상세|메모|내용/.test(cleanKey) || (value && String(value).length > 20);
                          const isHighlight = /이름|연락처|전화번호|고객명/.test(cleanKey);

                          if (isLongText) {
                            // 긴 텍스트 (주소 등) -> 상하 배치
                            return (
                              <div key={key} className="py-4 border-b border-gray-50 last:border-0 flex flex-col gap-2">
                                <span className="text-[13px] font-semibold text-gray-400">{cleanKey}</span>
                                <span className="text-[15px] font-medium text-gray-900 whitespace-pre-wrap leading-relaxed">
                                  {value || '-'}
                                </span>
                              </div>
                            );
                          } else {
                            // 짧은 텍스트 (이름, 전화번호 등) -> 좌우 배치 (영수증 스타일)
                            return (
                              <div key={key} className="py-4 border-b border-gray-50 last:border-0 flex items-center justify-between gap-4">
                                <span className="text-[13px] font-semibold text-gray-400 shrink-0">{cleanKey}</span>
                                <span className={\`text-[15px] text-right break-words \${isHighlight ? 'font-extrabold text-blue-700' : 'font-semibold text-gray-800'}\`}>
                                  {value || '-'}
                                </span>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                };

                return (
                  <>
                    {renderSection('발송인 정보 (보내는 분)', senderEntries, 'bg-gray-700')}
                    {renderSection('수령인 정보 (받는 분)', receiverEntries, 'bg-blue-600')}
                    {renderSection('기타 물품 정보', otherEntries, 'bg-gray-400')}
                  </>
                );
              })()}
            </div>

            {/* 3. 푸터 버튼 영역 (플로팅 스타일) */}
            <div className="p-4 sm:p-5 bg-white border-t border-gray-100 flex gap-3">
              <button 
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all font-bold shadow-md text-[15px]"
              >
                <Printer className="w-5 h-5" />
                내용 출력 및 PDF 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
  
  content = content.substring(0, startIndex) + newModal;
  fs.writeFileSync(path, content, 'utf8');
}
