"use client";

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Building, CreditCard, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [accounts, setAccounts] = useState([{ bank: '', accountNumber: '', holder: '' }]);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAccounts() {
      const { data } = await supabase
        .from('ssakdaform_store_accounts')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (data && data.length > 0) {
        setAccounts(data.map(d => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      }
      setIsLoading(false);
    }
    loadAccounts();
  }, []);

  const handleAddAccount = () => {
    if (accounts.length >= 3) {
      alert('계좌는 최대 3개까지 등록할 수 있습니다.');
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

  const handleSave = async () => {
    setIsSaved(false);
    const validAccounts = accounts.filter(acc => acc.bank.trim() !== '' || acc.accountNumber.trim() !== '');
    
    try {
      // 기존 계좌 모두 삭제
      const { error: delError } = await supabase.from('ssakdaform_store_accounts').delete().not('id', 'is', null);
      if (delError) {
        console.error('Delete Error:', delError);
        alert('삭제 오류: ' + delError.message);
        return;
      }
      
      // 새로 삽입
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">환경 설정</h1>
        <p className="text-gray-500">매장 운영에 필요한 기본 정보와 입금 계좌를 설정합니다.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">무통장 입금 계좌 설정</h2>
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

          <div className="space-y-4">
            {accounts.map((account, index) => (
              <div key={index} className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 relative group">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleRemoveAccount(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="계좌 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  입금 계좌 {index + 1}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">은행명</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={account.bank}
                        onChange={(e) => handleChange(index, 'bank', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                        placeholder="예: 국민은행"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">계좌번호</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={account.accountNumber}
                        onChange={(e) => handleChange(index, 'accountNumber', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono"
                        placeholder="예: 123-456-789012"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">예금주</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={account.holder}
                        onChange={(e) => handleChange(index, 'holder', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                        placeholder="예: 홍길동 (싹다상점)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleSave}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm w-full sm:w-auto ${
              isSaved 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
            }`}
          >
            <Save className="w-4 h-4" />
            {isSaved ? '저장 완료!' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
