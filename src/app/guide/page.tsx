"use client";

import { ChevronLeft } from 'lucide-react';

interface GuidePageProps {
  onBack?: () => void;
}

export default function GuidePage({ onBack }: GuidePageProps) {
  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] pb-24">
      {/* 상단 고정 헤더 (< 1분 이용 가이드) */}
      <div className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onBack) {
                onBack();
              } else if (typeof window !== 'undefined') {
                window.history.back();
              }
            }}
            className="p-1.5 -ml-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="뒤로 가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[18px] sm:text-[20px] font-extrabold text-gray-900 tracking-tight">
            1분 이용 가이드
          </h1>
        </div>
      </div>

      {/* 본문 카드 영역 */}
      <div className="max-w-[580px] mx-auto px-4 pt-7 sm:pt-9 space-y-6">
        
        {/* 카드 1: 핵심 기능 요약 (보라색 상단 포인트) */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-200/70 overflow-hidden relative p-6 sm:p-7">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500" />
          
          {/* 우측 상단 전구 일러스트 아이콘 */}
          <div className="absolute top-5 right-6 opacity-90 pointer-events-none select-none">
            <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 3C10.8203 3 5 8.8203 5 16C5 20.6206 7.4126 24.6774 11.0442 26.9813C12.1924 27.7097 12.92 28.9472 13.066 30.3002L13.25 32H22.75L22.934 30.3002C23.08 28.9472 23.8076 27.7097 24.9558 26.9813C28.5874 24.6774 31 20.6206 31 16C31 8.8203 25.1797 3 18 3Z" fill="#FEF9C3" stroke="#D1D5DB" strokeWidth="2"/>
              <path d="M14 32H22V35C22 37.2091 20.2091 39 18 39C15.7909 39 14 37.2091 14 35V32Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>
              <path d="M14.5 35H21.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <h2 className="text-[18px] sm:text-[19px] font-extrabold text-purple-600 tracking-tight mb-5">
            핵심 기능 요약
          </h2>

          <ul className="space-y-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
              <div>
                <h3 className="text-[14.5px] font-extrabold text-gray-900">우리 매장 통합 접수 링크 & QR 코드</h3>
                <p className="text-[13.5px] font-medium text-gray-600 mt-0.5 leading-relaxed">
                  인스타·카톡에 링크를 공유하거나 매장 계산대에 QR 코드를 비치하면 고객이 스마트폰으로 즉시 접수합니다!
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
              <div>
                <h3 className="text-[14.5px] font-extrabold text-gray-900">현장 필수 5대 접수 (택배 · 예약 · 상품 · 간편폼 · 이력서)</h3>
                <p className="text-[13.5px] font-medium text-gray-600 mt-0.5 leading-relaxed">
                  가장 많이 쓰는 기본 신청서 4종이 완벽 세팅되어 있으며, 매장 상황에 맞는 맞춤 신청서도 무제한 만들 수 있습니다!
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
              <div>
                <h3 className="text-[14.5px] font-extrabold text-gray-900">회원가입 없는 &apos;내 접수 / 실시간 배송조회&apos;</h3>
                <p className="text-[13.5px] font-medium text-gray-600 mt-0.5 leading-relaxed">
                  고객이 본인 이름과 전화번호만 입력하면 접수 진행상황, 발송 택배사·송장번호(실시간 배송위치), 사장님 안내메모까지 직접 확인합니다!
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
              <div>
                <h3 className="text-[14.5px] font-extrabold text-gray-900">직원채용 간편이력서 (사진 · 보건증 첨부)</h3>
                <p className="text-[13.5px] font-medium text-gray-600 mt-0.5 leading-relaxed">
                  번거로운 종이 이력서 없이 지원자가 스마트폰으로 본인 사진과 보건증까지 찍어 제출하면 어드민에서 바로 검토·인쇄할 수 있습니다!
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 카드 2: 1초 컷! 초스피드 관리 팁 (파란색 상단 포인트) */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-200/70 overflow-hidden relative p-6 sm:p-7">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

          {/* 우측 상단 번개 일러스트 아이콘 */}
          <div className="absolute top-5 right-6 opacity-90 pointer-events-none select-none">
            <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5 3L6 21H17L14.5 35L28 17H17L19.5 3Z" fill="#FEFCE8" stroke="#D1D5DB" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="text-[18px] sm:text-[19px] font-extrabold text-blue-600 tracking-tight mb-5">
            1초 컷! 초스피드 관리 팁
          </h2>

          <div className="space-y-3.5">
            {/* 서브 박스 1 */}
            <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                🚚 택배사 선택 & 송장번호 입력 (문의 전화 ZERO!)
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                택배접수·상품접수 리스트에서 택배사를 고르고 송장번호를 입력해 <strong className="text-gray-900">[완료]</strong>만 누르세요! 자동으로 발송완료 처리되며, 고객 조회 화면에 <strong className="text-indigo-700">실시간 배송위치 조회</strong>까지 한 번에 연결됩니다!
              </p>
            </div>

            {/* 서브 박스 2 */}
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                💬 고객 전달 안내메모 활용하기
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                예약·상품·간편폼 리스트의 메모란에 <em>&quot;주차는 건물 뒤편 가능합니다&quot;</em>, <em>&quot;입금 확인 완료, 내일 발송됩니다&quot;</em> 등 안내사항을 적어 <strong className="text-gray-900">[완료]</strong>를 누르면 고객이 조회할 때 <strong className="text-gray-900">매장 전달 안내사항</strong>으로 눈에 띄게 표시됩니다!
              </p>
            </div>

            {/* 서브 박스 3 */}
            <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                📊 택배 송장용 엑셀(CSV) 선택 다운로드
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                택배접수 리스트 왼쪽 체크박스로 오늘 발송할 내역만 골라 <strong className="text-gray-900">[택배 송장용 엑셀 다운로드]</strong>를 누르면 우체국·CJ·롯데·로젠 등 택배 프로그램에 바로 등록할 수 있습니다!
              </p>
            </div>

            {/* 서브 박스 4 */}
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                ✨ 맞춤형 간편폼 & 단골 전용 개별 링크
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                명절 사전예약이나 특별 공동구매는 <strong className="text-gray-900">[간편폼 만들기]</strong>로 뚝딱 제작하세요. 일반 고객 화면에는 숨겨두고, 저장된 폼 목록에서 <strong className="text-gray-900">[링크 복사]</strong>를 눌러 원하는 고객에게만 프라이빗하게 보낼 수 있습니다!
              </p>
            </div>
          </div>
        </div>

        {/* 카드 3: 처음 시작하는 사장님 3단계 세팅 (에메랄드 상단 포인트) */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-200/70 overflow-hidden relative p-6 sm:p-7">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

          <h2 className="text-[18px] sm:text-[19px] font-extrabold text-emerald-600 tracking-tight mb-5">
            처음 시작하는 사장님 3단계 세팅
          </h2>

          <div className="space-y-3.5">
            <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                🏦 1단계: 가게 정보 & 무통장 입금 계좌 등록
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                하단 <strong className="text-gray-900">[마이] &gt; [설정(가게/계좌 정보)]</strong>에서 상호명, 영업시간, 입금 계좌를 입력하고 저장하면 고객 접수 화면 상단에 즉시 반영됩니다.
              </p>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                📱 2단계: 스마트폰 &apos;홈 화면에 추가&apos; 해두기
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                어드민 우측 상단의 <strong className="text-gray-900">[홈 화면에 추가]</strong> 버튼을 눌러 스마트폰 바탕화면에 아이콘을 만들어 두면, 언제 어디서나 앱처럼 1초 만에 접속해 접수 내역을 관리할 수 있습니다.
              </p>
            </div>

            <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                🖨️ 3단계: 상세 내역 확인 및 PDF 저장 · 인쇄
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                각 접수 리스트의 <strong className="text-gray-900">[상세 내용]</strong> 버튼을 누르면 깔끔하게 정리된 신청서를 한눈에 볼 수 있으며, <strong className="text-gray-900">[출력 / PDF 저장]</strong> 버튼으로 종이 인쇄나 파일 보관이 가능합니다.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
