"use client";

import { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

export default function CustomerFormPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  
  // 주소 검색 모달 관련 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [currentAddressFieldId, setCurrentAddressFieldId] = useState<number | null>(null);
  const [addressValues, setAddressValues] = useState<Record<number, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('ssakdaform_draft');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
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
      
      <div className="mb-6 text-stone-400 text-xs font-mono">
        Form ID: {params.id}
      </div>

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
              let inputClass = "w-full px-4 py-3 rounded-xl border focus:bg-white focus:outline-none transition-all duration-200 ";

              if (isSender) {
                labelClass += "text-blue-700";
                inputClass += "bg-blue-50 border-blue-200 focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-blue-300";
              } else if (isReceiver) {
                labelClass += "text-teal-700";
                inputClass += "bg-teal-50 border-teal-200 focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-teal-300";
              } else {
                labelClass += "text-gray-700";
                inputClass += "bg-gray-50 border-gray-200 focus:ring-2 focus:ring-gray-400 text-gray-900 placeholder-gray-400";
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
                    <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${isSender ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : isReceiver ? 'bg-teal-50 border-teal-200 hover:bg-teal-100' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                      <input type="checkbox" className={`w-5 h-5 mt-0.5 rounded cursor-pointer ${isSender ? 'text-blue-600 border-blue-300 focus:ring-blue-500' : isReceiver ? 'text-teal-600 border-teal-300 focus:ring-teal-500' : 'text-gray-600 border-gray-300 focus:ring-gray-500'}`} />
                      <span className={`text-sm leading-relaxed ${isSender ? 'text-blue-800' : isReceiver ? 'text-teal-800' : 'text-gray-800'}`}>{field.placeholder || '동의합니다.'}</span>
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
