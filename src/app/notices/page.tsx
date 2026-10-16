"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, Megaphone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface NoticesPageProps {
  onBack?: () => void;
}

export default function NoticesPage({ onBack }: NoticesPageProps) {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotices() {
      setLoading(true);
      const { data } = await supabase
        .from('ssakdaform_responses')
        .select('*')
        .eq('store_id', '__hq__')
        .eq('form_id', '__hq_notice__')
        .order('submitted_at', { ascending: false });

      if (data && data.length > 0) {
        setNotices(
          data.map(r => ({
            id: r.id,
            title: r.data?.title || '',
            content: r.data?.content || '',
            important: Boolean(r.data?.important),
            createdAt: new Date(r.submitted_at).toLocaleDateString('ko-KR')
          }))
        );
      } else {
        setNotices([
          {
            id: 'default-1',
            title: '[업데이트] 비회원 내 접수 / 실시간 배송조회 기능이 오픈되었습니다!',
            content:
              '고객이 회원가입 없이 이름과 연락처만으로 택배·예약·상품주문 진행상태와 실시간 배송위치를 조회할 수 있습니다.',
            important: true,
            createdAt: new Date().toLocaleDateString('ko-KR')
          },
          {
            id: 'default-2',
            title: '[안내] 택배 송장용 엑셀(CSV) 선택 다운로드 기능 안내',
            content:
              '택배접수 리스트에서 원하는 건만 체크하여 택배사 프로그램용 엑셀 파일로 한 번에 다운로드하실 수 있습니다.',
            important: false,
            createdAt: new Date().toLocaleDateString('ko-KR')
          }
        ]);
      }
      setLoading(false);
    }
    loadNotices();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] pb-24">
      <div className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => (onBack ? onBack() : window.history.back())}
            className="p-1.5 -ml-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[18px] sm:text-[20px] font-extrabold text-gray-900 tracking-tight">
            본사 공지사항
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-7 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400 font-medium">공지사항을 불러오는 중입니다...</div>
        ) : (
          notices.map(notice => (
            <div
              key={notice.id}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-200/70 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {notice.important ? (
                    <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-full text-[11px] font-extrabold">
                      필독 공지
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[11px] font-extrabold">
                      안내
                    </span>
                  )}
                </div>
                <span className="text-[12px] text-gray-400 font-medium">{notice.createdAt}</span>
              </div>
              <h2 className="text-[16px] font-extrabold text-gray-900">{notice.title}</h2>
              <p className="text-[14px] font-medium text-gray-600 whitespace-pre-wrap leading-relaxed pt-1">
                {notice.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
