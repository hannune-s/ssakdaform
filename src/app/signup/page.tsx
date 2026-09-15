'use client';

import { useState } from 'react';
import { Sparkles, User, Lock, Phone, Store, MapPin, Briefcase, ChevronLeft } from 'lucide-react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    ownerName: '',
    phone: '',
    storeName: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return;
    }
    // TODO: 실제 회원가입 API 연동
    alert('🎉 회원가입 UI 테스트가 완료되었습니다!\n(현재는 디자인만 구현된 상태입니다.)');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          환영합니다!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">
          싹다폼으로 복잡한 접수와 주문 관리를 싹 다 해결해보세요.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-10 px-4 shadow-xl shadow-gray-200/40 sm:rounded-[2rem] sm:px-12 border border-gray-100">
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {/* 1. 계정 정보 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
                계정 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">아이디 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="사용하실 아이디를 입력해주세요"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">상호명 (소속/단체명) <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Store className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="storeName"
                      type="text"
                      required
                      value={formData.storeName}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="매장 이름 또는 소속 단체명"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">사업장 주소 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="매장 주소를 입력해주세요"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                가입 완료하고 시작하기
              </button>
            </div>
            
            <div className="pt-4 flex flex-col items-center gap-4">
              <div className="text-sm font-medium text-gray-500">
                이미 계정이 있으신가요?{' '}
                <button 
                  type="button" 
                  onClick={() => window.location.href = '/login'}
                  className="ml-1 text-indigo-600 hover:text-indigo-800 font-extrabold underline underline-offset-2 transition-colors"
                >
                  로그인
                </button>
              </div>
              
              <button 
                type="button" 
                onClick={() => window.location.href = '/landing'}
                className="text-sm font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-1 mt-2"
              >
                <ChevronLeft className="w-4 h-4" />
                홈으로 돌아가기
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
