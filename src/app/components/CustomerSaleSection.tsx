"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Smartphone,
  X,
  CheckCircle2,
  Share,
  ChevronRight,
  Flower2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from '@/lib/pushConfig';
import type { StoreSaleData } from './SalePushManager';

interface CustomerSaleSectionProps {
  storeId: string;
  storeName: string;
}

// 맑고 은은한 알림 차임 사운드 (Web Audio API)
function playSaleChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.38);
    });
  } catch {}
}

function formatPriceDisplay(val?: string) {
  if (!val) return '';
  const trimmed = val.trim();
  if (!trimmed) return '';
  // 숫자만 있거나 콤마가 섞여 있어도 무조건 천단위 콤마 표시 + 단위 없으면 '원' 추가
  const rawNum = trimmed.replace(/,/g, '');
  if (/^\d+$/.test(rawNum)) {
    return `${Number(rawNum).toLocaleString('ko-KR')}원`;
  }
  return rawNum.replace(/\d+/g, (num) => {
    const n = Number(num);
    return isNaN(n) ? num : n.toLocaleString('ko-KR');
  });
}

export default function CustomerSaleSection({ storeId, storeName }: CustomerSaleSectionProps) {
  const [saleData, setSaleData] = useState<StoreSaleData | null>(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showAddHomeGuide, setShowAddHomeGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const lastUpdatedAtRef = useRef<string | null>(null);
  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    if (!storeId) return;

    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(ua));
      const savedSub = localStorage.getItem(`ssakdaform_push_sub_${storeId}`);
      if (savedSub === '1' && 'Notification' in window && Notification.permission === 'granted') {
        setIsSubscribed(true);
      }
    }

    fetchSaleData(true);

    // 7초마다 실시간 특가 오픈 및 품절 상태 자동 동기화
    const timer = setInterval(() => {
      fetchSaleData(false);
    }, 7000);

    const onSwMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'SSAKDAFORM_SALE_PUSH' ||
        event.data?.type === 'SSAKDAFORM_OPEN_SALE_MODAL'
      ) {
        playSaleChime();
        fetchSaleData(false, true);
        setIsSaleModalOpen(true);
      }
    };

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', onSwMessage);
    }

    return () => {
      clearInterval(timer);
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', onSwMessage);
      }
    };
  }, [storeId]);

  async function fetchSaleData(isInitial: boolean, forceOpen = false) {
    try {
      const { data: rows } = await supabase
        .from('ssakdaform_responses')
        .select('*')
        .eq('store_id', '__hq__')
        .eq('form_id', '__store_sale__')
        .order('submitted_at', { ascending: false });

      const myRow = (rows || []).find((r: { data?: { storeId?: string } }) => r.data?.storeId === storeId);
      if (!myRow || !myRow.data) {
        setSaleData(null);
        return;
      }

      const d = myRow.data as StoreSaleData;
      setSaleData(d);

      if (d.isActive && Array.isArray(d.items) && d.items.length > 0) {
        if (isInitial && !hasAutoOpenedRef.current) {
          hasAutoOpenedRef.current = true;
          setIsSaleModalOpen(true);
        } else if (
          !isInitial &&
          lastUpdatedAtRef.current &&
          d.updatedAt &&
          d.updatedAt !== lastUpdatedAtRef.current
        ) {
          playSaleChime();
          setIsSaleModalOpen(true);
        } else if (forceOpen) {
          setIsSaleModalOpen(true);
        }
      }

      if (d.updatedAt) {
        lastUpdatedAtRef.current = d.updatedAt;
      }
    } catch {}
  }

  const handleEnablePushAndAddHome = async () => {
    setIsSubscribing(true);
    try {
      if (typeof window !== 'undefined') {
        const dp = (window as unknown as { deferredPrompt?: { prompt: () => void } }).deferredPrompt;
        if (dp && typeof dp.prompt === 'function') {
          try {
            dp.prompt();
            (window as unknown as { deferredPrompt?: null }).deferredPrompt = null;
          } catch {}
        }
      }

      if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          let registration = await navigator.serviceWorker.getRegistration();
          if (!registration) {
            registration = await navigator.serviceWorker.register('/sw.js?v=4');
          } else {
            try { await registration.update(); } catch {}
          }
          await navigator.serviceWorker.ready;

          let sub = await registration.pushManager.getSubscription();
          if (!sub) {
            sub = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource,
            });
          }

          if (sub) {
            const subJson = sub.toJSON();
            const endpoint = subJson.endpoint || '';

            const { data: existing } = await supabase
              .from('ssakdaform_responses')
              .select('id, data')
              .eq('store_id', '__hq__')
              .eq('form_id', '__store_push_sub__');

            const matchedRow = (existing || []).find(
              (r: { id: string; data?: { storeId?: string; endpoint?: string } }) =>
                r.data?.storeId === storeId && r.data?.endpoint === endpoint
            );

            if (matchedRow) {
              await supabase
                .from('ssakdaform_responses')
                .update({
                  data: {
                    storeId,
                    storeName,
                    endpoint,
                    subscription: subJson,
                    subscribedAt: new Date().toISOString(),
                  },
                })
                .eq('id', matchedRow.id);
            } else {
              await supabase.from('ssakdaform_responses').insert([
                {
                  store_id: '__hq__',
                  form_id: '__store_push_sub__',
                  status: '구독중',
                  data: {
                    storeId,
                    storeName,
                    endpoint,
                    subscription: subJson,
                    subscribedAt: new Date().toISOString(),
                  },
                },
              ]);
            }

            localStorage.setItem(`ssakdaform_push_sub_${storeId}`, '1');
            setIsSubscribed(true);
            playSaleChime();

            // 모바일(안드로이드/아이폰 PWA)에서도 100% 상단 배너로 뜨도록 고유 tag 사용
            try {
              await registration.showNotification(`🔔 [${storeName}] 단골 특가 알림 켜짐!`, {
                body: '사장님이 깜짝 특가를 올리면 이 기기로 소리와 함께 알림이 도착합니다.',
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                tag: 'ssakdaform-sub-confirm-' + Date.now(),
                vibrate: [300, 100, 300],
              } as NotificationOptions);
            } catch {
              try {
                new Notification(`[${storeName}] 단골 특가 알림이 켜졌습니다`, {
                  body: '새로운 특가 소식이 올라오면 알려드릴게요.',
                  icon: '/icon-192.png',
                });
              } catch {}
            }

            alert(
              `🔔 [${storeName}] 이 기기(휴대폰/PC)에 실시간 특가 알림이 연결되었습니다!\n사장님이 특가 소식을 전송하면 알림으로 바로 받아보실 수 있습니다.`
            );
            return;
          }
        } else if (permission === 'denied') {
          alert(
            '브라우저 알림이 꺼져 있습니다.\n주소창 옆 메뉴(또는 휴대폰 설정 > 앱 > 브라우저 알림)에서 [알림]을 허용으로 변경해 주세요.'
          );
          return;
        }
      }

      setShowAddHomeGuide(true);
    } catch (e) {
      console.error('Push subscription error:', e);
      setShowAddHomeGuide(true);
    } finally {
      setIsSubscribing(false);
    }
  };

  const hasActiveSale = Boolean(
    saleData && saleData.isActive && Array.isArray(saleData.items) && saleData.items.length > 0
  );

  return (
    <>
      {/* 고객 화면: 기존 '내가먼저 득템!' 카드 디자인 & 컬러 그대로 적용 */}
      <div className="mb-2">
        {hasActiveSale ? (
          <div
            onClick={() => setIsSaleModalOpen(true)}
            className="cursor-pointer w-full px-3.5 sm:px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFF1F2] via-[#FFF5F5] to-[#FFE4E6] hover:from-[#FFE4E6] hover:to-[#FECDD3] border-2 border-rose-300 hover:border-rose-400 shadow-[0_4px_12px_rgba(225,29,72,0.10)] transition-all flex items-center justify-between gap-2.5 group active:scale-[0.99]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-[14.5px] sm:text-[15px] font-black text-rose-950 tracking-tight break-keep">
                  {saleData!.title}
                </p>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-extrabold">
                  실시간 특가
                </span>
              </div>
              <p className="text-[11.5px] sm:text-[12px] font-bold text-rose-800/90 mt-0.5 break-keep">
                {saleData!.period || '홈화면에 꼭 추가해주세요! 실시간 세일·득템 소식'}
              </p>
            </div>
            <div className="flex items-center gap-0.5 px-3 py-1.5 rounded-lg bg-rose-600 group-hover:bg-rose-700 text-white text-[11.5px] font-extrabold shadow-xs transition-colors shrink-0">
              <span>특가 보기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              handleEnablePushAndAddHome();
            }}
            className="cursor-pointer w-full px-3.5 sm:px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFF1F2] via-[#FFF5F5] to-[#FFE4E6] hover:from-[#FFE4E6] hover:to-[#FECDD3] border-2 border-rose-300 hover:border-rose-400 shadow-[0_4px_12px_rgba(225,29,72,0.10)] transition-all flex items-center justify-between gap-2.5 group active:scale-[0.99]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-[14.5px] sm:text-[15px] font-black text-rose-950 tracking-tight break-keep">
                  내가먼저 득템!
                </p>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-extrabold">
                  실시간 특가
                </span>
              </div>
              <p className="text-[11.5px] sm:text-[12px] font-bold text-rose-800/90 mt-0.5 break-keep">
                {isSubscribed
                  ? '실시간 특가 알림이 켜져 있습니다 (홈화면 추가 안내)'
                  : '홈화면에 꼭 추가해주세요! 실시간 세일·득템 소식'}
              </p>
            </div>
            <div className="flex items-center gap-0.5 px-3 py-1.5 rounded-lg bg-rose-600 group-hover:bg-rose-700 text-white text-[11.5px] font-extrabold shadow-xs transition-colors shrink-0">
              <span>{isSubscribing ? '설정 중...' : isSubscribed ? '알림 켜짐' : '세일소식 받기'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>

      {/* 고객 화면: 단골 특가 모달 */}
      {isSaleModalOpen && hasActiveSale && (
        <div
          className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsSaleModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border border-rose-200 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* 팝업 상단 헤더: 내가먼저 득템! 카드의 부드러운 핑크/로즈 컬러감 적용 */}
            <div className="bg-gradient-to-r from-[#FFF1F2] via-[#FFF5F5] to-[#FFE4E6] border-b border-rose-200 px-5 py-5 relative">
              <button
                type="button"
                onClick={() => setIsSaleModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-rose-200/60 hover:bg-rose-200 text-rose-900 flex items-center justify-center transition-colors"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100/90 text-[#4C1D95] border border-purple-200 text-[11px] font-extrabold mb-1.5">
                {storeName} · 실시간 특가
              </span>

              <h3 className="text-[18px] font-black text-gray-900 leading-snug break-keep pr-6">
                {saleData!.title}
              </h3>

              {saleData!.period && (
                <p className="text-xs font-bold text-gray-600 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{saleData!.period}</span>
                </p>
              )}
            </div>

            {/* 팝업 본문 */}
            <div className="p-5 space-y-3.5 max-h-[65vh] overflow-y-auto bg-white">
              {saleData!.story && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[13px] text-amber-950 font-medium leading-relaxed whitespace-pre-line break-keep">
                  <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-[12.5px] mb-1.5">
                    <Flower2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>사장님 이야기</span>
                  </div>
                  {saleData!.story}
                </div>
              )}

              <div className="divide-y divide-rose-100/80 border border-rose-200 rounded-xl overflow-hidden">
                {saleData!.items.map(item => (
                  <div
                    key={item.id}
                    className={`px-4 py-3.5 flex items-center justify-between gap-3 ${
                      item.soldOut ? 'bg-gray-100/90' : 'bg-white'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[15px] sm:text-[15.5px] font-extrabold break-keep leading-snug ${
                          item.soldOut ? 'line-through text-gray-400' : 'text-gray-900'
                        }`}
                      >
                        {item.name}
                      </p>
                    </div>

                    {item.soldOut ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold text-gray-400 line-through">
                          {formatPriceDisplay(item.salePrice)}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-extrabold tracking-tight shadow-2xs">
                          품절
                        </span>
                      </div>
                    ) : (
                      <div className="text-right shrink-0 flex flex-col items-end">
                        {item.originalPrice && (
                          <span className="text-[12.5px] font-bold text-gray-500 line-through leading-tight">
                            {formatPriceDisplay(item.originalPrice)}
                          </span>
                        )}
                        <span className="text-[18px] sm:text-[19px] font-black text-rose-600 tracking-tight leading-tight mt-0.5">
                          {formatPriceDisplay(item.salePrice)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 팝업 내 세일소식 받기 & 홈추가 안내 */}
              {!isSubscribed ? (
                <div className="px-3.5 py-3 rounded-xl bg-[#FFF1F2] border border-rose-200 flex items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-rose-950">
                      다음 특가도 먼저 알림 받으시겠어요?
                    </p>
                    <p className="text-[11px] font-semibold text-rose-800/80 mt-0.5">
                      홈화면에 추가하고 실시간 세일 소식을 받아보세요.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={isSubscribing}
                      onClick={handleEnablePushAndAddHome}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11.5px] font-extrabold"
                    >
                      세일소식 받기
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddHomeGuide(true)}
                      className="px-2 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-800 text-[11px] font-bold"
                    >
                      홈추가
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between gap-2 text-rose-950 text-xs font-bold">
                  <div
                    onClick={handleEnablePushAndAddHome}
                    className="flex items-center gap-1.5 cursor-pointer"
                    title="누르면 이 기기의 푸시 알림을 다시 확인합니다"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>실시간 세일 알림 켜짐 (다시 확인)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddHomeGuide(true)}
                    className="text-[11px] font-extrabold text-rose-700 underline"
                  >
                    홈화면 추가 안내
                  </button>
                </div>
              )}
            </div>

            {/* 팝업 하단 닫기 버튼 */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsSaleModalOpen(false)}
                className="w-full py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 홈화면 추가 안내 모달 */}
      {showAddHomeGuide && (
        <div
          className="fixed inset-0 z-[140] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddHomeGuide(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-xl border border-rose-200 space-y-3.5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-rose-600" />
                <h3 className="text-[15px] font-extrabold text-gray-900">
                  홈화면 추가 안내
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddHomeGuide(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              <b>{storeName}</b> 페이지를 휴대폰 홈화면에 추가해 두시면 별도 앱 설치 없이 언제든 바로 접속하고 실시간 세일·득템 소식을 받아보실 수 있습니다.
            </p>

            {isIOS ? (
              <div className="p-3.5 rounded-xl bg-[#FFF5F5] border border-rose-200 space-y-2 text-xs text-rose-950">
                <p className="font-extrabold text-rose-700">아이폰(Safari) 추가 방법</p>
                <p className="flex items-center gap-1">
                  1. 하단 <Share className="w-3.5 h-3.5 text-blue-600 inline" /> <b>[공유]</b> 버튼을 누릅니다.
                </p>
                <p>2. <b>[홈 화면에 추가]</b>를 선택합니다.</p>
                <p>3. 추가된 아이콘으로 접속해 <b>[세일소식 받기]</b>를 눌러주세요.</p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#FFF5F5] border border-rose-200 space-y-2 text-xs text-rose-950">
                <p className="font-extrabold text-rose-700">갤럭시/안드로이드 추가 방법</p>
                <p>1. 브라우저 우측 메뉴 <b>[⋮]</b> 또는 <b>[≡]</b>를 누릅니다.</p>
                <p>2. <b>[홈 화면에 추가]</b>를 선택합니다.</p>
                <p>3. 화면의 <b>[세일소식 받기]</b>를 눌러 알림을 허용해 주세요.</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowAddHomeGuide(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-extrabold hover:bg-rose-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
