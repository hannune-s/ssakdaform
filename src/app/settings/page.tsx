"use client";

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, User, Store, MapPin, Phone, Clock, CalendarX, Search } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode';
import { supabase } from '@/lib/supabase';
import { getActiveStoreId, getLoggedInStore, setLoggedInStore } from '@/lib/storeSession';

export default function SettingsPage() {
  const [accounts, setAccounts] = useState([{ bank: '', accountNumber: '', holder: '' }]);
  const [storeInfo, setStoreInfo] = useState<any>({ name: '', ownerName: '', address: '', addressDetail: '', phone: '', hours: '', closedDays: '', paymentLink: '' });
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleCompletePostcode = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setStoreInfo((prev: any) => ({ ...prev, address: fullAddress }));
    setIsPostcodeOpen(false);
  };

  useEffect(() => {
    async function loadData() {
      const activeStoreId = getActiveStoreId();
      const loggedIn = getLoggedInStore();

      let initialStore: any = {
        name: loggedIn?.store_name || '',
        ownerName: loggedIn?.owner_name || '',
        address: loggedIn?.address || '',
        phone: loggedIn?.phone || '',
        hours: '',
        closedDays: '',
        paymentLink: ''
      };

      // DB에서 최신 매장 정보 로드
      const { data: storeRow } = await supabase
        .from('ssakdaform_stores')
        .select('*')
        .eq('store_id', activeStoreId)
        .maybeSingle();

      if (storeRow) {
        initialStore = {
          ...initialStore,
          name: storeRow.store_name || initialStore.name,
          ownerName: storeRow.owner_name || initialStore.ownerName,
          address: storeRow.address || initialStore.address,
          phone: storeRow.phone || initialStore.phone
        };
      }

      // 로컬에 저장된 영업시간/휴무일 등 부가 정보 병합
      const savedInfo = localStorage.getItem(`ssakdaform_store_details_${activeStoreId}`) || localStorage.getItem('ssakdaform_store_details');
      if (savedInfo) {
        try {
          const parsed = JSON.parse(savedInfo);
          initialStore = {
            ...initialStore,
            hours: parsed.hours || '',
            closedDays: parsed.closedDays || '',
            paymentLink: parsed.paymentLink || '',
            name: initialStore.name || parsed.name || parsed.storeName || '',
            ownerName: initialStore.ownerName || parsed.ownerName || '',
            address: initialStore.address || parsed.address || '',
            phone: initialStore.phone || parsed.phone || parsed.contact || ''
          };
        } catch (e) {}
      }

      setStoreInfo(initialStore);

      // 현재 로그인된 매장(store_id)의 계좌 목록만 불러오기
      const { data } = await supabase
        .from('ssakdaform_store_accounts')
        .select('*')
        .eq('store_id', activeStoreId)
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
    const activeStoreId = getActiveStoreId();
    const loggedIn = getLoggedInStore();
    const combinedAddress = [String(storeInfo.address || '').trim(), String(storeInfo.addressDetail || '').trim()]
      .filter(Boolean)
      .join(' ');
    const payloadToSave = { ...storeInfo, address: combinedAddress, addressDetail: '' };
    setStoreInfo(payloadToSave);
    
    // 로컬 스토리지 저장 (매장별 키 + 기본 키)
    localStorage.setItem(`ssakdaform_store_details_${activeStoreId}`, JSON.stringify(payloadToSave));
    localStorage.setItem('ssakdaform_store_details', JSON.stringify(payloadToSave));

    const validAccounts = accounts.filter(acc => acc.bank.trim() !== '' || acc.accountNumber.trim() !== '');
    
    try {
      // 1. ssakdaform_stores 테이블의 매장 기본 정보 업데이트
      const { data: updatedStore } = await supabase
        .from('ssakdaform_stores')
        .update({
          store_name: payloadToSave.name,
          owner_name: payloadToSave.ownerName,
          address: combinedAddress,
          phone: payloadToSave.phone
        })
        .eq('store_id', activeStoreId)
        .select('*')
        .maybeSingle();

      if (updatedStore) {
        setLoggedInStore(updatedStore);
      } else if (loggedIn) {
        setLoggedInStore({
          ...loggedIn,
          store_name: payloadToSave.name,
          owner_name: payloadToSave.ownerName,
          address: combinedAddress,
          phone: payloadToSave.phone
        });
      }

      // 2. 현재 매장(store_id)의 기존 계좌만 삭제 후 재등록
      const { error: delError } = await supabase
        .from('ssakdaform_store_accounts')
        .delete()
        .eq('store_id', activeStoreId);

      if (delError) {
        console.error('Delete Error:', delError);
        alert('삭제 오류: ' + delError.message);
        return;
      }
      
      if (validAccounts.length > 0) {
        const { error: insError } = await supabase.from('ssakdaform_store_accounts').insert(
          validAccounts.map(acc => ({
            store_id: activeStoreId,
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
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      readOnly
                      onClick={() => setIsPostcodeOpen(true)}
                      value={storeInfo.address}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                      placeholder="클릭하여 매장 주소 검색"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPostcodeOpen(true)}
                    className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    주소 검색
                  </button>
                </div>
                {storeInfo.address && (
                  <input 
                    type="text" 
                    value={storeInfo.addressDetail || ''}
                    onChange={(e) => handleStoreChange('addressDetail', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                    placeholder="상세 주소를 입력하세요 (예: 1층 102호)"
                  />
                )}
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

      {/* 다음(카카오) 우편번호 검색 모달 */}
      {isPostcodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800">매장 주소 검색</h3>
              <button
                type="button"
                onClick={() => setIsPostcodeOpen(false)}
                className="text-gray-500 hover:text-gray-900 font-bold p-1"
              >
                닫기 ✕
              </button>
            </div>
            <div className="h-[420px] w-full">
              <DaumPostcode onComplete={handleCompletePostcode} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
