import Link from 'next/link';
import {
  QrCode,
  Sparkles,
  Users,
  Smartphone,
  PlusSquare,
  CreditCard,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Printer,
  Download,
  UserCheck,
  Camera,
  FileCheck,
  ShieldCheck,
  Search,
  Truck,
  MessageSquare,
  ExternalLink,
  Star,
  Package
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen break-keep bg-white selection:bg-purple-100 selection:text-purple-900 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-white/85 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#5B21B6] rounded-lg flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">싹다폼</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-sm font-bold text-gray-600 hover:text-gray-900 px-2 py-2 transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="text-[13px] sm:text-sm font-extrabold text-white bg-[#5B21B6] hover:bg-[#3B0764] px-4 py-2 rounded-full transition-colors shadow-sm"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 px-4 sm:px-6 bg-gradient-to-b from-purple-50/70 via-indigo-50/30 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 text-[#4C1D95] font-extrabold text-xs sm:text-sm mb-6 border border-purple-200">
            <Sparkles className="w-4 h-4 text-[#5B21B6]" />
            인스타·블로그 연동 · 단골 모집 · 간편 택배 · 송장 엑셀 · 채용 이력서까지 올인원!
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.18] mb-6">
            인스타·블로그·단골을 하나로 잇는<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B0764] via-[#5B21B6] to-[#7E22CE]">우리 매장 모바일 홈 &amp; 스마트 접수</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 font-medium mb-10 max-w-3xl mx-auto leading-relaxed">
            고무장갑 벗고 종이 조각에 주소 적던 시대는 끝났습니다.<br className="hidden sm:block" />
            내가 직접 꾸민 <strong>우리 매장 대표 링크</strong> 하나에 <strong>블로그·인스타·실시간 세일 특가·간편 택배 접수·비회원 배송조회·직원채용 이력서</strong>까지 싹 다 담아드렸습니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#5B21B6] hover:bg-[#3B0764] text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-purple-900/15 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              지금 우리 매장 링크 만들기 <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
            >
              어드민 화면 먼저 체험하기
            </Link>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <span className="text-xs sm:text-sm font-extrabold text-[#5B21B6] tracking-widest uppercase">
              WHY SSAKDAFORM
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">
              실제 매장 사장님이 직접 쓰면서 완성한 6가지 핵심 무기
            </h2>
            <p className="text-gray-500 text-base sm:text-lg font-medium">
              컴퓨터를 잘 모르는 사장님도 가입 즉시 바로 쓸 수 있도록 가장 직관적으로 설계했습니다.
            </p>
          </div>

          <div className="space-y-24 sm:space-y-32">

            {/* Feature 1: 내가 꾸민 대표 화면 + 외부 링크 + 기본 택배/이력서 올인원 허브 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#5B21B6] text-xs font-extrabold">
                  핵심 무기 01 · 인스타 · 블로그 · 매장 QR 올인원 링크
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  내가 꾸민 맞춤폼이 곧 &lsquo;우리 매장 대표 화면&rsquo;!<br className="hidden sm:block" />
                  블로그 · 인스타 · 세일 특가 · 택배 · 이력서가 한 화면에
                </h3>
                <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
                  천편일률적인 딱딱한 접수 화면이 아닙니다. 사장님이 <strong>&ldquo;단골할래요?&rdquo;</strong>, <strong>&ldquo;명절 선물세트 사전예약&rdquo;</strong>처럼 매장에 딱 맞는 제목과 따뜻한 인사말을 적고 <strong>[⭐ 대표 화면 지정]</strong>만 누르면, 우리 매장 QR코드와 대표 주소(<code>/store/내매장ID</code>)가 즉시 그 화면으로 연결됩니다.<br /><br />
                  게다가 상단에는 <strong>우리 매장 블로그(소소한 기록)</strong>와 눈에 확 띄는 <strong>실시간 세일·특가 링크</strong>를 연결할 수 있고, 아무 설정을 안 해도 <strong>[간편 택배 접수]</strong>와 <strong>[직원채용 이력서]</strong> 버튼이 기본 탑재되어 컴맹 사장님도 1분 만에 완벽한 매장 홈페이지를 갖게 됩니다.
                </p>
              </div>

              <div className="flex-1 w-full relative min-h-[430px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 via-fuchsia-50 to-indigo-50 rounded-[2.5rem] transform rotate-2 scale-105" />

                {/* 가상의 샘플 고객 대표 화면 목업 */}
                <div className="relative w-full max-w-[350px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(91,33,182,0.18)] border border-purple-100 overflow-hidden z-10">
                  <div className="bg-gradient-to-br from-[#3B0764] via-[#5B21B6] to-[#4C1D95] px-5 py-6 text-center text-white">
                    <div className="text-lg font-black tracking-tight">싹다상점 강남본점</div>
                    <div className="mt-2 inline-block px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-extrabold">
                      단골할래요?
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5 bg-white">
                    {/* 블로그 고정 줄 */}
                    <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#F3E8FF] to-[#EDE9FE] border border-[#C4B5FD] flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-[#3B0764]">우리 가게 이야기</span>
                        <span className="text-[10.5px] font-semibold text-[#6D28D9]">매일 정성껏 준비하는 일상</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#5B21B6] text-white text-[10px] font-extrabold">블로그 보기 &gt;</span>
                    </div>

                    {/* 특가 강조 줄 */}
                    <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFF1F2] to-[#FFE4E6] border-2 border-rose-300 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-rose-950">오늘의 깜짝 특가!</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-extrabold">실시간 특가</span>
                        </div>
                        <p className="text-[10px] font-bold text-rose-800 mt-0.5">홈화면에 추가하고 세일소식 먼저 받기</p>
                      </div>
                      <span className="px-2 py-1 rounded-md bg-rose-600 text-white text-[10px] font-extrabold shrink-0">세일소식 받기 &gt;</span>
                    </div>

                    {/* 기본 장착 2열 (간편 택배 접수 | 직원채용 이력서) */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
                        <div>
                          <div className="text-[11.5px] font-black text-indigo-950">간편 택배 접수</div>
                          <div className="text-[9.5px] font-semibold text-indigo-700">택배 발송 신청서</div>
                        </div>
                        <span className="text-indigo-600 text-xs font-bold">&gt;</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                        <div>
                          <div className="text-[11.5px] font-black text-emerald-950">직원채용 이력서</div>
                          <div className="text-[9.5px] font-semibold text-emerald-700">매장 근무 간편 지원</div>
                        </div>
                        <span className="text-emerald-600 text-xs font-bold">&gt;</span>
                      </div>
                    </div>

                    {/* 내 접수/배송 조회 */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white text-[#5B21B6] flex items-center justify-center font-bold text-xs">🔍</div>
                        <div>
                          <div className="text-xs font-extrabold">내 접수 / 배송 조회 <span className="px-1.5 py-0.5 bg-amber-300 text-purple-950 rounded-full text-[9px] font-black ml-1">실시간 확인</span></div>
                          <div className="text-[10px] text-purple-100">이름과 연락처로 송장번호 즉시 확인</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg">조회 &gt;</span>
                    </div>

                    {/* 단골되기 버튼 */}
                    <div className="pt-1">
                      <div className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4C1D95] to-[#6D28D9] text-white text-center text-sm font-extrabold shadow-md">
                        단골되기
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: 간편 택배 접수 (상품명+수량+매장결제완료 vs 계좌이체 입금자명 + 송장 엑셀) */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold">
                  핵심 무기 02 · 현장 맞춤형 택배 접수 &amp; 송장 엑셀
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  &ldquo;매장에서 카드 결제하셨나요, 계좌이체 하시나요?&rdquo;<br className="hidden sm:block" />
                  상품·수량·입금자 확인부터 택배 송장 엑셀까지 1초 컷!
                </h3>
                <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
                  매장에서 카드로 결제하고 택배 주소만 적고 가는 손님은 <strong>[💳 매장 결제 완료]</strong> 버튼 하나로 입금자명 입력 없이 10초 만에 접수를 끝내고, 전화나 카톡으로 주문하고 입금하는 손님은 <strong>[🏦 계좌이체]</strong>를 눌러 <strong>입금자명</strong>을 정확히 남깁니다.<br /><br />
                  어드민 <strong>[택배접수]</strong> 리스트에서는 <strong>주문상품(수량)</strong>과 함께 <strong className="text-emerald-700">매장 결제 완료(초록색 뱃지)</strong>와 <strong className="text-amber-700">계좌이체 입금자(노란색 뱃지)</strong>가 한눈에 구분되며, 체크박스로 골라 <strong>[택배 송장용 엑셀 다운로드]</strong>만 누르면 우체국·CJ·롯데·한진 등 택배 프로그램에 바로 대량 등록할 수 있습니다!
                </p>
              </div>

              <div className="flex-1 w-full relative min-h-[380px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[2.5rem] transform -rotate-2 scale-105" />

                <div className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.14)] border border-gray-100 overflow-hidden z-10 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#5B21B6]" />
                      <span className="font-extrabold text-gray-900 text-sm">어드민 택배접수 실시간 리스트</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> 택배 송장용 엑셀 다운로드
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-extrabold text-gray-900">
                          한우 선물세트 1호 <span className="text-indigo-600">(2개)</span>
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10.5px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          💳 매장 결제 완료 (카드/현금)
                        </span>
                      </div>
                      <div className="text-right text-xs">
                        <div className="font-bold text-gray-800">보내는 분: 김민수</div>
                        <div className="text-[11px] text-gray-500">받는 분: 이정훈 (서울 강남구...)</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-extrabold text-gray-900">
                          진한 한우 사골곰탕 <span className="text-indigo-600">(5개)</span>
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10.5px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                          🏦 계좌이체 (입금자: 박영희)
                        </span>
                      </div>
                      <div className="text-right text-xs">
                        <div className="font-bold text-gray-800">보내는 분: 박영희</div>
                        <div className="text-[11px] text-gray-500">받는 분: 최수진 (경기 김포시...)</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 font-bold text-center">
                    ✓ 통장 입금 확인할 고객과 바로 포장해 발송할 고객이 1초 만에 구분됩니다!
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: 비회원 내 접수 / 실시간 배송조회 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold">
                  핵심 무기 03 · 고객 문의 전화 90% 감소
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  &ldquo;사장님, 제 택배 송장번호 뭐예요?&rdquo; 문의 전화 끝!<br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600">회원가입 없이 1초 만에</span> 내 접수 · 실시간 배송조회
                </h3>
                <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
                  고객에게 번거로운 회원가입이나 앱 설치를 요구하지 마세요. 고객 화면 상단에 항상 떠 있는 <strong>[내 접수 / 배송 조회]</strong> 버튼을 눌러 <strong>본인의 이름과 전화번호</strong>만 입력하면 끝!<br /><br />
                  사장님이 어드민에서 <strong>택배사와 송장번호</strong>를 입력하거나 <strong>고객 전달 안내메모</strong>를 적어 <strong>[완료]</strong>만 누르면, 고객이 직접 송장번호와 <strong>실시간 택배 배송위치</strong>를 바로 확인할 수 있어 바쁜 시간대 문의 전화가 사라집니다.
                </p>
              </div>
              <div className="flex-1 w-full relative min-h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-violet-100/70 to-blue-50 rounded-[2.5rem] transform rotate-2 scale-105" />

                <div className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.18)] border border-indigo-100 overflow-hidden z-10">
                  <div className="bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#7E22CE] px-5 py-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white text-[#5B21B6] flex items-center justify-center">
                        <Search className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[14.5px]">내 접수 / 배송 조회</span>
                          <span className="px-2 py-0.5 bg-amber-300 text-purple-950 text-[10px] font-black rounded-full">실시간 확인</span>
                        </div>
                        <p className="text-[11px] text-purple-100 mt-0.5">이름과 전화번호만으로 송장번호 · 배송위치 즉시 확인</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5 bg-gray-50/70">
                    <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-extrabold rounded-lg border border-indigo-100">📦 택배접수 · 한우 선물세트</span>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-extrabold">발송완료</span>
                      </div>

                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <div className="text-[10.5px] font-extrabold text-emerald-700 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5" /> 발송 택배사 및 송장번호
                          </div>
                          <div className="text-[13px] font-black text-emerald-950 mt-0.5">
                            우체국택배 · <span className="underline decoration-emerald-400">6890123456789</span>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs shrink-0">
                          실시간 배송위치 조회 <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: 여러 개의 맞춤폼 동시 운영 + 매장용 QR 안내문 POP 즉시 출력 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold">
                  핵심 무기 04 · 무제한 맞춤폼 &amp; 매장용 QR 안내문 출력
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  대표 화면 외에 여러 맞춤폼도 동시에!<br className="hidden sm:block" />
                  계산대 비치용 QR 안내문(A4 · A4 반절)도 즉시 인쇄
                </h3>
                <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
                  1번 폼(예: <em>단골할래요?</em>)은 매장 대표 화면으로 띄워두고, 2번·3번 폼(예: <em>꽃배달 퀵배송 신청서</em>, <em>VIP 명절 선물세트 예약</em>)은 짧은 개별 주소(<code>/f/매장ID/2</code>)를 복사해 원하는 손님에게만 카톡이나 문자로 보내 동시에 여러 용도로 활용할 수 있습니다.<br /><br />
                  또한 어드민 상단 <strong>[QR 다운로드]</strong> 버튼만 누르면 QR코드만 덩그러니 나오는 것이 아니라, <strong>우리 매장 상호명과 원하는 안내 문구가 들어간 심플하고 고급스러운 POP 안내문</strong>을 <strong>A4 반절(A5)</strong> 또는 <strong>A4 전체 크기</strong>로 바로 인쇄하거나 이미지로 저장할 수 있습니다!
                </p>
              </div>

              <div className="flex-1 w-full relative min-h-[380px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-100 to-purple-50 rounded-[2.5rem] transform -rotate-2 scale-105" />

                <div className="relative w-full max-w-[440px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(91,33,182,0.14)] border border-gray-100 p-6 z-10 space-y-4">
                  {/* QR 안내문 미리보기 축소 카드 */}
                  <div className="mx-auto w-56 bg-white border-2 border-[#3B0764] rounded-2xl p-4 text-center shadow-sm relative">
                    <p className="text-[10.5px] font-extrabold text-[#5B21B6]">싹다상점 강남본점</p>
                    <div className="w-6 h-0.5 bg-purple-300 mx-auto my-1.5" />
                    <div className="text-sm font-black text-gray-900">QR코드를 스캔해 주세요</div>
                    <p className="text-[9.5px] text-gray-500 mt-1">스마트폰 카메라로 비추면 매장 소식과 간편 신청 화면으로 바로 연결됩니다.</p>
                    <div className="my-2.5 inline-block p-2 rounded-xl bg-purple-50 border border-purple-200">
                      <QrCode className="w-16 h-16 text-[#3B0764] mx-auto" />
                    </div>
                    <div className="px-2 py-1 rounded-full bg-purple-50 text-[9px] font-extrabold text-[#3B0764]">
                      📱 휴대폰 카메라를 켜고 비춰주세요
                    </div>
                  </div>

                  {/* 다중 폼 뱃지 */}
                  <div className="space-y-2 pt-2">
                    <div className="px-3.5 py-2.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-extrabold text-gray-900">
                        <span>단골할래요?</span>
                        <span className="px-2 py-0.5 rounded bg-[#5B21B6] text-white text-[10px] inline-flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" /> 매장 대표 화면
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-purple-700">/f/ssakdamart/1</span>
                    </div>
                    <div className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800">퀵배달 · 특별 예약 신청서 (개별 전송용)</span>
                      <span className="text-[11px] font-bold text-indigo-600">/f/ssakdamart/2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5: 직원채용 간편이력서 (사진 선택 · 보건증 첨부 · A4 1장 출력) */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
                  핵심 무기 05 · 직원채용 간편이력서 기본 탑재
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  &ldquo;종이 이력서 들고 오지 마세요!&rdquo;<br className="hidden sm:block" />
                  경력·근무시간·보건증까지 스마트폰으로 받는 간편이력서
                </h3>
                <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
                  알바나 직원을 구할 때마다 문자로 경력과 가능 시간대를 일일이 물어보느라 번거로우셨죠?<br /><br />
                  고객 화면에 기본 탑재된 <strong>[직원채용 이력서]</strong> 버튼을 누르면 지원자가 스마트폰으로 <strong>인적사항, 주소, 지원파트, 근무가능 요일·시간, 관련업종 경력, 각오, 보건증 사진(사진 첨부는 부담 없도록 선택사항!)</strong>까지 한 번에 제출합니다. 사장님은 어드민에서 면접 메모를 남기고 <strong>A4 한 장에 딱 맞게 깔끔하게 인쇄·PDF 보관</strong>할 수 있습니다.
                </p>
              </div>
              <div className="flex-1 w-full relative min-h-[380px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-[2.5rem] transform rotate-2 scale-105" />

                <div className="relative w-full max-w-[450px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.16)] border border-emerald-100 overflow-hidden z-10">
                  <div className="bg-gradient-to-r from-emerald-700 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-200" />
                      <span className="font-extrabold text-[15px]">직원채용 이력서 상세 · A4 1장 출력</span>
                    </div>
                    <span className="px-2.5 py-1 bg-white/15 text-emerald-100 text-[11px] font-bold rounded-full">면접메모 저장</span>
                  </div>

                  <div className="p-5 space-y-3.5 bg-gray-50/60">
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4">
                      <div className="w-14 h-16 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center shrink-0 text-emerald-700">
                        <Camera className="w-5 h-5 mb-0.5" />
                        <span className="text-[9.5px] font-bold">사진(선택)</span>
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[15px] font-black text-gray-900">김민지 지원자</span>
                          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">010-2345-6789</span>
                        </div>
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-bold">지원파트: 홀서빙 · 카운터</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[11px] font-bold">평일 오전 09~15시</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50/70 px-4 py-3 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-[12px] font-bold text-emerald-900">증빙서류 (보건증) 첨부 · A4 1장 인쇄 지원</span>
                      </div>
                      <Printer className="w-4 h-4 text-emerald-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section (월 9,900원 단독 플랜 + 명절/단기 이용 시 자료 100% 영구 보관 강조) */}
      <section className="py-24 sm:py-32 bg-gray-50 relative overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-[#5B21B6] font-extrabold tracking-widest uppercase text-sm mb-3">
              PRICING
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-5 leading-tight">
              수기 장부와 번거로운 전화 응대를 끝내는 비용,<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B0764] via-[#5B21B6] to-[#7E22CE]">
                소상공인 상생 응원가 월 9,900원
              </span>
            </h3>
            <p className="text-base sm:text-lg text-gray-600 font-medium">
              복잡한 연간 약정이나 위약금 없이, 필요한 달에만 1개월씩 부담 없이 이용하세요.
            </p>
          </div>

          {/* 단일 플랜 카드 */}
          <div className="max-w-xl mx-auto bg-white rounded-[2rem] shadow-2xl shadow-purple-100/70 border-2 border-[#5B21B6] p-8 sm:p-10 relative">
            <div className="absolute -top-4 right-8 bg-gradient-to-r from-[#3B0764] to-[#6D28D9] text-white text-xs sm:text-[13px] font-black px-4 py-1.5 rounded-full shadow-md">
              소상공인 상생 응원가 🚀
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-6 mb-6 border-b border-gray-100">
              <div>
                <h4 className="text-2xl font-black text-gray-900">월간 이용권 (1개월 단독)</h4>
                <p className="text-xs sm:text-sm font-bold text-[#5B21B6] mt-1">
                  자동결제 약정 없음 · 모든 기능 100% 무제한 제공
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-sm font-bold text-gray-400 line-through">월 19,900원</div>
                <div className="text-4xl sm:text-5xl font-black text-[#5B21B6] tracking-tight">
                  9,900<span className="text-base sm:text-lg font-bold text-gray-600 ml-1">원 / 1개월</span>
                </div>
              </div>
            </div>

            <ul className="space-y-3.5 mb-8">
              {[
                '내가 꾸민 맞춤폼을 우리 매장 대표 화면(/store/매장ID)으로 지정',
                '블로그(소소한 기록) · 실시간 세일 특가 · 쇼핑몰 외부 링크 최상단 연동',
                '간편 택배 접수 (상품·수량·매장결제완료/계좌이체 입금자 구분) 기본 탑재',
                '우체국·CJ·롯데·한진 등 택배사 송장용 엑셀(CSV) 원클릭 다운로드',
                '비회원 1초 내 접수 · 실시간 배송위치 조회 및 사장님 안내메모 전달',
                '직원채용 간편이력서 기본 탑재 & 모든 접수 내역 A4 1장 깔끔 인쇄',
                '매장 계산대 비치용 QR 안내문 (A4 반절 / A4 전체) 즉시 인쇄·저장'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#5B21B6] shrink-0 mt-0.5" />
                  <span className="text-gray-800 font-bold text-[14px] sm:text-[15px] leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* 1개월 단기 이용 & 자료 영구 보관 안심 박스 */}
            <div className="mb-8 p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1.5">
              <div className="text-[13px] font-extrabold text-[#3B0764] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5B21B6] shrink-0" />
                명절·시즌 행사 등 1개월만 쓰고 쉬어도 기존 자료는 100% 보관됩니다!
              </div>
              <p className="text-[12px] text-purple-950/80 font-medium leading-relaxed">
                이용 기간이 끝나면 고객 접수 링크만 일시 정지될 뿐, <strong>기존 고객 장부와 만들어둔 맞춤폼은 삭제되지 않고 그대로 보관</strong>됩니다. 다음 명절이나 행사가 있을 때 다시 결제하면 기존 링크와 폼이 1초 만에 그대로 다시 열립니다.
              </p>
            </div>

            <Link
              href="/signup"
              className="block text-center w-full py-4 sm:py-5 rounded-2xl font-black text-white text-lg bg-gradient-to-r from-[#3B0764] via-[#5B21B6] to-[#6D28D9] hover:from-[#2E054E] hover:to-[#4C1D95] shadow-xl shadow-purple-900/20 transition-all active:scale-[0.98]"
            >
              월 9,900원으로 우리 매장 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#3B0764] via-[#5B21B6] to-[#4C1D95] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
            오늘부터 우리 매장도<br className="hidden sm:block" />단골이 모이는 스마트 매장으로 바뀝니다
          </h2>
          <p className="text-purple-100 text-base sm:text-lg mb-8 font-medium">
            가입 후 1분이면 우리 매장 전용 대표 링크와 QR 안내문이 완성됩니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#3B0764] px-9 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              회원가입하고 바로 시작하기 <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/25 px-8 py-4 rounded-2xl font-bold text-base transition-all"
            >
              어드민 먼저 둘러보기
            </Link>
          </div>
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
