'use client';

import { useState } from 'react';
import { Sparkles, User, Lock, ChevronLeft, Phone, Store, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { setLoggedInStore } from '@/lib/storeSession';
import { verifyPassword, hashPassword, isSha256Hash } from '@/lib/passwordCrypto';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 찾기 / 재설정 모달 상태
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetStep, setResetStep] = useState<'verify' | 'newPw'>('verify');
  const [resetTargetStore, setResetTargetStore] = useState<any>(null);
  const [resetForm, setResetForm] = useState({
    identifier: '',
    ownerName: '',
    phone: '',
    newPassword: '',
    newPasswordConfirm: ''
  });
  const [isResetting, setIsResetting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputId = formData.username.trim();
    const inputPw = formData.password;

    if (!inputId || !inputPw) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 로그인 아이디(username) 또는 매장 영문 아이디(store_id)로 조회
      const { data: stores, error } = await supabase
        .from('ssakdaform_stores')
        .select('*')
        .or(`username.eq.${inputId},store_id.eq.${inputId.toLowerCase()},email.eq.${inputId}`);

      if (error) {
        throw new Error(error.message);
      }

      let matchedStore: any = null;
      for (const s of stores || []) {
        if (await verifyPassword(inputPw, s.password)) {
          matchedStore = s;
          break;
        }
      }

      if (!matchedStore) {
        alert('아이디 또는 비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        setIsLoading(false);
        return;
      }

      // 만약 기존 DB에 평문으로 저장되어 있었다면 즉시 암호화된 해시로 자동 업그레이드
      if (matchedStore.password && !isSha256Hash(matchedStore.password)) {
        const hashedPw = await hashPassword(inputPw);
        await supabase
          .from('ssakdaform_stores')
          .update({ password: hashedPw })
          .eq('id', matchedStore.id);
        matchedStore = { ...matchedStore, password: hashedPw };
      }

      setLoggedInStore(matchedStore);
      alert(`환영합니다, [${matchedStore.store_name}] ${matchedStore.owner_name} 사장님! 어드민 홈으로 이동합니다.`);
      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      alert('로그인 처리 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류'));
    } finally {
      setIsLoading(false);
    }
  };

  const openResetModal = () => {
    setResetStep('verify');
    setResetTargetStore(null);
    setResetForm({
      identifier: formData.username.trim(),
      ownerName: '',
      phone: '',
      newPassword: '',
      newPasswordConfirm: ''
    });
    setIsResetOpen(true);
  };

  const handleVerifyAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const idVal = resetForm.identifier.trim();
    const ownerVal = resetForm.ownerName.trim();
    const phoneDigits = resetForm.phone.replace(/[^0-9]/g, '');

    if (!idVal || !ownerVal || !phoneDigits) {
      alert('아이디(또는 매장 영문 아이디), 대표자 성함, 연락처를 모두 입력해 주세요.');
      return;
    }

    setIsResetting(true);
    try {
      const { data: stores, error } = await supabase
        .from('ssakdaform_stores')
        .select('*')
        .or(`username.eq.${idVal},store_id.eq.${idVal.toLowerCase()},email.eq.${idVal}`);

      if (error) throw new Error(error.message);

      const matched = (stores || []).find(s => {
        const dbOwner = String(s.owner_name || '').trim();
        const dbPhoneDigits = String(s.phone || '').replace(/[^0-9]/g, '');
        return dbOwner === ownerVal && dbPhoneDigits === phoneDigits;
      });

      if (!matched) {
        alert('입력하신 정보와 일치하는 매장을 찾을 수 없습니다.\n아이디, 대표자 성함, 가입 시 등록한 연락처를 다시 확인해 주세요.');
        return;
      }

      setResetTargetStore(matched);
      setResetStep('newPw');
    } catch (err: any) {
      alert('본인 확인 중 오류가 발생했습니다: ' + (err.message || '오류'));
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetStore) return;

    if (resetForm.newPassword.length < 4) {
      alert('새 비밀번호는 4자리 이상 입력해 주세요.');
      return;
    }
    if (resetForm.newPassword !== resetForm.newPasswordConfirm) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setIsResetting(true);
    try {
      const hashedPw = await hashPassword(resetForm.newPassword);
      const { error } = await supabase
        .from('ssakdaform_stores')
        .update({ password: hashedPw })
        .eq('id', resetTargetStore.id);

      if (error) throw new Error(error.message);

      alert(`[${resetTargetStore.store_name}] 매장의 새 비밀번호로 변경되었습니다!\n새 비밀번호로 로그인해 주세요.`);
      setFormData(prev => ({
        ...prev,
        username: resetTargetStore.username || resetTargetStore.store_id,
        password: ''
      }));
      setIsResetOpen(false);
    } catch (err: any) {
      alert('비밀번호 재설정 실패: ' + (err.message || '오류'));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          로그인
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">
          싹다폼 어드민으로 돌아오신 것을 환영합니다.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-10 shadow-xl shadow-gray-200/50 sm:rounded-[24px] border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">아이디</label>
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
                  placeholder="아이디를 입력해주세요"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">비밀번호</label>
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
                  placeholder="비밀번호"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  로그인 상태 유지
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={openResetModal}
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  비밀번호 찾기
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-[15px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {isLoading ? '로그인 확인 중...' : '로그인'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">아직 계정이 없으신가요?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/signup"
                className="w-full flex justify-center py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm text-[15px] font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all active:scale-[0.98]"
              >
                회원가입 하기
              </Link>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link href="/landing" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* 비밀번호 찾기 / 재설정 모달 */}
      {isResetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsResetOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <h3 className="text-lg font-extrabold text-gray-900">
                {resetStep === 'verify' ? '비밀번호 찾기 (본인 확인)' : '새 비밀번호 설정'}
              </h3>
              <button
                type="button"
                onClick={() => setIsResetOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetStep === 'verify' ? (
              <form onSubmit={handleVerifyAccount} className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  가입 시 등록한 <b>아이디(또는 매장 영문 아이디)</b>와 <b>대표자 성함</b>, <b>연락처</b>를 입력하시면 즉시 새 비밀번호를 설정하실 수 있습니다.
                </p>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    로그인 아이디 또는 매장 영문 아이디
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={resetForm.identifier}
                      onChange={e => setResetForm({ ...resetForm, identifier: e.target.value })}
                      placeholder="예) j00337"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    대표자 성함
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={resetForm.ownerName}
                      onChange={e => setResetForm({ ...resetForm, ownerName: e.target.value })}
                      placeholder="가입 시 등록한 대표자 이름"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    등록된 연락처 (전화번호)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={resetForm.phone}
                      onChange={e => setResetForm({ ...resetForm, phone: e.target.value })}
                      placeholder="예) 010-0000-0000"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsResetOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm disabled:opacity-60"
                  >
                    {isResetting ? '확인 중...' : '본인 확인 및 다음'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2 text-xs text-indigo-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    [{resetTargetStore?.store_name}] 본인 확인이 완료되었습니다. 새 비밀번호를 입력해 주세요.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    새 비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={resetForm.newPassword}
                      onChange={e => setResetForm({ ...resetForm, newPassword: e.target.value })}
                      placeholder="새 비밀번호 입력 (4자리 이상)"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    새 비밀번호 확인
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={resetForm.newPasswordConfirm}
                      onChange={e => setResetForm({ ...resetForm, newPasswordConfirm: e.target.value })}
                      placeholder="새 비밀번호 한 번 더 입력"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsResetOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm disabled:opacity-60"
                  >
                    {isResetting ? '저장 중...' : '새 비밀번호 저장'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
