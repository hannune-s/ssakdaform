"use client";

import { useEffect, useState } from 'react';
import { Package, Search, Calendar, ChevronRight, X, Printer, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ReservationListPage() {
  const [responses, setResponses] = useState<any[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data, error } = await supabase
      .from('ssakdaform_responses')
      .select('*')
      .eq('form_id', 'reservation-preset')
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
    const newStatus = currentStatus === '예약확정' ? '접수대기' : '예약확정';
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">매장 예약 신청 현황</h1>
          <p className="text-gray-500">고객들이 제출한 매장 예약 신청서 리스트입니다.</p>
        </div>
      </div>

      {/* 리스트 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">접수일시</th>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">예약자 (이름/연락처)</th>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">예약 일정 (날짜/시간)</th>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">상태</th>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {responses.length > 0 ? (
                responses.map((res) => {
                  const data = res.data || {};
                  const resName = data['예약자 이름'] || '-';
                  const resPhone = data['연락처'] || '-';
                  const resDate = data['예약 날짜'] || '-';
                  const resTime = data['예약 시간'] || '-';
                  const isCompleted = res.status === '예약확정';

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
                        <div className="text-sm font-bold text-slate-800 mb-1">{resName}</div>
                        <div className="text-sm text-slate-500 font-mono">{resPhone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-bold text-[#5C4D3C] mb-1">{resDate}</div>
                        <div className="text-sm text-gray-600">{resTime}</div>
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
                          {isCompleted ? '예약확정' : '접수대기'}
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
                    <h3 className="text-gray-900 font-medium text-lg">아직 접수된 예약이 없습니다</h3>
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
              <h2 className="text-lg font-bold text-gray-900">매장 예약 상세 정보</h2>
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
                    <div className="font-bold text-indigo-600">{selectedResponse.status === '예약확정' ? '예약확정' : '접수대기'}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {(() => {
                  const dataEntries = Object.entries(selectedResponse.data || { '안내': '이전 테스트 데이터이거나 내용이 없습니다.' });
                  const senderEntries = dataEntries.filter(([k]) => k.includes('예약자'));
                  const receiverEntries = dataEntries.filter(([k]) => k.includes('예약 일정'));
                  const otherEntries = dataEntries.filter(([k]) => !k.includes('예약자') && !k.includes('예약 일정'));

                  return (
                    <div className="space-y-6">
                      {senderEntries.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                          <h3 className="font-extrabold text-slate-800 mb-4 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-slate-600 rounded-full inline-block"></span>
                            예약자 (발송인)
                          </h3>
                          <div className="space-y-4">
                            {senderEntries.map(([key, value]: any) => (
                              <div key={key}>
                                <div className="text-xs font-bold text-slate-500 mb-1.5">{key.replace('예약자 - ', '')}</div>
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
                            예약 일정 (수령인)
                          </h3>
                          <div className="space-y-4">
                            {receiverEntries.map(([key, value]: any) => (
                              <div key={key}>
                                <div className="text-xs font-bold text-[#8B7355] mb-1.5">{key.replace('예약 일정 - ', '')}</div>
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
