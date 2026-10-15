"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getEffectiveAdminStoreId } from '@/lib/storeSession';

import { Package, Calendar, ShoppingBag, FileText, UserCheck, Bell, BarChart3, ChevronRight } from 'lucide-react';

export default function DashboardWidget({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [counts, setCounts] = useState({ delivery: 0, reservation: 0, order: 0, custom: 0, resume: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCounts() {
      const storeId = getEffectiveAdminStoreId();
      // Get today's start and end in local time
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfDay = today.toISOString();
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endOfDay = tomorrow.toISOString();

      const { data, error } = await supabase
        .from('ssakdaform_responses')
        .select('form_id')
        .eq('store_id', storeId)
        .gte('submitted_at', startOfDay)
        .lt('submitted_at', endOfDay);
      
      if (data) {
        const newCounts = { delivery: 0, reservation: 0, order: 0, custom: 0, resume: 0 };
        data.forEach(row => {
          if (row.form_id === 'delivery-preset') newCounts.delivery++;
          else if (row.form_id === 'reservation-preset') newCounts.reservation++;
          else if (row.form_id === 'order-preset') newCounts.order++;
          else if (row.form_id === 'resume-preset') newCounts.resume++;
          else newCounts.custom++;
        });
        setCounts(newCounts);
      }

      // 2. Fetch recent 5 activities
      const { data: recentData } = await supabase
        .from('ssakdaform_responses')
        .select('*')
        .eq('store_id', storeId)
        .order('submitted_at', { ascending: false })
        .limit(5);

      if (recentData) {
        const parsedActivities = recentData.map(row => {
          let type = '간편폼';
          let tab = 'custom';
          let name = '고객 님';
          let desc = '새로운 신청서가 접수되었습니다.';
          
          const d = row.data || {};
          
          const nameKey = Object.keys(d).find(k => k.includes('이름') || k.includes('고객명') || k.includes('예약자'));
          if (nameKey && d[nameKey]) name = `${d[nameKey]} 님`;

          if (row.form_id === 'delivery-preset') {
            type = '택배'; tab = 'delivery';
            if (d['보내는 분 - 이름']) name = `${d['보내는 분 - 이름']} 님`;
            if (d['받는 분 - 주소']) desc = d['받는 분 - 주소'];
          } else if (row.form_id === 'reservation-preset') {
            type = '예약'; tab = 'reservation';
            const date = d['예약 날짜'] || '';
            const time = d['예약 시간'] || '';
            const people = d['방문 인원'] ? `${d['방문 인원']}명` : '';
            desc = [date, time, people].filter(Boolean).join(' - ');
          } else if (row.form_id === 'order-preset') {
            type = '상품'; tab = 'order';
            if (d['상품명']) desc = d['상품명'];
          } else if (row.form_id === 'resume-preset') {
            type = '이력서'; tab = 'resume';
            const part = d['지원파트'] ? `지원파트: ${d['지원파트']}` : '';
            const schedule = [d['근무가능요일'], d['근무가능시간']].filter(Boolean).join(' / ');
            desc = [part, schedule].filter(Boolean).join(' · ') || '간편 이력서가 접수되었습니다.';
          } else {
            type = '간편폼'; tab = 'custom';
            const descKey = Object.keys(d).find(k => (k.includes('상품명') || k.includes('내용') || k.includes('주소')) && typeof d[k] === 'string' && !d[k].startsWith('data:'));
            if (descKey && d[descKey]) desc = d[descKey];
          }

          const now = new Date();
          const submitted = new Date(row.submitted_at);
          const diffMs = now.getTime() - submitted.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          let timeStr = '';
          if (diffMins < 60) timeStr = `${diffMins || 1}분 전`;
          else if (diffMins < 24 * 60) timeStr = `${Math.floor(diffMins / 60)}시간 전`;
          else timeStr = `${Math.floor(diffMins / (24 * 60))}일 전`;

          return { type, name, desc, time: timeStr, isNew: diffMins < 24 * 60, tab };
        });
        setRecentActivities(parsedActivities);
      }
    }
    fetchCounts();
  }, []);

  const stats = [
    { id: 'delivery', name: '택배접수', count: counts.delivery, newCount: 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { id: 'reservation', name: '예약접수', count: counts.reservation, newCount: 0, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { id: 'order', name: '상품접수', count: counts.order, newCount: 0, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { id: 'custom', name: '간편폼접수', count: counts.custom, newCount: 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    { id: 'resume', name: '이력서접수', count: counts.resume, newCount: 0, icon: UserCheck, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8 mt-2">
      
      {/* 1 Row 5 Columns Grid Status */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 text-[14px] sm:text-[15px]">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            오늘의 접수 현황
          </h3>
          <span className="text-[11px] text-gray-500 font-medium">오늘 00:00 기준</span>
        </div>
        
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
          {stats.map(stat => (
            <button 
              key={stat.id}
              onClick={() => setActiveTab(stat.id)}
              className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-gray-50/80 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all active:scale-95 relative"
            >
              {stat.newCount > 0 && (
                <div className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
              )}
              
              <p className="text-gray-500 text-[10px] sm:text-[11px] font-semibold mb-1 whitespace-nowrap tracking-tighter sm:tracking-normal">{stat.name}</p>
              <div className="flex items-baseline gap-0.5">
                <span className={`text-[20px] sm:text-[26px] font-black tracking-tight ${stat.color}`}>{stat.count}</span>
                <span className="text-[10.5px] sm:text-[12px] text-gray-500 font-medium">건</span>
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
          
        </div>
        
        <div className="divide-y divide-gray-200 flex flex-col">
          {recentActivities.length === 0 && (
            <div className="py-10 text-center text-gray-400 text-[13px]">
              최근 들어온 알림이 없습니다.
            </div>
          )}
          {recentActivities.map((activity, i) => (
            <div key={i} onClick={() => setActiveTab(activity.tab)} className="flex items-center gap-3 py-4 px-3 sm:px-4 bg-white hover:bg-gray-50/40 transition-colors cursor-pointer active:scale-[0.99] group rounded-xl">
              <div className={`w-2 h-2 rounded-full shrink-0 ${activity.isNew ? 'bg-indigo-500' : 'bg-gray-300'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-2 py-0.5 rounded-md text-[11.5px] sm:text-[12px] font-bold shrink-0 ${
                      activity.tab === 'delivery' ? 'bg-blue-50 text-blue-600' :
                      activity.tab === 'order' ? 'bg-purple-50 text-purple-600' :
                      activity.tab === 'reservation' ? 'bg-green-50 text-green-600' :
                      activity.tab === 'resume' ? 'bg-teal-50 text-teal-700' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {activity.type}
                    </span>
                    <p className={`text-[14px] sm:text-[15px] font-extrabold truncate ${activity.isNew ? 'text-gray-900' : 'text-gray-600'}`}>{activity.name}</p>
                  </div>
                  <span className="text-[11px] sm:text-[12px] font-medium text-gray-400 whitespace-nowrap shrink-0">{activity.time}</span>
                </div>
                <p className="text-[13px] sm:text-[14px] text-gray-500 truncate">{activity.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
