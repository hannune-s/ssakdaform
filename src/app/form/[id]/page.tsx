"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DaumPostcode from 'react-daum-postcode';
import { CreditCard, Copy, CheckCircle2, Store, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp, User, Camera, Paperclip, X, FileCheck, ShoppingBag, ExternalLink, Plus, Trash2, UserCheck, ChevronRight, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getSmartPlaceholder } from '@/lib/formUtils';
import { getActiveStoreId } from '@/lib/storeSession';
import { fetchStoreSubscription, isSubscriptionExpired } from '@/lib/subscriptionUtils';
import ShopLinkList from '@/app/components/ShopLinkList';
import CustomerLookupSection from '@/app/components/CustomerLookupSection';
import CustomerSaleSection from '@/app/components/CustomerSaleSection';

export default function CustomerFormPage({
  overrideStoreId,
  overrideFormCode
}: {
  overrideStoreId?: string;
  overrideFormCode?: string;
} = {}) {
  const params = useParams();
  // /f/[storeId]/[code] 경로, /store/[slug] 대표 폼, 기존 /form/[id]?store=[storeId] 경로를 모두 완벽 호환 지원
  const paramStoreId =
    overrideStoreId ||
    (params?.storeId ? decodeURIComponent(params.storeId as string) : null) ||
    (params?.slug ? decodeURIComponent(params.slug as string) : null);
  const id = decodeURIComponent(
    overrideFormCode || ((params?.code || params?.id) as string) || '1'
  );

  const [data, setData] = useState<any>(null);
  const [actualFormId, setActualFormId] = useState<string>(id);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [targetStoreId, setTargetStoreId] = useState<string>(paramStoreId || 'demo');
  const [isLinkSuspended, setIsLinkSuspended] = useState(false);
  
  // 주소 검색 모달 관련 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [currentAddressFieldId, setCurrentAddressFieldId] = useState<number | null>(null);
  const [addressValues, setAddressValues] = useState<Record<number, string>>({});
  const [timeValues, setTimeValues] = useState<Record<number, { ampm: string, hour: string, minute: string }>>({});
  
  // 사진 및 첨부파일 (Base64 Data URL) 상태
  const [fileValues, setFileValues] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});

  // 간편 택배 접수 (delivery-preset) 전용: 주문 상품(상품명+수량) 및 결제 방식(매장결제완료 vs 계좌이체/입금자명) 상태
  const [deliveryItems, setDeliveryItems] = useState<{ name: string; qty: string }[]>([
    { name: '', qty: '1' }
  ]);
  const [deliveryPaymentType, setDeliveryPaymentType] = useState<'card_done' | 'bank_transfer'>('card_done');
  const [deliveryDepositor, setDeliveryDepositor] = useState('');

  const handleDeliveryItemChange = (index: number, field: 'name' | 'qty', value: string) => {
    setDeliveryItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddDeliveryItem = () => {
    if (deliveryItems.length >= 5) return;
    setDeliveryItems(prev => [...prev, { name: '', qty: '1' }]);
  };

  const handleRemoveDeliveryItem = (index: number) => {
    setDeliveryItems(prev => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [{ name: '', qty: '1' }];
    });
  };
  
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
    const pathMatch = window.location.pathname.match(/^\/f\/([^/]+)\/([^/]+)/);
    const pathStoreId = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
    const pathCode = pathMatch ? decodeURIComponent(pathMatch[2]) : null;
    const resolvedStoreId = paramStoreId || pathStoreId || paramsObj.get('store') || getActiveStoreId() || 'demo';
    const resolvedId = id || pathCode || '';
    setTargetStoreId(resolvedStoreId);
    setActualFormId(resolvedId);

    const findMatchingCustomForm = (forms: any[], codeOrId: string) => {
      if (!Array.isArray(forms) || forms.length === 0) return null;
      // 0. '__main__' 요청인 경우 대표 폼(isMain: true) 또는 첫 번째 폼 반환
      if (codeOrId === '__main__') {
        return forms.find((f: any) => f && f.isMain) || forms[0];
      }
      // 1. id 또는 shortCode 직접 일치 확인
      const direct = forms.find(
        (f: any) => String(f.id) === codeOrId || (f.shortCode && String(f.shortCode) === codeOrId)
      );
      if (direct) return direct;
      // 2. 숫자 코드(예: "1", "2", "3")인 경우 해당 순번(1-based index)의 폼 매칭 (기존 생성된 폼도 즉시 호환)
      if (/^\d+$/.test(codeOrId)) {
        const idx = parseInt(codeOrId, 10) - 1;
        if (idx >= 0 && idx < forms.length) {
          return forms[idx];
        }
      }
      return forms.find((f: any) => f && f.isMain) || forms[0];
    };

    const isPresetForm =
      id === 'delivery-preset' ||
      id === 'reservation-preset' ||
      id === 'order-preset' ||
      id === 'resume-preset';

    async function loadStoreAndAccounts() {
      let resolvedInfo: any = null;
      let dbMatchedForm: any = null;

      const { data: storeRow } = await supabase
        .from('ssakdaform_stores')
        .select('*')
        .eq('store_id', resolvedStoreId)
        .maybeSingle();

      const subInfo = await fetchStoreSubscription(resolvedStoreId, storeRow?.created_at);
      setIsLinkSuspended(isSubscriptionExpired(subInfo, resolvedStoreId));

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
        if (!isPresetForm && Array.isArray(storeRow.custom_forms)) {
          dbMatchedForm = findMatchingCustomForm(storeRow.custom_forms, resolvedId);
          if (dbMatchedForm) {
            setData(dbMatchedForm);
            if (dbMatchedForm.id) setActualFormId(dbMatchedForm.id);
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
            ...parsed,
            ...(resolvedInfo || {}),
            name: resolvedInfo?.name || parsed.name || parsed.storeName || '',
            ownerName: resolvedInfo?.ownerName || parsed.ownerName || '',
            address: resolvedInfo?.address || parsed.address || '',
            phone: resolvedInfo?.phone || parsed.phone || parsed.contact || '',
            hours: parsed.hours || resolvedInfo?.hours || '',
            closedDays: parsed.closedDays || resolvedInfo?.closedDays || '',
            extraNotice: parsed.extraNotice || resolvedInfo?.extraNotice || '',
            paymentLink: parsed.paymentLink || resolvedInfo?.paymentLink || '',
            shopLinks: Array.isArray(parsed.shopLinks) ? parsed.shopLinks : [],
            showDeliveryButton: parsed.showDeliveryButton !== false,
            showResumeButton: parsed.showResumeButton !== false
          };
        } catch (e) {}
      }

      const { data: metaRows } = await supabase
        .from('ssakdaform_responses')
        .select('*')
        .eq('store_id', '__hq__')
        .eq('form_id', '__store_meta__')
        .order('submitted_at', { ascending: false });

      const storeMeta = (metaRows || []).find((r: any) => r.data?.storeId === resolvedStoreId);
      if (storeMeta?.data) {
        resolvedInfo = {
          ...(resolvedInfo || {}),
          hours: storeMeta.data.hours || resolvedInfo?.hours || '',
          closedDays: storeMeta.data.closedDays || resolvedInfo?.closedDays || '',
          extraNotice: storeMeta.data.extraNotice || resolvedInfo?.extraNotice || '',
          shopLinks: Array.isArray(storeMeta.data.shopLinks) && storeMeta.data.shopLinks.length > 0
            ? storeMeta.data.shopLinks
            : (resolvedInfo?.shopLinks || []),
          showDeliveryButton:
            storeMeta.data.showDeliveryButton !== undefined
              ? Boolean(storeMeta.data.showDeliveryButton)
              : resolvedInfo?.showDeliveryButton !== false,
          showResumeButton:
            storeMeta.data.showResumeButton !== undefined
              ? Boolean(storeMeta.data.showResumeButton)
              : resolvedInfo?.showResumeButton !== false
        };
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

      // 커스텀 폼인데 DB에서 못 찾은 경우 로컬 스토리지 및 초안에서 보조 탐색
      if (!isPresetForm && !dbMatchedForm) {
        const localRaw =
          localStorage.getItem(`ssakdaform_custom_forms_${resolvedStoreId}`) ||
          localStorage.getItem('ssakdaform_custom_forms');
        if (localRaw) {
          try {
            const localForms = JSON.parse(localRaw);
            const localFound = findMatchingCustomForm(localForms, resolvedId);
            if (localFound) {
              setData(localFound);
              if (localFound.id) setActualFormId(localFound.id);
              return;
            }
          } catch {}
        }

        const storedDraft =
          localStorage.getItem(`ssakdaform_draft_${resolvedStoreId}`) ||
          localStorage.getItem('ssakdaform_draft');
        if (storedDraft) {
          setData(JSON.parse(storedDraft));
        } else {
          setData({
            storeName: resolvedInfo?.name || '데모 스토어',
            formTitle: '고객용 신청서',
            fields: [
              { id: 1, type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true },
              { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true }
            ]
          });
        }
      }
    }
    loadStoreAndAccounts();

    if (!isPresetForm) {
      const localRaw =
        localStorage.getItem(`ssakdaform_custom_forms_${resolvedStoreId}`) ||
        localStorage.getItem('ssakdaform_custom_forms');
      if (localRaw) {
        try {
          const forms = JSON.parse(localRaw);
          const foundForm = findMatchingCustomForm(forms, id);
          if (foundForm) {
            setData(foundForm);
            if (foundForm.id) setActualFormId(foundForm.id);
            return;
          }
        } catch {}
      }
      return;
    }

    if (id === 'delivery-preset') {
      setData({
        storeName: '내 매장 이름 (기본 설정)',
        formTitle: '간편한 택배 접수',
        fields: [
          { id: 1, type: 'text', label: '보내는 분 - 이름', placeholder: '이름을 입력하세요', required: true },
          { id: 2, type: 'phone', label: '보내는 분 - 연락처', placeholder: '010-0000-0000', required: true },
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
        formDescription: '지원해주셔서 감사합니다. 작성해 제출해주시면 확인 후 연락드리겠습니다.\n• 사진 첨부는 선택사항(생략 가능)이며, 첨부하실 경우 얼굴 확인이 가능한 편한 사진으로 올려주셔도 됩니다.\n• 보건증 등 증빙서류 첨부가 어려우신 경우, 추후 방문 시 종이서류로 직접 확인시켜 주셔도 됩니다.',
        fields: [
          { id: 1, type: 'photo', label: '사진 (선택)', placeholder: '사진 첨부는 선택사항입니다 (생략 가능)', required: false },
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
  }, [id, paramStoreId]);

  if (isLinkSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F8] p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-amber-200 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">현재 온라인 접수 기간이 아닙니다</h2>
          <p className="text-[14px] text-gray-600 leading-relaxed break-keep">
            현재 해당 매장의 온라인 신청서 접수가 일시 중지된 상태입니다.<br />
            기존에 신청하신 내역이나 배송(송장번호) 조회는 매장 홈에서 확인하실 수 있습니다.
          </p>
          <a
            href={`/store/${encodeURIComponent(targetStoreId)}`}
            className="inline-flex items-center justify-center w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors text-[14px]"
          >
            매장 홈 (기존 접수/배송 조회) 이동
          </a>
        </div>
      </div>
    );
  }

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

    // 간편 택배 접수 (delivery-preset)인 경우: 상품명, 수량, 결제확인/입금자명 병합
    if (id === 'delivery-preset') {
      const validItems = deliveryItems
        .map(it => ({ name: it.name.trim(), qty: (it.qty || '1').trim() }))
        .filter(it => it.name !== '');

      if (validItems.length === 0) {
        alert('주문(발송)하실 상품명을 입력해 주세요.');
        return;
      }

      if (deliveryPaymentType === 'bank_transfer' && !deliveryDepositor.trim()) {
        alert('계좌이체를 선택하셨습니다. 입금자명을 입력해 주세요.');
        return;
      }

      const formattedProductList =
        validItems.length === 1
          ? validItems[0].name
          : validItems.map(it => `${it.name}(${it.qty})`).join(', ');
      const totalQtySummary =
        validItems.length === 1
          ? validItems[0].qty
          : validItems.map(it => `${it.qty}`).join(', ');

      // 기존 송장 엑셀 및 리스트 완벽 호환 + 상세 정보 저장
      dataObj['주문 상품 - 상품명'] = formattedProductList;
      dataObj['주문 상품 - 수량'] = totalQtySummary;
      dataObj['보내는 분 - 상품명'] =
        validItems.length === 1
          ? `${validItems[0].name} (${validItems[0].qty})`
          : formattedProductList;
      dataObj['주문 상품 - 결제확인'] =
        deliveryPaymentType === 'card_done'
          ? '매장 결제 완료 (카드/현금)'
          : `계좌이체 (입금자: ${deliveryDepositor.trim()})`;
      if (deliveryPaymentType === 'bank_transfer') {
        dataObj['주문 상품 - 입금자명'] = deliveryDepositor.trim();
      }
    }

    const newResponse = {
      store_id: targetStoreId,
      form_id: actualFormId || id,
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
        : '신청이 완료되었습니다. 감사합니다!'
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
        
        <div className={`bg-gradient-to-br ${isResumeForm ? 'from-emerald-700 to-teal-900' : 'from-[#3B0764] via-[#5B21B6] to-[#4C1D95]'} px-4 sm:px-6 py-7 sm:py-9 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-[22px] sm:text-[26px] font-black text-white tracking-tight drop-shadow-md leading-snug">
              {storeInfo?.name || data.storeName}
            </h2>
            <div className="mt-2.5 inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 shadow-xs">
              <h1 className="text-[16px] sm:text-[18px] font-extrabold text-purple-50 tracking-tight">
                {data.formTitle}
              </h1>
            </div>
          </div>
        </div>
        
        <div className="px-3 sm:px-6 py-4 sm:py-7">
          {storeInfo && (storeInfo.name || storeInfo.ownerName || storeInfo.address || storeInfo.phone || storeInfo.hours || storeInfo.closedDays || storeInfo.extraNotice) && (
            <div className="mb-6">
              <button 
                type="button"
                onClick={() => setIsStoreInfoOpen(!isStoreInfoOpen)}
                className="flex items-center gap-2 text-[13px] font-extrabold text-purple-950 hover:text-purple-900 transition-all mx-auto bg-purple-50/80 hover:bg-purple-100/80 border-2 border-purple-200 hover:border-purple-300 shadow-xs px-4 py-2 rounded-full active:scale-95"
              >
                <Store className="w-4 h-4 text-purple-700" />
                <span>가게 정보 보기</span>
                {isStoreInfoOpen ? <ChevronUp className="w-4 h-4 text-purple-700" /> : <ChevronDown className="w-4 h-4 text-purple-700" />}
              </button>
              
              {isStoreInfoOpen && (
                <div className="mt-3 p-4 bg-purple-50/40 border border-purple-100 rounded-2xl text-[13.5px] text-gray-800 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {storeInfo.name && (
                    <div className="flex items-start gap-2.5">
                      <Store className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <div><span className="font-extrabold text-purple-950 mr-2">상호명:</span><span className="font-semibold text-gray-900">{storeInfo.name}</span></div>
                    </div>
                  )}

                  {storeInfo.ownerName && (
                    <div className="flex items-start gap-2.5">
                      <User className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <div><span className="font-extrabold text-purple-950 mr-2">대표자:</span><span className="font-semibold text-gray-900">{storeInfo.ownerName}</span></div>
                    </div>
                  )}
                  {storeInfo.address && (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <div><span className="font-extrabold text-purple-950 mr-2">주소:</span><span className="font-semibold text-gray-900">{storeInfo.address}</span></div>
                    </div>
                  )}
                  {storeInfo.phone && (
                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <div><span className="font-extrabold text-purple-950 mr-2">전화번호:</span><span className="font-bold text-purple-800">{storeInfo.phone}</span></div>
                    </div>
                  )}
                  {storeInfo.hours && (
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <div><span className="font-extrabold text-purple-950 mr-2">영업시간:</span><span className="font-semibold text-gray-900">{storeInfo.hours}</span></div>
                    </div>
                  )}
                  {storeInfo.closedDays && (
                    <div className="flex items-start gap-2.5">
                      <CalendarX className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <div><span className="font-extrabold text-purple-950 mr-2">휴무일:</span><span className="font-semibold text-gray-900">{storeInfo.closedDays}</span></div>
                    </div>
                  )}
                  {storeInfo.extraNotice && (
                    <div className="flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <div><span className="font-extrabold text-purple-950 mr-2">기타 안내:</span><span className="font-semibold text-gray-900 whitespace-pre-line">{storeInfo.extraNotice}</span></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 이력서 폼이 아닐 때만 결제 및 계좌 안내 노출 */}
          {!isResumeForm && (accounts.length > 0 || (storeInfo && storeInfo.paymentLink)) && (
            <div className="mb-6 bg-[#F8F5FF] border border-purple-200 rounded-2xl px-4 py-3.5">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-purple-500" />
                <h2 className="font-bold text-purple-950 text-[14px]">결제 및 계좌 안내</h2>
              </div>
              
              <div className="space-y-1.5">
                {accounts.map((acc, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 flex-1">
                      <span className="text-[13px] font-bold text-purple-700">{acc.bank}</span>
                      <span className="text-[17px] font-bold font-mono text-gray-900 tracking-tight">{acc.accountNumber}</span>
                      <span className="text-[13px] font-medium text-gray-500">{acc.holder}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleCopyAccount(acc.accountNumber)}
                      className="flex items-center justify-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm border border-purple-100"
                    >
                      {copiedAccount === acc.accountNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      <span>{copiedAccount === acc.accountNumber ? '복사됨' : '복사'}</span>
                    </button>
                  </div>
                ))}
              </div>
              {storeInfo && storeInfo.paymentLink && (
                <div className="mt-4 pt-4 border-t border-purple-200/50">
                  <h3 className="text-[12px] font-bold text-purple-950 mb-2">비대면 카드 결제</h3>
                  <a 
                    href={storeInfo.paymentLink.startsWith('http') ? storeInfo.paymentLink : `https://${storeInfo.paymentLink}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold rounded-xl transition-colors text-[14px] shadow-sm active:scale-[0.98]"
                  >
                    <CreditCard className="w-4 h-4" />
                    결제하러 가기
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 🔥 실시간 단골 깜짝 특가 팝업 & 홈화면 푸시 알림 구독 영역 */}
          {!isResumeForm && id !== 'delivery-preset' && (
            <CustomerSaleSection
              storeId={targetStoreId}
              storeName={storeInfo?.name || data?.storeName || '우리 매장'}
            />
          )}

          {/* 🛍️ 매장 공식 쇼핑몰 / 외부 링크 바로가기 영역 */}
          {!isResumeForm && (
            <ShopLinkList
              links={storeInfo?.shopLinks}
              storeId={targetStoreId}
              hideDefaultDelivery={true}
              className="mb-3 space-y-2"
            />
          )}

          {/* 📦 기본 제공 [간편 택배 접수] & [직원채용 이력서] 바로가기 버튼 (설정에서 표시/숨김 선택 가능) */}
          {!isResumeForm &&
            id !== 'delivery-preset' &&
            (storeInfo?.showDeliveryButton !== false || storeInfo?.showResumeButton !== false) && (
              <div
                className={`grid ${
                  storeInfo?.showDeliveryButton !== false && storeInfo?.showResumeButton !== false
                    ? 'grid-cols-2'
                    : 'grid-cols-1'
                } gap-2 mb-3`}
              >
                {storeInfo?.showDeliveryButton !== false && (
                  <a
                    href={`/form/delivery-preset?store=${encodeURIComponent(targetStoreId)}`}
                    className="px-3.5 py-2.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200 hover:border-indigo-400 shadow-2xs transition-all flex items-center justify-between gap-1.5 group active:scale-[0.99]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] sm:text-[13.5px] font-black text-indigo-950 tracking-tight leading-snug break-keep">
                        간편 택배 접수
                      </p>
                      <p className="text-[11px] font-semibold text-indigo-700/80 leading-snug mt-0.5 break-keep">
                        택배 발송 신청서 작성
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </a>
                )}

                {storeInfo?.showResumeButton !== false && (
                  <a
                    href={`/form/resume-preset?store=${encodeURIComponent(targetStoreId)}`}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 hover:border-emerald-400 shadow-2xs transition-all flex items-center justify-between gap-1.5 group active:scale-[0.99]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] sm:text-[13.5px] font-black text-emerald-950 tracking-tight leading-snug break-keep">
                        직원채용 이력서
                      </p>
                      <p className="text-[11px] font-semibold text-emerald-700/80 leading-snug mt-0.5 break-keep">
                        매장 근무 간편 지원
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </a>
                )}
              </div>
            )}

          {/* 🔍 내 접수 / 배송 조회 버튼 및 조회 모달 (이력서 폼 제외) */}
          {!isResumeForm && (
            <CustomerLookupSection
              storeId={targetStoreId}
              storeName={storeInfo?.name || data?.storeName || '우리 매장'}
              className="mb-6"
            />
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
                    ) : field.type === 'address' || /주소|배송지/.test(field.label || '') ? (
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
                  {/* 간편 택배 접수 전용: 보내는 분 위쪽 [주문 상품 및 결제 확인] 섹션 */}
                  {id === 'delivery-preset' && (
                    <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-[#3B0764] text-base flex items-center gap-2">
                          <span className="w-2 h-6 bg-[#5B21B6] rounded-full inline-block"></span>
                          주문 상품 및 결제 확인
                        </h3>
                        {deliveryItems.length < 5 && (
                          <button
                            type="button"
                            onClick={handleAddDeliveryItem}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-purple-200 hover:bg-purple-100 text-[#5B21B6] text-xs font-extrabold transition-colors shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>상품 추가</span>
                          </button>
                        )}
                      </div>

                      {/* 1. 상품명 + 수량 입력 줄 */}
                      <div className="space-y-2.5">
                        {deliveryItems.map((item, idx) => (
                          <div key={idx} className="flex items-end gap-2">
                            <div className="flex-1 min-w-0">
                              {idx === 0 && (
                                <label className="block text-[13px] font-bold text-[#3B0764] mb-1.5">
                                  상품명 <span className="text-red-500">*</span>
                                </label>
                              )}
                              <input
                                type="text"
                                required={idx === 0}
                                value={item.name}
                                onChange={e => handleDeliveryItemChange(idx, 'name', e.target.value)}
                                placeholder="예: 한우 선물세트 1호"
                                className="w-full px-3.5 py-2.5 text-[14px] rounded-xl border border-purple-200 bg-white focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] text-gray-900 placeholder-gray-400 shadow-xs"
                              />
                            </div>

                            <div className="w-24 sm:w-28 shrink-0">
                              {idx === 0 && (
                                <label className="block text-[13px] font-bold text-[#3B0764] mb-1.5">
                                  수량 <span className="text-red-500">*</span>
                                </label>
                              )}
                              <input
                                type="text"
                                required={idx === 0}
                                value={item.qty}
                                onChange={e => handleDeliveryItemChange(idx, 'qty', e.target.value)}
                                placeholder="예: 1개"
                                className="w-full px-3 py-2.5 text-[14px] rounded-xl border border-purple-200 bg-white focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] text-gray-900 text-center font-bold placeholder-gray-400 shadow-xs"
                              />
                            </div>

                            {deliveryItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveDeliveryItem(idx)}
                                className="p-2.5 mb-0.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors shrink-0"
                                title="상품 삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 2. 결제 방식 선택 (매장 결제 완료 vs 계좌이체/입금자명) */}
                      <div className="pt-2 border-t border-purple-200/70">
                        <label className="block text-[13px] font-bold text-[#3B0764] mb-2">
                          결제 확인 <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setDeliveryPaymentType('card_done')}
                            className={`py-3 px-3 rounded-xl border-2 text-left transition-all flex flex-col justify-center ${
                              deliveryPaymentType === 'card_done'
                                ? 'bg-[#5B21B6] border-[#5B21B6] text-white shadow-sm'
                                : 'bg-white border-purple-200 text-gray-700 hover:bg-purple-50/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] sm:text-[13.5px] font-black break-keep">
                                💳 매장 결제 완료
                              </span>
                              {deliveryPaymentType === 'card_done' && (
                                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                              )}
                            </div>
                            <span
                              className={`text-[11px] mt-0.5 font-semibold break-keep ${
                                deliveryPaymentType === 'card_done' ? 'text-purple-100' : 'text-gray-400'
                              }`}
                            >
                              카드·현금 결제 완료 고객
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeliveryPaymentType('bank_transfer')}
                            className={`py-3 px-3 rounded-xl border-2 text-left transition-all flex flex-col justify-center ${
                              deliveryPaymentType === 'bank_transfer'
                                ? 'bg-[#5B21B6] border-[#5B21B6] text-white shadow-sm'
                                : 'bg-white border-purple-200 text-gray-700 hover:bg-purple-50/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] sm:text-[13.5px] font-black break-keep">
                                🏦 계좌이체 (입금)
                              </span>
                              {deliveryPaymentType === 'bank_transfer' && (
                                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                              )}
                            </div>
                            <span
                              className={`text-[11px] mt-0.5 font-semibold break-keep ${
                                deliveryPaymentType === 'bank_transfer' ? 'text-purple-100' : 'text-gray-400'
                              }`}
                            >
                              입금자명 입력
                            </span>
                          </button>
                        </div>

                        {deliveryPaymentType === 'bank_transfer' ? (
                          <div className="mt-3 p-3.5 rounded-xl bg-white border border-purple-200 space-y-2.5 animate-in fade-in duration-150">
                            <div>
                              <label className="block text-[12.5px] font-extrabold text-[#3B0764] mb-1">
                                입금자명 <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={deliveryDepositor}
                                onChange={e => setDeliveryDepositor(e.target.value)}
                                placeholder="통장에 찍힐 입금자 성함을 입력하세요"
                                className="w-full px-3.5 py-2.5 text-[14px] rounded-xl border border-purple-300 bg-purple-50/20 focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] text-gray-900 placeholder-gray-400"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-[11.5px] font-bold text-[#5B21B6] pl-1">
                            ✓ 매장에서 결제를 마치신 경우 아래 보내는 분·받는 분 주소만 적어주시면 됩니다.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

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
                <input type="checkbox" required className="w-4 h-4 mt-0.5 sm:mt-1 rounded border-gray-300 text-purple-700 focus:ring-purple-700 cursor-pointer" />
                <span className="text-sm sm:text-[15px] font-medium text-gray-800 leading-relaxed">
                  [필수] 개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>
            </div>
            
            <div className="pt-6 sm:pt-8">
              <button 
                type="submit"
                className={`w-full py-4 ${isResumeForm ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20' : 'bg-gradient-to-r from-[#4C1D95] to-[#6D28D9] hover:from-[#3B0764] hover:to-[#5B21B6] shadow-purple-900/20'} text-white rounded-xl font-extrabold text-lg active:transform active:scale-[0.99] transition-all shadow-lg`}
              >
                {data?.submitButtonText
                  ? data.submitButtonText
                  : isResumeForm
                    ? '이력서 제출하기'
                    : String(data?.formTitle || '').includes('단골')
                      ? '단골되기'
                      : '제출하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-stone-400 font-medium">
        Powered by{' '}
        <span className="text-purple-700 font-semibold">
          싹다폼
        </span>
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
