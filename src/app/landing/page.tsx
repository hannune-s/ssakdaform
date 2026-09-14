import Link from 'next/link';
import { QrCode, Sparkles, Users, Smartphone, PlusSquare, CreditCard, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">싹다폼</span>
          </div>
          <Link 
            href="/"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors"
          >
            어드민으로 이동
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 px-4 sm:px-6 bg-gradient-to-b from-indigo-50/50 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/50 text-indigo-700 font-semibold text-sm mb-6 border border-indigo-200/50">
            <Sparkles className="w-4 h-4" />
            소상공인을 위한 완벽한 접수 솔루션
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.15] mb-6">
            모든 현장 접수,<br className="hidden sm:block" />
            이제 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">스마트폰 하나로</span> 끝내세요
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            고무장갑 벗고 메모할 필요 없습니다. 싹다폼은 알아보기 힘든 종이 조각 대신, 
            가장 쉽고 빠르며 고급스러운 고객 맞춤형 폼 접수 경험을 제공합니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              무료로 시작하기 <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">왜 싹다폼을 선택해야 할까요?</h2>
            <p className="text-gray-500 text-lg font-medium">실제 현장에서 가장 필요했던 기능들만 꽉꽉 담았습니다.</p>
          </div>

          <div className="space-y-24 sm:space-y-32">
            
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-2">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  고무장갑 벗고 전화할 필요 없는,<br />1초 만에 끝나는 스마트 접수
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  "김치 담그다 말고 장갑 벗고, 알아보기 힘든 종이 조각에 주소를 적고 계신가요?"<br/><br/>
                  이제 고객이 직접 큐알(QR)이나 링크 하나로 간편하게 주소와 요청사항을 입력합니다. 사장님은 손에 묻은 양념을 닦을 필요도, 주소를 잘못 적어 고객에게 다시 전화하는 아날로그적 번거로움도 싹 사라집니다.
                </p>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[2.5rem] transform rotate-3 scale-105" />
                <img src="https://placehold.co/800x600/e0e7ff/4f46e5?text=Smart+QR+Link+Screenshot" alt="스마트 접수 화면" className="relative rounded-3xl shadow-2xl border border-gray-100 w-full object-cover" />
                <p className="text-center text-sm text-gray-400 mt-3 font-medium">※ 실제 어드민의 링크 복사/QR 기능 캡처 이미지로 교체해 주세요.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  우리 매장의 품격을 높이는<br />고급스러운 브랜드 경험
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  싸구려 간이 폼이나 지저분한 메모장이 아닙니다.<br/><br/>
                  사장님의 멋진 매장 상호명과 브랜드 로고가 딱 박힌 고급스러운 인터페이스로 고객에게 주문을 받습니다. 스마트한 방식 덕분에 고객이 느끼는 브랜드의 신뢰도와 가치가 단번에 올라갑니다.
                </p>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-fuchsia-50 rounded-[2.5rem] transform -rotate-3 scale-105" />
                <img src="https://placehold.co/800x600/f3e8ff/9333ea?text=Premium+Form+Design" alt="고급스러운 브랜드 폼 화면" className="relative rounded-3xl shadow-2xl border border-gray-100 w-full object-cover" />
                <p className="text-center text-sm text-gray-400 mt-3 font-medium">※ 매장 로고와 상호명이 적용된 실제 고객용 폼 화면을 캡처해 주세요.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  버려지던 종이 조각이 '단골 자산'으로!<br />자동 고객 관리 시스템
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  그동안 택배 주문을 받고 대충 버려졌던 종이 조각들과 흩어진 수기 노트는 그만.<br/><br/>
                  싹다폼에 단 한 번이라도 주문서를 작성한 고객의 정보는 차곡차곡 안전하게 보관됩니다. 나중에 재주문이 들어왔을 때, 이름이나 전화번호만 살짝 조회하면 이전 주소를 금방 찾아낼 수 있어 단골 관리와 재주문 처리가 압도적으로 빨라집니다.
                </p>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-emerald-50 rounded-[2.5rem] transform rotate-2 scale-105" />
                <img src="https://placehold.co/800x600/dcfce7/16a34a?text=Customer+CRM+List" alt="고객 관리 시스템 화면" className="relative rounded-3xl shadow-2xl border border-gray-100 w-full object-cover" />
                <p className="text-center text-sm text-gray-400 mt-3 font-medium">※ 어드민의 검색 기능과 리스트 화면을 캡처해 주세요.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-2">
                  <PlusSquare className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  어떤 현장이든 내 입맛대로 뚝딱!<br />무한 확장 '간편폼 만들기'
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  기본적으로 현장에서 가장 많이 쓰는 택배, 주문, 예약 폼은 완벽하게 세팅 완료!<br/><br/>
                  하지만 여기서 끝이 아닙니다. '간편폼 만들기' 기능으로 어떤 업종이든 본인에게 필요한 방식의 맞춤형 신청서를 자유롭게 만들 수 있습니다. 만든 폼의 링크를 복사해 고객에게 보내기만 하면 끝. 소상공인부터 프리랜서까지 모든 접수 업무를 혁신합니다.
                </p>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-amber-50 rounded-[2.5rem] transform -rotate-2 scale-105" />
                <img src="https://placehold.co/800x600/ffedd5/ea580c?text=Form+Builder+Screenshot" alt="간편폼 만들기 화면" className="relative rounded-3xl shadow-2xl border border-gray-100 w-full object-cover" />
                <p className="text-center text-sm text-gray-400 mt-3 font-medium">※ 실제 어드민의 '간편폼 만들기' 기능 화면을 캡처해 주세요.</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-2">
                  <Smartphone className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  스마트폰 홈 화면에 톡!<br />언제 어디서나 확인하고 척척 출력
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  복잡한 앱 설치 없이, 스마트폰 홈 화면에 아이콘만 바로 추가해두고 언제 어디서나 모바일로 확인합니다.<br/><br/>
                  들어온 택배 주문서나 예약 주문서를 보기 쉽게 모아보고, 컴퓨터 앞에서는 필요할 때 엑셀처럼 직관적인 리스트로 다운로드 및 출력까지 완벽하게 지원합니다.
                </p>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-pink-50 rounded-[2.5rem] transform rotate-3 scale-105" />
                <img src="https://placehold.co/800x600/ffe4e6/e11d48?text=Mobile+App+View" alt="모바일 최적화 화면" className="relative rounded-3xl shadow-2xl border border-gray-100 w-full object-cover" />
                <p className="text-center text-sm text-gray-400 mt-3 font-medium">※ 스마트폰에서 접속한 어드민 화면을 캡처해 주세요.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Added Bonus Features (AI Suggested) */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">여기에 더해, 사장님을 위한 든든한 디테일</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">계좌번호 무한 추가 & 결제 링크 연동</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                입금 받을 계좌가 여러 개인가요? 싹다폼에서는 필요한 만큼 계좌번호를 등록하고, 토스나 카카오페이 등 간편 송금 링크까지 연동할 수 있어 폼 하나로 결제 안내까지 깔끔하게 끝납니다.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">한눈에 쏙 들어오는 실시간 대시보드</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                앱을 켜자마자 오늘 하루 들어온 택배, 예약, 주문 건수를 큼직한 숫자와 컬러별로 바로 확인하세요. 최근 접수된 알림 리스트까지 실시간으로 모니터링할 수 있어 업무 흐름이 끊기지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
            더 이상 아날로그 접수에<br />시간 뺏기지 마세요
          </h2>
          <p className="text-indigo-100 text-lg sm:text-xl mb-10 font-medium">
            지금 바로 싹다폼을 도입하고 매장 업무의 혁신을 경험해 보세요.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            싹다폼 어드민 체험하기 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-gray-500" />
            </div>
            <span className="font-bold text-gray-400">SSAKDAFORM</span>
          </div>
          <p className="text-sm text-gray-400 font-medium">© 2026 싹다폼. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
