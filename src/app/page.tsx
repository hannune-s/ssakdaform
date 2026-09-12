'use client';

import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import DeliveryList from './delivery-list/page';
import ReservationList from './reservation-list/page';
import OrderList from './order-list/page';
import FormBuilder from './form-builder/page';

export default function AdminHub() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col pt-12 sm:pt-16 px-4">
      
      {/* 상단 로고 및 타이틀 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight mb-2">
          싹다폼
        </h1>
        <p className="text-gray-500 font-medium">자영업자 필수 링크 & 서식 종합 허브</p>
      </div>

      {/* 탭 및 검색 카드 영역 */}
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
        
        {/* 검색 바 */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium sm:text-sm"
            placeholder="'보건증', '제로페이', '메뉴판' 등 키워드 검색"
          />
        </div>

        {/* 메뉴(카테고리) 탭 버튼 */}
        <div className="flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'delivery' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            택배 신청 현황
          </button>
          <button
            onClick={() => setActiveTab('reservation')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'reservation' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            매장 예약 현황
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'order' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            상품 주문 현황
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
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
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">📦 택배 신청 현황</h2>
              <DeliveryList />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">📅 매장 예약 현황</h2>
              <ReservationList />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">🛍️ 상품 주문 현황</h2>
              <OrderList />
            </div>
          </div>
        )}
        
        {activeTab === 'delivery' && <DeliveryList />}
        {activeTab === 'reservation' && <ReservationList />}
        {activeTab === 'order' && <OrderList />}
        {activeTab === 'builder' && <FormBuilder />}
      </div>
      
    </div>
  );
}
