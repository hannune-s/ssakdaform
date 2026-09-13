"use client";

import { Package, Calendar, ShoppingBag, FileText, Bell, BarChart3, ChevronRight } from 'lucide-react';

export default function DashboardWidget({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  // Demo data for today
  const stats = [
    { id: 'delivery', name: '택배 접수', count: 12, newCount: 3, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { id: 'reservation', name: '예약 신청', count: 8, newCount: 2, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { id: 'order', name: '상품 주문', count: 24, newCount: 5, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { id: 'builder', name: '맞춤 주문', count: 0, newCount: 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' }
  ];

  const recentActivities = [
    { title: '[택배] 홍길동 님', desc: '서울 강남구 테헤란로 123', time: '10분 전', isNew: true },
    { title: '[주문] 김철수 님', desc: '한우 특수부위 세트 외 1건', time: '1시간 전', isNew: true },
    { title: '[예약] 이영희 님', desc: '10/25 (금) 19:00 - 4명 방문', time: '3시간 전', isNew: false },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
      
      {/* 2x2 Grid Status */}
      <div>
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 text-[16px]">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            오늘의 접수 현황
          </h3>
          <span className="text-[12px] text-gray-500 font-medium">오늘 00:00 기준</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {stats.map(stat => (
            <button 
              key={stat.id}
              onClick={() => setActiveTab(stat.id)}
              className={`bg-white p-4 sm:p-5 rounded-[20px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-left relative overflow-hidden border ${stat.border}`}
            >
              {stat.newCount > 0 && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[11px] font-bold text-red-600 shrink-0">신규 {stat.newCount}</span>
                </div>
              )}
              
              <div className={`p-2.5 sm:p-3 rounded-xl ${stat.bg} inline-flex mb-3 sm:mb-4`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              
              <div className="mt-1">
                <p className="text-gray-500 text-[13px] font-semibold mb-0.5">{stat.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{stat.count}</span>
                  <span className="text-sm text-gray-500 font-medium">건</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 text-[15px]">
            <Bell className="w-5 h-5 text-indigo-600" />
            최근 들어온 알림
          </h3>
          <button className="text-[12px] text-gray-500 font-medium flex items-center hover:text-gray-900">
            전체보기 <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        
        <div className="space-y-3">
          {recentActivities.map((activity, i) => (
            <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${activity.isNew ? 'bg-indigo-500' : 'bg-gray-300'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className={`text-[13.5px] font-bold truncate pr-2 ${activity.isNew ? 'text-gray-900' : 'text-gray-600'}`}>{activity.title}</p>
                  <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap shrink-0">{activity.time}</span>
                </div>
                <p className="text-[12.5px] text-gray-500 truncate">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
