"use client";

import { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

type FieldType = 'text' | 'number' | 'phone' | 'date' | 'textarea' | 'checkbox' | 'address';

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
  
  // 주소 검색 모달 관련 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [currentAddressFieldId, setCurrentAddressFieldId] = useState<number | null>(null);
  const [addressValues, setAddressValues] = useState<Record<number, string>>({});

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

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    if (currentAddressFieldId !== null) {
      setAddressValues(prev => ({
        ...prev,
        [currentAddressFieldId]: fullAddress
      }));
    }
    setIsPostcodeOpen(false);
  };

  const openPostcode = (fieldId: number) => {
    setCurrentAddressFieldId(fieldId);
    setIsPostcodeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center py-12 px-4 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-stone-100">
        
        <div className="bg-white px-8 py-10 text-center relative border-b border-stone-100">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>
          <p className="text-emerald-700 text-base font-bold tracking-wide mb-2">{data.storeName}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">{data.formTitle}</h1>
        </div>
        
        <div className="p-8 sm:p-10">
          <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
            {data.fields.map((field: any) => {
              const isSender = field.label.includes('보내는 분');
              const isReceiver = field.label.includes('받는 분');
              
              let labelClass = "block text-sm font-bold mb-2 ";
              let inputClass = "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 ";

              if (isSender) {
                labelClass += "text-slate-600";
                inputClass += "border-slate-400 focus:border-slate-600 focus:ring-1 focus:ring-slate-600";
              } else if (isReceiver) {
                labelClass += "text-emerald-700/80";
                inputClass += "border-emerald-600/50 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700";
              } else {
                labelClass += "text-gray-700";
                inputClass += "border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500";
              }

              return (
                <div key={field.id} className="relative">
                  <label className={labelClass}>
                    {field.label || '제목 없는 항목'}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea 
                      className={inputClass}
                      placeholder={field.placeholder}
                      rows={3}
                    />
                  ) : field.type === 'checkbox' ? (
                    <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors bg-white ${isSender ? 'border-slate-400 hover:bg-slate-50' : isReceiver ? 'border-emerald-600/50 hover:bg-emerald-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                      <input type="checkbox" className={`w-5 h-5 mt-0.5 rounded cursor-pointer ${isSender ? 'text-slate-600 border-slate-400 focus:ring-slate-600' : isReceiver ? 'text-emerald-600 border-emerald-500 focus:ring-emerald-600' : 'text-gray-600 border-gray-400 focus:ring-gray-600'}`} />
                      <span className={`text-sm leading-relaxed ${isSender ? 'text-slate-700' : isReceiver ? 'text-emerald-800' : 'text-gray-700'}`}>{field.placeholder || '동의합니다.'}</span>
                    </label>
                  ) : field.type === 'address' ? (
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        readOnly
                        onClick={() => openPostcode(field.id)}
                        value={addressValues[field.id] || ''}
                        className={`${inputClass} cursor-pointer`}
                        placeholder="클릭하여 주소 검색"
                      />
                      {addressValues[field.id] && (
                        <input 
                          type="text" 
                          className={inputClass}
                          placeholder="상세 주소를 입력하세요"
                        />
                      )}
                    </div>
                  ) : (
                    <input 
                      type={field.type === 'phone' ? 'tel' : field.type} 
                      className={inputClass}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              );
            })}
            
            <div className="pt-8">
              <button className="w-full py-4 bg-emerald-700 text-white rounded-xl font-semibold text-lg hover:bg-emerald-800 active:transform active:scale-[0.99] transition-all shadow-lg shadow-emerald-700/20">
                제출하기
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-stone-400 font-medium">
        Powered by <span className="text-emerald-600 font-semibold">싹다폼</span>
      </div>

      {/* 카카오 우편번호 검색 모달 */}
      {isPostcodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800">주소 검색</h3>
              <button onClick={() => setIsPostcodeOpen(false)} className="text-gray-500 hover:text-gray-900 font-bold p-1">
                닫기 ✕
              </button>
            </div>
            <div className="h-[400px] w-full">
              <DaumPostcode onComplete={handleComplete} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
