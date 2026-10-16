"use client";

import { useEffect, useState } from 'react';
import { Package, X, Printer, CheckCircle, Download } from 'lucide-react';
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
  '일양로지스',
  '직접배송/기타',
];

export default function DeliveryList({ searchQuery = '' }: { searchQuery?: string }) {
  const [responses, setResponses] = useState<any[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [courierInputs, setCourierInputs] = useState<Record<string, string>>({});
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const filteredResponses = responses.filter(res => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const dataStr = JSON.stringify(res.data || {}).toLowerCase();
    return dataStr.includes(q);
  });

  const selectableResponses = filteredResponses.filter(r => r.status !== '취소됨');
  const isAllSelected =
    selectableResponses.length > 0 &&
    selectableResponses.every(r => selectedIds.includes(r.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const selectableIdSet = new Set(selectableResponses.map(r => r.id));
      setSelectedIds(prev => prev.filter(id => !selectableIdSet.has(id)));
    } else {
      const merged = new Set([...selectedIds, ...selectableResponses.map(r => r.id)]);
      setSelectedIds(Array.from(merged));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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
      .eq('form_id', 'delivery-preset')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Load Data Error:', error);
      alert('목록 불러오기 실패: ' + error.message);
    }

    if (data) {
      setResponses(data);
      setSelectedIds(prev => prev.filter(id => data.some((d: any) => d.id === id && d.status !== '취소됨')));
      const initialCouriers: Record<string, string> = {};
      const initialTrackings: Record<string, string> = {};
      data.forEach((item: any) => {
        initialCouriers[item.id] = item.data?._courier || '';
        initialTrackings[item.id] = item.data?._trackingNumber || '';
      });
      setCourierInputs(initialCouriers);
      setTrackingInputs(initialTrackings);
    }
  };

  const saveShippingInfo = async (res: any) => {
    const courier = (courierInputs[res.id] ?? res.data?._courier ?? '').trim();
    const trackingNumber = (trackingInputs[res.id] ?? res.data?._trackingNumber ?? '').trim();

    if (!courier) {
      alert('택배사를 선택해주세요.');
      return;
    }
    if (!trackingNumber) {
      alert('송장번호를 입력해주세요.');
      return;
    }

    setSavingId(res.id);
    const updatedData = {
      ...(res.data || {}),
      _courier: courier,
      _trackingNumber: trackingNumber,
    };

    const { error } = await supabase
      .from('ssakdaform_responses')
      .update({
        status: '발송완료',
        data: updatedData,
      })
      .eq('id', res.id);

    setSavingId(null);

    if (error) {
      alert('송장 정보 저장 실패: ' + error.message);
      return;
    }

    setResponses(prev =>
      prev.map(item =>
        item.id === res.id ? { ...item, status: '발송완료', data: updatedData } : item
      )
    );
    if (selectedResponse?.id === res.id) {
      setSelectedResponse((prev: any) =>
        prev ? { ...prev, status: '발송완료', data: updatedData } : prev
      );
    }
  };

  // 전화번호 하이픈 포맷팅 (엑셀에서 앞자리 0이 사라지는 현상 방지 및 택배사 양식 호환)
  const formatPhoneForExcel = (raw: string) => {
    if (!raw) return '';
    const digits = String(raw).replace(/[^0-9]/g, '');
    if (digits.length === 11) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
      if (digits.startsWith('02')) {
        return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
      }
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 9 && digits.startsWith('02')) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    }
    return raw;
  };

  // CSV 셀 이스케이프 처리
  const escapeCsvCell = (val: any) => {
    const str = val === null || val === undefined ? '' : String(val).replace(/\r?\n/g, ' ');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // 택배 송장용 엑셀(CSV) 다운로드 함수 (체크박스로 선택한 항목만 다운로드)
  const handleDownloadWaybillExcel = () => {
    const validTargets = filteredResponses.filter(
      r => selectedIds.includes(r.id) && r.status !== '취소됨'
    );
    if (validTargets.length === 0) {
      alert('다운로드할 택배 신청서를 왼쪽 체크박스로 먼저 선택해주세요.');
      return;
    }

    // 택배사(우체국/CJ/롯데/한진 등) 송장 대량 등록 표준 컬럼 순서
    const headers = [
      '받는분성명',
      '받는분전화번호',
      '받는분주소',
      '품목명',
      '수량',
      '배송메시지',
      '보내는분성명',
      '보내는분전화번호',
      '기타요청사항',
      '택배사',
      '송장번호',
      '배송상태',
      '접수일시'
    ];

    const rows = validTargets.map(res => {
      const d = res.data || {};
      const receiverName = d['받는 분 - 이름'] || res.receiverName || '';
      const receiverPhone = formatPhoneForExcel(d['받는 분 - 연락처'] || res.receiverPhone || '');
      const receiverAddress = d['받는 분 - 주소'] || res.receiverAddress || '';
      const itemName = d['보내는 분 - 상품명'] || '매장 발송 상품';
      const quantity = '1';
      const deliveryMsg = d['배송 기사님께 남길 말씀'] || '';
      const senderName = d['보내는 분 - 이름'] || res.senderName || '';
      const senderPhone = formatPhoneForExcel(d['보내는 분 - 연락처'] || res.senderPhone || '');
      const memo = d['기타 전달하고 싶은 내용'] || '';
      const courier = d._courier || '';
      const trackingNumber = d._trackingNumber || '';
      const status = res.status || '접수대기';
      const submittedAt = res.submitted_at ? new Date(res.submitted_at).toLocaleString('ko-KR') : '';

      return [
        receiverName,
        receiverPhone,
        receiverAddress,
        itemName,
        quantity,
        deliveryMsg,
        senderName,
        senderPhone,
        memo,
        courier,
        trackingNumber,
        status,
        submittedAt
      ].map(escapeCsvCell).join(',');
    });

    // 한글 깨짐 방지를 위한 UTF-8 BOM(\uFEFF) 추가
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `택배송장_선택목록_${validTargets.length}건_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (currentStatus === '취소됨') return;
    const newStatus = currentStatus === '발송완료' ? '접수대기' : '발송완료';
    await supabase
      .from('ssakdaform_responses')
      .update({ status: newStatus })
      .eq('id', id);
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
    <div className="max-w-6xl mx-auto pb-12">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0 {
            position: absolute !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
          .print-area, .print-area * { visibility: visible; }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
        }
      `}</style>
      
      <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[19px] md:text-xl font-bold text-gray-900 mb-1">택배접수</h1>
          <p className="text-[13px] text-gray-500">고객들이 제출한 택배 배송 신청서 리스트입니다. 원하는 내역을 체크하여 송장용 엑셀로 다운로드하세요.</p>
        </div>
        <button
          onClick={handleDownloadWaybillExcel}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13.5px] font-bold rounded-xl shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          택배 송장용 엑셀 다운로드
          {selectedIds.length > 0 && (
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-[12px] font-extrabold">
              {selectedIds.length}건
            </span>
          )}
        </button>
      </div>

      {/* 리스트 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-indigo-50/70 border-b border-indigo-100">
                <th className="pl-4 pr-2 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    title="전체 선택 / 해제"
                    className="w-4 h-4 rounded border-indigo-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                  />
                </th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">접수일시</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">보내는 분 (이름/연락처)</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">받는 분 (이름/주소)</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900 min-w-[340px]">배송상태 (택배사 / 송장번호)</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedResponses.length > 0 ? (
                paginatedResponses.map((res) => {
                  const data = res.data || {};
                  const senderName = data['보내는 분 - 이름'] || res.senderName || '-';
                  const senderPhone = data['보내는 분 - 연락처'] || res.senderPhone || '-';
                  const receiverName = data['받는 분 - 이름'] || res.receiverName || '-';
                  const receiverAddress = data['받는 분 - 주소'] || res.receiverAddress || '-';
                  const isCompleted = res.status === '발송완료';
                  const isCancelled = res.status === '취소됨';
                  const isSelected = selectedIds.includes(res.id);
                  const currentCourier = courierInputs[res.id] ?? data._courier ?? '';

                  return (
                    <tr
                      key={res.id}
                      className={`transition-colors group ${
                        isSelected ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="pl-4 pr-2 py-3 align-middle text-center w-10">
                        <input
                          type="checkbox"
                          disabled={isCancelled}
                          checked={isSelected && !isCancelled}
                          onChange={() => toggleSelectOne(res.id)}
                          title={isCancelled ? '취소된 내역은 선택할 수 없습니다' : '송장 엑셀 다운로드 선택'}
                          className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed accent-emerald-600"
                        />
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <p className="font-semibold text-gray-900 text-[13px]">{new Date(res.submitted_at).toLocaleDateString('ko-KR')}</p>
                        <p className="text-[12.5px] font-semibold text-indigo-600 mt-0.5">{new Date(res.submitted_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute:'2-digit' })}</p>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <p className="font-bold text-gray-900 text-[13px]">{senderName}</p>
                        <p className="text-[12.5px] font-semibold text-indigo-600 mt-0.5">{senderPhone}</p>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <p className="font-bold text-gray-900 text-[13px]">{receiverName}</p>
                        <p className="text-[12.5px] font-semibold text-indigo-600 truncate max-w-[180px] mt-0.5" title={receiverAddress}>{receiverAddress}</p>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        {isCancelled ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border bg-red-50 text-red-700 border-red-200">
                            <X className="w-3 h-3 mr-1" />
                            취소됨
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleStatus(res.id, res.status)}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                                  isCompleted
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                }`}
                                title="클릭하여 접수대기/발송완료 상태를 직접 전환할 수도 있습니다"
                              >
                                {isCompleted && <CheckCircle className="w-3 h-3 mr-1" />}
                                {isCompleted ? '발송완료' : '접수대기'}
                              </button>
                              {isCompleted && data._courier && data._trackingNumber && (
                                <span className="text-[11.5px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                  {data._courier} · {data._trackingNumber}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <select
                                value={currentCourier}
                                onChange={(e) =>
                                  setCourierInputs(prev => ({ ...prev, [res.id]: e.target.value }))
                                }
                                className="px-2.5 py-1.5 text-[12px] font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer"
                              >
                                <option value="">택배사 선택</option>
                                {COURIER_LIST.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                              <input
                                key={`${res.id}-${data._trackingNumber || ''}`}
                                type="text"
                                defaultValue={data._trackingNumber || ''}
                                onChange={(e) =>
                                  setTrackingInputs(prev => ({ ...prev, [res.id]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    saveShippingInfo(res);
                                  }
                                }}
                                placeholder="송장번호 입력"
                                className="w-[140px] sm:w-[155px] px-2.5 py-1.5 text-[12px] font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                              />
                              <button
                                onClick={() => saveShippingInfo(res)}
                                disabled={savingId === res.id}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[12px] font-bold transition-all active:scale-95 shrink-0 shadow-sm disabled:opacity-50"
                              >
                                {savingId === res.id ? '저장중' : '완료'}
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
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
                    <h3 className="text-gray-900 font-medium text-lg">아직 접수된 택배가 없습니다</h3>
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
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-black/5">
            <div className="px-6 py-5 flex items-center justify-between bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-md">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-200" />
                택배 접수 상세 정보
              </h2>
              <button 
                onClick={() => setSelectedResponse(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto print-area bg-gray-100 flex-1 min-h-0">
              {/* 상단 상태 티켓 */}
              <div className="bg-white rounded-2xl p-5 mb-6 shadow-md shadow-gray-200/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">접수 일시</p>
                  <p className="text-sm font-bold text-gray-900">{new Date(selectedResponse.submitted_at).toLocaleString('ko-KR')}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs font-medium text-gray-500 mb-1">배송 상태 및 송장 정보</p>
                  <div className="flex flex-wrap items-center sm:justify-end gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold">
                      {selectedResponse.status === '발송완료' ? <CheckCircle className="w-4 h-4" /> : null}
                      {selectedResponse.status === '발송완료' ? '발송완료' : '접수대기'}
                    </div>
                    {selectedResponse.data?._courier && selectedResponse.data?._trackingNumber && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold">
                        {selectedResponse.data._courier} · {selectedResponse.data._trackingNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {(() => {
                  const dataEntries = Object.entries(selectedResponse.data || { '안내': '이전 테스트 데이터이거나 내용이 없습니다.' }).filter(([k]) => !k.startsWith('_'));
                  const senderEntries = dataEntries.filter(([k]) => k.includes('보내는 분'));
                  const receiverEntries = dataEntries.filter(([k]) => k.includes('받는 분'));
                  const otherEntries = dataEntries.filter(([k]) => !k.includes('보내는 분') && !k.includes('받는 분'));

                  const renderSection = (title: string, entries: any[], isReceiver: boolean) => {
                    if (entries.length === 0) return null;
                    return (
                      <div className={`bg-white rounded-2xl p-6 shadow-md ${isReceiver ? "shadow-indigo-100/50 border border-indigo-100" : "shadow-gray-200/50 border border-transparent"}`}>
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
