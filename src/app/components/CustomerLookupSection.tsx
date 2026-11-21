"use client";

import { useState } from 'react';
import {
  Search,
  ChevronRight,
  Truck,
  X,
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CustomerLookupSectionProps {
  storeId: string;
  storeName?: string;
  className?: string;
}

export default function CustomerLookupSection({
  storeId,
  storeName = '우리 매장',
  className = 'mb-6'
}: CustomerLookupSectionProps) {
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [lookupName, setLookupName] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResults, setLookupResults] = useState<any[] | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  const openLookupModal = () => {
    setLookupName('');
    setLookupPhone('');
    setLookupResults(null);
    setLookupLoading(false);
    setCopiedTracking(null);
    setIsLookupOpen(true);
  };

  const closeLookupModal = () => {
    setIsLookupOpen(false);
    setLookupName('');
    setLookupPhone('');
    setLookupResults(null);
    setLookupLoading(false);
    setCopiedTracking(null);
  };

  const handleCopyTracking = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber).then(() => {
      setCopiedTracking(trackingNumber);
      setTimeout(() => setCopiedTracking(null), 2000);
    });
  };

  const maskAddress = (addr: string) => {
    if (!addr) return '-';
    const parts = addr.trim().split(/\s+/);
    if (parts.length <= 2) return addr;
    return `${parts.slice(0, 3).join(' ')} ***`;
  };

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetName = lookupName.trim();
    const targetPhoneDigits = lookupPhone.replace(/[^0-9]/g, '');

    if (!targetName) {
      alert('신청자 이름을 입력해주세요.');
      return;
    }
    if (targetPhoneDigits.length < 4) {
      alert('연락처를 정확히 입력해주세요.');
      return;
    }

    setLookupLoading(true);
    const { data, error } = await supabase
      .from('ssakdaform_responses')
      .select('*')
      .eq('store_id', storeId)
      .neq('form_id', 'resume-preset')
      .order('submitted_at', { ascending: false });

    setLookupLoading(false);

    if (error) {
      alert('조회 중 오류가 발생했습니다: ' + error.message);
      return;
    }

    const matched = (data || []).filter((row: any) => {
      const d = row.data || {};
      const entries = Object.entries(d).filter(([k]) => !k.startsWith('_'));

      if (row.form_id === 'delivery-preset') {
        const senderName = String(d['보내는 분 - 이름'] || row.senderName || '').trim();
        const senderPhone = String(d['보내는 분 - 연락처'] || row.senderPhone || '').replace(/[^0-9]/g, '');
        const receiverName = String(d['받는 분 - 이름'] || row.receiverName || '').trim();
        const receiverPhone = String(d['받는 분 - 연락처'] || row.receiverPhone || '').replace(/[^0-9]/g, '');

        const isSenderMatch =
          senderName === targetName &&
          senderPhone.length >= 4 &&
          (senderPhone === targetPhoneDigits || senderPhone.endsWith(targetPhoneDigits));
        const isReceiverMatch =
          receiverName === targetName &&
          receiverPhone.length >= 4 &&
          (receiverPhone === targetPhoneDigits || receiverPhone.endsWith(targetPhoneDigits));

        return isSenderMatch || isReceiverMatch;
      }

      let nameMatched = false;
      let phoneMatched = false;

      for (const [k, v] of entries) {
        const valStr = String(v || '').trim();
        const valDigits = valStr.replace(/[^0-9]/g, '');

        if (/이름|성함|고객명|예약자|주문자/.test(k)) {
          if (valStr === targetName) nameMatched = true;
        }
        if (/연락처|전화번호|휴대폰|핸드폰/.test(k)) {
          if (valDigits.length >= 4 && (valDigits === targetPhoneDigits || valDigits.endsWith(targetPhoneDigits))) {
            phoneMatched = true;
          }
        }
      }

      if (!nameMatched) {
        nameMatched = entries.some(([, v]) => String(v || '').trim() === targetName);
      }
      if (!phoneMatched) {
        phoneMatched = entries.some(([, v]) => {
          const digits = String(v || '').replace(/[^0-9]/g, '');
          return digits.length >= 8 && (digits === targetPhoneDigits || digits.endsWith(targetPhoneDigits));
        });
      }

      return nameMatched && phoneMatched;
    });

    setLookupResults(matched);
  };

  const getFormCategoryMeta = (formId: string, data: any) => {
    if (formId === 'delivery-preset') {
      return {
        label: '택배접수',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        defaultPending: '접수대기'
      };
    }
    if (formId === 'reservation-preset') {
      return {
        label: '매장예약',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        defaultPending: '접수대기'
      };
    }
    if (formId === 'order-preset') {
      return {
        label: '상품주문',
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
        defaultPending: '접수대기'
      };
    }
    return {
      label: data?.formTitle || '간편폼접수',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      defaultPending: '접수대기'
    };
  };

  return (
    <>
      <div className={className}>
        <button
          type="button"
          onClick={openLookupModal}
          className="w-full text-left group relative p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#7E22CE] text-white shadow-[0_8px_24px_rgba(91,33,182,0.25)] hover:shadow-[0_12px_30px_rgba(91,33,182,0.35)] transition-all duration-300 flex items-center gap-3.5 hover:-translate-y-0.5 active:scale-[0.99] overflow-hidden border border-white/20"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/15 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-6 -bottom-8 w-24 h-24 bg-fuchsia-300/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="relative z-10 p-2.5 sm:p-3 rounded-xl bg-white text-[#5B21B6] shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4]" />
          </div>
          <div className="relative z-10 flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-extrabold text-white text-[15.5px] sm:text-[17px] tracking-tight drop-shadow-sm whitespace-nowrap">
                내 접수 / 배송 조회
              </h3>
              <span className="px-2 py-0.5 text-[10px] sm:text-[10.5px] font-extrabold bg-amber-300 text-purple-950 rounded-full shadow-sm whitespace-nowrap">
                실시간 확인
              </span>
            </div>
            <p className="text-[12px] sm:text-[12.5px] text-purple-50 font-medium truncate">
              이름과 연락처로 송장번호·예약·주문 상태를 확인하세요
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/20 group-hover:bg-white/30 backdrop-blur-sm text-white text-[11.5px] sm:text-[12px] font-extrabold transition-colors shrink-0 border border-white/25">
            <span>조회</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </button>
      </div>

      {isLookupOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#7E22CE] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#5B21B6] shadow-sm flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-extrabold tracking-tight">내 접수 / 배송 조회</h2>
                  <p className="text-[12px] text-purple-100">{storeName} 접수 내역 확인</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeLookupModal}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-gray-50/70">
              <form onSubmit={handleLookup} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-sm space-y-3.5">
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">
                    신청자 이름 <span className="text-[#5B21B6] font-normal">(택배는 보내는 분 또는 받는 분 이름)</span>
                  </label>
                  <input
                    type="text"
                    value={lookupName}
                    onChange={(e) => setLookupName(e.target.value)}
                    placeholder="예: 김철수"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#5B21B6] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">
                    휴대폰 번호
                  </label>
                  <input
                    type="tel"
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value)}
                    placeholder="예: 010-2345-6789 (숫자만 입력 가능)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#5B21B6] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full py-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold rounded-xl text-[14.5px] shadow-md shadow-purple-900/15 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  {lookupLoading ? '조회 중...' : '접수 및 배송상태 조회하기'}
                </button>
              </form>

              {lookupResults !== null && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[13.5px] font-extrabold text-gray-800">
                      조회 결과 <span className="text-[#5B21B6]">{lookupResults.length}건</span>
                    </h3>
                  </div>

                  {lookupResults.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                      <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
                      <p className="text-[14.5px] font-bold text-gray-800 mb-1">일치하는 접수 내역이 없습니다</p>
                      <p className="text-[12.5px] text-gray-500">
                        신청 시 입력하신 이름과 연락처가 맞는지 다시 확인해주세요.
                      </p>
                    </div>
                  ) : (
                    lookupResults.map((item) => {
                      const d = item.data || {};
                      const meta = getFormCategoryMeta(item.form_id, d);
                      const status = item.status || meta.defaultPending;
                      const isDone =
                        status === '발송완료' ||
                        status === '입금확인' ||
                        status === '예약확정' ||
                        status === '확인완료' ||
                        status === '결제완료';
                      const isCancelled = status === '취소됨';
                      const courier = d._courier || '';
                      const trackingNumber = d._trackingNumber || '';
                      const isOrderShipped = status === '발송완료';

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden"
                        >
                          <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-md text-[11.5px] font-extrabold border ${meta.badgeClass}`}>
                                {meta.label}
                              </span>
                              <span className="text-[12px] text-gray-500 font-medium">
                                {new Date(item.submitted_at).toLocaleDateString('ko-KR')}{' '}
                                {new Date(item.submitted_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-extrabold border ${
                                isCancelled
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : isDone
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {status}
                            </span>
                          </div>

                          <div className="p-4 space-y-3">
                            {item.form_id === 'delivery-preset' ? (
                              <>
                                <div className="grid grid-cols-2 gap-2 text-[13px]">
                                  <div className="bg-gray-50 p-2.5 rounded-xl">
                                    <p className="text-[11px] text-gray-400 font-semibold mb-0.5">보내는 분</p>
                                    <p className="font-bold text-gray-900">{d['보내는 분 - 이름'] || item.senderName || '-'}</p>
                                  </div>
                                  <div className="bg-gray-50 p-2.5 rounded-xl">
                                    <p className="text-[11px] text-gray-400 font-semibold mb-0.5">받는 분</p>
                                    <p className="font-bold text-gray-900">{d['받는 분 - 이름'] || item.receiverName || '-'}</p>
                                  </div>
                                </div>

                                <div className="text-[12.5px] text-gray-600 bg-gray-50/70 px-3 py-2 rounded-xl space-y-1">
                                  {d['보내는 분 - 상품명'] && (
                                    <p><span className="font-bold text-gray-700 mr-1.5">품목명:</span>{d['보내는 분 - 상품명']}</p>
                                  )}
                                  <p>
                                    <span className="font-bold text-gray-700 mr-1.5">배송지:</span>
                                    {maskAddress(d['받는 분 - 주소'] || item.receiverAddress || '')}
                                  </p>
                                </div>

                                {courier && trackingNumber ? (
                                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-emerald-50/60 border border-purple-200/80 space-y-2.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <div>
                                        <p className="text-[11px] font-bold text-[#5B21B6] mb-0.5">발송 택배사 및 송장번호</p>
                                        <p className="text-[15px] font-extrabold text-gray-900 tracking-tight">
                                          {courier} <span className="text-[#5B21B6] font-mono">{trackingNumber}</span>
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyTracking(trackingNumber)}
                                        className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-purple-100 rounded-lg text-[11.5px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all shrink-0"
                                      >
                                        {copiedTracking === trackingNumber ? (
                                          <>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>복사됨</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                                            <span>송장복사</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <a
                                      href={`https://search.naver.com/search.naver?query=${encodeURIComponent(`${courier} ${trackingNumber}`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="w-full py-2.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.99]"
                                    >
                                      <Truck className="w-4 h-4" />
                                      <span>실시간 배송위치 조회</span>
                                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                                    </a>
                                  </div>
                                ) : (
                                  <div className="px-3.5 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[12px] text-amber-800 font-medium">
                                    {isCancelled
                                      ? '취소된 택배 접수건입니다.'
                                      : '매장에서 상품 및 송장을 준비 중입니다. 송장이 등록되면 이곳에서 송장번호와 배송위치를 바로 확인하실 수 있습니다.'}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="space-y-2.5">
                                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-[13px]">
                                  {Object.entries(d)
                                    .filter(([k]) => !k.startsWith('_') && k !== 'formTitle')
                                    .map(([k, v]) => (
                                      <div key={k} className="flex justify-between gap-3">
                                        <span className="text-gray-500 font-semibold shrink-0">{k}</span>
                                        <span className="text-gray-900 font-bold text-right break-all">
                                          {/주소/.test(k) ? maskAddress(String(v || '')) : String(v || '-')}
                                        </span>
                                      </div>
                                    ))}
                                </div>

                                {item.form_id === 'order-preset' && courier && (
                                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-emerald-50/60 border border-purple-200/80 space-y-2.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <div>
                                        <p className="text-[11px] font-bold text-[#5B21B6] mb-0.5">배송방식 및 송장정보</p>
                                        <p className="text-[15px] font-extrabold text-gray-900 tracking-tight">
                                          {courier}{' '}
                                          {trackingNumber && (
                                            <span className="text-[#5B21B6] font-mono">{trackingNumber}</span>
                                          )}
                                        </p>
                                      </div>
                                      {trackingNumber && (
                                        <button
                                          type="button"
                                          onClick={() => handleCopyTracking(trackingNumber)}
                                          className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-purple-100 rounded-lg text-[11.5px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all shrink-0"
                                        >
                                          {copiedTracking === trackingNumber ? (
                                            <>
                                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                              <span>복사됨</span>
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3.5 h-3.5 text-gray-400" />
                                              <span>번호복사</span>
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                    {trackingNumber && !courier.includes('퀵') && !courier.includes('픽업') && (
                                      <a
                                        href={`https://search.naver.com/search.naver?query=${encodeURIComponent(`${courier} ${trackingNumber}`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-2.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.99]"
                                      >
                                        <Truck className="w-4 h-4" />
                                        <span>실시간 배송위치 조회</span>
                                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                                      </a>
                                    )}
                                  </div>
                                )}

                                {isCancelled ? (
                                  <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[12.5px] text-red-700 font-bold">
                                    취소된 접수 내역입니다.
                                  </div>
                                ) : isDone ? (
                                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-purple-50/60 border border-emerald-200/90 space-y-1.5">
                                    <p className="text-[13px] font-extrabold text-emerald-800 flex items-center gap-1.5">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                      {item.form_id === 'reservation-preset'
                                        ? '예약이 완료(확정)되었습니다!'
                                        : item.form_id === 'order-preset'
                                          ? isOrderShipped
                                            ? '주문하신 상품이 발송 완료되었습니다!'
                                            : '입금 및 주문 내역이 확인되었습니다!'
                                          : '접수가 정상적으로 확인되었습니다!'}
                                    </p>
                                    {d._customerNotice && (
                                      <div className="mt-1.5 pt-2 border-t border-emerald-200/70">
                                        <p className="text-[11px] font-extrabold text-[#5B21B6] mb-0.5">📢 매장 전달 안내사항</p>
                                        <p className="text-[13px] font-bold text-gray-900 whitespace-pre-wrap leading-relaxed">
                                          {d._customerNotice}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                                    <p className="text-[12.5px] text-amber-800 font-bold">
                                      현재 매장에서 접수 내역을 확인 중입니다.
                                    </p>
                                    {d._customerNotice && (
                                      <div className="mt-1.5 pt-2 border-t border-amber-200/70">
                                        <p className="text-[11px] font-extrabold text-[#5B21B6] mb-0.5">📢 매장 전달 안내사항</p>
                                        <p className="text-[13px] font-bold text-gray-900 whitespace-pre-wrap leading-relaxed">
                                          {d._customerNotice}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 bg-white border-t border-gray-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={closeLookupModal}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-[13px] transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
