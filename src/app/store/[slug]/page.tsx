"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Calendar, FileText, ChevronRight, Store, ShoppingBag, CreditCard, Copy, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function StoreHubPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // 실제로는 slug를 이용해 DB에서 매장 정보를 불러옵니다.
  // 데모를 위해 임시로 slug를 파싱하여 매장명을 생성합니다.
  const storeName = slug === 'demo' ? '싹다 데모 매장' : `${decodeURIComponent(slug || '우리')} 매장`;

  const standardForms = [
    {
      id: 'delivery-preset',
      title: '간편 택배 접수',
      description: '보내실 물품의 택배 발송을 신청합니다.',
      icon: <Package className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-100 group-hover:border-blue-300',
    },
    {
      id: 'reservation-preset',
      title: '매장 예약 신청',
      description: '방문 일정과 인원을 미리 예약합니다.',
      icon: <Calendar className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-100 group-hover:border-indigo-300',
    },
    {
      id: 'order-preset',
      title: '상품 주문서',
      description: '원하시는 상품을 쉽고 빠르게 주문하세요.',
      icon: <ShoppingBag className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-50 border-orange-100 group-hover:border-orange-300',
    }
  ];
  const [accounts, setAccounts] = useState<any[]>([]);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccounts() {
      const { data } = await supabase
        .from('ssakdaform_store_accounts')
        .select('*')
        .order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setAccounts(data.map(d => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      }
    }
    loadAccounts();
  }, []);

  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopiedAccount(accountNumber);
      setTimeout(() => setCopiedAccount(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col font-sans relative">
      
      {/* 상단 테마 컬러 배너 */}
      <div className="w-full bg-gradient-to-b from-indigo-700 to-indigo-900 pt-14 pb-20 px-4 text-center relative overflow-hidden flex-shrink-0 shadow-lg rounded-b-[2.5rem]">
        {/* 고급스러운 패턴 배경 */}
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.08]"></div>
        
        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-5 border-4 border-indigo-400/20 transform rotate-3 transition-transform hover:rotate-0 duration-300">
            <Store className="w-10 h-10 text-indigo-700" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">{storeName}</h1>
          <p className="text-indigo-100 font-medium tracking-wide">원하시는 서비스를 선택해주세요</p>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 -mt-8 relative z-20 flex-1 pb-16">

        {/* 계좌 안내 영역 */}
        {accounts.length > 0 && (
          <div className="mb-8 bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="font-extrabold text-indigo-900 text-lg">계좌 안내</h2>
            </div>
            <div className="space-y-3">
              {accounts.map((acc, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-3 sm:p-4 bg-white rounded-xl border border-indigo-50 shadow-sm">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 flex-1">
                    <span className="text-xs sm:text-sm font-bold px-2 py-0.5 sm:py-1 bg-indigo-600 text-white rounded-md shadow-sm">{acc.bank}</span>
                    <span className="text-sm sm:text-base font-bold font-mono text-gray-900 tracking-tight">{acc.accountNumber}</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-600">{acc.holder}</span>
                  </div>
                  <button 
                    onClick={() => handleCopyAccount(acc.accountNumber)}
                    className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs sm:text-sm font-bold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all shrink-0"
                  >
                    {copiedAccount === acc.accountNumber ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    <span className="hidden sm:inline ml-1.5">{copiedAccount === acc.accountNumber ? '복사됨' : '복사'}</span>
                    <span className="inline sm:hidden ml-1">{copiedAccount === acc.accountNumber ? '완료' : '복사'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Links */}
        <div className="space-y-4">
          {standardForms.map((form) => (
            <Link href={`/form/${form.id}`} key={form.id} className="block group">
              <div className="p-5 rounded-2xl border border-transparent transition-all duration-200 flex items-center gap-4 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] group-hover:shadow-md cursor-pointer">
                <div className={`p-3 rounded-xl ${form.color} transition-colors border`}>
                  {form.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-0.5">{form.title}</h3>
                  <p className="text-sm text-gray-500">{form.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
        
        {/* Custom Forms Section (Placeholder for Demo) */}
        <div className="mt-12 pt-8 border-t border-gray-200">
           <h3 className="text-sm font-bold text-gray-400 mb-4 px-2 uppercase tracking-wider">이벤트 & 기획전 (커스텀 폼 예시)</h3>
           <Link href="/form/demo-12345" className="block group">
              <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:shadow-md transition-all flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800">🎉 추석 맞이 특별 할인 신청</h4>
                  <p className="text-xs text-gray-500 mt-1">2026.09.15 ~ 09.30</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
              </div>
           </Link>
        </div>

        <div className="mt-12 text-center text-sm text-stone-400 font-medium">
          Powered by <span className="text-indigo-600 font-semibold">싹다폼</span>
        </div>
      </div>
    </div>
  );
}
