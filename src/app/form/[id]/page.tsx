"use client";

import { useEffect, useState } from 'react';

// Next.js App Router 동적 라우팅 파라미터 타입 지정
export default function CustomerFormPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // 임시 데모 모드: 로컬 스토리지에 저장된 빌더 데이터가 있으면 그걸 띄워줍니다.
    // 추후에는 params.id 를 이용해 Supabase DB에서 해당 폼 데이터를 불러오게 됩니다.
    const stored = localStorage.getItem('ssakdaform_draft');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      // 로컬 스토리지가 비어있을 경우 (다른 기기에서 접속 테스트 시 등)
      setData({
        storeName: '데모 스토어',
        formTitle: '고객용 폼 데모 화면',
        fields: [
          { id: 1, type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true },
          { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true }
        ]
      });
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F8]">
        <div className="text-stone-500 font-medium animate-pulse">폼 데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center py-12 px-4 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 폼 고유 아이디 표시 (어드민 참고용) */}
      <div className="mb-6 text-stone-400 text-xs font-mono">
        Form ID: {params.id}
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-stone-100">
        
        {/* 고객 화면 헤더 */}
        <div className="bg-white px-8 py-10 text-center relative border-b border-stone-100">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>
          <p className="text-emerald-700 text-base font-bold tracking-wide mb-2">{data.storeName}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">{data.formTitle}</h1>
        </div>
        
        {/* 폼 입력 영역 */}
        <div className="p-8 sm:p-10">
          <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
            {data.fields.map((field: any) => (
              <div key={field.id} className="relative">
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  {field.label || '제목 없는 항목'}
                  {field.required && <span className="text-emerald-500 ml-1">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea 
                    className="w-full px-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all duration-200 text-stone-800 placeholder-stone-400"
                    placeholder={field.placeholder}
                    rows={3}
                  />
                ) : field.type === 'checkbox' ? (
                  <label className="flex items-start gap-3 p-4 bg-stone-50/50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                    <input type="checkbox" className="w-5 h-5 mt-0.5 text-emerald-600 rounded border-stone-300 focus:ring-emerald-600 cursor-pointer" />
                    <span className="text-stone-700 text-sm leading-relaxed">{field.placeholder || '동의합니다.'}</span>
                  </label>
                ) : (
                  <input 
                    type={field.type === 'phone' ? 'tel' : field.type} 
                    className="w-full px-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all duration-200 text-stone-800 placeholder-stone-400"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
            
            <div className="pt-8">
              <button 
                onClick={() => alert('신청이 완료되었습니다! (어드민 대시보드로 데이터가 전송됩니다)')}
                className="w-full py-4 bg-emerald-700 text-white rounded-xl font-semibold text-lg hover:bg-emerald-800 active:transform active:scale-[0.99] transition-all shadow-lg shadow-emerald-700/20"
              >
                제출하기
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-stone-400 font-medium">
        Powered by <span className="text-emerald-600 font-semibold">싹다폼</span>
      </div>
    </div>
  );
}
