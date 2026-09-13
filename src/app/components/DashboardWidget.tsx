"use client";

import { Package, Calendar, ShoppingBag, FileText, Bell, BarChart3, ChevronRight } from 'lucide-react';

export default function DashboardWidget({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  // Demo data for today
  const stats = [
    { id: 'delivery', name: '택배', count: 12, newCount: 3, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { id: 'reservation', name: '예약', count: 8, newCount: 2, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { id: 'order', name: '주문', count: 24, newCount: 5, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { id: 'custom', name: '맞춤', count: 0, newCount: 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' }
  ];

  const recentActivities = [
    { title: '[택배] 홍길동 님', desc: '서울 강남구 테헤란로 123', time: '10분 전', isNew: true, tab: 'delivery' },
    { title: '[주문] 김철수 님', desc: '한우 특수부위 세트 외 1건', time: '1시간 전', isNew: true, tab: 'order' },
    { title: '[예약] 이영희 님', desc: '10/25 (금) 19:00 - 4명 방문', time: '3시간 전', isNew: false, tab: 'reservation' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8 mt-2">
      
      {/* 1 Row 4 Columns Grid Status */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 text-[14px] sm:text-[15px]">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            오늘의 접수 현황
          </h3>
          <span className="text-[11px] text-gray-500 font-medium">오늘 00:00 기준</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {stats.map(stat => (
            <button 
              key={stat.id}
              onClick={() => setActiveTab(stat.id)}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors active:scale-95 relative border border-gray-100/50"
            >
              {stat.newCount > 0 && (
                <div className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
              )}
              
              <p className="text-gray-500 text-[11px] sm:text-[12px] font-semibold mb-0.5">{stat.name}</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[16px] sm:text-[18px] font-black text-gray-900 tracking-tight">{stat.count}</span>
                <span className="text-[11px] sm:text-[12px] text-gray-500 font-medium">건</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 text-[14px] sm:text-[15px]">
            <Bell className="w-4 h-4 text-indigo-600" />
            최근 들어온 알림
          </h3>
          <button className="text-[11px] sm:text-[12px] text-gray-500 font-medium flex items-center hover:text-gray-900">
            전체보기 <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
        
        <div className="space-y-2.5">
          {recentActivities.map((activity, i) => (
            <div key={i} onClick={() => setActiveTab(activity.tab)} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:bg-gray-50 transition-colors cursor-pointer active:scale-[0.99]">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${activity.isNew ? 'bg-indigo-500' : 'bg-gray-300'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <p className={`text-[12.5px] sm:text-[13px] font-bold truncate pr-2 ${activity.isNew ? 'text-gray-900' : 'text-gray-600'}`}>{activity.title}</p>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 whitespace-nowrap shrink-0 mt-0.5">{activity.time}</span>
                </div>
                <p className="text-[11.5px] sm:text-[12px] text-gray-500 truncate">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
