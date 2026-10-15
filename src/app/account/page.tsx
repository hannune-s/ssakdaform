"use client";

import { useState, useEffect } from 'react';
import { Save, User, Lock, Mail, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getLoggedInStore, setLoggedInStore, DEFAULT_DEMO_STORE } from '@/lib/storeSession';

export default function AccountPage() {
  const [accountInfo, setAccountInfo] = useState({
    id: 'demo',
    email: 'demo@ssakdaform.com',
    name: '홍길동',
    storeId: 'demo'
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const store = getLoggedInStore() || DEFAULT_DEMO_STORE;
    setAccountInfo({
      id: store.username,
      email: store.email || '',
      name: store.owner_name,
      storeId: store.store_id
    });
  }, []);

  const handleInfoChange = (field: string, value: string) => {
    setAccountInfo({ ...accountInfo, [field]: value });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const handleSave = async () => {
    const store = getLoggedInStore() || DEFAULT_DEMO_STORE;

    if (passwords.new || passwords.confirm) {
      if (store.password && passwords.current !== store.password) {
        alert('현재 비밀번호가 일치하지 않습니다.');
        return;
      }
      if (passwords.new !== passwords.confirm) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      if (passwords.new.length < 4) {
        alert('새 비밀번호는 4자리 이상 입력해주세요.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const updatePayload: any = {
        owner_name: accountInfo.name.trim(),
        email: accountInfo.email.trim()
      };
      if (passwords.new) {
        updatePayload.password = passwords.new;
      }

      const { data: updated, error } = await supabase
        .from('ssakdaform_stores')
        .update(updatePayload)
        .eq('store_id', store.store_id)
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (updated) {
        setLoggedInStore(updated);
      }

      setIsSaved(true);
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err: any) {
      console.error('Account update error:', err);
      alert('저장 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">기본 계정 정보</h2>
            <p className="text-sm text-gray-500 mt-1">가입된 로그인 아이디, 매장 전용 주소 및 대표자 정보를 확인하고 관리합니다.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">로그인 아이디 (변경 불가)</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={accountInfo.id}
                  disabled
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">매장 전용 영문 아이디 / 스토어 주소 (변경 불가)</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={`/store/${accountInfo.storeId}`}
                  disabled
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-indigo-100 bg-indigo-50/50 text-indigo-700 text-sm cursor-not-allowed font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">이메일</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  value={accountInfo.email}
                  onChange={(e) => handleInfoChange('email', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">대표자 이름</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={accountInfo.name}
                  onChange={(e) => handleInfoChange('name', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="대표자 성함"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">비밀번호 변경</h2>
            <p className="text-sm text-gray-500 mt-1">계정을 안전하게 보호하기 위해 비밀번호를 변경할 수 있습니다.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">현재 비밀번호</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  value={passwords.current}
                  onChange={(e) => handlePasswordChange('current', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="현재 비밀번호 입력"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">새 비밀번호</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  value={passwords.new}
                  onChange={(e) => handlePasswordChange('new', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="새 비밀번호 입력"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">새 비밀번호 확인</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  value={passwords.confirm}
                  onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="새 비밀번호 다시 입력"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-60"
          >
            {isSaved ? <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">✓</div>저장됨</span> : <><Save className="w-4 h-4" />{isLoading ? '저장 중...' : '변경사항 저장'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
