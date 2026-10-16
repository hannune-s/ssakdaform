"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getActiveStoreId, getLoggedInStore, DEFAULT_DEMO_STORE } from '@/lib/storeSession';

interface InquiryPageProps {
  onBack?: () => void;
}

export default function InquiryPage({ onBack }: InquiryPageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [myInquiries, setMyInquiries] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadMyInquiries = async () => {
    const activeStoreId = getActiveStoreId();
    const { data } = await supabase
      .from('ssakdaform_responses')
      .select('*')
      .eq('store_id', '__hq__')
      .eq('form_id', '__hq_inquiry__')
      .order('submitted_at', { ascending: false });

    if (data) {
      const mine = data
        .filter(r => (r.data?.storeId || 'demo') === activeStoreId)
        .map(r => ({
          id: r.id,
          title: r.data?.title || '',
          content: r.data?.content || '',
          reply: r.data?.reply || '',
          status: r.status || '답변대기',
          createdAt: new Date(r.submitted_at).toLocaleString('ko-KR')
        }));
      setMyInquiries(mine);
    }
  };

  useEffect(() => {
    loadMyInquiries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('문의 제목과 내용을 입력해주세요.');
      return;
    }

    const store = getLoggedInStore() || DEFAULT_DEMO_STORE;
    setSubmitting(true);
    const { error } = await supabase.from('ssakdaform_responses').insert([
      {
        store_id: '__hq__',
        form_id: '__hq_inquiry__',
        status: '답변대기',
        data: {
          storeId: store.store_id,
          storeName: store.store_name,
          ownerName: store.owner_name,
          phone: store.phone,
          title: title.trim(),
          content: content.trim(),
          reply: ''
        }
      }
    ]);
    setSubmitting(false);

    if (error) {
      alert('문의 등록 중 오류가 발생했습니다: ' + error.message);
      return;
    }

    setTitle('');
    setContent('');
    alert('본사로 1:1 문의가 접수되었습니다!');
    loadMyInquiries();
  };

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
            1:1 본사 문의
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-7 space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-200/70 space-y-4"
        >
          <h2 className="text-[16px] font-extrabold text-gray-900">문의 남기기</h2>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="문의 제목을 입력해주세요"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] font-bold outline-none focus:bg-white focus:border-indigo-500"
          />
          <textarea
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="이용 중 궁금하신 점이나 건의사항을 편하게 남겨주세요."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] font-medium outline-none focus:bg-white focus:border-indigo-500"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[13.5px] font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? '전송 중...' : '문의 등록하기'}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          <h3 className="text-[15px] font-extrabold text-gray-800 px-1">나의 문의 내역</h3>
          {myInquiries.length > 0 ? (
            myInquiries.map(inq => (
              <div
                key={inq.id}
                className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      inq.status === '답변완료'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {inq.status}
                  </span>
                  <span className="text-[12px] text-gray-400 font-medium">{inq.createdAt}</span>
                </div>
                <h4 className="text-[15px] font-extrabold text-gray-900">{inq.title}</h4>
                <p className="text-[13.5px] font-medium text-gray-600 whitespace-pre-wrap">{inq.content}</p>
                {inq.reply && (
                  <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3.5 mt-2">
                    <div className="text-[11.5px] font-extrabold text-indigo-700 mb-1">
                      💬 싹다폼 본사 답변
                    </div>
                    <p className="text-[13px] font-bold text-gray-800 whitespace-pre-wrap">{inq.reply}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-[13.5px] font-medium border border-gray-100">
              아직 등록한 1:1 문의 내역이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
