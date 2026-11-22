"use client";

import { ChevronLeft } from 'lucide-react';

interface GuidePageProps {
  onBack?: () => void;
}

export default function GuidePage({ onBack }: GuidePageProps) {
  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] pb-24 break-keep">
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
        
        {/* 카드 1: 왜 '싹다폼'인가요? 핵심 장점 4가지 (보라색 상단 포인트) */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-200/70 overflow-hidden relative p-6 sm:p-7">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#3B0764] via-[#5B21B6] to-[#7E22CE]" />
          
          <div className="absolute top-5 right-6 opacity-90 pointer-events-none select-none">
            <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 3C10.8203 3 5 8.8203 5 16C5 20.6206 7.4126 24.6774 11.0442 26.9813C12.1924 27.7097 12.92 28.9472 13.066 30.3002L13.25 32H22.75L22.934 30.3002C23.08 28.9472 23.8076 27.7097 24.9558 26.9813C28.5874 24.6774 31 20.6206 31 16C31 8.8203 25.1797 3 18 3Z" fill="#FEF9C3" stroke="#D1D5DB" strokeWidth="2"/>
              <path d="M14 32H22V35C22 37.2091 20.2091 39 18 39C15.7909 39 14 37.2091 14 35V32Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>
              <path d="M14.5 35H21.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <h2 className="text-[18px] sm:text-[19px] font-extrabold text-[#5B21B6] tracking-tight mb-5">
            우리 매장만의 올인원 고객 홈페이지 & 접수 시스템
          </h2>

          <ul className="space-y-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B21B6] mt-2 shrink-0" />
              <div>
                <h3 className="text-[14.5px] font-extrabold text-gray-900">
                  1. 내가 꾸민 맞춤폼이 곧 &apos;우리 매장 대표 화면&apos;!
                </h3>
                <p className="text-[13.5px] font-medium text-gray-600 mt-0.5 leading-relaxed">
                  <strong>[간편폼 만들기]</strong>에서 단골 등록, 사전예약, 주문서 등 원하는 폼을 만들고 <strong>[⭐ 대표 화면 지정]</strong>만 누르세요! 우리 매장 통합 링크(<code>/store/내매장ID</code>)와 QR코드로 접속하는 즉시 사장님이 꾸민 화면이 멋지게 열립니다.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B21B6] mt-2 shrink-0" />
              <div>
                <h3 className="text-[14.5px] font-extrabold text-gray-900">
                  2. 아무 설정 없이도 &apos;간편 택배 접수&apos; &amp; &apos;직원채용 이력서&apos; 기본 장착
                </h3>
                <p className="text-[13.5px] font-medium text-gray-600 mt-0.5 leading-relaxed">
                  컴퓨터가 익숙하지 않은 사장님도 걱정 없습니다. 고객 화면 상단에 <strong>[간편 택배 접수]</strong>(상품명·수량·매장결제완료/계좌이체 입금자 확인 포함)와 <strong>[직원채용 이력서]</strong>(사진·보건증 첨부) 버튼이 기본으로 자동 탑재되어 있습니다!
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B21B6] mt-2 shrink-0" />
              <div>
                <h3 className="text-[14.5px] font-extrabold text-gray-900">
                  3. 쇼핑몰 · 미니블로그 · 세일 전단지 외부 링크 한눈에 연결
                </h3>
                <p className="text-[13.5px] font-medium text-gray-600 mt-0.5 leading-relaxed">
                  매장 블로그(소소한 기록), 실시간 특가/세일 알림 페이지, 스마트스토어, 인스타그램 등을 고객 화면 최상단에 돋보이는 버튼으로 연결하고 위·아래 순서도 자유롭게 바꿀 수 있습니다!
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B21B6] mt-2 shrink-0" />
              <div>
                <h3 className="text-[14.5px] font-extrabold text-gray-900">
                  4. 회원가입 없는 &apos;내 접수 / 실시간 배송조회&apos;
                </h3>
                <p className="text-[13.5px] font-medium text-gray-600 mt-0.5 leading-relaxed">
                  고객이 본인 이름과 전화번호만 입력하면 접수 진행상황, 발송 택배사·송장번호(실시간 배송위치), 사장님 전달 안내메모까지 직접 확인해 매장으로 오는 문의 전화를 확 줄여줍니다!
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 카드 2: 1초 컷! 초스피드 매장 운영 팁 (파란색 상단 포인트) */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-200/70 overflow-hidden relative p-6 sm:p-7">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

          <div className="absolute top-5 right-6 opacity-90 pointer-events-none select-none">
            <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5 3L6 21H17L14.5 35L28 17H17L19.5 3Z" fill="#FEFCE8" stroke="#D1D5DB" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="text-[18px] sm:text-[19px] font-extrabold text-blue-600 tracking-tight mb-5">
            1초 컷! 초스피드 매장 운영 팁
          </h2>

          <div className="space-y-3.5">
            <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                💳 택배 접수 시 &apos;매장 결제 완료&apos; vs &apos;계좌이체 입금자&apos; 자동 구분
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                매장에서 카드로 결제하고 주소만 적는 손님은 <strong>[매장 결제 완료]</strong> 버튼 하나로 끝내고, 전화·입금 주문 손님은 <strong>[계좌이체(입금자명)]</strong>를 적어 제출합니다. 어드민 리스트에서 초록색·노란색 뱃지로 1초 만에 구분됩니다!
              </p>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                🚚 송장번호 입력 &amp; 택배사 엑셀(CSV) 원클릭 다운로드
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                <strong>[택배접수]</strong>에서 오늘 보낼 내역만 체크해 <strong>[택배 송장용 엑셀 다운로드]</strong>를 누르면 우체국·CJ·롯데·한진 등 택배 프로그램에 바로 대량 등록할 수 있으며, 송장번호를 입력해 <strong>[완료]</strong>를 누르면 고객이 실시간 배송위치를 바로 조회합니다!
              </p>
            </div>

            <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                🎯 상황별 여러 개의 맞춤폼 동시 활용
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                1번 폼(예: <em>단골할래요?</em>)은 매장 대표 화면으로 띄워두고, 2번·3번 폼(예: <em>명절 선물세트 사전예약</em>, <em>퀵배달 주문서</em>)은 개별 짧은 링크(<code>/f/매장ID/2</code>)를 복사해 원하는 고객에게만 카톡·문자로 따로 보내 동시에 운영할 수 있습니다!
              </p>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                🖨️ 매장 비치용 QR 안내문 (A4 / A4 반절 사이즈) 즉시 출력
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                어드민 상단 <strong>[QR 다운로드]</strong>를 누르면 매장 이름과 원하는 안내 문구가 들어간 깔끔한 POP 포스터를 <strong>A4 반절(A5)</strong> 또는 <strong>A4 전체 크기</strong>로 바로 인쇄하거나 이미지로 저장할 수 있습니다!
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
                🏦 1단계: 가게 정보 · 입금 계좌 · 외부 링크 등록
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                하단 <strong>[마이] &gt; [설정(가게/계좌/쇼핑몰 링크)]</strong>에서 상호명, 영업시간, 무통장 계좌와 운영 중인 블로그·세일 페이지·쇼핑몰 링크를 등록하세요.
              </p>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                ✨ 2단계: 우리 매장 대표 간편폼 만들기
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                <strong>[간편폼 만들기]</strong>에서 우리 매장의 인사말과 입력 항목, 하단 버튼 이름(예: <em>단골되기</em>, <em>신청하기</em>)을 설정해 저장하면 우리 매장 대표 화면이 즉시 완성됩니다.
              </p>
            </div>

            <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-2xl p-4">
              <h3 className="text-[14px] font-extrabold text-gray-900 mb-1.5">
                📱 3단계: QR 안내문 비치 &amp; 스마트폰 홈 화면 추가
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                상단 <strong>[QR 다운로드]</strong>로 안내문을 인쇄해 계산대에 비치하고, 사장님 휴대폰에서는 <strong>[홈 화면에 추가]</strong>를 눌러 언제 어디서나 앱처럼 1초 만에 접수 내역을 확인·A4 한 장 인쇄로 깔끔하게 관리하세요!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
