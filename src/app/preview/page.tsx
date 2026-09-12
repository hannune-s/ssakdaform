"use client";

import { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { CreditCard, Copy, CheckCircle2 } from 'lucide-react';

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
  const [data, setData] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // 주소 검색 모달 관련 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [currentAddressFieldId, setCurrentAddressFieldId] = useState<number | null>(null);
  const [addressValues, setAddressValues] = useState<Record<number, string>>({});

  useEffect(() => {
    const storedAccounts = localStorage.getItem('ssakdaform_store_accounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    }

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

  const handleCopyAccount = async (account: string) => {
    try {
      await navigator.clipboard.writeText(account);
      setCopiedAccount(account);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (err) {
      console.error('Failed to copy account', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center py-8 sm:py-12 px-2 sm:px-4 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-stone-100">
        
        <div className="bg-white px-5 sm:px-8 py-8 sm:py-10 text-center relative border-b border-stone-100">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>
          <p className="text-emerald-700 text-base font-bold tracking-wide mb-2">{data.storeName}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">{data.formTitle}</h1>
        </div>
        
        <div className="px-4 sm:px-10 py-6 sm:py-10">
          {accounts.length > 0 && (
            <div className="mb-8 bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="font-extrabold text-indigo-900 text-lg">계좌 안내</h2>
              </div>
              <div className="space-y-3">
                {accounts.map((acc, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-indigo-50 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 sm:gap-2.5 flex-1">
                      <span className="text-sm font-bold px-2.5 py-1 bg-indigo-600 text-white rounded-md shadow-sm self-start sm:self-auto shrink-0">{acc.bank}</span>
                      <span className="text-base sm:text-lg font-bold font-mono text-gray-900 tracking-tight break-all">{acc.accountNumber}</span>
                      <span className="text-base font-bold text-gray-700">{acc.holder}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleCopyAccount(acc.accountNumber)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-sm font-bold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all w-full sm:w-auto shrink-0"
                    >
                      {copiedAccount === acc.accountNumber ? <CheckCircle2 className="w-4 h-4 text-indigo-600" /> : <Copy className="w-4 h-4" />}
                      {copiedAccount === acc.accountNumber ? '복사됨' : '복사'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
            {(() => {
              const senderFields = data.fields.filter((f: any) => f.label.includes('보내는 분'));
              const receiverFields = data.fields.filter((f: any) => f.label.includes('받는 분'));
              const otherFields = data.fields.filter((f: any) => !f.label.includes('보내는 분') && !f.label.includes('받는 분'));

              const renderField = (field: any, groupType: 'sender' | 'receiver' | 'other') => {
                let labelClass = "block text-sm font-bold mb-2 ";
                let inputClass = "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 ";

                if (groupType === 'sender') {
                  labelClass += "text-slate-800";
                  inputClass += "border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-600 shadow-sm";
                } else if (groupType === 'receiver') {
                  labelClass += "text-[#5C4D3C]";
                  inputClass += "border-[#D4C4B1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] shadow-sm";
                } else {
                  labelClass += "text-gray-800";
                  inputClass += "border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 shadow-sm";
                }

                const displayLabel = field.label ? field.label.replace('보내는 분 - ', '').replace('받는 분 - ', '') : '제목 없는 항목';

                return (
                  <div key={field.id} className="relative mb-5 last:mb-0">
                    <label className={labelClass}>
                      {displayLabel}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea 
                        name={field.label}
                        className={inputClass}
                        placeholder={field.placeholder}
                        rows={3}
                      />
                    ) : field.type === 'checkbox' ? (
                      <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors bg-white shadow-sm ${groupType === 'sender' ? 'border-slate-300 hover:bg-slate-50' : groupType === 'receiver' ? 'border-[#D4C4B1] hover:bg-[#FDFBF7]' : 'border-gray-300 hover:bg-gray-50'}`}>
                        <input name={field.label} type="checkbox" className={`w-5 h-5 mt-0.5 rounded cursor-pointer ${groupType === 'sender' ? 'text-slate-600 border-slate-400 focus:ring-slate-600' : groupType === 'receiver' ? 'text-[#8B7355] border-[#D4C4B1] focus:ring-[#8B7355]' : 'text-gray-600 border-gray-400 focus:ring-gray-600'}`} />
                        <span className={`text-sm leading-relaxed ${groupType === 'sender' ? 'text-slate-800' : groupType === 'receiver' ? 'text-[#5C4D3C]' : 'text-gray-800'}`}>{field.placeholder || '동의합니다.'}</span>
                      </label>
                    ) : field.type === 'address' ? (
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          name={field.label}
                          readOnly
                          onClick={() => openPostcode(field.id)}
                          value={addressValues[field.id] || ''}
                          className={`${inputClass} cursor-pointer`}
                          placeholder="클릭하여 주소 검색"
                        />
                        {addressValues[field.id] && (
                          <input 
                            type="text" 
                            name={`${field.label} - 상세주소`}
                            className={inputClass}
                            placeholder="상세 주소를 입력하세요"
                          />
                        )}
                      </div>
                    ) : (
                      <input 
                        name={field.label}
                        type={field.type === 'phone' ? 'tel' : field.type} 
                        className={inputClass}
                        placeholder={field.placeholder}
                        defaultValue={field.defaultValue}
                      />
                    )}
                  </div>
                );
              };

              return (
                <div className="space-y-8">
                  {senderFields.length > 0 && (
                    <div className="bg-slate-100 border border-slate-300 rounded-2xl p-4 sm:p-7 shadow-sm">
                      <h3 className="font-extrabold text-slate-800 mb-5 text-lg flex items-center gap-2">
                        <span className="w-2 h-6 bg-slate-600 rounded-full inline-block"></span>
                        보내는 분 (발송인)
                      </h3>
                      <div>
                        {senderFields.map((f: any) => renderField(f, 'sender'))}
                      </div>
                    </div>
                  )}

                  {receiverFields.length > 0 && (
                    <div className="bg-[#F6F1EA] border border-[#E8DCC9] rounded-2xl p-4 sm:p-7 shadow-sm">
                      <h3 className="font-extrabold text-[#5C4D3C] mb-5 text-lg flex items-center gap-2">
                        <span className="w-2 h-6 bg-[#8B7355] rounded-full inline-block"></span>
                        받는 분 (수령인)
                      </h3>
                      <div>
                        {receiverFields.map((f: any) => renderField(f, 'receiver'))}
                      </div>
                    </div>
                  )}

                  {otherFields.length > 0 && (
                    <div className="bg-gray-100 border border-gray-300 rounded-2xl p-4 sm:p-7 shadow-sm">
                      <h3 className="font-extrabold text-gray-800 mb-5 text-lg flex items-center gap-2">
                        <span className="w-2 h-6 bg-gray-500 rounded-full inline-block"></span>
                        {(senderFields.length > 0 || receiverFields.length > 0) ? '기타 정보' : '입력 정보'}
                      </h3>
                      <div>
                        {otherFields.map((f: any) => renderField(f, 'other'))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            
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
