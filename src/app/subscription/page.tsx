"use client";

import { CreditCard, ChevronRight } from 'lucide-react';

export default function SubscriptionPage() {
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
            </div>
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-50 text-indigo-600 font-bold text-xs sm:text-sm rounded-full inline-flex items-center w-fit border border-indigo-100">
              현재 무료 체험 중
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-xl font-black text-gray-900 mb-2 sm:mb-3">프리미엄 요금제로 업그레이드 하세요!</h3>
            <p className="text-[13px] sm:text-[15px] text-gray-600 leading-snug sm:leading-relaxed mb-4 sm:mb-6">
              월 9,900원으로 제한 없는 폼 생성과 자동화된 고객 관리 시스템을 경험해 보세요.<br className="hidden sm:block" />
              아날로그 수기 장부에 뺏기던 사장님의 금쪽같은 시간을 확실하게 찾아드립니다.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
              {/* 월간 결제 버튼 */}
              <button onClick={() => alert('월간 결제 모듈이 실행됩니다.')} className="relative w-full bg-white border-2 border-transparent shadow-sm sm:shadow-md shadow-gray-200/50 rounded-xl p-4 sm:p-5 text-left hover:border-indigo-600 hover:shadow-indigo-100 transition-all group overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] sm:text-[11px] font-bold px-2 sm:px-3 py-1 rounded-bl-xl">
                  얼리버드 특가
                </div>
                <div className="font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-indigo-600 transition-colors text-[15px] sm:text-lg">월간 결제</div>
                <div className="flex items-end gap-1.5 mb-2 sm:mb-3">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight">9,900<span className="text-[13px] sm:text-[15px] font-bold text-gray-500 ml-0.5">원</span></span>
                  <span className="text-xs sm:text-sm text-gray-400 line-through mb-0.5 sm:mb-1 ml-1 font-medium">14,900원</span>
                </div>
                <div className="text-[11px] sm:text-[13px] text-gray-500 font-medium">1개월 이용권이 1회 단독 결제됩니다.</div>
              </button>

              {/* 연간 결제 버튼 */}
              <button onClick={() => alert('연간 결제 모듈이 실행됩니다.')} className="relative w-full bg-white border-2 border-transparent shadow-sm sm:shadow-md shadow-gray-200/50 rounded-xl p-4 sm:p-5 text-left hover:border-indigo-600 hover:shadow-indigo-100 transition-all group overflow-hidden">
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] sm:text-[11px] font-bold px-2 sm:px-3 py-1 rounded-bl-xl">
                  추천! 2개월 무료
                </div>
                <div className="font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-indigo-600 transition-colors text-[15px] sm:text-lg">연간 결제</div>
                <div className="flex items-end gap-1.5 mb-1 sm:mb-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight">99,000<span className="text-[13px] sm:text-[15px] font-bold text-gray-500 ml-0.5">원</span></span>
                </div>
                <div className="text-[11px] sm:text-[13px] text-rose-500 font-bold mb-0.5 sm:mb-1">월 8,250원 꼴 (약 17% 추가 할인)</div>
                <div className="text-[11px] sm:text-[12px] text-gray-500 font-medium">1년 치가 한 번에 결제됩니다.</div>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 px-1 sm:px-2 text-[14px] sm:text-base">결제 내역 및 수단 관리</h3>
            <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
              <button className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors rounded-t-xl group text-left">
                <div>
                  <div className="font-bold text-gray-900 text-[13px] sm:text-sm mb-0.5 sm:mb-1">결제 수단 관리</div>
                  <div className="text-[11px] sm:text-xs text-gray-500">등록된 카드 변경 및 삭제</div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors rounded-b-xl group text-left">
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
