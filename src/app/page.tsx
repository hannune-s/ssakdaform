'use client';

import { useState } from 'react';
import { Search, Package, Copy, ExternalLink, Check, Home, User } from 'lucide-react';
import DeliveryList from './delivery-list/page';
import ReservationList from './reservation-list/page';
import OrderList from './order-list/page';
import FormBuilder from './form-builder/page';

export default function AdminHub() {
  const [activeTab, setActiveTab] = useState('builder');
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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col pt-12 sm:pt-16 px-4 pb-24">
      
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
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-6 py-2 rounded-full text-[13.5px] sm:text-[15px] font-bold transition-all whitespace-nowrap tracking-tight ${
              activeTab === 'builder' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            맞춤형 폼 만들기
          </button>
          
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
        
        
        {activeTab === 'builder' && <FormBuilder />}
        {activeTab === 'delivery' && <DeliveryList searchQuery={searchQuery} />}
        {activeTab === 'reservation' && <ReservationList searchQuery={searchQuery} />}
        {activeTab === 'order' && <OrderList searchQuery={searchQuery} />}
        
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
      
      {/* My Tab Content (Simple Placeholder) */}
      {activeTab === 'my' && (
        <div className="w-full max-w-md mx-auto mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-800">마이 페이지</h2>
          <p className="text-sm text-gray-500 mt-2">내 상점 정보 및 계정 설정 기능이 업데이트될 예정입니다.</p>
        </div>
      )}

    </div>
  );
}
