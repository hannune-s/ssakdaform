"use client";

import { useState, useEffect } from 'react';
import { Save, User, Lock, Mail } from 'lucide-react';

export default function AccountPage() {
  const [accountInfo, setAccountInfo] = useState({ id: 'admin', name: '관리자' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load from localStorage for demo purposes
    const saved = localStorage.getItem('ssakdaform_account_info');
    if (saved) {
      setAccountInfo(JSON.parse(saved));
    }
  }, []);

  const handleInfoChange = (field: string, value: string) => {
    setAccountInfo({ ...accountInfo, [field]: value });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const handleSave = () => {
    if (passwords.new !== passwords.confirm) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setIsLoading(true);
    
    // Save to localStorage
    localStorage.setItem('ssakdaform_account_info', JSON.stringify(accountInfo));
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      setPasswords({ current: '', new: '', confirm: '' }); // Clear passwords after save
      setTimeout(() => setIsSaved(false), 2000);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-300 overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">기본 정보</h2>
            <p className="text-sm text-gray-500 mt-1">로그인에 사용되는 아이디와 관리자 이름을 변경합니다.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">아이디</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={accountInfo.id}
                  onChange={(e) => handleInfoChange('id', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border-2 border-gray-300 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">이름</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={accountInfo.name}
                  onChange={(e) => handleInfoChange('name', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border-2 border-gray-300 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="관리자"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-300 overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">비밀번호 변경</h2>
            <p className="text-sm text-gray-500 mt-1">계정을 안전하게 보호하기 위해 주기적으로 변경해주세요.</p>
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
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border-2 border-gray-300 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
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
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border-2 border-gray-300 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
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
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border-2 border-gray-300 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
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
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 font-bold border-2 border-indigo-600 shadow-md text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            {isSaved ? <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">✓</div>저장됨</span> : <><Save className="w-4 h-4" />변경사항 저장</>}
          </button>
        </div>
      </div>
    </div>
  );
}
