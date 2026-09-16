"use client";

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Building, CreditCard, User, Store, MapPin, Phone, Clock, CalendarX, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [accounts, setAccounts] = useState([{ bank: '', accountNumber: '', holder: '' }]);
  const [storeInfo, setStoreInfo] = useState<any>({ name: '', ownerName: '', address: '', phone: '', hours: '', closedDays: '', paymentLink: '' });
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Load Store Info from localStorage
      const savedInfo = localStorage.getItem('ssakdaform_store_details');
      if (savedInfo) {
        setStoreInfo(JSON.parse(savedInfo));
      }

      // Load Accounts from Supabase
      const { data } = await supabase
        .from('ssakdaform_store_accounts')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (data && data.length > 0) {
        setAccounts(data.map(d => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleAddAccount = () => {
    if (accounts.length >= 3) {
      alert('계좌는 최대 3개까지 등록 가능합니다.');
      return;
    }
    setAccounts([...accounts, { bank: '', accountNumber: '', holder: '' }]);
  };

  const handleRemoveAccount = (index: number) => {
    const newAccounts = accounts.filter((_, i) => i !== index);
    setAccounts(newAccounts.length > 0 ? newAccounts : [{ bank: '', accountNumber: '', holder: '' }]);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newAccounts = [...accounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setAccounts(newAccounts);
  };

  const handleStoreChange = (field: string, value: string) => {
    setStoreInfo({ ...storeInfo, [field]: value });
  };

  const handleSave = async () => {
    setIsSaved(false);
    
    // Save Store Info to localStorage
    localStorage.setItem('ssakdaform_store_details', JSON.stringify(storeInfo));

    const validAccounts = accounts.filter(acc => acc.bank.trim() !== '' || acc.accountNumber.trim() !== '');
    
    try {
      // Delete existing
      const { error: delError } = await supabase.from('ssakdaform_store_accounts').delete().not('id', 'is', null);
      if (delError) {
        console.error('Delete Error:', delError);
        alert('삭제 오류: ' + delError.message);
        return;
      }
      
      // Insert new
      if (validAccounts.length > 0) {
        const { error: insError } = await supabase.from('ssakdaform_store_accounts').insert(
          validAccounts.map(acc => ({
            bank: acc.bank,
            account_number: acc.accountNumber,
            holder: acc.holder
          }))
        );
        if (insError) {
          console.error('Insert Error:', insError);
          alert('저장 오류: ' + insError.message);
          return;
        }
      }
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err: any) {
      console.error(err);
      alert('연결 오류: ' + (err.message || '알 수 없는 오류'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* 가게 정보 설정 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">가게 정보 설정</h2>
            <p className="text-sm text-gray-500 mt-1">고객 화면 상단에 표시될 매장 기본 정보를 입력하세요.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">상호명</label>
              <div className="relative">
                <Store className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={storeInfo.name}
                  onChange={(e) => handleStoreChange('name', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="예) 싹다상점"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">대표자명</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={storeInfo.ownerName || ''}
                  onChange={(e) => handleStoreChange('ownerName', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                  placeholder="예) 홍길동"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">주소</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={storeInfo.address}
                  onChange={(e) => handleStoreChange('address', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="예) 서울특별시 강남구 테헤란로 123"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">전화번호</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={storeInfo.phone}
                    onChange={(e) => handleStoreChange('phone', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                    placeholder="예) 02-1234-5678"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">영업시간</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={storeInfo.hours}
                    onChange={(e) => handleStoreChange('hours', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                    placeholder="예) 09:00 ~ 18:00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">휴무일</label>
                <div className="relative">
                  <CalendarX className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={storeInfo.closedDays}
                    onChange={(e) => handleStoreChange('closedDays', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                    placeholder="예) 매주 일요일"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 계좌 설정 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">계좌 설정</h2>
              <p className="text-sm text-gray-500 mt-1">등록된 계좌는 고객 통합 접속 링크 메인 화면에 자동으로 노출됩니다.</p>
            </div>
            <button 
              onClick={handleAddAccount}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              계좌 추가
            </button>
          </div>

          <div className="space-y-3">
            {accounts.map((account, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-row items-end gap-1.5 relative group w-full">
                <div className="w-[25%] shrink-0">
                  <label className="block text-[10px] sm:text-[11px] font-semibold text-gray-500 mb-1">은행명</label>
                  <input 
                    type="text" 
                    value={account.bank}
                    onChange={(e) => handleChange(index, 'bank', e.target.value)}
                    className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm"
                    placeholder="국민은행"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] sm:text-[11px] font-semibold text-gray-500 mb-1">계좌번호</label>
                  <input 
                    type="text" 
                    value={account.accountNumber}
                    onChange={(e) => handleChange(index, 'accountNumber', e.target.value)}
                    className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm font-mono"
                    placeholder="123-456-7890"
                  />
                </div>
                
                <div className="w-[22%] sm:w-[25%] shrink-0">
                  <label className="block text-[10px] sm:text-[11px] font-semibold text-gray-500 mb-1">예금주</label>
                  <input 
                    type="text" 
                    value={account.holder}
                    onChange={(e) => handleChange(index, 'holder', e.target.value)}
                    className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm"
                    placeholder="홍길동"
                  />
                </div>

                <button 
                  onClick={() => handleRemoveAccount(index)}
                  className="p-1.5 mb-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="계좌 삭제"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ))}
          </div>
          
          
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            {isSaved ? <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">✓</div>저장됨</span> : <><Save className="w-4 h-4" />저장하기</>}
          </button>
        </div>
      </div>
    </div>
  );
}
