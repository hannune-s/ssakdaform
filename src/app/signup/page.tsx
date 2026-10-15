'use client';

import { useState } from 'react';
import { Sparkles, User, Lock, Phone, Store, MapPin, Mail, Globe, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { setLoggedInStore } from '@/lib/storeSession';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    ownerName: '',
    phone: '',
    storeId: '',
    storeName: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'storeId') {
      // 영문 소문자와 숫자만 허용
      const sanitized = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      setFormData(prev => ({ ...prev, storeId: sanitized }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = formData.username.trim();
    const cleanStoreId = formData.storeId.trim().toLowerCase();

    if (!cleanUsername) {
      alert('사용하실 로그인 아이디를 입력해주세요.');
      return;
    }
    if (formData.password.length < 4) {
      alert('비밀번호는 최소 4자리 이상 입력해주세요.');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return;
    }
    if (!cleanStoreId || cleanStoreId.length < 2) {
      alert('매장 전용 영문 아이디(스토어 주소용)를 영문/숫자 2자 이상 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. 로그인 아이디(username) 중복 체크
      const { data: existingUser } = await supabase
        .from('ssakdaform_stores')
        .select('id')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (existingUser) {
        alert('이미 사용 중인 로그인 아이디입니다. 다른 아이디를 입력해주세요.');
        setIsSubmitting(false);
        return;
      }

      // 2. 매장 전용 영문 아이디(store_id) 중복 체크
      const { data: existingStore } = await supabase
        .from('ssakdaform_stores')
        .select('id')
        .eq('store_id', cleanStoreId)
        .maybeSingle();

      if (existingStore) {
        alert('이미 사용 중인 매장 전용 영문 아이디(스토어 주소)입니다. 다른 영문 아이디를 입력해주세요.');
        setIsSubmitting(false);
        return;
      }

      // 3. ssakdaform_stores 테이블에 신규 매장/계정 저장
      const newStorePayload = {
        username: cleanUsername,
        email: formData.email.trim(),
        password: formData.password,
        owner_name: formData.ownerName.trim(),
        phone: formData.phone.trim(),
        store_id: cleanStoreId,
        store_name: formData.storeName.trim(),
        address: formData.address.trim(),
        custom_forms: []
      };

      const { data: insertedStore, error: insertError } = await supabase
        .from('ssakdaform_stores')
        .insert([newStorePayload])
        .select('*')
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // 4. 가입 완료 후 즉시 로그인 세션 저장 및 어드민 홈 이동
      setLoggedInStore(insertedStore || newStorePayload);

      alert(
        `🎉 회원가입이 완료되었습니다!\n\n[${formData.storeName}] 전용 링크(/store/${cleanStoreId})가 생성되었습니다.\n어드민 대시보드로 이동합니다.`
      );
      router.push('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      alert('회원가입 처리 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류'));
    } finally {
      setIsSubmitting(false);
    }
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
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="사용하실 로그인 아이디를 입력해주세요"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">이메일 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">비밀번호 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="비밀번호 (6자리 이상)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">비밀번호 확인 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="passwordConfirm"
                      type="password"
                      required
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="비밀번호 한 번 더 입력"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 사장님(대표자) 정보 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
                대표자 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">이름 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="ownerName"
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="대표자 성함"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">연락처 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 매장 정보 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
                매장 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    매장 전용 영문 아이디 (스토어 주소용) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="storeId"
                      type="text"
                      required
                      value={formData.storeId}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="영문 소문자/숫자만 입력 (예: ssakdamart)"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-indigo-600 font-medium pl-1">
                    * 내 매장 전용 링크 및 QR코드 주소로 사용됩니다. (예: /store/{formData.storeId || 'ssakdamart'})
                  </p>
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
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
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
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="매장 주소를 입력해주세요"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
              >
                {isSubmitting ? '가입 처리 중...' : '가입 완료하고 시작하기'}
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
