"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Calendar, FileText, ChevronRight, Store, ShoppingBag, CreditCard, Copy, CheckCircle2, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccounts() {
      const savedStoreInfo = localStorage.getItem('ssakdaform_store_details');
      if (savedStoreInfo) { setStoreInfo(JSON.parse(savedStoreInfo)); }
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
        
        {storeInfo && (storeInfo.name || storeInfo.address || storeInfo.phone || storeInfo.hours || storeInfo.closedDays) && (
          <div className="mb-6">
            <button 
              onClick={() => setIsStoreInfoOpen(!isStoreInfoOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors mx-auto bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full"
            >
              <Store className="w-3.5 h-3.5" />
              가게 정보 보기
              {isStoreInfoOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            
            {isStoreInfoOpen && (
              <div className="mt-3 p-4 bg-white shadow-sm border border-gray-100 rounded-xl text-sm text-gray-700 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {storeInfo.name && (
                  <div className="flex gap-2">
                    <Store className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">상호명:</span>{storeInfo.name}</div>
                  </div>
                )}
                {storeInfo.address && (
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">주소:</span>{storeInfo.address}</div>
                  </div>
                )}
                {storeInfo.phone && (
                  <div className="flex gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">전화번호:</span>{storeInfo.phone}</div>
                  </div>
                )}
                {storeInfo.hours && (
                  <div className="flex gap-2">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">영업시간:</span>{storeInfo.hours}</div>
                  </div>
                )}
                {storeInfo.closedDays && (
                  <div className="flex gap-2">
                    <CalendarX className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">휴무일:</span>{storeInfo.closedDays}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 계좌 안내 영역 (전체 배경색 적용, 크기 축소) */}
        {(accounts.length > 0 || (storeInfo && storeInfo.paymentLink)) && (
          <div className="mb-6 bg-[#F0F4FF] border border-indigo-200 rounded-2xl px-4 py-3.5">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <h2 className="font-bold text-indigo-900 text-[14px]">결제 및 계좌 안내</h2>
            </div>
            
            <div className="space-y-1.5">
              {accounts.map((acc, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 flex-1">
                    <span className="text-[13px] font-bold text-indigo-600">{acc.bank}</span>
                    <span className="text-[17px] font-bold font-mono text-gray-900 tracking-tight">{acc.accountNumber}</span>
                    <span className="text-[13px] font-medium text-gray-500">{acc.holder}</span>
                  </div>
                  <button 
                    onClick={() => handleCopyAccount(acc.accountNumber)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm border border-indigo-50"
                  >
                    {copiedAccount === acc.accountNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    <span>{copiedAccount === acc.accountNumber ? '복사됨' : '복사'}</span>
                  </button>
                </div>
              ))}
            </div>
            {storeInfo && storeInfo.paymentLink && (
              <div className="mt-4 pt-4 border-t border-indigo-200/50">
                <h3 className="text-[12px] font-bold text-indigo-900 mb-2">비대면 카드 결제</h3>
                <a 
                  href={storeInfo.paymentLink.startsWith('http') ? storeInfo.paymentLink : `https://${storeInfo.paymentLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors text-[14px] shadow-sm active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" />
                  결제하러 가기
                </a>
              </div>
            )}
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
