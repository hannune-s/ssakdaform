import Link from 'next/link';
import { QrCode, Sparkles, Users, Smartphone, PlusSquare, CreditCard, BarChart3, ArrowRight, CheckCircle2, Printer, Download } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen break-keep bg-white selection:bg-indigo-100 selection:text-indigo-900 font-sans">
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
            href="/demo"
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
              href="/demo"
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
                  고무장갑 벗고 전화할 필요 없는,<br className="hidden sm:block" />1초 만에 끝나는 스마트 접수
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  "김치 담그다 말고 장갑 벗고, 알아보기 힘든 종이 조각에 주소를 적고 계신가요?"<br/><br/>
                  이제 고객이 직접 큐알(QR)이나 링크 하나로 간편하게 주소와 요청사항을 입력합니다. 사장님은 손에 묻은 양념을 닦을 필요도, 주소를 잘못 적어 고객에게 다시 전화하는 아날로그적 번거로움도 싹 사라집니다.
                </p>
              </div>
              <div className="flex-1 w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[2.5rem] transform rotate-3 scale-105" />
                
                {/* 3 Mobile Mockups Container */}
                <div className="relative w-full max-w-md h-[360px]">
                  
                  {/* Delivery Mockup (Left) */}
                  <div className="absolute top-4 -left-4 sm:left-0 w-48 bg-white rounded-3xl shadow-[0_15px_30px_rgb(0,0,0,0.1)] border border-gray-100 transform -rotate-6 p-4 overflow-hidden z-10 hover:-rotate-2 hover:z-40 transition-all duration-300">
                    <div className="bg-blue-600 text-white text-center py-3 -mx-4 -mt-4 mb-3 text-[13px] font-bold shadow-sm">📦 간편 택배 접수</div>
                    <div className="space-y-3">
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">받는 분 성함</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">홍길동</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">연락처</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">010-1234-5678</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">주소</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium truncate">서울 강남구 테헤란로</span></div></div>
                      <div className="h-8 bg-blue-600 rounded-xl mt-3 flex items-center justify-center text-white text-[12px] font-bold shadow-md">접수하기</div>
                    </div>
                  </div>

                  {/* Order Mockup (Right) */}
                  <div className="absolute top-12 -right-4 sm:right-0 w-48 bg-white rounded-3xl shadow-[0_15px_30px_rgb(0,0,0,0.1)] border border-gray-100 transform rotate-6 p-4 overflow-hidden z-20 hover:rotate-2 hover:z-40 transition-all duration-300">
                    <div className="bg-purple-600 text-white text-center py-3 -mx-4 -mt-4 mb-3 text-[13px] font-bold shadow-sm">🛍️ 상품 주문서</div>
                    <div className="space-y-3">
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">주문 상품</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium truncate">프리미엄 세트 A</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">수량</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">2개</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">요청사항</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium truncate">선물용 포장 부탁드려요</span></div></div>
                      <div className="h-8 bg-purple-600 rounded-xl mt-3 flex items-center justify-center text-white text-[12px] font-bold shadow-md">주문하기</div>
                    </div>
                  </div>

                  {/* Reservation Mockup (Center/Front) */}
                  <div className="absolute top-24 left-1/2 -translate-x-1/2 w-52 bg-white rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.15)] border border-gray-100 p-4 overflow-hidden z-30 hover:scale-105 transition-all duration-300">
                    <div className="bg-green-600 text-white text-center py-3 -mx-4 -mt-4 mb-3 text-[13px] font-bold shadow-sm">🗓️ 매장 예약 접수</div>
                    <div className="space-y-3">
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">예약자명</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">이영희</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">방문 일시</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">10월 25일 (금) 19:00</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">방문 인원</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">4명 (성인2, 아동2)</span></div></div>
                      <div className="h-9 bg-green-600 rounded-xl mt-3 flex items-center justify-center text-white text-[12px] font-bold shadow-md">예약하기</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  우리 매장의 품격을 높이는<br className="hidden sm:block" />고급스러운 브랜드 경험
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  싸구려 간이 폼이나 지저분한 메모장이 아닙니다.<br/><br/>
                  사장님의 멋진 매장 상호명과 브랜드 로고가 딱 박힌 고급스러운 인터페이스로 고객에게 주문을 받습니다. 스마트한 방식 덕분에 고객이 느끼는 브랜드의 신뢰도와 가치가 단번에 올라갑니다.
                </p>
              </div>
              <div className="flex-1 w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-fuchsia-50 rounded-[2.5rem] transform -rotate-3 scale-105" />
                
                {/* Premium Brand Mockup */}
                <div className="relative w-64 bg-[#FAFAFA] rounded-[2rem] shadow-[0_20px_50px_rgba(147,51,234,0.15)] border-4 border-white overflow-hidden z-10 hover:scale-105 transition-transform duration-500">
                  
                  {/* Mockup Header (Brand) */}
                  <div className="bg-white px-6 pt-8 pb-6 text-center border-b border-gray-100 shadow-sm relative z-10">
                    <div className="w-16 h-16 mx-auto bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3 shadow-inner border border-purple-100">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-gray-900 tracking-tight">우아한 베이커리</h4>
                    <p className="text-[11px] text-gray-400 mt-1 font-medium">프리미엄 수제 디저트 전문점</p>
                  </div>
                  
                  {/* Mockup Body (Form) */}
                  <div className="p-5 space-y-4 bg-gray-50/50">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="text-[11.5px] font-bold text-gray-800 mb-2.5">예약자 정보</div>
                      <div className="space-y-2">
                        <div className="h-8 bg-gray-50 border border-gray-200 rounded-lg px-3 flex items-center"><span className="text-[11px] text-gray-400">성함을 입력해주세요</span></div>
                        <div className="h-8 bg-gray-50 border border-gray-200 rounded-lg px-3 flex items-center"><span className="text-[11px] text-gray-400">연락처를 입력해주세요</span></div>
                      </div>
                    </div>
                    
                    <div className="h-11 bg-purple-600 rounded-xl flex items-center justify-center text-white text-[13px] font-bold shadow-md shadow-purple-200 hover:bg-purple-700 transition-colors cursor-pointer">
                      예약 완료하기
                    </div>
                  </div>
                  
                </div>
                
                {/* Small floating badge */}
                <div className="absolute top-[20%] -right-2 sm:-right-6 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 z-20 flex items-center gap-2 animate-bounce">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-[12px] font-bold text-gray-700">고급스러운 브랜드 인지도 상승!</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  버려지던 종이 조각이 '단골 자산'으로!<br className="hidden sm:block" />자동 고객 관리 시스템
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  그동안 택배 주문을 받고 대충 버려졌던 종이 조각들과 흩어진 수기 노트는 그만.<br/><br/>
                  싹다폼에 단 한 번이라도 주문서를 작성한 고객의 정보는 차곡차곡 안전하게 보관됩니다. 나중에 재주문이 들어왔을 때, 이름이나 전화번호만 살짝 조회하면 이전 주소를 금방 찾아낼 수 있어 단골 관리와 재주문 처리가 압도적으로 빨라집니다.
                </p>
              </div>
              <div className="flex-1 w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-emerald-50 rounded-[2.5rem] transform rotate-2 scale-105" />
                
                {/* Admin CRM List Mockup */}
                <div className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.15)] border border-gray-100 overflow-hidden z-10 hover:scale-[1.02] transition-transform duration-500">
                  
                  {/* Mockup Header (Search/Tabs) */}
                  <div className="p-4 sm:p-5 border-b border-gray-100 bg-white">
                    <div className="flex gap-2 mb-4">
                      <div className="px-3 py-1.5 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-200">택배접수 (12)</div>
                      <div className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[11px] font-semibold rounded-full border border-gray-200">예약접수 (5)</div>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 border-[1.5px] border-gray-400 rounded-full" />
                      <div className="absolute left-[14px] top-1/2 mt-[3px] ml-[3px] w-1.5 h-1.5 border-l-[1.5px] border-gray-400 transform -rotate-45" />
                      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl h-10 pl-9 pr-3 flex items-center">
                        <span className="text-[12px] text-gray-800 font-medium">김철</span>
                        <div className="w-[1.5px] h-4 bg-blue-500 animate-pulse ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Mockup Table */}
                  <div className="bg-white overflow-hidden pb-2">
                    <table className="w-full text-left">
                      <thead className="bg-green-50/50 border-y border-green-100/50">
                        <tr>
                          <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 tracking-wider">이름</th>
                          <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 tracking-wider hidden sm:table-cell">연락처</th>
                          <th className="px-4 py-2.5 text-center text-[10px] font-extrabold text-gray-500 tracking-wider">상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50 transition-colors bg-green-50/20">
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900 text-[12px]">김철수</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 sm:hidden">010-1234-****</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">오늘 14:30</div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="text-[11px] font-bold text-gray-600">010-1234-5678</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">결제완료</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900 text-[12px]">이영희</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 sm:hidden">010-9876-****</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">오늘 11:20</div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="text-[11px] font-semibold text-gray-600">010-9876-5432</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-[10px] font-bold">접수대기</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900 text-[12px]">박민수</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 sm:hidden">010-5555-****</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">어제 16:45</div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="text-[11px] font-semibold text-gray-600">010-5555-6666</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">결제완료</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Small floating badge */}
                <div className="absolute bottom-6 -left-2 sm:-left-6 bg-white px-4 py-3 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-gray-100 z-20 flex items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-black text-gray-900">단골고객 발견!</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">이전 주문 이력: 3회</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-2">
                  <PlusSquare className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  어떤 현장이든 내 입맛대로 뚝딱!<br className="hidden sm:block" />무한 확장 '간편폼 만들기'
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  기본적으로 현장에서 가장 많이 쓰는 택배, 주문, 예약 폼은 완벽하게 세팅 완료!<br/><br/>
                  하지만 여기서 끝이 아닙니다. '간편폼 만들기' 기능으로 어떤 업종이든 본인에게 필요한 방식의 맞춤형 신청서를 자유롭게 만들 수 있습니다. 만든 폼의 링크를 복사해 고객에게 보내기만 하면 끝. 소상공인부터 프리랜서까지 모든 접수 업무를 혁신합니다.
                </p>
              </div>
              <div className="flex-1 w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-amber-50 rounded-[2.5rem] transform -rotate-2 scale-105" />
                
                {/* Form Builder Mockup */}
                <div className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(234,88,12,0.15)] border border-gray-100 overflow-hidden z-10 hover:scale-[1.02] transition-transform duration-500 flex flex-col h-[340px]">
                  
                  {/* Mockup Header */}
                  <div className="p-4 border-b border-gray-100 bg-orange-50/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center border border-orange-200">
                        <PlusSquare className="w-4 h-4" />
                      </div>
                      <span className="text-[14px] font-bold text-gray-900">새 간편폼 만들기</span>
                    </div>
                    <div className="px-4 py-1.5 bg-gray-900 text-white text-[12px] font-bold rounded-xl shadow-sm">저장하기</div>
                  </div>

                  {/* Mockup Body */}
                  <div className="flex-1 p-4 bg-gray-50/50 flex gap-4 overflow-hidden relative">
                    
                    {/* Left/Main Column - Fields List */}
                    <div className="flex-1 space-y-3">
                      {/* Form Title */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm relative">
                        <div className="text-[13px] font-bold text-gray-800 mb-1">제목 없는 폼</div>
                        <div className="text-[11px] text-gray-400">폼 설명을 입력해 주세요.</div>
                        <div className="absolute right-4 top-4 w-4 h-4 text-gray-300">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </div>
                      </div>

                      {/* Draggable Field 1 */}
                      <div className="bg-white p-3.5 rounded-2xl border-l-[6px] border-l-orange-500 border border-gray-200 shadow-sm flex items-start gap-3 relative">
                        <div className="w-4 h-4 text-gray-300 flex flex-col gap-[3px] justify-center mt-1 cursor-move">
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[12px] font-bold text-gray-700 mb-2 flex justify-between">
                            <span>고객 성함 (단답형)</span>
                            <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-bold">필수</span>
                          </div>
                          <div className="h-7 bg-gray-50 border border-gray-100 rounded-lg" />
                        </div>
                      </div>

                      {/* Draggable Field 2 */}
                      <div className="bg-white p-3.5 rounded-2xl border-l-[6px] border-l-gray-300 border border-gray-200 shadow-sm flex items-start gap-3 relative opacity-70">
                        <div className="w-4 h-4 text-gray-300 flex flex-col gap-[3px] justify-center mt-1 cursor-move">
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                          <div className="w-3 h-0.5 bg-gray-300 rounded" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[12px] font-bold text-gray-700 mb-2">방문 목적 (객관식)</div>
                          <div className="flex gap-3">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border border-gray-300 bg-white" /><div className="h-2 w-10 bg-gray-200 rounded" /></div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border border-gray-300 bg-white" /><div className="h-2 w-10 bg-gray-200 rounded" /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Add Field Button Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <div className="px-5 py-3 bg-gray-900 text-white text-[13px] font-bold rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2)] flex items-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors">
                        <PlusSquare className="w-4 h-4 text-orange-400" />
                        새 항목 추가
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Small floating badge */}
                <div className="absolute top-10 -left-2 sm:-left-6 bg-white px-4 py-3 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] border border-gray-100 z-20 flex flex-col items-center gap-1 animate-[bounce_3s_infinite]">
                  <div className="text-[13px] font-black text-orange-600">내 마음대로 뚝딱!</div>
                  <div className="text-[11px] font-medium text-gray-500">객관식, 주소, 이미지까지</div>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-2">
                  <Smartphone className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  스마트폰 홈 화면에 톡!<br className="hidden sm:block" />언제 어디서나 확인하고 척척 출력
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  복잡한 앱 설치 없이, 스마트폰 홈 화면에 아이콘만 바로 추가해두고 언제 어디서나 모바일로 확인합니다.<br/><br/>
                  들어온 택배 주문서나 예약 주문서를 보기 쉽게 모아보고, 컴퓨터 앞에서는 필요할 때 엑셀처럼 직관적인 리스트로 다운로드 및 출력까지 완벽하게 지원합니다.
                </p>
              </div>
              <div className="flex-1 w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-pink-50 rounded-[2.5rem] transform rotate-3 scale-105" />
                
                {/* Mobile Admin Mockup */}
                <div className="relative w-64 bg-gray-50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(225,29,72,0.15)] border-[8px] border-white overflow-hidden z-10 hover:-translate-y-2 transition-transform duration-500 h-[420px] flex flex-col">
                  
                  {/* Top Bar with Export/Print */}
                  <div className="bg-white p-4 border-b border-gray-100 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[15px] font-black text-gray-900 tracking-tight">상세 현황 관리</span>
                      <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100"><Sparkles className="w-3.5 h-3.5" /></div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <div className="flex-1 py-2 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:bg-emerald-100 transition-colors">
                        <Download className="w-3.5 h-3.5" /> 엑셀 다운로드
                      </div>
                      <div className="flex-1 py-2 bg-gray-800 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:bg-gray-900 transition-colors">
                        <Printer className="w-3.5 h-3.5 text-gray-300" /> 인쇄하기
                      </div>
                    </div>
                  </div>

                  {/* List Content */}
                  <div className="flex-1 p-3 space-y-3 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 z-10 pointer-events-none" />
                    
                    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 relative z-0">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[12px] font-bold text-gray-900">김철수 고객님</span>
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full">결제완료</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-3/4 bg-gray-100 rounded" />
                        <div className="h-2 w-1/2 bg-gray-100 rounded" />
                      </div>
                    </div>
                    
                    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 relative z-0">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[12px] font-bold text-gray-900">이영희 고객님</span>
                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-full border border-yellow-100">접수대기</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-gray-100 rounded" />
                        <div className="h-2 w-2/3 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation Mockup */}
                  <div className="bg-white border-t border-gray-100 p-3 flex justify-around items-center px-4 pb-5 relative z-20">
                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                      <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center"><Smartphone className="w-3.5 h-3.5" /></div>
                      <div className="text-[9px] font-bold text-rose-600">홈</div>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40 cursor-pointer">
                      <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center"><BarChart3 className="w-3.5 h-3.5 text-gray-500" /></div>
                      <div className="text-[9px] font-bold text-gray-500">통계</div>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40 cursor-pointer">
                      <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center"><CreditCard className="w-3.5 h-3.5 text-gray-500" /></div>
                      <div className="text-[9px] font-bold text-gray-500">설정</div>
                    </div>
                  </div>
                </div>
                
                {/* Small floating badge */}
                <div className="absolute top-1/4 -right-4 sm:-right-8 bg-white px-4 py-3 rounded-2xl shadow-[0_15px_30px_rgba(225,29,72,0.15)] border border-rose-100 z-20 flex items-center gap-3 animate-bounce">
                  <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-black text-gray-900">버튼 클릭 한 번으로!</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">엑셀 다운 & 출력 완벽 지원</div>
                  </div>
                </div>
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">계좌번호 무한 추가</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                입금 받을 계좌가 여러 개인가요? 싹다폼에서는 필요한 만큼 계좌번호를 무제한으로 등록할 수 있어, 폼 하나로 복잡한 입금 안내까지 깔끔하게 끝납니다.
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

            {/* Pricing Section */}
      <section className="py-24 sm:py-32 bg-gray-50 relative overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-indigo-600 font-extrabold tracking-widest uppercase text-sm mb-3">Pricing</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
              복잡한 종이 노트와 수기 관리를 끝내는 비용,<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">커피 두 잔 값도 안 되는 월 9,900원으로 시작하세요!</span>
            </h3>
            <p className="text-lg sm:text-xl text-gray-500 font-medium">
              합리적인 요금으로 매장 업무의 혁신을 경험해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            
            {/* Monthly Plan (Early Bird) */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border-2 border-indigo-500 p-8 sm:p-10 z-10 transform md:-translate-y-4">
              <div className="absolute -top-5 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[13px] font-black px-4 py-2 rounded-full shadow-lg animate-bounce">
                2026 얼리버드 특가 🚀
              </div>
              
              <h4 className="text-2xl font-black text-gray-900 mb-2">월간 구독 플랜</h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="line-through text-gray-400 text-lg font-bold">정상가 월 14,900원</span>
              </div>
              <div className="flex items-end gap-2 mb-8 border-b border-gray-100 pb-8">
                <span className="text-5xl sm:text-6xl font-black text-indigo-600 tracking-tight">9,900<span className="text-xl font-bold text-gray-500 ml-1">원 / 월</span></span>
              </div>
              
              <ul className="space-y-4 mb-10">
                {['아날로그 접수 혁신', '무제한 폼 생성 및 커스텀', '자동 고객 및 주문 관리', '모바일 주문서 다운로드 및 출력', '싹다폼의 모든 강력한 기능 포함'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
                    <span className="text-gray-700 font-bold text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="/signup"
                className="block text-center w-full py-4 sm:py-5 rounded-2xl font-black text-white text-lg bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-[0.98]"
              >
                월간 플랜으로 시작하기
              </a>
            </div>

            {/* Yearly Plan */}
            <div className="relative bg-white rounded-[2rem] border border-gray-200 p-8 sm:p-10 h-fit shadow-lg shadow-gray-100/50">
              <div className="absolute -top-4 left-8 bg-gray-800 text-white text-[12px] font-black px-4 py-1.5 rounded-full shadow-md">
                추천! 2개월 무료 🎁
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">연간 구독 플랜 (선택 옵션)</h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">99,000<span className="text-lg font-bold text-gray-500 ml-1">원 / 년</span></span>
              </div>
              <p className="text-indigo-600 text-sm font-black mb-6 pb-6 border-b border-gray-100">
                월 8,250원 꼴 (약 17% 추가 할인 혜택!)
              </p>
              
              <p className="text-[15px] text-gray-500 mb-8 font-medium leading-relaxed">
                1년 치를 한 번에 결제하시면<br className="hidden sm:block" />
                <strong className="text-gray-900">두 달치 요금을 완전히 면제</strong>해 드립니다.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-600 font-medium">월간 플랜의 <strong>모든 기능 무제한 포함</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-gray-900 font-bold">12개월 중 2개월 무료 혜택 제공</span>
                </li>
              </ul>
              
              <a 
                href="/signup"
                className="block text-center w-full py-4 rounded-2xl font-bold text-gray-700 text-lg bg-gray-50 border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all active:scale-[0.98]"
              >
                연간 플랜으로 혜택받기
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
            더 이상 아날로그 접수에<br className="hidden sm:block" />시간 뺏기지 마세요
          </h2>
          <p className="text-indigo-100 text-lg sm:text-xl mb-10 font-medium">
            지금 바로 싹다폼을 도입하고 매장 업무의 혁신을 경험해 보세요.
          </p>
          <Link 
            href="/demo"
            className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            싹다폼 어드민 체험하기 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between gap-8 md:gap-4">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-gray-500" />
              </div>
              <span className="font-bold text-gray-400">SSAKDAFORM</span>
            </div>
            
            {/* 사업자 정보 아코디언 */}
            <details className="group">
              <summary className="text-sm font-bold text-gray-500 cursor-pointer list-none flex items-center gap-1 hover:text-gray-700 transition-colors">
                사업자 정보 
                <span className="text-[10px] text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 text-[13px] text-gray-400 space-y-1.5 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p><span className="font-semibold">상호명:</span> (주)싹다폼 | <span className="font-semibold">대표:</span> 김싹다</p>
                <p><span className="font-semibold">사업자등록번호:</span> 123-45-67890</p>
                <p><span className="font-semibold">통신판매업신고:</span> 제2026-서울강남-1234호</p>
                <p><span className="font-semibold">이메일:</span> support@ssakdaform.com | <span className="font-semibold">고객센터:</span> 070-1234-5678</p>
                <p><span className="font-semibold">주소:</span> 서울특별시 강남구 테헤란로 123, 싹다빌딩 4층</p>
              </div>
            </details>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-4 text-[13px] font-bold text-gray-500">
              <Link href="/terms" className="hover:text-gray-800 transition-colors">이용약관</Link>
              <span className="text-gray-300">|</span>
              <Link href="/privacy" className="hover:text-gray-800 transition-colors">개인정보처리방침</Link>
            </div>
            <p className="text-[13px] text-gray-400 font-medium">© 2026 싹다폼. All rights reserved.</p>
          </div>
          
        </div>
      </footer>
    </div>
  );
}
