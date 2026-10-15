"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DaumPostcode from 'react-daum-postcode';
import { CreditCard, Copy, CheckCircle2, Store, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp, User, Camera, Paperclip, X, FileCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getSmartPlaceholder } from '@/lib/formUtils';
import { getActiveStoreId } from '@/lib/storeSession';

export default function CustomerFormPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [targetStoreId, setTargetStoreId] = useState<string>('demo');
  
  // 주소 검색 모달 관련 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [currentAddressFieldId, setCurrentAddressFieldId] = useState<number | null>(null);
  const [addressValues, setAddressValues] = useState<Record<number, string>>({});
  const [timeValues, setTimeValues] = useState<Record<number, { ampm: string, hour: string, minute: string }>>({});
  
  // 사진 및 첨부파일 (Base64 Data URL) 상태
  const [fileValues, setFileValues] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  
  const handleTimeChange = (fieldId: number, part: 'ampm' | 'hour' | 'minute', value: string) => {
    setTimeValues(prev => ({
      ...prev,
      [fieldId]: {
        ampm: prev[fieldId]?.ampm || '오후',
        hour: prev[fieldId]?.hour || '12',
        minute: prev[fieldId]?.minute || '00',
        [part]: value
      }
    }));
  };

  // 이미지 파일을 가볍게 리사이징하여 Base64 Data URL로 변환하는 함수
  const handleFileUpload = (fieldLabel: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileNames(prev => ({ ...prev, [fieldLabel]: file.name }));

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 700;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setFileValues(prev => ({ ...prev, [fieldLabel]: compressedDataUrl }));
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      if (file.size > 2 * 1024 * 1024) {
        alert('파일 크기는 2MB 이하로 첨부해주세요.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileValues(prev => ({
          ...prev,
          [fieldLabel]: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (fieldLabel: string) => {
    setFileValues(prev => {
      const next = { ...prev };
      delete next[fieldLabel];
      return next;
    });
    setFileNames(prev => {
      const next = { ...prev };
      delete next[fieldLabel];
      return next;
    });
  };

  useEffect(() => {
    const paramsObj = new URLSearchParams(window.location.search);
    const resolvedStoreId = paramsObj.get('store') || getActiveStoreId() || 'demo';
    setTargetStoreId(resolvedStoreId);

    async function loadStoreAndAccounts() {
      let resolvedInfo: any = null;
      const { data: storeRow } = await supabase
        .from('ssakdaform_stores')
        .select('*')
        .eq('store_id', resolvedStoreId)
        .maybeSingle();

      if (storeRow) {
        resolvedInfo = {
          name: storeRow.store_name,
          ownerName: storeRow.owner_name,
          address: storeRow.address,
          phone: storeRow.phone,
          hours: '',
          closedDays: '',
          paymentLink: ''
        };
        if (Array.isArray(storeRow.custom_forms)) {
          const dbFoundForm = storeRow.custom_forms.find((f: any) => f.id === id);
          if (dbFoundForm) {
            setData(dbFoundForm);
          }
        }
      }

      const savedStoreInfo =
        localStorage.getItem(`ssakdaform_store_details_${resolvedStoreId}`) ||
        (resolvedStoreId === getActiveStoreId() ? localStorage.getItem('ssakdaform_store_details') : null);
      if (savedStoreInfo) {
        try {
          const parsed = JSON.parse(savedStoreInfo);
          resolvedInfo = {
            ...(resolvedInfo || {}),
            ...parsed,
            name: parsed.name || parsed.storeName || resolvedInfo?.name || '',
            phone: parsed.phone || parsed.contact || resolvedInfo?.phone || ''
          };
        } catch (e) {}
      }

      if (!resolvedInfo) {
        resolvedInfo = {
          name: '싹다 데모 매장',
          ownerName: '홍길동',
          address: '서울시 서초구 (데모 주소)',
          phone: '010-1234-5678',
          hours: '09:00 ~ 18:00',
          closedDays: '일요일',
          paymentLink: ''
        };
      }
      setStoreInfo(resolvedInfo);

      const { data: accData } = await supabase
        .from('ssakdaform_store_accounts')
        .select('*')
        .eq('store_id', resolvedStoreId)
        .order('created_at', { ascending: true });
      if (accData && accData.length > 0) {
        setAccounts(accData.map(d => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      } else {
        setAccounts([]);
      }
    }
    loadStoreAndAccounts();

    const storedForms = localStorage.getItem('ssakdaform_custom_forms');
    if (storedForms) {
      const forms = JSON.parse(storedForms);
      const foundForm = forms.find((f: any) => f.id === id);
      if (foundForm) {
        setData(foundForm);
        return;
      }
    }

    if (id === 'delivery-preset') {
      setData({
        storeName: '내 매장 이름 (기본 설정)',
        formTitle: '간편한 택배 접수',
        fields: [
          { id: 1, type: 'text', label: '보내는 분 - 이름', placeholder: '이름을 입력하세요', required: true },
          { id: 2, type: 'phone', label: '보내는 분 - 연락처', placeholder: '010-0000-0000', required: true },
          { id: 3, type: 'text', label: '보내는 분 - 상품명', placeholder: '보내실 상품명을 입력하세요', required: true },
          { id: 4, type: 'text', label: '받는 분 - 이름', placeholder: '이름을 입력하세요', required: true },
          { id: 5, type: 'phone', label: '받는 분 - 연락처', placeholder: '010-0000-0000', required: true },
          { id: 6, type: 'address', label: '받는 분 - 주소', placeholder: '주소를 검색해주세요', required: true },
          { id: 7, type: 'text', label: '배송 기사님께 남길 말씀', placeholder: '예: 문 앞에 놓고 문자 부탁드립니다.', required: false },
          { id: 8, type: 'textarea', label: '기타 전달하고 싶은 내용', placeholder: '사장님께 전달하실 기타 요청사항을 자유롭게 적어주세요.', required: false }
        ]
      });
      return;
    } else if (id === 'reservation-preset') {
      setData({
        storeName: '내 매장 이름 (기본 설정)',
        formTitle: '간편한 매장 예약 신청',
        formDescription: '원활한 매장 운영과 정성스러운 준비를 위해 예약 시간을 꼭 지켜주시기 바랍니다.\n부득이하게 방문이 어렵거나 일정이 변경될 경우, 노쇼(No-Show) 방지를 위해 반드시 매장으로 미리 연락 부탁드립니다.',
        fields: [
          { id: 1, type: 'text', label: '예약자 이름', placeholder: '이름을 입력하세요', required: true },
          { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
          { id: 3, type: 'date', label: '예약 날짜', placeholder: '날짜를 선택해주세요', required: true },
          { id: 4, type: 'time', label: '예약 시간', placeholder: '시간을 선택해주세요', required: true },
          { id: 5, type: 'text', label: '방문 인원', placeholder: '예: 성인 2명, 아이 1명', required: true },
          { id: 6, type: 'textarea', label: '기타 전달하고 싶은 내용', placeholder: '매장에 미리 요청하실 사항이나 알러지 정보 등을 자유롭게 적어주세요.', required: false }
        ]
      });
      return;
    } else if (id === 'order-preset') {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      setData({
        storeName: '내 매장 이름 (기본 설정)',
        formTitle: '간편한 상품 주문서',
        fields: [
          { id: 1, type: 'date', label: '주문 날짜', defaultValue: todayStr, required: true },
          { id: 2, type: 'textarea', label: '상품명', placeholder: '주문하실 상품명, 수량, 옵션 등을 자유롭게 적어주세요', required: true },
          { id: 3, type: 'text', label: '고객명', placeholder: '주문자 성함을 입력하세요', required: true },
          { id: 4, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
          { id: 5, type: 'address', label: '배송지 주소', placeholder: '클릭하여 배송지 검색', required: true },
          { id: 6, type: 'text', label: '입금자명', placeholder: '입금하실 분의 성함을 입력하세요', required: true },
          { id: 7, type: 'textarea', label: '기타 전달 내용', placeholder: '배송 메시지 등 기타 요청사항을 적어주세요', required: false }
        ]
      });
      return;
    } else if (id === 'resume-preset') {
      setData({
        storeName: '내 매장 이름 (기본 설정)',
        formTitle: '직원채용 간편이력서',
        formDescription: '지원해주셔서 감사합니다. 작성해 제출해주시면 확인 후 연락드리겠습니다.\n• 사진은 꼭 증명사진이 아니어도 되며, 얼굴 확인이 가능한 편한 사진으로 첨부해주세요.\n• 보건증 등 증빙서류 첨부가 어려우신 경우, 추후 방문 시 종이서류로 직접 확인시켜 주셔도 됩니다.',
        fields: [
          { id: 1, type: 'photo', label: '사진', placeholder: '본인 확인용 사진을 첨부해주세요 (카메라 촬영 또는 앨범 선택)', required: false },
          { id: 2, type: 'text', label: '이름', placeholder: '지원자 성함을 입력하세요', required: true },
          { id: 3, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
          { id: 4, type: 'address', label: '주소', placeholder: '클릭하여 거주지 주소 검색', required: true },
          { id: 5, type: 'text', label: '지원파트', placeholder: '예: 홀서빙, 주방, 카운터, 배달, 오픈/마감 등', required: true },
          { id: 6, type: 'text', label: '근무가능시간', placeholder: '예: 오전(09~15시), 오후(18~23시), 풀타임, 시간협의 등', required: true },
          { id: 7, type: 'text', label: '근무가능요일', placeholder: '예: 평일(월~금), 주말(토·일), 주 5일, 요일협의 등', required: true },
          { id: 8, type: 'textarea', label: '관련업종경력유무', placeholder: '예: 유 (음식점 홀서빙 1년, 카페 6개월) / 무 (신입이지만 성실히 배우겠습니다)', required: true },
          { id: 9, type: 'textarea', label: '간단한 소개 또는 각오', placeholder: '간단한 자기소개나 근무 각오를 자유롭게 적어주세요.', required: true },
          { id: 10, type: 'file', label: '증빙서류 (보건증 등 파일첨부)', placeholder: '보건증, 자격증 등 관련 서류 사진이나 파일을 첨부해주세요 (선택)', required: false }
        ]
      });
      return;
    }

    const stored = localStorage.getItem('ssakdaform_draft');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      setData({
        storeName: '데모 스토어',
        formTitle: '고객용 폼 데모 화면',
        fields: [
          { id: 1, type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true },
          { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true }
        ]
      });
    }
  }, [params.id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F8]">
        <div className="text-stone-500 font-medium animate-pulse">폼 데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    if (currentAddressFieldId !== null) {
      setAddressValues(prev => ({
        ...prev,
        [currentAddressFieldId]: fullAddress
      }));
    }
    setIsPostcodeOpen(false);
  };

  const openPostcode = (fieldId: number) => {
    setCurrentAddressFieldId(fieldId);
    setIsPostcodeOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const dataObj: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      // 주소 필드의 경우 "라벨명"과 "라벨명 - 상세주소"를 합쳐서 하나로 만듦
      if (key.includes(' - 상세주소')) {
        const mainKey = key.replace(' - 상세주소', '');
        if (dataObj[mainKey]) {
          dataObj[mainKey] = `${dataObj[mainKey]} ${value.toString()}`;
        }
      } else {
        dataObj[key] = value.toString();
      }
    });

    // 첨부된 사진 및 파일 데이터 병합
    Object.entries(fileValues).forEach(([label, dataUrl]) => {
      if (dataUrl) {
        dataObj[label] = dataUrl;
      }
    });

    const newResponse = {
      store_id: targetStoreId,
      form_id: id,
      data: dataObj,
      status: '접수대기'
    };

    const submitData = async () => {
      const { error } = await supabase.from('ssakdaform_responses').insert([newResponse]);
      if (error) {
        console.error('Supabase Insert Error:', error);
        throw new Error(error.message);
      }
    };
    
    submitData().then(() => {
      alert(id === 'resume-preset'
        ? '이력서 지원이 성공적으로 접수되었습니다!\n확인 후 연락드리겠습니다.'
        : '신청이 성공적으로 완료되었습니다!\n(어드민의 현황 리스트에서 확인하실 수 있습니다)'
      );
      window.location.reload();
    }).catch(err => {
      console.error(err);
      alert('접수 중 오류가 발생했습니다.');
    });
  };

  const handleCopyAccount = async (account: string) => {
    try {
      await navigator.clipboard.writeText(account);
      setCopiedAccount(account);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (err) {
      console.error('Failed to copy account', err);
    }
  };

  const isResumeForm = id === 'resume-preset';

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center py-8 sm:py-12 px-2 sm:px-4 font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-stone-100">
        
        <div className={`bg-gradient-to-r ${isResumeForm ? 'from-emerald-700 to-teal-900' : 'from-indigo-700 to-indigo-900'} px-4 sm:px-6 py-6 sm:py-8 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
          <p className="relative z-10 text-white/80 text-sm sm:text-base font-bold tracking-widest mb-3 uppercase drop-shadow-sm">
            {storeInfo?.name || data.storeName}
          </p>
          <h1 className="relative z-10 text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">{data.formTitle}</h1>
        </div>
        
        <div className="px-3 sm:px-6 py-4 sm:py-7">
          {storeInfo && (storeInfo.name || storeInfo.ownerName || storeInfo.address || storeInfo.phone || storeInfo.hours || storeInfo.closedDays) && (
            <div className="mb-6">
              <button 
                type="button"
                onClick={() => setIsStoreInfoOpen(!isStoreInfoOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors mx-auto bg-gray-100/80 hover:bg-gray-200/80 px-3 py-1.5 rounded-full"
              >
                <Store className="w-3.5 h-3.5" />
                가게 정보 보기
                {isStoreInfoOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              {isStoreInfoOpen && (
                <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
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

          {/* 이력서 폼이 아닐 때만 결제 및 계좌 안내 노출 */}
          {!isResumeForm && (accounts.length > 0 || (storeInfo && storeInfo.paymentLink)) && (
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
                      type="button"
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

          {data.formDescription && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-4 sm:px-5 py-4 shadow-sm">
              <h3 className="font-bold text-amber-900 text-[14px] mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                사장님 안내사항
              </h3>
              <div className="text-[13.5px] text-amber-900/80 leading-relaxed whitespace-pre-wrap">
                {data.formDescription}
              </div>
            </div>
          )}

          <form className="space-y-7" onSubmit={handleSubmit}>
            {(() => {
              const senderFields = data.fields.filter((f: any) => f.label.includes('보내는 분'));
              const receiverFields = data.fields.filter((f: any) => f.label.includes('받는 분'));
              const otherFields = data.fields.filter((f: any) => !f.label.includes('보내는 분') && !f.label.includes('받는 분'));

              const renderField = (field: any, groupType: 'sender' | 'receiver' | 'other') => {
                let labelClass = "block text-[13px] font-bold mb-1.5 ";
                let inputClass = "w-full px-3.5 py-2.5 text-[14px] rounded-xl border bg-white focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 ";

                if (groupType === 'sender') {
                  labelClass += "text-slate-800";
                  inputClass += "border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-600 shadow-sm";
                } else if (groupType === 'receiver') {
                  labelClass += "text-[#5C4D3C]";
                  inputClass += "border-[#D4C4B1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] shadow-sm";
                } else {
                  labelClass += "text-gray-800";
                  inputClass += "border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 shadow-sm";
                }

                const displayLabel = field.label ? field.label.replace('보내는 분 - ', '').replace('받는 분 - ', '') : '제목 없는 항목';

                return (
                  <div key={field.id} className="relative mb-3.5 last:mb-0">
                    <label className={labelClass}>
                      {displayLabel}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'photo' ? (
                      <div className="bg-white border border-gray-300 rounded-xl p-3.5 shadow-sm">
                        {fileValues[field.label] ? (
                          <div className="flex items-center gap-4">
                            <img 
                              src={fileValues[field.label]} 
                              alt="첨부 사진 미리보기" 
                              className="w-20 h-24 object-cover rounded-lg border border-gray-200 shadow-xs shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-emerald-700 flex items-center gap-1">
                                <FileCheck className="w-4 h-4 shrink-0" />
                                사진이 등록되었습니다
                              </p>
                              <p className="text-[12px] text-gray-500 truncate mt-0.5">{fileNames[field.label]}</p>
                              <button
                                type="button"
                                onClick={() => clearFile(field.label)}
                                className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-[12px] font-bold transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> 다시 선택
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center py-4 px-3 border-2 border-dashed border-gray-200 hover:border-emerald-400 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-emerald-50/30 transition-all">
                            <Camera className="w-7 h-7 text-emerald-600 mb-1.5" />
                            <span className="text-[13px] font-bold text-gray-700">클릭하여 사진 촬영 또는 앨범에서 선택</span>
                            <span className="text-[11.5px] text-gray-400 mt-0.5">{field.placeholder}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(field.label, e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    ) : field.type === 'file' ? (
                      <div className="bg-white border border-gray-300 rounded-xl p-3.5 shadow-sm">
                        {fileValues[field.label] ? (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {fileValues[field.label].startsWith('data:image/') ? (
                                <img 
                                  src={fileValues[field.label]} 
                                  alt="증빙서류 미리보기" 
                                  className="w-14 h-14 object-cover rounded-lg border border-gray-200 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                  <FileCheck className="w-6 h-6 text-emerald-600" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-[13px] font-bold text-emerald-700">서류 첨부 완료</p>
                                <p className="text-[12px] text-gray-500 truncate mt-0.5">{fileNames[field.label]}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => clearFile(field.label)}
                              className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-[12px] font-bold shrink-0 transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2.5 py-3.5 px-3 border-2 border-dashed border-gray-200 hover:border-emerald-400 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-emerald-50/30 transition-all">
                            <Paperclip className="w-5 h-5 text-emerald-600 shrink-0" />
                            <div className="text-left">
                              <p className="text-[13px] font-bold text-gray-700">증빙서류 (보건증 등) 사진/파일 첨부하기</p>
                              <p className="text-[11.5px] text-gray-400">{field.placeholder}</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileUpload(field.label, e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    ) : field.type === 'textarea' ? (
                      <textarea 
                        name={field.label}
                        className={inputClass}
                        placeholder={field.placeholder || getSmartPlaceholder(field.label)}
                        required={field.required}
                        rows={3}
                      />
                    ) : field.type === 'checkbox' ? (
                      <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors bg-white shadow-sm ${groupType === 'sender' ? 'border-slate-300 hover:bg-slate-50' : groupType === 'receiver' ? 'border-[#D4C4B1] hover:bg-[#FDFBF7]' : 'border-gray-300 hover:bg-gray-50'}`}>
                        <input name={field.label} type="checkbox" className={`w-4 h-4 mt-0.5 rounded cursor-pointer ${groupType === 'sender' ? 'text-slate-600 border-slate-400 focus:ring-slate-600' : groupType === 'receiver' ? 'text-[#8B7355] border-[#D4C4B1] focus:ring-[#8B7355]' : 'text-gray-600 border-gray-400 focus:ring-gray-600'}`} />
                        <span className={`text-sm leading-relaxed ${groupType === 'sender' ? 'text-slate-800' : groupType === 'receiver' ? 'text-[#5C4D3C]' : 'text-gray-800'}`}>{field.placeholder || '동의합니다.'}</span>
                      </label>
                    ) : field.type === 'address' ? (
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          name={field.label}
                          readOnly
                          required={field.required}
                          onClick={() => openPostcode(field.id)}
                          value={addressValues[field.id] || ''}
                          className={`${inputClass} cursor-pointer`}
                          placeholder={field.placeholder || "클릭하여 주소 검색"}
                        />
                        {addressValues[field.id] && (
                          <input 
                            type="text" 
                            name={`${field.label} - 상세주소`}
                            className={inputClass}
                            placeholder="상세 주소를 입력하세요"
                          />
                        )}
                      </div>
                    ) : field.type === 'time' ? (
                      <div className="flex gap-1.5 sm:gap-2">
                          <input 
                            type="hidden" 
                            name={field.label} 
                            value={`${timeValues[field.id]?.ampm || '오후'} ${timeValues[field.id]?.hour || '12'}:${timeValues[field.id]?.minute || '00'}`} 
                          />
                          <select
                            className={inputClass + " !px-1 sm:!px-2 text-center !pr-6"}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em', appearance: 'none' }}
                            value={timeValues[field.id]?.ampm || '오후'}
                            onChange={(e) => handleTimeChange(field.id, 'ampm', e.target.value)}
                          >
                            <option value="오전">오전</option>
                            <option value="오후">오후</option>
                          </select>
                          <select
                            className={inputClass + " !px-1 sm:!px-2 text-center !pr-6"}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em', appearance: 'none' }}
                            value={timeValues[field.id]?.hour || '12'}
                            onChange={(e) => handleTimeChange(field.id, 'hour', e.target.value)}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                              <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                            ))}
                          </select>
                          <select
                            className={inputClass + " !px-1 sm:!px-2 text-center !pr-6"}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em', appearance: 'none' }}
                            value={timeValues[field.id]?.minute || '00'}
                            onChange={(e) => handleTimeChange(field.id, 'minute', e.target.value)}
                          >
                            {['00', '10', '20', '30', '40', '50'].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                    ) : (
                      <input 
                        name={field.label}
                        type={field.type === 'phone' ? 'tel' : field.type} 
                        className={inputClass}
                        placeholder={field.placeholder || getSmartPlaceholder(field.label)}
                        defaultValue={field.defaultValue}
                        required={field.required}
                      />
                    )}
                  </div>
                );
              };

              return (
                <div className="space-y-5">
                  {senderFields.length > 0 && (
                    <div className="bg-slate-100 border border-slate-300 rounded-2xl p-3.5 sm:p-5 shadow-sm">
                      <h3 className="font-extrabold text-slate-800 mb-3.5 text-base flex items-center gap-2">
                        <span className="w-2 h-6 bg-slate-600 rounded-full inline-block"></span>
                        보내는 분 (발송인)
                      </h3>
                      <div>
                        {senderFields.map((f: any) => renderField(f, 'sender'))}
                      </div>
                    </div>
                  )}

                  {receiverFields.length > 0 && (
                    <div className="bg-[#F6F1EA] border border-[#E8DCC9] rounded-2xl p-3.5 sm:p-5 shadow-sm">
                      <h3 className="font-extrabold text-[#5C4D3C] mb-3.5 text-base flex items-center gap-2">
                        <span className="w-2 h-6 bg-[#8B7355] rounded-full inline-block"></span>
                        받는 분 (수령인)
                      </h3>
                      <div>
                        {receiverFields.map((f: any) => renderField(f, 'receiver'))}
                      </div>
                    </div>
                  )}

                  {otherFields.length > 0 && (
                    <div className="bg-gray-100 border border-gray-300 rounded-2xl p-3.5 sm:p-5 shadow-sm">
                      <h3 className="font-extrabold text-gray-800 mb-3.5 text-base flex items-center gap-2">
                        <span className={`w-2 h-6 ${isResumeForm ? 'bg-emerald-600' : 'bg-gray-500'} rounded-full inline-block`}></span>
                        {isResumeForm ? '지원자 이력서 정보' : (senderFields.length > 0 || receiverFields.length > 0) ? '기타 정보' : '입력 정보'}
                      </h3>
                      <div>
                        {otherFields.map((f: any) => renderField(f, 'other'))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            
            {/* 고정 개인정보 수집 동의 */}
            <div className="pt-6">
              <label className="flex items-start gap-2.5 p-3 sm:p-4 rounded-xl border border-gray-300 cursor-pointer transition-colors bg-white hover:bg-gray-50 shadow-sm">
                <input type="checkbox" required className="w-4 h-4 mt-0.5 sm:mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
                <span className="text-sm sm:text-[15px] font-medium text-gray-800 leading-relaxed">
                  [필수] 개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>
            </div>
            
            <div className="pt-6 sm:pt-8">
              <button 
                type="submit"
                className={`w-full py-4 ${isResumeForm ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20' : 'bg-indigo-700 hover:bg-indigo-800 shadow-indigo-700/20'} text-white rounded-xl font-semibold text-lg active:transform active:scale-[0.99] transition-all shadow-lg`}
              >
                {isResumeForm ? '이력서 제출하기' : '제출하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-stone-400 font-medium">
        Powered by <span className="text-indigo-600 font-semibold">싹다폼</span>
      </div>

      {/* 카카오 우편번호 검색 모달 */}
      {isPostcodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800">주소 검색</h3>
              <button onClick={() => setIsPostcodeOpen(false)} className="text-gray-500 hover:text-gray-900 font-bold p-1">
                닫기 ✕
              </button>
            </div>
            <div className="h-[400px] w-full">
              <DaumPostcode onComplete={handleComplete} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
