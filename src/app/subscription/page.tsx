"use client";

import { useState, useEffect } from 'react';
import { CreditCard, ChevronRight, ShieldCheck } from 'lucide-react';
import { getActiveStoreId, getLoggedInStore } from '@/lib/storeSession';
import {
  fetchStoreSubscription,
  isSubscriptionExpired,
  StoreSubscriptionInfo
} from '@/lib/subscriptionUtils';

export default function SubscriptionPage() {
  const [subInfo, setSubInfo] = useState<StoreSubscriptionInfo | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const activeId = getActiveStoreId();
    const store = getLoggedInStore();
    fetchStoreSubscription(activeId, store?.created_at).then(info => {
      setSubInfo(info);
      setIsExpired(isSubscriptionExpired(info, activeId));
    });
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 break-keep">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 sm:p-6 md:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4 border-b border-gray-100 pb-4 sm:pb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                나의 이용권 상태
              </h2>
              {subInfo && (
                <p className="text-xs sm:text-[13px] font-semibold text-gray-500 mt-1">
                  현재 플랜: <span className="text-gray-800 font-bold">{subInfo.plan}</span> · 이용 만료일: <span className="text-indigo-600 font-bold">{subInfo.nextBilling}</span>
                </p>
              )}
            </div>
            {isExpired ? (
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-50 text-rose-700 font-bold text-xs sm:text-sm rounded-full inline-flex items-center w-fit border border-rose-200">
                기간 만료 · 접수 링크 일시정지 (자료 보관중)
              </div>
            ) : subInfo?.status === '무료체험' ? (
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-50 text-amber-700 font-bold text-xs sm:text-sm rounded-full inline-flex items-center w-fit border border-amber-200">
                현재 무료 체험 중
              </div>
            ) : (
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-50 text-emerald-700 font-bold text-xs sm:text-sm rounded-full inline-flex items-center w-fit border border-emerald-200">
                정상 이용 중 (고객 링크 활성화)
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100 mb-6">
            <h3 className="text-base sm:text-xl font-black text-gray-900 mb-2 sm:mb-3">싹다폼 이용권 안내</h3>
            <p className="text-[13px] sm:text-[15px] text-gray-600 leading-snug sm:leading-relaxed mb-4 sm:mb-6">
              월간 정상 이용 요금은 <strong>월 29,900원</strong>.<br />
              <strong>소상공인 상생 응원가로 월 9,900원</strong>에 제한 없는 폼생성과 실시간 단골 특가푸시, 자동화된 고객 관리 시스템을 경험해보세요.<br className="hidden sm:block" />
              아날로그 수기 장부에 뺏기던 사장님의 금쪽같은 시간을 확실하게 찾아드립니다.
            </p>
            
            <div className="w-full">
              {/* 월간 결제 버튼 (단독 노출) */}
              <button onClick={() => alert('월간 결제 모듈이 실행됩니다.')} className="relative w-full bg-white border-2 border-indigo-200/80 shadow-sm sm:shadow-md shadow-gray-200/50 rounded-2xl p-5 sm:p-6 text-left hover:border-indigo-600 hover:shadow-indigo-100 transition-all group overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-bl-xl">
                  소상공인 상생 응원가
                </div>
                <div className="font-extrabold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors text-[16px] sm:text-lg">
                  월간 이용권 (1개월 단독 결제)
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                    9,900<span className="text-[14px] sm:text-[16px] font-bold text-gray-500 ml-0.5">원 / 1개월</span>
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 line-through mb-1 ml-1 font-medium">29,900원</span>
                </div>
                <div className="text-[12px] sm:text-[13.5px] text-indigo-600 font-extrabold mb-1">
                  소상공인 상생 응원 특별 할인가 · 자동결제 약정 없음
                </div>
                <div className="text-[12px] sm:text-[13px] text-gray-500 font-medium">
                  명절·이벤트 등 필요한 달에만 1개월씩 부담 없이 단독 결제로 이용하실 수 있습니다.
                </div>
              </button>
            </div>
          </div>

          {/* 1개월 단기(명절·이벤트) 이용 및 자료 보관 안내 */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 sm:p-5 mb-6 space-y-2">
            <h4 className="text-[13.5px] sm:text-[14.5px] font-extrabold text-indigo-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              명절·시즌 이벤트 등 1개월 단기 이용 시 자료 보관 안내
            </h4>
            <ul className="text-[12px] sm:text-[13px] text-indigo-900/80 font-medium space-y-1.5 leading-relaxed pl-1">
              <li>• <strong>기존 자료 100% 보관:</strong> 1개월만 결제 후 이용 기간이 끝나더라도, 회원 탈퇴 전까지 <strong>기존 고객 접수 장부와 만들어둔 맞춤폼은 절대 삭제되지 않고 그대로 보관</strong>됩니다.</li>
              <li>• <strong>만료 시 접수 링크만 일시 정지:</strong> 이용 기간이 만료되면 고객이 접속하는 신청 링크만 <em>&ldquo;현재 온라인 접수 기간이 아닙니다&rdquo;</em>로 일시 정지되며, 사장님은 언제든 로그인해 과거 접수 내역을 조회·출력·엑셀 다운로드하실 수 있습니다.</li>
              <li>• <strong>언제든 즉시 재오픈:</strong> 다음 명절이나 행사가 있을 때 다시 1개월 이용권을 결제하시면, 기존 매장 링크와 만들어둔 폼이 그대로 즉시 다시 열립니다.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 px-1 sm:px-2 text-[14px] sm:text-base">결제 내역 및 영수증</h3>
            <div className="border border-gray-100 rounded-xl">
              <button className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors rounded-xl group text-left">
                <div>
                  <div className="font-bold text-gray-900 text-[13px] sm:text-sm mb-0.5 sm:mb-1">결제 내역 및 영수증</div>
                  <div className="text-[11px] sm:text-xs text-gray-500">과거 결제 내역 확인 및 매출 전표 출력</div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

