"use client";

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, X, Printer, CheckCircle, MessageSquare, Truck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getEffectiveAdminStoreId } from '@/lib/storeSession';

const COURIER_LIST = [
  'CJ대한통운',
  '우체국택배',
  '롯데택배',
  '한진택배',
  '로젠택배',
  '경동택배',
  'CU편의점택배',
  'GS25편의점택배',
  '퀵서비스/당일배송',
  '매장픽업/직접수령',
  '직접배송/기타',
];

export default function OrderList({ searchQuery = '' }: { searchQuery?: string }) {
  const [responses, setResponses] = useState<any[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [noticeInputs, setNoticeInputs] = useState<Record<string, string>>({});
  const [courierInputs, setCourierInputs] = useState<Record<string, string>>({});
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedFeedbackId, setSavedFeedbackId] = useState<string | null>(null);

  const filteredResponses = responses.filter(res => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const dataStr = JSON.stringify(res.data || {}).toLowerCase();
    return dataStr.includes(q);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const paginatedResponses = filteredResponses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data, error } = await supabase
      .from('ssakdaform_responses')
      .select('*')
      .eq('store_id', getEffectiveAdminStoreId())
      .eq('form_id', 'order-preset')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Load Data Error:', error);
      alert('목록 불러오기 실패: ' + error.message);
    }

    if (data) {
      setResponses(data);
      const initialNotices: Record<string, string> = {};
      const initialCouriers: Record<string, string> = {};
      const initialTrackings: Record<string, string> = {};
      data.forEach((item: any) => {
        initialNotices[item.id] = item.data?._customerNotice || '';
        initialCouriers[item.id] = item.data?._courier || '';
        initialTrackings[item.id] = item.data?._trackingNumber || '';
      });
      setNoticeInputs(initialNotices);
      setCourierInputs(initialCouriers);
      setTrackingInputs(initialTrackings);
    }
  };

  // 안내메모 및 택배사/송장번호 통합 저장 함수
  const saveOrderAndShippingInfo = async (res: any) => {
    const noticeText = (noticeInputs[res.id] ?? res.data?._customerNotice ?? '').trim();
    const courier = (courierInputs[res.id] ?? res.data?._courier ?? '').trim();
    const trackingNumber = (trackingInputs[res.id] ?? res.data?._trackingNumber ?? '').trim();

    setSavingId(res.id);

    // 송장번호(또는 퀵/매장픽업)가 입력된 경우 '발송완료', 안내메모만 입력된 경우 '입금확인'
    const hasShipping = Boolean(courier && (trackingNumber || courier.includes('퀵') || courier.includes('픽업')));
    const nextStatus = hasShipping ? '발송완료' : noticeText ? '입금확인' : '발송완료';

    const updatedData = {
      ...(res.data || {}),
      _customerNotice: noticeText,
      _courier: courier,
      _trackingNumber: trackingNumber,
      _orderConfirmed: true,
    };

    const { error } = await supabase
      .from('ssakdaform_responses')
      .update({
        status: nextStatus,
        data: updatedData,
      })
      .eq('id', res.id);

    setSavingId(null);

    if (error) {
      alert('저장 실패: ' + error.message);
      return;
    }

    setResponses(prev =>
      prev.map(item =>
        item.id === res.id ? { ...item, status: nextStatus, data: updatedData } : item
      )
    );
    if (selectedResponse?.id === res.id) {
      setSelectedResponse((prev: any) =>
        prev ? { ...prev, status: nextStatus, data: updatedData } : prev
      );
    }

    setSavedFeedbackId(res.id);
    setTimeout(() => {
      setSavedFeedbackId(prev => (prev === res.id ? null : prev));
    }, 1800);
  };

  const toggleOrderStatus = async (res: any) => {
    if (res.status === '취소됨') return;
    const isOrderConfirmed = res.status === '입금확인' || res.status === '발송완료' || res.data?._orderConfirmed;
    const nextConfirmed = !isOrderConfirmed;
    const nextStatus = !nextConfirmed ? '접수대기' : (res.data?._courier && res.data?._trackingNumber ? '발송완료' : '입금확인');
    const updatedData = {
      ...(res.data || {}),
      _orderConfirmed: nextConfirmed,
    };
    await supabase
      .from('ssakdaform_responses')
      .update({ status: nextStatus, data: updatedData })
      .eq('id', res.id);
    loadData();
  };

  const toggleShippingStatus = async (res: any) => {
    if (res.status === '취소됨') return;
    const newStatus = res.status === '발송완료' ? '입금확인' : '발송완료';
    await supabase
      .from('ssakdaform_responses')
      .update({ status: newStatus })
      .eq('id', res.id);
    loadData();
  };

  const cancelStatus = async (id: string) => {
    if (!window.confirm('정말 취소 처리하시겠습니까?')) return;
    await supabase
      .from('ssakdaform_responses')
      .update({ status: '취소됨' })
      .eq('id', id);
    loadData();
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm('이 내역을 목록에서 완전히 삭제하시겠습니까?\n(삭제 후에는 복구할 수 없습니다)')) return;
    await supabase
      .from('ssakdaform_responses')
      .delete()
      .eq('id', id);
    loadData();
  };

  const openDetails = (res: any) => {
    setSelectedResponse(res);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 print:pb-0">
      <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-3 no-print">
        <div>
          <h1 className="text-[19px] md:text-xl font-bold text-gray-900 mb-1">상품접수</h1>
          <p className="text-[13px] text-gray-500">고객들이 제출한 상품 주문서 리스트입니다. 안내메모와 택배사·송장번호를 입력하고 완료를 누르면 고객 조회 화면에 바로 전달됩니다.</p>
        </div>
      </div>

      {/* 리스트 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] no-print">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-indigo-50/70 border-b border-indigo-100">
                <th className="w-[115px] px-4 py-2.5 text-[13px] font-bold text-indigo-900 leading-tight whitespace-nowrap align-middle">
                  주문일시
                  <span className="block text-[11px] font-medium text-indigo-600/80 mt-0.5">(날짜/시간)</span>
                </th>
                <th className="w-[135px] px-4 py-2.5 text-[13px] font-bold text-indigo-900 leading-tight whitespace-nowrap align-middle">
                  주문자
                  <span className="block text-[11px] font-medium text-indigo-600/80 mt-0.5">(이름/연락처)</span>
                </th>
                <th className="w-[150px] px-4 py-2.5 text-[13px] font-bold text-indigo-900 leading-tight whitespace-nowrap align-middle">
                  주문상품
                  <span className="block text-[11px] font-medium text-indigo-600/80 mt-0.5">(상품명/입금자명)</span>
                </th>
                <th className="w-[110px] px-3 py-2.5 text-[13px] font-bold text-indigo-900 leading-tight whitespace-nowrap text-center align-middle">
                  접수상태
                  <span className="block text-[11px] font-medium text-indigo-600/80 mt-0.5">(상태변경)</span>
                </th>
                <th className="px-4 py-2.5 text-[13px] font-bold text-indigo-900 leading-tight min-w-[340px] align-middle">
                  배송상태
                  <span className="block text-[11px] font-medium text-indigo-600/80 mt-0.5">(안내메모 / 송장입력)</span>
                </th>
                <th className="w-[215px] px-4 py-2.5 text-[13px] font-bold text-indigo-900 leading-tight text-center whitespace-nowrap align-middle">
                  관리
                  <span className="block text-[11px] font-medium text-indigo-600/80 mt-0.5">(상세/취소/삭제)</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedResponses.length > 0 ? (
                paginatedResponses.map((res) => {
                  const data = res.data || {};
                  const customerName = data['고객명'] || '-';
                  const customerPhone = data['연락처'] || '-';
                  const productName = data['상품명'] || '-';
                  const depositorName = data['입금자명'] || '-';
                  const isCancelled = res.status === '취소됨';
                  const isShipped = res.status === '발송완료';
                  const isOrderConfirmed = res.status === '입금확인' || isShipped || Boolean(data._orderConfirmed);
                  const currentCourier = courierInputs[res.id] ?? data._courier ?? '';

                  return (
                    <tr key={res.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-3 align-middle whitespace-nowrap">
                        <div className="font-semibold text-gray-900 text-[13px]">
                          {new Date(res.submitted_at).toLocaleDateString('ko-KR')}
                        </div>
                        <div className="text-[12.5px] font-semibold text-indigo-600 mt-0.5">
                          {new Date(res.submitted_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle whitespace-nowrap">
                        <div className="font-bold text-gray-900 text-[13px]">{customerName}</div>
                        <div className="text-[12.5px] font-semibold text-indigo-600 mt-0.5">{customerPhone}</div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="font-bold text-gray-900 text-[13px] break-keep">{productName}</div>
                        <div className="text-[12.5px] font-semibold text-indigo-600 mt-0.5">{depositorName}</div>
                      </td>
                      <td className="px-3 py-3 align-middle text-center whitespace-nowrap">
                        {isCancelled ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border bg-red-50 text-red-700 border-red-200">
                            <X className="w-3 h-3 mr-1" />
                            취소됨
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleOrderStatus(res)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-bold border transition-colors ${
                              isShipped
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : isOrderConfirmed
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                            }`}
                            title="클릭하여 접수상태를 전환할 수 있습니다"
                          >
                            {(isShipped || isOrderConfirmed) && <CheckCircle className="w-3 h-3 mr-1" />}
                            {isShipped ? '발송완료' : isOrderConfirmed ? '입금·주문확인' : '접수대기'}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        {isCancelled ? (
                          <span className="text-[12px] text-gray-400">-</span>
                        ) : (
                          <div className="flex flex-col gap-1.5 w-full max-w-[430px]">
                            {/* 1줄: 택배사/퀵 드롭다운 + 송장번호 입력 */}
                            <div className="flex items-center gap-1.5">
                              <select
                                value={currentCourier}
                                onChange={(e) =>
                                  setCourierInputs(prev => ({ ...prev, [res.id]: e.target.value }))
                                }
                                className="px-2.5 py-1.5 text-[12px] font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer"
                              >
                                <option value="">택배사 / 배송방식 선택</option>
                                {COURIER_LIST.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                              <input
                                key={`track-${res.id}-${data._trackingNumber || ''}`}
                                type="text"
                                defaultValue={data._trackingNumber || ''}
                                onChange={(e) =>
                                  setTrackingInputs(prev => ({ ...prev, [res.id]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    saveOrderAndShippingInfo(res);
                                  }
                                }}
                                placeholder="송장번호 (또는 퀵 기사님 연락처)"
                                className="flex-1 min-w-[140px] px-2.5 py-1.5 text-[12px] font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                              />
                            </div>

                            {/* 2줄: 고객 전달 안내메모 + 완료 버튼 */}
                            <div className="flex items-center gap-1.5">
                              <input
                                key={`notice-${res.id}-${data._customerNotice || ''}`}
                                type="text"
                                defaultValue={data._customerNotice || ''}
                                onChange={(e) =>
                                  setNoticeInputs(prev => ({ ...prev, [res.id]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    saveOrderAndShippingInfo(res);
                                  }
                                }}
                                placeholder="고객 전달 안내메모 (예: 입금확인 완료, 내일 발송 등)"
                                className="flex-1 px-2.5 py-1.5 text-[12px] font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                              />
                              <button
                                onClick={() => saveOrderAndShippingInfo(res)}
                                disabled={savingId === res.id}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all active:scale-95 shrink-0 shadow-sm ${
                                  savedFeedbackId === res.id
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                } disabled:opacity-50`}
                              >
                                {savingId === res.id ? '저장중' : savedFeedbackId === res.id ? '✓ 완료됨' : '완료'}
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center align-middle whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                          <button 
                            onClick={() => openDetails(res)}
                            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                          >
                            상세 내용
                          </button>
                          {res.status !== '취소됨' && (
                            <button 
                              onClick={() => cancelStatus(res.id)} 
                              className="inline-flex items-center px-2.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100 rounded-lg text-[12px] font-bold transition-all"
                            >
                              주문 취소
                            </button>
                          )}
                          <button 
                            onClick={() => deleteItem(res.id)} 
                            className="inline-flex items-center px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 rounded-lg text-[12px] font-bold transition-all"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-gray-900 font-medium text-lg">아직 접수된 주문이 없습니다</h3>
                    <p className="text-gray-500 mt-1 text-sm">고객에게 통합 링크를 전달하여 접수를 받아보세요.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4 bg-gray-50/50 border-t border-gray-100">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt;
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-bold transition-colors ${
                  currentPage === pageNum 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &gt;
          </button>
        </div>
      )}
      </div>

      {/* 모달 */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 print-modal-root">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-black/5 print-modal-card">
            <div className="px-5 py-3.5 flex items-center justify-between bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-sm print:bg-none print:text-gray-900 print:border-b-2 print:border-gray-900 print:px-0 print:py-2">
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-200 print:text-indigo-700" />
                주문 상세 정보
              </h2>
              <button 
                onClick={() => setSelectedResponse(null)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors no-print"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-5 overflow-y-auto print-area bg-gray-50 flex-1 min-h-0 space-y-3 print:bg-white print:p-0 print:pt-3">
              <div className="bg-white rounded-xl px-4 py-3 border border-gray-200/80 shadow-sm flex flex-wrap justify-between items-center gap-2 print:shadow-none print:border-gray-300">
                <div>
                  <p className="text-[11px] font-medium text-gray-500">접수 일시</p>
                  <p className="text-[13px] font-bold text-gray-900">{new Date(selectedResponse.submitted_at).toLocaleString('ko-KR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium text-gray-500 mb-0.5">접수 및 배송 상태</p>
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                      {selectedResponse.status === '발송완료' || selectedResponse.status === '입금확인' ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                      {selectedResponse.status || '접수대기'}
                    </div>
                    {selectedResponse.data?._courier && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        {selectedResponse.data._courier}
                        {selectedResponse.data._trackingNumber ? ` · ${selectedResponse.data._trackingNumber}` : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {(() => {
                  const dataEntries = Object.entries(selectedResponse.data || { '안내': '내용이 없습니다.' }).filter(([k]) => !k.startsWith('_'));
                  const orderEntries = dataEntries.filter(([k]) => k.includes('상품명') || k.includes('주문 날짜'));
                  const customerEntries = dataEntries.filter(([k]) => k.includes('고객명') || k.includes('연락처') || k.includes('입금자명') || k.includes('주소'));
                  const otherEntries = dataEntries.filter(([k]) => !k.includes('상품명') && !k.includes('주문 날짜') && !k.includes('고객명') && !k.includes('연락처') && !k.includes('입금자명') && !k.includes('주소'));

                  const renderSection = (title: string, entries: any[], isHighlightStyle: boolean) => {
                    if (entries.length === 0) return null;
                    return (
                      <div className={`bg-white rounded-xl p-4 shadow-sm print:shadow-none ${isHighlightStyle ? "border border-indigo-200" : "border border-gray-200/80 print:border-gray-300"}`}>
                        <h3 className={`text-[13px] font-extrabold mb-3 pb-2 border-b ${isHighlightStyle ? 'text-indigo-900 border-indigo-200' : 'text-gray-900 border-gray-200'} flex items-center gap-2`}>
                           {title}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                          {entries.map(([key, value]: any) => {
                            const isFullWidth = /주소|요청사항|상세|메모|내용|상품명/.test(key) || (value && String(value).length > 22);
                            const isHighlightText = /이름|연락처|전화번호|고객|날짜|상품|입금자/.test(key);

                            return (
                              <div key={key} className={isFullWidth ? "col-span-2 sm:col-span-3" : ""}>
                                <p className="text-[11.5px] font-semibold text-gray-500 mb-0.5">{key}</p>
                                <p className={`text-gray-900 ${isHighlightText ? 'text-[14.5px] font-extrabold tracking-tight' : 'text-[13.5px] font-medium'} leading-snug whitespace-pre-wrap`}>
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
                    <div className="space-y-3">
                      {renderSection('상품 및 주문 정보', orderEntries, true)}
                      {renderSection('고객 정보', customerEntries, false)}
                      {renderSection('기타 요청사항', otherEntries, false)}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-gray-100 bg-white flex justify-end gap-2.5 rounded-b-[20px] no-print">
              <button 
                onClick={() => setSelectedResponse(null)}
                className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                닫기
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all text-sm font-bold shadow-md"
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
