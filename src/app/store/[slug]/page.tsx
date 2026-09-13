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
      <div className="w-full bg-gradient-to-b from-indigo-700 to-indigo-900 pt-12 pb-12 px-4 text-center relative overflow-hidden flex-shrink-0 shadow-md">
        {/* 고급스러운 패턴 배경 */}
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.08]"></div>
        
        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-5 border-4 border-indigo-400/20">
            <Store className="w-10 h-10 text-indigo-700" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">{storeName}</h1>
          <p className="text-indigo-100 font-medium tracking-wide">원하시는 서비스를 선택해주세요</p>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 mt-6 relative z-20 flex-1 pb-16">

        {/* 계좌 안내 영역 (시인성/고급스러움 강화) */}
        {accounts.length > 0 && (
          <div className="mb-8 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
            {/* 은은한 포인트 라인 */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-blue-400"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <h2 className="font-extrabold text-slate-600 text-[14px] tracking-wide">무통장 입금 계좌안내</h2>
            </div>
            
            <div className="space-y-4">
              {accounts.map((acc, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-extrabold text-indigo-700">{acc.bank}</span>
                      <span className="text-sm font-semibold text-slate-500">{acc.holder}</span>
                    </div>
                    <div className="text-[22px] sm:text-2xl font-black font-mono text-slate-900 tracking-tighter">
                      {acc.accountNumber}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopyAccount(acc.accountNumber)}
                    className="flex items-center justify-center gap-1.5 px-5 py-3 sm:py-2.5 bg-indigo-50 border border-indigo-100/80 rounded-xl text-sm font-bold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 active:scale-95 transition-all shrink-0 w-full sm:w-auto"
                  >
                    {copiedAccount === acc.accountNumber ? <CheckCircle2 className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-indigo-600" /> : <Copy className="w-4.5 h-4.5 sm:w-4 sm:h-4" />}
                    <span className="text-[14px]">{copiedAccount === acc.accountNumber ? '복사완료' : '계좌 복사'}</span>
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
              <div className="relative p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 border-b-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 flex items-center gap-4 group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] group-hover:border-indigo-200 group-hover:border-b-indigo-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/0 to-indigo-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <div className={`relative z-10 p-3 rounded-xl ${form.color} transition-colors border shadow-sm`}>
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
              <div className="relative p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 border-b-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 flex items-center justify-between group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] group-hover:border-indigo-200 group-hover:border-b-indigo-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/0 to-indigo-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <div className="relative z-10">
                  <h4 className="font-bold text-gray-800">🎉 추석 맞이 특별 할인 신청</h4>
                  <p className="text-xs text-gray-500 mt-1">2026.09.15 ~ 09.30</p>
                </div>
                <ChevronRight className="relative z-10 w-5 h-5 text-gray-300 group-hover:text-gray-500" />
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
