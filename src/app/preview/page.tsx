"use client";

import { useEffect, useState } from 'react';

type FieldType = 'text' | 'number' | 'phone' | 'date' | 'textarea' | 'checkbox';

interface FormField {
  id: number;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
}

interface PreviewData {
  storeName: string;
  formTitle: string;
  fields: FormField[];
}

export default function PreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 빌더 데이터 가져오기
    const stored = localStorage.getItem('ssakdaform_preview');
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-stone-500 font-medium">미리보기 데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center py-12 px-4 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-stone-100">
        
        {/* 고급스러운 헤더 영역 (블랙 대신 깨끗한 화이트 & 딥 그린 포인트) */}
        <div className="bg-white px-8 py-10 text-center relative border-b border-stone-100">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>
          <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-3">{data.storeName}</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-800 tracking-tight">{data.formTitle}</h1>
        </div>
        
        {/* 폼 입력 영역 */}
        <div className="p-8 sm:p-10">
          <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
            {data.fields.map((field) => (
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
              <button className="w-full py-4 bg-emerald-700 text-white rounded-xl font-semibold text-lg hover:bg-emerald-800 active:transform active:scale-[0.99] transition-all shadow-lg shadow-emerald-700/20">
                제출하기
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* 하단 싹다폼 워터마크 (선택사항) */}
      <div className="mt-8 text-center text-sm text-stone-400 font-medium">
        Powered by <span className="text-emerald-600 font-semibold">싹다폼</span>
      </div>
    </div>
  );
}
