"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Calendar,
  ChevronRight,
  Store,
  ShoppingBag,
  CreditCard,
  Copy,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  CalendarX,
  ChevronDown,
  ChevronUp,
  User,
  UserCheck,
  Search,
  Truck,
  X,
  FileText,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getActiveStoreId } from '@/lib/storeSession';

export default function StoreHubPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'demo';

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
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // 내 접수/배송 조회 모달 상태
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [lookupName, setLookupName] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResults, setLookupResults] = useState<any[] | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  const openLookupModal = () => {
    setLookupName('');
    setLookupPhone('');
    setLookupResults(null);
    setLookupLoading(false);
    setCopiedTracking(null);
    setIsLookupOpen(true);
  };

  const closeLookupModal = () => {
    setIsLookupOpen(false);
    setLookupName('');
    setLookupPhone('');
    setLookupResults(null);
    setLookupLoading(false);
    setCopiedTracking(null);
  };

  useEffect(() => {
    async function loadStoreAndAccounts() {
      let resolvedStore: any = null;

      // 1. Supabase ssakdaform_stores 테이블에서 해당 slug(store_id)의 매장 정보 조회
      const { data: storeRow } = await supabase
        .from('ssakdaform_stores')
        .select('*')
        .eq('store_id', slug)
        .maybeSingle();

      if (storeRow) {
        resolvedStore = {
          name: storeRow.store_name,
          ownerName: storeRow.owner_name,
          address: storeRow.address,
          phone: storeRow.phone,
          hours: '',
          closedDays: '',
          paymentLink: ''
        };
      }

      // 2. 같은 브라우저에서 설정한 추가 상세정보(영업시간, 휴무일 등) 병합 (DB의 상호명/기본정보 우선)
      const savedStoreInfo = localStorage.getItem(`ssakdaform_store_details_${slug}`) || (slug === getActiveStoreId() ? localStorage.getItem('ssakdaform_store_details') : null);
      if (savedStoreInfo) {
        try {
          const parsed = JSON.parse(savedStoreInfo);
          resolvedStore = {
            ...parsed,
            ...(resolvedStore || {}),
            name: resolvedStore?.name || parsed.name || parsed.storeName || '',
            ownerName: resolvedStore?.ownerName || parsed.ownerName || '',
            address: resolvedStore?.address || parsed.address || '',
            phone: resolvedStore?.phone || parsed.phone || parsed.contact || '',
            hours: parsed.hours || resolvedStore?.hours || '',
            closedDays: parsed.closedDays || resolvedStore?.closedDays || '',
            paymentLink: parsed.paymentLink || resolvedStore?.paymentLink || ''
          };
        } catch (e) {}
      }

      if (!resolvedStore) {
        resolvedStore = {
          name: slug === 'demo' ? '싹다 데모 매장' : `${decodeURIComponent(slug)} 매장`,
          address: slug === 'demo' ? '서울시 서초구 (데모 주소)' : '',
          phone: slug === 'demo' ? '010-1234-5678' : '',
          hours: slug === 'demo' ? '09:00 ~ 18:00' : '',
          closedDays: slug === 'demo' ? '일요일' : '',
          ownerName: slug === 'demo' ? '홍길동' : '',
          paymentLink: ''
        };
      }

      setStoreInfo(resolvedStore);

      // 3. 해당 매장(store_id)의 입금 계좌 목록 조회
      const { data: accData } = await supabase
        .from('ssakdaform_store_accounts')
        .select('*')
        .eq('store_id', slug)
        .order('created_at', { ascending: true });

      if (accData && accData.length > 0) {
        setAccounts(accData.map(d => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      } else {
        setAccounts([]);
      }
    }
    loadStoreAndAccounts();
  }, [slug]);

  const displayStoreName =
    storeInfo?.name ||
    storeInfo?.storeName ||
    (slug === 'demo' ? '싹다 데모 매장' : `${decodeURIComponent(slug || '우리')} 매장`);

  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopiedAccount(accountNumber);
      setTimeout(() => setCopiedAccount(null), 2000);
    });
  };

  const handleCopyTracking = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber).then(() => {
      setCopiedTracking(trackingNumber);
      setTimeout(() => setCopiedTracking(null), 2000);
    });
  };

  // 주소 일부 마스킹 처리 (개인정보 보호)
  const maskAddress = (addr: string) => {
    if (!addr) return '-';
    const parts = addr.trim().split(/\s+/);
    if (parts.length <= 2) return addr;
    return `${parts.slice(0, 3).join(' ')} ***`;
  };

  // 이름 + 전화번호로 접수 내역 조회
  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetName = lookupName.trim();
    const targetPhoneDigits = lookupPhone.replace(/[^0-9]/g, '');

    if (!targetName) {
      alert('신청자 이름을 입력해주세요.');
      return;
    }
    if (targetPhoneDigits.length < 4) {
      alert('연락처를 정확히 입력해주세요.');
      return;
    }

    setLookupLoading(true);
    const { data, error } = await supabase
      .from('ssakdaform_responses')
      .select('*')
      .eq('store_id', slug)
      .neq('form_id', 'resume-preset')
      .order('submitted_at', { ascending: false });

    setLookupLoading(false);

    if (error) {
      alert('조회 중 오류가 발생했습니다: ' + error.message);
      return;
    }

    const matched = (data || []).filter((row: any) => {
      const d = row.data || {};
      const entries = Object.entries(d).filter(([k]) => !k.startsWith('_'));

      // 택배접수: 보내는 분 또는 받는 분 이름+연락처 일치 여부 확인
      if (row.form_id === 'delivery-preset') {
        const senderName = String(d['보내는 분 - 이름'] || row.senderName || '').trim();
        const senderPhone = String(d['보내는 분 - 연락처'] || row.senderPhone || '').replace(/[^0-9]/g, '');
        const receiverName = String(d['받는 분 - 이름'] || row.receiverName || '').trim();
        const receiverPhone = String(d['받는 분 - 연락처'] || row.receiverPhone || '').replace(/[^0-9]/g, '');

        const isSenderMatch =
          senderName === targetName &&
          senderPhone.length >= 4 &&
          (senderPhone === targetPhoneDigits || senderPhone.endsWith(targetPhoneDigits));
        const isReceiverMatch =
          receiverName === targetName &&
          receiverPhone.length >= 4 &&
          (receiverPhone === targetPhoneDigits || receiverPhone.endsWith(targetPhoneDigits));

        return isSenderMatch || isReceiverMatch;
      }

      // 예약 / 상품주문 / 간편폼: 이름 관련 필드와 연락처 관련 필드 매칭
      let nameMatched = false;
      let phoneMatched = false;

      for (const [k, v] of entries) {
        const valStr = String(v || '').trim();
        const valDigits = valStr.replace(/[^0-9]/g, '');

        if (/이름|성함|고객명|예약자|주문자/.test(k)) {
          if (valStr === targetName) nameMatched = true;
        }
        if (/연락처|전화번호|휴대폰|핸드폰/.test(k)) {
          if (valDigits.length >= 4 && (valDigits === targetPhoneDigits || valDigits.endsWith(targetPhoneDigits))) {
            phoneMatched = true;
          }
        }
      }

      // 만약 커스텀 폼에서 필드명이 다를 경우 값 자체에서 일치 여부 보조 확인
      if (!nameMatched) {
        nameMatched = entries.some(([, v]) => String(v || '').trim() === targetName);
      }
      if (!phoneMatched) {
        phoneMatched = entries.some(([, v]) => {
          const digits = String(v || '').replace(/[^0-9]/g, '');
          return digits.length >= 8 && (digits === targetPhoneDigits || digits.endsWith(targetPhoneDigits));
        });
      }

      return nameMatched && phoneMatched;
    });

    setLookupResults(matched);
  };

  const getFormCategoryMeta = (formId: string, data: any) => {
    if (formId === 'delivery-preset') {
      return {
        label: '택배접수',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        defaultPending: '접수대기',
      };
    }
    if (formId === 'reservation-preset') {
      return {
        label: '매장예약',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        defaultPending: '접수대기',
      };
    }
    if (formId === 'order-preset') {
      return {
        label: '상품주문',
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
        defaultPending: '접수대기',
      };
    }
    return {
      label: data?.formTitle || '간편폼접수',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      defaultPending: '접수대기',
    };
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
            {displayStoreName}
          </h1>
          <p className="text-indigo-100 font-medium tracking-wide">원하시는 서비스를 선택해주세요</p>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 mt-6 relative z-20 flex-1 pb-16">
        
        {storeInfo && (storeInfo.name || storeInfo.ownerName || storeInfo.address || storeInfo.phone || storeInfo.hours || storeInfo.closedDays) && (
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

                {storeInfo.ownerName && (
                  <div className="flex gap-2">
                    <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">대표자:</span>{storeInfo.ownerName}</div>
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

        {/* 계좌 안내 영역 */}
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

        {/* 🔍 내 접수 / 배송 조회 버튼 (간편 택배 접수 바로 위) */}
        <div className="mb-5">
          <button
            type="button"
            onClick={openLookupModal}
            className="w-full text-left group relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 text-white shadow-[0_8px_24px_rgba(79,70,229,0.28)] hover:shadow-[0_12px_30px_rgba(79,70,229,0.38)] transition-all duration-300 flex items-center gap-4 hover:-translate-y-0.5 active:scale-[0.99] overflow-hidden border border-white/20"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/15 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -left-6 -bottom-8 w-24 h-24 bg-cyan-300/20 rounded-full blur-xl pointer-events-none"></div>
            <div className="relative z-10 p-3 rounded-xl bg-white text-indigo-600 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Search className="w-6 h-6 stroke-[2.4]" />
            </div>
            <div className="relative z-10 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-extrabold text-white text-[16.5px] sm:text-[17.5px] tracking-tight drop-shadow-sm">
                  내 접수 / 배송 조회
                </h3>
                <span className="px-2 py-0.5 text-[10.5px] font-extrabold bg-amber-300 text-indigo-950 rounded-full shadow-sm">
                  실시간 확인
                </span>
              </div>
              <p className="text-[12.5px] sm:text-[13px] text-indigo-50 font-medium truncate">
                이름과 연락처로 송장번호·예약·주문 상태를 확인하세요
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/20 group-hover:bg-white/30 backdrop-blur-sm text-white text-[12px] font-extrabold transition-colors shrink-0 border border-white/25">
              <span>조회</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* 기본 고객 서비스 폼 3종 */}
        <div className="space-y-4">
          {standardForms.map((form) => (
            <Link href={`/form/${form.id}?store=${encodeURIComponent(slug)}`} key={form.id} className="block group">
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

        {/* 기본 폼과 분리된 직원채용 간편이력서 영역 */}
        <div className="mt-10 pt-7 border-t border-gray-200/90">
          <h3 className="text-xs font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider">직원 채용 안내</h3>
          <Link href={`/form/resume-preset?store=${encodeURIComponent(slug)}`} className="block group">
            <div className="relative p-5 sm:p-6 rounded-2xl bg-white border border-emerald-200/80 border-b-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 flex items-center gap-4 group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] group-hover:border-emerald-300 group-hover:border-b-emerald-400 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="relative z-10 p-3 rounded-xl bg-emerald-50 border border-emerald-100 group-hover:border-emerald-300 transition-colors shadow-sm">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-0.5">직원채용 간편이력서</h3>
                <p className="text-sm text-gray-500">매장 근무 지원을 위한 간편 이력서를 작성합니다.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-stone-400 font-medium">
          Powered by{' '}
          <Link href="/landing" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
            싹다폼
          </Link>
        </div>
      </div>

      {/* 🔍 내 접수 / 배송 조회 모달 */}
      {isLookupOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            {/* 모달 헤더 */}
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 shadow-sm flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-extrabold tracking-tight">내 접수 / 배송 조회</h2>
                  <p className="text-[12px] text-indigo-100">{displayStoreName} 접수 내역 확인</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeLookupModal}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 검색 폼 & 결과 영역 */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-gray-50/70">
              <form onSubmit={handleLookup} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-sm space-y-3.5">
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">
                    신청자 이름 <span className="text-indigo-600 font-normal">(택배는 보내는 분 또는 받는 분 이름)</span>
                  </label>
                  <input
                    type="text"
                    value={lookupName}
                    onChange={(e) => setLookupName(e.target.value)}
                    placeholder="예: 김철수"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">
                    휴대폰 번호
                  </label>
                  <input
                    type="tel"
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value)}
                    placeholder="예: 010-2345-6789 (숫자만 입력 가능)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-[14.5px] shadow-md shadow-indigo-600/15 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  {lookupLoading ? '조회 중...' : '접수 및 배송상태 조회하기'}
                </button>
              </form>

              {/* 조회 결과 */}
              {lookupResults !== null && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[13.5px] font-extrabold text-gray-800">
                      조회 결과 <span className="text-indigo-600">{lookupResults.length}건</span>
                    </h3>
                  </div>

                  {lookupResults.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                      <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
                      <p className="text-[14.5px] font-bold text-gray-800 mb-1">일치하는 접수 내역이 없습니다</p>
                      <p className="text-[12.5px] text-gray-500">
                        신청 시 입력하신 이름과 연락처가 맞는지 다시 확인해주세요.
                      </p>
                    </div>
                  ) : (
                    lookupResults.map((item) => {
                      const d = item.data || {};
                      const meta = getFormCategoryMeta(item.form_id, d);
                      const status = item.status || meta.defaultPending;
                      const isDone = status === '발송완료' || status === '예약확정' || status === '확인완료' || status === '결제완료';
                      const isCancelled = status === '취소됨';
                      const courier = d._courier || '';
                      const trackingNumber = d._trackingNumber || '';

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden"
                        >
                          {/* 카드 상단 바 */}
                          <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-md text-[11.5px] font-extrabold border ${meta.badgeClass}`}>
                                {meta.label}
                              </span>
                              <span className="text-[12px] text-gray-500 font-medium">
                                {new Date(item.submitted_at).toLocaleDateString('ko-KR')}{' '}
                                {new Date(item.submitted_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-extrabold border ${
                                isCancelled
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : isDone
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {status}
                            </span>
                          </div>

                          {/* 카드 본문 */}
                          <div className="p-4 space-y-3">
                            {item.form_id === 'delivery-preset' ? (
                              <>
                                <div className="grid grid-cols-2 gap-2 text-[13px]">
                                  <div className="bg-gray-50 p-2.5 rounded-xl">
                                    <p className="text-[11px] text-gray-400 font-semibold mb-0.5">보내는 분</p>
                                    <p className="font-bold text-gray-900">{d['보내는 분 - 이름'] || item.senderName || '-'}</p>
                                  </div>
                                  <div className="bg-gray-50 p-2.5 rounded-xl">
                                    <p className="text-[11px] text-gray-400 font-semibold mb-0.5">받는 분</p>
                                    <p className="font-bold text-gray-900">{d['받는 분 - 이름'] || item.receiverName || '-'}</p>
                                  </div>
                                </div>

                                <div className="text-[12.5px] text-gray-600 bg-gray-50/70 px-3 py-2 rounded-xl space-y-1">
                                  {d['보내는 분 - 상품명'] && (
                                    <p><span className="font-bold text-gray-700 mr-1.5">품목명:</span>{d['보내는 분 - 상품명']}</p>
                                  )}
                                  <p>
                                    <span className="font-bold text-gray-700 mr-1.5">배송지:</span>
                                    {maskAddress(d['받는 분 - 주소'] || item.receiverAddress || '')}
                                  </p>
                                </div>

                                {/* 택배사 및 송장번호 안내 영역 */}
                                {courier && trackingNumber ? (
                                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50 to-emerald-50/60 border border-indigo-200/80 space-y-2.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <div>
                                        <p className="text-[11px] font-bold text-indigo-600 mb-0.5">발송 택배사 및 송장번호</p>
                                        <p className="text-[15px] font-extrabold text-gray-900 tracking-tight">
                                          {courier} <span className="text-indigo-700 font-mono">{trackingNumber}</span>
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyTracking(trackingNumber)}
                                        className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-indigo-100 rounded-lg text-[11.5px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all shrink-0"
                                      >
                                        {copiedTracking === trackingNumber ? (
                                          <>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>복사됨</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                                            <span>송장복사</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <a
                                      href={`https://search.naver.com/search.naver?query=${encodeURIComponent(`${courier} ${trackingNumber}`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.99]"
                                    >
                                      <Truck className="w-4 h-4" />
                                      <span>실시간 배송위치 조회</span>
                                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                                    </a>
                                  </div>
                                ) : (
                                  <div className="px-3.5 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[12px] text-amber-800 font-medium">
                                    {isCancelled
                                      ? '취소된 택배 접수건입니다.'
                                      : '매장에서 상품 및 송장을 준비 중입니다. 송장이 등록되면 이곳에서 송장번호와 배송위치를 바로 확인하실 수 있습니다.'}
                                  </div>
                                )}
                              </>
                            ) : (
                              /* 예약 / 상품주문 / 간편폼 상세 요약 */
                              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-[13px]">
                                {Object.entries(d)
                                  .filter(([k]) => !k.startsWith('_') && k !== 'formTitle')
                                  .map(([k, v]) => (
                                    <div key={k} className="flex justify-between gap-3">
                                      <span className="text-gray-500 font-semibold shrink-0">{k}</span>
                                      <span className="text-gray-900 font-bold text-right break-all">{String(v || '-')}</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* 모달 하단 닫기 */}
            <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={closeLookupModal}
                className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-[13.5px] transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

