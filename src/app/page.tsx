'use client';

import { useState } from 'react';
import { Search, Package, Copy, ExternalLink, Check, Home, User, ChevronRight, ArrowLeft, LogOut } from 'lucide-react';
import DeliveryList from './delivery-list/page';
import ReservationList from './reservation-list/page';
import OrderList from './order-list/page';
import CustomList from './custom-list/page';
import FormBuilder from './form-builder/page';
import SettingsPage from './settings/page';
import AccountPage from './account/page';
import DashboardWidget from './components/DashboardWidget';

export default function AdminHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ssakdaform-9cqv.vercel.app';
      await navigator.clipboard.writeText(`${currentOrigin}/store/demo`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col px-4 pb-24">
      {activeTab !== 'my' && activeTab !== 'settings' && activeTab !== 'account' && (
        <div className="pt-12 sm:pt-16 flex flex-col w-full">
      
      {/* 상단 로고 및 타이틀 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight mb-2">
          싹다폼
        </h1>
        <p className="text-gray-500 font-medium">복잡한 접수와 주문, 싹다폼으로 싹 다.</p>
      </div>


      {/* 매장 통합 링크 (고객 전송용) - 최상단 고정 */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="bg-gradient-to-br from-[#EEF2FF] via-[#F5F3FF] to-[#E0E7FF] rounded-[20px] sm:rounded-3xl p-5 sm:p-6 shadow-lg border-2 border-indigo-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* 텍스트 영역 */}
            <div className="flex-1">
              <h2 className="text-[17px] sm:text-[19px] font-extrabold text-indigo-950 mb-1.5 tracking-tight">우리 매장 통합 링크</h2>
              <p className="text-indigo-900/70 text-[12.5px] sm:text-[14px] font-medium leading-snug tracking-tighter whitespace-nowrap">
                인스타, 카톡 등에 링크를 공유해 고객에게 안내해 보세요.
              </p>
            </div>
            
            {/* 버튼 영역 */}
            <div className="flex flex-row gap-2 w-full md:w-auto shrink-0">
                <button 
                  onClick={handleCopy}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-sm active:scale-95 text-[13.5px] sm:text-[14px]"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '복사완료' : '링크 복사'}
                </button>
                <a 
                  href="/store/demo"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-white border border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-50 font-bold transition-all shadow-sm active:scale-95 text-[13.5px] sm:text-[14px]"
                >
                  <ExternalLink className="w-4 h-4" />
                  고객화면 가기
                </a>
            </div>
        </div>
      </div>


      {/* 탭 및 검색 카드 영역 */}
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
        
        {/* 메뉴(카테고리) 탭 버튼 */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 w-full px-1">
          {/* 1번 줄: 맞춤형 폼 만들기 */}
          <div className="flex flex-row justify-center gap-1 sm:gap-2 w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 max-w-[150px] px-2 py-2 rounded-full text-[13.5px] sm:text-[15px] font-bold transition-all whitespace-nowrap tracking-tight ${
                activeTab === 'dashboard' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              대시보드
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`flex-1 max-w-[150px] px-2 py-2 rounded-full text-[13.5px] sm:text-[15px] font-bold transition-all whitespace-nowrap tracking-tight ${
                activeTab === 'builder' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              맞춤형 폼 만들기
            </button>
          </div>
          
          {/* 2번 줄: 현황 3종 */}
          <div className="flex flex-row justify-center gap-1 sm:gap-2 w-full">
            <button
              onClick={() => setActiveTab('delivery')}
              className={`flex-1 max-w-[130px] px-0.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[13px] sm:text-[14px] font-bold transition-all whitespace-nowrap tracking-tighter sm:tracking-tight ${
                activeTab === 'delivery' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              택배 신청 현황
            </button>
            <button
              onClick={() => setActiveTab('reservation')}
              className={`flex-1 max-w-[130px] px-0.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[13px] sm:text-[14px] font-bold transition-all whitespace-nowrap tracking-tighter sm:tracking-tight ${
                activeTab === 'reservation' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              매장 예약 현황
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className={`flex-1 max-w-[130px] px-0.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[13px] sm:text-[14px] font-bold transition-all whitespace-nowrap tracking-tighter sm:tracking-tight ${
                activeTab === 'order' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              상품 주문 현황
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 max-w-[130px] px-0.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[13px] sm:text-[14px] font-bold transition-all whitespace-nowrap tracking-tighter sm:tracking-tight ${
                activeTab === 'custom' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              맞춤 주문 현황
            </button>
          </div>
        </div>
        
        {/* 검색창 */}
        <div className="relative mt-5 sm:mt-6">
          <input
            type="text"
            className="block w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-[13px] sm:text-base outline-none"
            placeholder="이름, 연락처, 주문상품 등을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-1.5 flex items-center">
            <button className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 하단 콘텐츠(기존 컴포넌트 렌더링) 영역 */}
      <div className="w-full max-w-6xl mx-auto flex-1">
        
        
        {activeTab === 'dashboard' && <DashboardWidget setActiveTab={setActiveTab} />}
        {activeTab === 'builder' && <FormBuilder />}
        {activeTab === 'delivery' && <DeliveryList searchQuery={searchQuery} />}
        {activeTab === 'reservation' && <ReservationList searchQuery={searchQuery} />}
        {activeTab === 'order' && <OrderList searchQuery={searchQuery} />}
        {activeTab === 'custom' && <CustomList searchQuery={searchQuery} />}
        
        </div>

      {/* 🔹 하단 네비게이션바 (홈 / 마이) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-50 h-16 sm:h-16">
        <button 
          onClick={() => setActiveTab('builder')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab !== 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">홈</span>
        </button>
        <button 
          onClick={() => setActiveTab('my')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">마이</span>
        </button>
      </div>
      
      </div>
      )}

      {/* 계정 정보 페이지 */}
      {activeTab === 'account' && (
        <div className="pt-12 sm:pt-16 pb-10 w-full">
          <div className="px-4 flex items-center gap-2 mb-4">
            <button onClick={() => setActiveTab('my')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">계정 정보</h2>
          </div>
          <AccountPage />
        </div>
      )}

      {/* 마이 메뉴 컨텐츠 */}
      {activeTab === 'settings' && (
        <div className="pt-12 sm:pt-16 pb-10 w-full">
          <div className="px-4 flex items-center gap-2 mb-4">
            <button onClick={() => setActiveTab('my')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">설정 (계좌 정보)</h2>
          </div>
          <SettingsPage />
        </div>
      )}

      {/* 마이 메뉴 컨텐츠 */}
      {activeTab === 'my' && (
        <div className="w-full max-w-4xl mx-auto mt-6 px-2 sm:px-0 pb-10">
          <div className="mb-6 flex items-start sm:items-center gap-1 sm:gap-3">
            <button 
              onClick={() => setActiveTab('builder')}
              className="p-1.5 -ml-2 text-gray-400 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-200 active:scale-95 mt-0.5 sm:mt-0"
              aria-label="이전으로 돌아가기"
            >
              <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <div>
              <h2 className="text-[22px] sm:text-2xl font-bold text-gray-900 leading-tight">마이 메뉴</h2>
              <p className="text-[13px] sm:text-sm text-gray-500 mt-1">계정 정보 및 설정을 관리하세요.</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                title: '계정 정보',
                desc: '관리자 아이디 및 비밀번호 변경',
                color: 'bg-purple-900',
                onClick: () => setActiveTab('account')
              },
              {
                title: '구독 및 결제 관리',
                desc: '이용권 상태, 카드 변경, 결제 내역',
                color: 'bg-purple-900'
              },
              {
                title: '설정 (가게/계좌 정보)',
                desc: '가게 기본 정보 및 무통장 입금 계좌 관리',
                color: 'bg-purple-900',
                onClick: () => setActiveTab('settings')
              },
              {
                title: '고객 홍보 (링크 & QR)',
                desc: '우리 매장 전용 링크 및 QR코드 다운로드',
                color: 'bg-pink-500'
              }
            ].map((menu, idx) => (
              <div 
                key={idx} 
                onClick={menu.onClick}
                className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100/80 flex items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${menu.color}`}></div>
                <div className="ml-2 flex-1">
                  <h3 className="font-extrabold text-gray-900 text-[15px] sm:text-[16px] tracking-tight">{menu.title}</h3>
                  <p className="text-[13px] text-gray-500 mt-0.5">{menu.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            ))}
          </div>

          <div className="mt-10 mb-3">
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight px-1">고객 서비스</h3>
          </div>
          
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100/80 overflow-hidden divide-y divide-gray-100/80">
            {[
              { title: '이용 가이드', type: 'normal' },
              { title: '1:1 문의', type: 'normal' },
              { title: '본사 공지사항', type: 'notice' },
              { title: '로그아웃', type: 'logout' }
            ].map((menu, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-[15px] sm:text-[16px] ${menu.type === 'logout' ? 'text-red-500' : 'text-gray-900'}`}>
                    {menu.title}
                  </span>
                  {menu.type === 'notice' && (
                    <span className="flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full leading-none mt-0.5">
                      N
                    </span>
                  )}
                </div>
                {menu.type === 'logout' ? (
                  <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 mb-20 flex flex-col items-center justify-center space-y-2">
            <span className="text-[12px] font-medium text-gray-400 tracking-wide">싹다폼 v1.0.0</span>
            <button className="text-[12px] font-medium text-gray-400 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-500 pb-0.5">
              서비스 탈퇴하기
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
