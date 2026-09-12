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
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-black/5">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                택배 접수 상세 정보
              </h2>
              <button 
                onClick={() => setSelectedResponse(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto print-area bg-[#F8FAFC] flex-1">
              {/* 상단 상태 티켓 */}
              <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">접수 일시</p>
                  <p className="text-sm font-bold text-gray-900">{new Date(selectedResponse.submitted_at).toLocaleString('ko-KR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 mb-1">현재 상태</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold">
                    {selectedResponse.status === '발송완료' ? <CheckCircle className="w-4 h-4" /> : null}
                    {selectedResponse.status === '발송완료' ? '발송완료' : '접수대기'}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {(() => {
                  const dataEntries = Object.entries(selectedResponse.data || { '안내': '이전 테스트 데이터이거나 내용이 없습니다.' });
                  const senderEntries = dataEntries.filter(([k]) => k.includes('보내는 분'));
                  const receiverEntries = dataEntries.filter(([k]) => k.includes('받는 분'));
                  const otherEntries = dataEntries.filter(([k]) => !k.includes('보내는 분') && !k.includes('받는 분'));

                  const renderSection = (title: string, entries: any[], isReceiver: boolean) => {
                    if (entries.length === 0) return null;
                    return (
                      <div className={`bg-white border ${isReceiver ? 'border-indigo-100' : 'border-gray-200'} rounded-2xl p-6 shadow-sm`}>
                        <h3 className={`text-sm font-extrabold mb-5 pb-3 border-b-2 ${isReceiver ? 'text-indigo-900 border-indigo-900' : 'text-gray-900 border-gray-900'} flex items-center gap-2`}>
                           {title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                          {entries.map(([key, value]: any) => {
                            const cleanKey = key.replace(/보내는 분 - |받는 분 - /g, '');
                            const isFullWidth = /주소|요청사항|상세|메모|내용/.test(cleanKey) || (value && String(value).length > 25);
                            const isHighlight = /이름|연락처|전화번호|고객명/.test(cleanKey);

                            return (
                              <div key={key} className={isFullWidth ? "col-span-1 sm:col-span-2" : ""}>
                                <p className="text-[13px] font-semibold text-gray-500 mb-1.5">{cleanKey}</p>
                                <p className={`text-gray-900 ${isHighlight ? 'text-[17px] font-extrabold tracking-tight' : 'text-[15px] font-medium'} leading-relaxed whitespace-pre-wrap`}>
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
                      {renderSection('보내는 분 (발송인)', senderEntries, false)}
                      {renderSection('받는 분 (수령인)', receiverEntries, true)}
                      {renderSection('물품 및 기타 정보', otherEntries, false)}
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
}
