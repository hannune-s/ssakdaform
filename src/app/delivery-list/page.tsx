"use client";

import { useEffect, useState } from 'react';
import { Package, Search, Calendar, ChevronRight, X, Printer, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DeliveryList({ searchQuery = '' }: { searchQuery?: string }) {
  const [responses, setResponses] = useState<any[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);

  const filteredResponses = responses.filter(res => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const dataStr = JSON.stringify(res.data || {}).toLowerCase();
    return dataStr.includes(q);
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data, error } = await supabase
      .from('ssakdaform_responses')
      .select('*')
      .eq('form_id', 'delivery-preset')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Load Data Error:', error);
      alert('목록 불러오기 실패: ' + error.message);
    }

    if (data) {
      setResponses(data);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === '발송완료' ? '접수대기' : '발송완료';
    await supabase
      .from('ssakdaform_responses')
      .update({ status: newStatus })
      .eq('id', id);
    loadData();
  };

  const openDetails = (res: any) => {
    setSelectedResponse(res);
  };

  const closeDetails = () => {
    setSelectedResponse(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
        }
      `}</style>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">택배 신청 현황</h1>
          <p className="text-gray-500">고객들이 제출한 택배 배송 신청서 리스트입니다.</p>
        </div>
      </div>

      {/* 리스트 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-indigo-50 border-b border-indigo-100">
                <th className="px-5 py-4 text-sm font-bold text-indigo-900">접수일시</th>
                <th className="px-5 py-4 text-sm font-bold text-indigo-900">보내는 분 (이름/연락처)</th>
                <th className="px-5 py-4 text-sm font-bold text-indigo-900">받는 분 (이름/주소)</th>
                <th className="px-5 py-4 text-sm font-bold text-indigo-900">상태</th>
                <th className="px-5 py-4 text-sm font-bold text-indigo-900 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResponses.length > 0 ? (
                filteredResponses.map((res) => {
                  const data = res.data || {};
                  const senderName = data['보내는 분 - 이름'] || res.senderName || '-';
                  const senderPhone = data['보내는 분 - 연락처'] || res.senderPhone || '-';
                  const receiverName = data['받는 분 - 이름'] || res.receiverName || '-';
                  const receiverAddress = data['받는 분 - 주소'] || res.receiverAddress || '-';
                  const isCompleted = res.status === '발송완료';

                  return (
                    <tr key={res.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-5 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {new Date(res.submitted_at).toLocaleDateString('ko-KR')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(res.submitted_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-bold text-slate-800 mb-1">{senderName}</div>
                        <div className="text-sm text-slate-500 font-mono">{senderPhone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-bold text-[#5C4D3C] mb-1">{receiverName}</div>
                        <div className="text-sm text-gray-600 truncate max-w-[200px]" title={receiverAddress}>
                          {receiverAddress}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => toggleStatus(res.id, res.status)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                            isCompleted 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' 
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                          }`}
                          title="상태를 변경하려면 클릭하세요"
                        >
                          {isCompleted ? <CheckCircle className="w-3.5 h-3.5 mr-1" /> : null}
                          {isCompleted ? '발송완료' : '접수대기'}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => openDetails(res)}
                          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                        >
                          상세 내용
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-gray-900 font-medium text-lg">아직 접수된 택배가 없습니다</h3>
                    <p className="text-gray-500 mt-1 text-sm">고객에게 통합 링크를 전달하여 접수를 받아보세요.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모달 */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">택배 접수 상세 정보</h2>
              <button onClick={closeDetails} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto print-area bg-white flex-1">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 bg-gray-100 px-3 py-1.5 rounded inline-block">접수 정보</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">접수 일시</div>
                    <div className="font-medium">{new Date(selectedResponse.submitted_at).toLocaleString('ko-KR')}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">현재 상태</div>
                    <div className="font-bold text-indigo-600">{selectedResponse.status === '발송완료' ? '발송완료' : '접수대기'}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {(() => {
                  const dataEntries = Object.entries(selectedResponse.data || { '안내': '이전 테스트 데이터이거나 내용이 없습니다.' });
                  const senderEntries = dataEntries.filter(([k]) => k.includes('보내는 분'));
                  const receiverEntries = dataEntries.filter(([k]) => k.includes('받는 분'));
                  const otherEntries = dataEntries.filter(([k]) => !k.includes('보내는 분') && !k.includes('받는 분'));

                  return (
                    <div className="space-y-6">
                      {senderEntries.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                          <h3 className="font-extrabold text-slate-800 mb-4 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-slate-600 rounded-full inline-block"></span>
                            보내는 분 (발송인)
                          </h3>
                          <div className="space-y-4">
                            {senderEntries.map(([key, value]: any) => (
                              <div key={key}>
                                <div className="text-xs font-bold text-slate-500 mb-1.5">{key.replace('보내는 분 - ', '')}</div>
                                <div className="text-sm text-slate-900 font-medium bg-white border border-slate-200 p-3 rounded-xl whitespace-pre-wrap">
                                  {value || '-'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {receiverEntries.length > 0 && (
                        <div className="bg-[#FDFBF7] border border-[#E8DCC9] rounded-2xl p-5">
                          <h3 className="font-extrabold text-[#5C4D3C] mb-4 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#8B7355] rounded-full inline-block"></span>
                            받는 분 (수령인)
                          </h3>
                          <div className="space-y-4">
                            {receiverEntries.map(([key, value]: any) => (
                              <div key={key}>
                                <div className="text-xs font-bold text-[#8B7355] mb-1.5">{key.replace('받는 분 - ', '')}</div>
                                <div className="text-sm text-[#5C4D3C] font-medium bg-white border border-[#E8DCC9] p-3 rounded-xl whitespace-pre-wrap">
                                  {value || '-'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {otherEntries.length > 0 && (
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                          <h3 className="font-extrabold text-gray-800 mb-4 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-gray-400 rounded-full inline-block"></span>
                            기타 / 상세 입력 정보
                          </h3>
                          <div className="space-y-4">
                            {otherEntries.map(([key, value]: any) => (
                              <div key={key}>
                                <div className="text-xs font-bold text-gray-500 mb-1.5">{key}</div>
                                <div className="text-sm text-gray-900 font-medium bg-white border border-gray-200 p-3 rounded-xl whitespace-pre-wrap">
                                  {value || '-'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50 rounded-b-2xl">
              <button 
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-all font-bold shadow-sm"
              >
                <Printer className="w-5 h-5" />
                내용 출력 / PDF 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
