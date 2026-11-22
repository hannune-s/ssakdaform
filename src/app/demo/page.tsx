'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Copy,
  ExternalLink,
  Check,
  Home,
  User,
  ChevronRight,
  ArrowLeft,
  LogOut,
  QrCode,
  Printer,
  Download,
  X
} from 'lucide-react';
import DeliveryList from '../delivery-list/page';
import CustomList from '../custom-list/page';
import ResumeList from '../resume-list/page';
import FormBuilder from '../form-builder/page';
import SettingsPage from '../settings/page';
import SubscriptionPage from '../subscription/page';
import AccountPage from '../account/page';
import GuidePage from '../guide/page';
import NoticesPage from '../notices/page';
import InquiryPage from '../inquiry/page';
import DashboardWidget from '../components/DashboardWidget';

export default function DemoAdminHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrSize, setQrSize] = useState<'a5' | 'a4'>('a5');
  const [qrTitle, setQrTitle] = useState('QR코드를 스캔해 주세요');
  const [qrSubtitle, setQrSubtitle] = useState(
    '스마트폰 카메라로 비추면\n매장 소식과 간편 신청 화면으로 바로 연결됩니다.'
  );

  const storeId = 'demo';
  const storeName = '싹다상점 강남본점 (체험용 데모)';

  // 데모 매장용 기본 대표 폼과 외부 링크가 로컬에 없으면 가상의 샘플로 자동 세팅
  useEffect(() => {
    try {
      const existingDemoForms = localStorage.getItem('ssakdaform_custom_forms_demo');
      if (!existingDemoForms) {
        const sampleForms = [
          {
            id: 'demo-form-1',
            shortCode: '1',
            isMain: true,
            storeName: '싹다상점 강남본점',
            formTitle: '단골할래요?',
            formDescription:
              '저희 매장을 찾아주셔서 감사합니다.\n단골로 등록해 주시면 매주 신선한 소식과 단골 전용 혜택을 가장 먼저 전해드립니다.',
            submitButtonText: '단골되기',
            fields: [
              { id: 1, type: 'text', label: '이름', placeholder: '성함을 입력하세요', required: true },
              { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true }
            ]
          },
          {
            id: 'demo-form-2',
            shortCode: '2',
            isMain: false,
            storeName: '싹다상점 강남본점',
            formTitle: '명절 선물세트 사전예약 신청서',
            formDescription: '원하시는 선물세트와 수령 희망일을 남겨주시면 확인 후 안내드립니다.',
            submitButtonText: '예약 신청하기',
            fields: [
              { id: 1, type: 'text', label: '예약자 성함', placeholder: '성함을 입력하세요', required: true },
              { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
              { id: 3, type: 'text', label: '선물세트 종류 및 수량', placeholder: '예: 프리미엄 세트 2개', required: true }
            ]
          }
        ];
        localStorage.setItem('ssakdaform_custom_forms_demo', JSON.stringify(sampleForms));
      }

      const existingDemoDetails = localStorage.getItem('ssakdaform_store_details_demo');
      if (!existingDemoDetails) {
        const sampleDetails = {
          name: '싹다상점 강남본점',
          ownerName: '홍길동',
          address: '서울특별시 강남구 테헤란로 123 1층',
          phone: '02-1234-5678',
          hours: '매일 10:00 ~ 20:00',
          closedDays: '매주 일요일 정기휴무',
          shopLinks: [
            {
              title: '우리 가게 이야기',
              subtitle: '매일 정성껏 준비하는 매장 일상 블로그',
              url: 'https://section.blog.naver.com'
            },
            {
              title: '오늘의 깜짝 특가!',
              subtitle: '홈화면에 추가하고 실시간 세일소식 먼저 받기',
              url: 'https://smartstore.naver.com'
            }
          ]
        };
        localStorage.setItem('ssakdaform_store_details_demo', JSON.stringify(sampleDetails));
      }
    } catch {}
  }, []);

  const handleCopy = async () => {
    try {
      const currentOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'https://ssakdaform-9cqv.vercel.app';
      await navigator.clipboard.writeText(`${currentOrigin}/store/demo`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const downloadQrCode = async () => {
    try {
      const currentOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'https://ssakdaform-9cqv.vercel.app';
      const storeLink = `${currentOrigin}/store/demo`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=${encodeURIComponent(
        storeLink
      )}`;

      const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = qrUrl;
      });

      const W = 1240;
      const H = 1754;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#3B0764';
      ctx.lineWidth = 6;
      ctx.strokeRect(70, 70, W - 140, H - 140);

      ctx.strokeStyle = '#E9D5FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(92, 92, W - 184, H - 184);

      const displayStore = '싹다상점 강남본점';
      ctx.fillStyle = '#5B21B6';
      ctx.font = 'bold 38px "Pretendard", "Malgun Gothic", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(displayStore, W / 2, 260);

      ctx.fillStyle = '#DDD6FE';
      ctx.fillRect(W / 2 - 50, 295, 100, 4);

      ctx.fillStyle = '#111827';
      ctx.font = '900 64px "Pretendard", "Malgun Gothic", sans-serif';
      ctx.fillText(qrTitle || 'QR코드를 스캔해 주세요', W / 2, 410);

      ctx.fillStyle = '#4B5563';
      ctx.font = '600 34px "Pretendard", "Malgun Gothic", sans-serif';
      const subLines = (qrSubtitle || '').split('\n');
      subLines.forEach((line, idx) => {
        ctx.fillText(line.trim(), W / 2, 495 + idx * 54);
      });

      const qrBoxSize = 640;
      const qrBoxX = (W - qrBoxSize) / 2;
      const qrBoxY = 650;

      ctx.fillStyle = '#FAF5FF';
      ctx.strokeStyle = '#C4B5FD';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 36);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(qrBoxX + 36, qrBoxY + 36, qrBoxSize - 72, qrBoxSize - 72, 24);
      ctx.fill();

      ctx.drawImage(qrImg, qrBoxX + 68, qrBoxY + 68, qrBoxSize - 136, qrBoxSize - 136);

      ctx.fillStyle = '#3B0764';
      ctx.font = 'bold 34px "Pretendard", "Malgun Gothic", sans-serif';
      ctx.fillText('📱 휴대폰 기본 카메라를 켜고 QR코드를 비춰주세요', W / 2, 1430);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '500 24px "Pretendard", "Malgun Gothic", sans-serif';
      ctx.fillText(storeLink, W / 2, 1560);

      canvas.toBlob(blob => {
        if (!blob) return;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `싹다상점_QR안내문_${qrSize.toUpperCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 'image/png');
    } catch {
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  const handlePrintQrPoster = () => {
    const currentOrigin =
      typeof window !== 'undefined' ? window.location.origin : 'https://ssakdaform-9cqv.vercel.app';
    const storeLink = `${currentOrigin}/store/demo`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=10&data=${encodeURIComponent(
      storeLink
    )}`;
    const displayStore = '싹다상점 강남본점';
    const isA5 = qrSize === 'a5';

    const printWin = window.open('', '_blank', 'width=820,height=980');
    if (!printWin) {
      alert('팝업 차단을 해제해 주세요.');
      return;
    }

    const escapedSub = (qrSubtitle || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');

    printWin.document.write(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>${displayStore} QR 안내문 출력</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: "Pretendard", "Malgun Gothic", sans-serif; background: #fff; color: #111827; display: flex; flex-direction: column; align-items: center; }
    .sheet {
      width: ${isA5 ? '148mm' : '185mm'};
      height: ${isA5 ? '205mm' : '272mm'};
      border: 2.5px solid #3B0764;
      border-radius: 16px;
      padding: ${isA5 ? '12mm 10mm' : '18mm 14mm'};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      position: relative;
      margin-top: ${isA5 ? '6mm' : '0'};
    }
    .inner-border { position: absolute; inset: 6px; border: 1px solid #DDD6FE; border-radius: 12px; pointer-events: none; }
    .store-name { font-size: ${isA5 ? '16pt' : '21pt'}; font-weight: 800; color: #5B21B6; }
    .divider { width: 40px; height: 3px; background: #C4B5FD; margin: 10px auto 0; border-radius: 2px; }
    .main-title { font-size: ${isA5 ? '23pt' : '31pt'}; font-weight: 900; color: #111827; margin-top: 10px; line-height: 1.25; word-break: keep-all; }
    .sub-title { font-size: ${isA5 ? '11.5pt' : '14.5pt'}; font-weight: 600; color: #4B5563; line-height: 1.6; margin-top: 10px; word-break: keep-all; }
    .qr-frame { background: #FAF5FF; border: 2px solid #C4B5FD; border-radius: 22px; padding: ${isA5 ? '14px' : '22px'}; margin: ${isA5 ? '12px 0' : '18px 0'}; }
    .qr-inner { background: #FFFFFF; border-radius: 16px; padding: ${isA5 ? '12px' : '18px'}; }
    .qr-inner img { width: ${isA5 ? '58mm' : '82mm'}; height: ${isA5 ? '58mm' : '82mm'}; display: block; }
    .guide-pill { background: #F5F3FF; color: #3B0764; border: 1px solid #DDD6FE; padding: ${isA5 ? '8px 16px' : '11px 22px'}; border-radius: 999px; font-size: ${isA5 ? '10.5pt' : '13pt'}; font-weight: 800; }
    .url-text { font-size: 9pt; color: #9CA3AF; margin-top: 6px; }
    .cut-hint { font-size: 9pt; color: #9CA3AF; margin-bottom: 4px; }
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body>
  ${isA5 ? '<p class="cut-hint no-print">✂️ A4 반절(A5) 사이즈 — 인쇄 후 테두리를 따라 잘라 매장에 비치하세요</p>' : ''}
  <div class="sheet">
    <div class="inner-border"></div>
    <div style="width:100%">
      <div class="store-name">${displayStore}</div>
      <div class="divider"></div>
      <h1 class="main-title">${qrTitle || 'QR코드를 스캔해 주세요'}</h1>
      <p class="sub-title">${escapedSub}</p>
    </div>
    <div class="qr-frame">
      <div class="qr-inner">
        <img src="${qrUrl}" alt="QR Code" onload="setTimeout(function(){ window.print(); }, 250);" />
      </div>
    </div>
    <div>
      <div class="guide-pill">📱 휴대폰 카메라를 켜고 QR코드를 비춰주세요</div>
      <div class="url-text">${storeLink}</div>
    </div>
  </div>
</body>
</html>`);
    printWin.document.close();
  };

  const isSubMyTab = [
    'my',
    'settings',
    'account',
    'subscription',
    'guide',
    'notices',
    'inquiry'
  ].includes(activeTab);

  return (
    <div
      className={`w-full min-h-screen print:min-h-0 bg-gray-50 print:bg-white flex flex-col ${
        ['guide', 'notices', 'inquiry'].includes(activeTab) ? 'px-0' : 'px-4 print:px-0'
      } pb-24 print:pb-0 pt-10`}
    >
      {/* 체험판 안내 상단 배너 (로얄 퍼플 테마) */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#3B0764] via-[#5B21B6] to-[#6D28D9] text-white py-2.5 px-4 z-[100] flex items-center justify-center gap-2 sm:gap-4 shadow-md no-print">
        <span className="text-[12.5px] sm:text-sm font-bold opacity-95 hidden sm:inline">
          ✨ 현재 데모(체험용) 어드민 화면입니다 — 모든 기능을 자유롭게 눌러보세요!
        </span>
        <span className="text-[12.5px] font-bold opacity-95 sm:hidden">
          ✨ 데모 체험 모드입니다.
        </span>
        <a
          href="/signup"
          className="text-[12px] sm:text-[13px] font-extrabold bg-amber-300 text-[#2E054E] px-4 py-1 rounded-full hover:bg-amber-200 transition-colors shadow-xs active:scale-95 shrink-0"
        >
          우리 매장 시작하기 &rarr;
        </a>
      </div>

      {!isSubMyTab && (
        <div className="pt-8 sm:pt-12 print:pt-0 flex flex-col w-full">
          {/* 상단 로고 및 타이틀 */}
          <div className="text-center mb-8 relative no-print">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#3B0764] via-[#5B21B6] to-[#7E22CE] bg-clip-text text-transparent tracking-tight mb-2">
              싹다폼
            </h1>
            <p className="text-gray-500 font-medium">{storeName}</p>
          </div>

          {/* 매장 통합 링크 (최신 어드민과 동일) */}
          <div className="w-full max-w-4xl mx-auto mb-6 no-print">
            <div className="bg-gradient-to-br from-[#F5F3FF] via-[#FAF5FF] to-[#EDE9FE] rounded-[20px] sm:rounded-3xl p-5 sm:p-6 shadow-lg border-2 border-purple-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h2 className="text-[17px] sm:text-[19px] font-extrabold text-purple-950 tracking-tight">
                    우리 매장 통합 링크
                  </h2>
                  <span className="text-[11px] sm:text-[12px] font-bold bg-purple-600/10 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                    /store/demo
                  </span>
                  <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    대표 맞춤폼 연결됨
                  </span>
                </div>
                <p className="text-purple-900/70 text-[12.5px] sm:text-[14px] font-medium leading-snug">
                  인스타, 카톡 등에 링크를 공유하거나 QR 안내문을 출력해 계산대에 비치해 보세요.
                </p>
              </div>

              <div className="flex flex-row flex-wrap md:flex-nowrap gap-2 w-full md:w-auto shrink-0">
                <button
                  onClick={handleCopy}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-[#5B21B6] text-white rounded-xl hover:bg-[#4C1D95] font-bold transition-all shadow-sm active:scale-95 text-[13.5px] sm:text-[14px] whitespace-nowrap"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '복사완료' : '링크 복사'}
                </button>
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 font-bold transition-all shadow-sm active:scale-95 text-[13.5px] sm:text-[14px] whitespace-nowrap"
                >
                  <QrCode className="w-4 h-4" />
                  QR 다운로드
                </button>
                <a
                  href="/store/demo"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-white border border-purple-200 text-purple-800 rounded-xl hover:bg-purple-50 font-bold transition-all shadow-sm active:scale-95 text-[13.5px] sm:text-[14px] whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4" />
                  고객화면
                </a>
              </div>
            </div>
          </div>

          {/* 탭 및 검색 카드 영역 (최신 3종 구조: 간편폼접수 / 택배접수 / 이력서접수) */}
          <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8 no-print">
            <div className="flex flex-col items-center gap-2 sm:gap-3 w-full px-1">
              <div className="flex flex-row justify-center gap-1 sm:gap-2 w-full">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 max-w-[150px] px-2 py-2 rounded-full text-[13.5px] sm:text-[15px] font-bold transition-all whitespace-nowrap tracking-tight ${
                    activeTab === 'dashboard'
                      ? 'bg-[#5B21B6] text-white shadow-md shadow-purple-900/15'
                      : 'bg-purple-50/70 text-[#4C1D95] hover:bg-purple-100/70 border border-purple-200 shadow-sm'
                  }`}
                >
                  대시보드
                </button>
                <button
                  onClick={() => setActiveTab('builder')}
                  className={`flex-1 max-w-[150px] px-2 py-2 rounded-full text-[13.5px] sm:text-[15px] font-bold transition-all whitespace-nowrap tracking-tight ${
                    activeTab === 'builder'
                      ? 'bg-[#5B21B6] text-white shadow-md shadow-purple-900/15'
                      : 'bg-purple-50/70 text-[#4C1D95] hover:bg-purple-100/70 border border-purple-200 shadow-sm'
                  }`}
                >
                  간편폼 만들기
                </button>
              </div>

              <div className="flex flex-row justify-center gap-1.5 sm:gap-2.5 w-full">
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`flex-1 max-w-[140px] px-2 py-2 sm:px-4 sm:py-2 rounded-full text-[12.5px] sm:text-[14px] font-bold transition-all whitespace-nowrap tracking-tight ${
                    activeTab === 'custom'
                      ? 'bg-[#5B21B6] text-white shadow-md shadow-purple-900/15'
                      : 'bg-purple-50/70 text-[#4C1D95] hover:bg-purple-100/70 border border-purple-200 shadow-sm'
                  }`}
                >
                  간편폼접수
                </button>
                <button
                  onClick={() => setActiveTab('delivery')}
                  className={`flex-1 max-w-[140px] px-2 py-2 sm:px-4 sm:py-2 rounded-full text-[12.5px] sm:text-[14px] font-bold transition-all whitespace-nowrap tracking-tight ${
                    activeTab === 'delivery'
                      ? 'bg-[#5B21B6] text-white shadow-md shadow-purple-900/15'
                      : 'bg-purple-50/70 text-[#4C1D95] hover:bg-purple-100/70 border border-purple-200 shadow-sm'
                  }`}
                >
                  택배접수
                </button>
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`flex-1 max-w-[140px] px-2 py-2 sm:px-4 sm:py-2 rounded-full text-[12.5px] sm:text-[14px] font-bold transition-all whitespace-nowrap tracking-tight ${
                    activeTab === 'resume'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/70 border border-emerald-200 shadow-sm'
                  }`}
                >
                  이력서접수
                </button>
              </div>
            </div>

            <div className="relative mt-5 sm:mt-6">
              <input
                type="text"
                className="block w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-300 rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#5B21B6] focus:ring-2 focus:ring-purple-100 transition-all font-medium text-[13px] sm:text-base outline-none"
                placeholder="이름, 연락처, 주문상품, 지원파트 등을 검색해보세요"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-1.5 flex items-center">
                <button className="p-1.5 sm:p-2 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-lg transition-colors shadow-sm">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full max-w-6xl mx-auto flex-1">
            {activeTab === 'dashboard' && <DashboardWidget setActiveTab={setActiveTab} />}
            {activeTab === 'builder' && <FormBuilder />}
            {activeTab === 'delivery' && <DeliveryList searchQuery={searchQuery} />}
            {activeTab === 'custom' && <CustomList searchQuery={searchQuery} />}
            {activeTab === 'resume' && <ResumeList searchQuery={searchQuery} />}
          </div>
        </div>
      )}

      {/* 하단 네비게이션바 (홈 / 마이 / 체험 종료하기) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-50 h-16 no-print">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            !isSubMyTab ? 'text-[#5B21B6]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] sm:text-[11px] font-bold">홈</span>
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            isSubMyTab ? 'text-[#5B21B6]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] sm:text-[11px] font-bold">마이 (설정·가이드)</span>
        </button>
        <button
          onClick={() => (window.location.href = '/landing')}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-rose-500 hover:text-rose-600"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] sm:text-[11px] font-bold">체험 종료</span>
        </button>
      </div>

      {activeTab === 'guide' && <GuidePage onBack={() => setActiveTab('my')} />}
      {activeTab === 'inquiry' && <InquiryPage onBack={() => setActiveTab('my')} />}
      {activeTab === 'notices' && <NoticesPage onBack={() => setActiveTab('my')} />}

      {activeTab === 'subscription' && (
        <div className="pt-8 sm:pt-12 pb-10 w-full">
          <div className="px-4 flex items-center gap-2 mb-4 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab('my')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">구독 및 결제 관리</h2>
          </div>
          <SubscriptionPage />
        </div>
      )}

      {activeTab === 'account' && (
        <div className="pt-8 sm:pt-12 pb-10 w-full">
          <div className="px-4 flex items-center gap-2 mb-4 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab('my')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">계정 정보</h2>
          </div>
          <AccountPage />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="pt-8 sm:pt-12 pb-10 w-full">
          <div className="px-4 flex items-center gap-2 mb-4 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab('my')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">설정 (가게 · 계좌 · 쇼핑몰 링크)</h2>
          </div>
          <SettingsPage />
        </div>
      )}

      {activeTab === 'my' && (
        <div className="w-full max-w-4xl mx-auto mt-6 px-2 sm:px-0 pb-10">
          <div className="mb-6 flex items-start sm:items-center gap-1 sm:gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-1.5 -ml-2 text-gray-400 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-200 active:scale-95 mt-0.5 sm:mt-0"
            >
              <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <div>
              <h2 className="text-[22px] sm:text-2xl font-bold text-gray-900 leading-tight">
                마이 메뉴 (데모 체험)
              </h2>
              <p className="text-[13px] sm:text-sm text-gray-500 mt-1">
                가게 설정, 구독 안내, 1분 이용 가이드를 직접 확인해 보세요.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                title: '계정 정보',
                desc: '관리자 아이디 및 비밀번호 변경',
                color: 'bg-purple-900',
                onClick: () => setActiveTab('account')
              },
              {
                title: '구독 및 결제 관리',
                desc: '월 9,900원 소상공인 상생 응원가 및 자료 영구 보관 안내',
                color: 'bg-purple-900',
                onClick: () => setActiveTab('subscription')
              },
              {
                title: '설정 (가게/계좌/쇼핑몰 링크)',
                desc: '가게 기본 정보, 무통장 입금 계좌 및 블로그·특가 바로가기 링크 관리',
                color: 'bg-purple-900',
                onClick: () => setActiveTab('settings')
              }
            ].map((menu, idx) => (
              <div
                key={idx}
                onClick={menu.onClick}
                className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100/80 flex items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${menu.color}`} />
                <div className="ml-2 flex-1">
                  <h3 className="font-extrabold text-gray-900 text-[15px] sm:text-[16px] tracking-tight">
                    {menu.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-0.5">{menu.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            ))}
          </div>

          <div className="mt-10 mb-3">
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight px-1">고객 서비스</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100/80 overflow-hidden divide-y divide-gray-100/80">
            {[
              { title: '1분 이용 가이드', type: 'guide' },
              { title: '1:1 문의', type: 'inquiry' },
              { title: '본사 공지사항', type: 'notice' },
              { title: '체험 종료하기', type: 'logout' }
            ].map((menu, idx) => (
              <div
                key={idx}
                onClick={
                  menu.type === 'logout'
                    ? () => (window.location.href = '/landing')
                    : menu.type === 'guide'
                      ? () => setActiveTab('guide')
                      : menu.type === 'inquiry'
                        ? () => setActiveTab('inquiry')
                        : menu.type === 'notice'
                          ? () => setActiveTab('notices')
                          : undefined
                }
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-[15px] sm:text-[16px] ${
                      menu.type === 'logout' ? 'text-red-500' : 'text-gray-900'
                    }`}
                  >
                    {menu.title}
                  </span>
                  {menu.type === 'notice' && (
                    <span className="flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full leading-none mt-0.5">
                      N
                    </span>
                  )}
                </div>
                {menu.type === 'logout' ? (
                  <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 매장 비치용 QR 안내문 모달 */}
      {isQrModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                  매장 비치용 QR 안내문 (체험용)
                </h3>
                <p className="text-[11.5px] text-gray-500">
                  A4 또는 A4 반절(A5) 크기로 깔끔하게 출력하거나 이미지로 저장하세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQrSize('a5')}
                  className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all ${
                    qrSize === 'a5'
                      ? 'bg-white text-[#5B21B6] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  A4 반절 사이즈 (A5 · 추천)
                </button>
                <button
                  type="button"
                  onClick={() => setQrSize('a4')}
                  className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all ${
                    qrSize === 'a4'
                      ? 'bg-white text-[#5B21B6] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  A4 전체 사이즈
                </button>
              </div>

              <div className="mx-auto w-full max-w-[290px] bg-white border-2 border-[#3B0764] rounded-2xl p-5 text-center shadow-md relative">
                <div className="absolute inset-1.5 border border-purple-200 rounded-xl pointer-events-none" />
                <p className="text-xs font-extrabold text-[#5B21B6] tracking-tight">
                  싹다상점 강남본점
                </p>
                <div className="w-7 h-0.5 bg-purple-300 mx-auto my-2 rounded-full" />
                <h4 className="text-[17px] font-black text-gray-900 leading-snug break-keep">
                  {qrTitle || 'QR코드를 스캔해 주세요'}
                </h4>
                <p className="text-[11px] font-semibold text-gray-500 leading-relaxed mt-1.5 whitespace-pre-line break-keep">
                  {qrSubtitle}
                </p>

                <div className="my-4 inline-block p-2.5 rounded-2xl bg-purple-50/70 border border-purple-200">
                  <div className="bg-white p-2 rounded-xl">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=6&data=${encodeURIComponent(
                        (typeof window !== 'undefined'
                          ? window.location.origin
                          : 'https://ssakdaform-9cqv.vercel.app') + '/store/demo'
                      )}`}
                      alt="Demo Store QR Code"
                      className="w-36 h-36 mx-auto"
                    />
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[10.5px] font-extrabold text-[#3B0764]">
                  📱 휴대폰 카메라를 켜고 QR코드를 비춰주세요
                </div>
              </div>

              <div className="space-y-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80">
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-600 mb-1">
                    안내 제목 (자유롭게 수정 가능)
                  </label>
                  <input
                    type="text"
                    value={qrTitle}
                    onChange={e => setQrTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-900 focus:outline-none focus:border-[#5B21B6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-600 mb-1">
                    설명 문구
                  </label>
                  <textarea
                    rows={2}
                    value={qrSubtitle}
                    onChange={e => setQrSubtitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-700 focus:outline-none focus:border-[#5B21B6] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePrintQrPoster}
                  className="flex-1 py-3 bg-[#3B0764] hover:bg-[#4C1D95] text-white font-extrabold text-xs sm:text-[13px] rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>{qrSize === 'a5' ? 'A4 반절(A5) 바로 인쇄' : 'A4 전체 바로 인쇄'}</span>
                </button>
                <button
                  type="button"
                  onClick={downloadQrCode}
                  className="flex-1 py-3 bg-purple-100 hover:bg-purple-200 text-[#3B0764] font-extrabold text-xs sm:text-[13px] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>포스터 이미지 저장</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
