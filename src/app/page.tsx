'use client';

import { useState } from 'react';
import { Search, Package, Copy, ExternalLink, Check } from 'lucide-react';
import DeliveryList from './delivery-list/page';
import ReservationList from './reservation-list/page';
import OrderList from './order-list/page';
import FormBuilder from './form-builder/page';

export default function AdminHub() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const storeLink = typeof window !== 'undefined' ? `${window.location.origin}/store/demo` : 'http://localhost:3000/store/demo';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(storeLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col pt-12 sm:pt-16 px-4">
      
      {/* 상단 로고 및 타이틀 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight mb-2">
          싹다폼
        </h1>
        <p className="text-gray-500 font-medium">복잡한 접수와 주문, 싹다폼으로 싹 다.</p>
      </div>

      {/* 탭 및 검색 카드 영역 */}
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
        
        {/* 검색 바 */}
        <div className="relative mb-6">
          <input
            type="text"
            className="block w-full pl-5 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium sm:text-base outline-none"
            placeholder="이름, 연락처, 주문상품 등을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 메뉴(카테고리) 탭 버튼 */}
        <div className="flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            대시보드
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'delivery' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            택배 신청 현황
          </button>
          <button
            onClick={() => setActiveTab('reservation')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'reservation' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            매장 예약 현황
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'order' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            상품 주문 현황
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'builder' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            맞춤형 폼 만들기
          </button>
        </div>
      </div>

      {/* 하단 콘텐츠(기존 컴포넌트 렌더링) 영역 */}
      <div className="w-full max-w-6xl mx-auto flex-1">
        {activeTab === 'all' && (
          <div className="flex flex-col gap-12">
            
            {/* 매장 통합 링크 (고객 전송용) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">🚀 우리 매장 고객용 통합 링크</h2>
              <p className="text-gray-500 text-sm mb-5">
                이 링크를 복사하여 인스타그램 프로필, 카카오톡 채널, 문자 메시지 등으로 고객에게 안내하세요.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium break-all flex items-center">
                  {storeLink}
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-sm active:scale-95 shrink-0"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? '복사완료' : '링크 복사'}
                  </button>
                  <a 
                    href={storeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-all shadow-sm active:scale-95 shrink-0"
                  >
                    <ExternalLink className="w-5 h-5" />
                    고객화면 바로가기
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'delivery' && <DeliveryList searchQuery={searchQuery} />}
        {activeTab === 'reservation' && <ReservationList searchQuery={searchQuery} />}
        {activeTab === 'order' && <OrderList searchQuery={searchQuery} />}
        {activeTab === 'builder' && <FormBuilder />}
      </div>
      
    </div>
  );
}
