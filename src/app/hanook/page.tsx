"use client";

import { useState, useEffect } from 'react';
import {
  Share2,
  X,
  Check,
  Image as ImageIcon,
  Smartphone,
  PlusSquare
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface HanookPost {
  id: number;
  created_at: string;
  title: string;
  content: string;
  imageUrl?: string;
  dateLabel?: string;
}

export interface HanookConfig {
  topCaption: string;
  blogTitle: string;
  blogSubtitle: string;
  introText: string;
  ownerName: string;
  storeName: string;
  phone: string;
  address: string;
}

export const DEFAULT_HANOOK_CONFIG: HanookConfig = {
  topCaption: "정성을 다듬어 온기를 내어놓는 곳",
  blogTitle: "꽃육점-HANOOK",
  blogSubtitle: "— H A N O O K",
  introText:
    "맑은 아침 햇살과 함께 정성을 고르고\n해 질 녘 일곱 시까지 온기를 지킵니다.\n\n귀한 걸음 헛되지 않도록\n눈에 보이지 않는 시간까지 정직하게 채우겠습니다.",
  ownerName: "송하나",
  storeName: "(주) 꽃육점 - HANOOK",
  phone: "031-984-9389",
  address: "김포시 양촌읍 양곡3로1번길 92 1층"
};

export default function HanookMiniBlogPage() {
  const [config, setConfig] = useState<HanookConfig>(DEFAULT_HANOOK_CONFIG);
  const [posts, setPosts] = useState<HanookPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<HanookPost | null>(null);
  const [copied, setCopied] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [installGuideType, setInstallGuideType] = useState<
    'none' | 'samsung' | 'ios' | 'chrome' | 'kakao-ios' | 'standalone-chrome'
  >('none');

  useEffect(() => {
    loadHanookData();

    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      existingManifest.setAttribute('href', '/hanook-manifest.json');
    }
    document.title = '꽃육점 - HANOOK';

    if (typeof window !== 'undefined') {
      if ((window as any).deferredPrompt) {
        setInstallPromptEvent((window as any).deferredPrompt);
      }
      const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        (window as any).deferredPrompt = e;
        setInstallPromptEvent(e);
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }
  }, []);

  const openInAndroidChrome = () => {
    if (typeof window === 'undefined') return;
    const hostAndPath = `${window.location.host}${window.location.pathname}?addHome=1`;
    window.location.href = `intent://${hostAndPath}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  const triggerHomeScreenFlow = async (fromRedirect = false) => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent.toLowerCase();
    const isKakao = ua.includes('kakaotalk');
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = ua.includes('android');
    const isSamsung = ua.includes('samsungbrowser');
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // 1. 크롬 원터치 설치 프롬프트(beforeinstallprompt)가 있으면 즉시 시스템 설치창 실행!
    const deferredPrompt = installPromptEvent || (window as any).deferredPrompt;
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        (window as any).deferredPrompt = null;
        setInstallPromptEvent(null);
        return;
      } catch {}
    }

    // 2. 카카오톡 인앱 브라우저 안에서 눌렀을 때:
    if (isKakao && !fromRedirect) {
      if (isAndroid) {
        openInAndroidChrome();
        return;
      } else {
        setInstallGuideType('kakao-ios');
        return;
      }
    }

    // 3. 이미 싹다폼 앱(전체화면 standalone) 안에서 열려서 상단 점 3개가 없는 경우:
    if (isStandalone && isAndroid) {
      setInstallGuideType('standalone-chrome');
      return;
    }

    // 4. 브라우저별 안내 모달
    if (isIOS) {
      setInstallGuideType('ios');
    } else if (isSamsung) {
      setInstallGuideType('samsung');
    } else {
      setInstallGuideType('chrome');
    }
  };

  async function loadHanookData() {
    setIsLoading(true);
    try {
      const { data: rows } = await supabase
        .from('ssakdaform_responses')
        .select('*')
        .eq('store_id', 'hanook')
        .order('id', { ascending: false });

      if (rows && rows.length > 0) {
        const configRow = rows.find((r: any) => r.form_id === '__hanook_config__');
        if (configRow?.data) {
          setConfig({
            ...DEFAULT_HANOOK_CONFIG,
            ...configRow.data
          });
        }

        const postRows = rows
          .filter((r: any) => r.form_id === '__hanook_post__')
          .map((r: any) => ({
            id: r.id,
            created_at: r.submitted_at || r.created_at || new Date().toISOString(),
            title: r.data?.title || '',
            content: r.data?.content || '',
            imageUrl: r.data?.imageUrl || '',
            dateLabel: r.data?.dateLabel || ''
          }));

        setPosts(postRows);
      }
    } catch (err) {
      console.error('Failed to load hanook data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (isoStr: string, customLabel?: string) => {
    if (customLabel) return customLabel;
    try {
      const d = new Date(isoStr);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}. ${m}. ${day}`;
    } catch {
      return '';
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: config.blogTitle,
          text: config.introText,
          url
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const renderFormattedTitle = () => {
    const raw = (config.blogTitle || '꽃육점-HANOOK').trim();
    if (raw.includes('-')) {
      const [mainPart, subPart] = raw.split('-').map(s => s.trim());
      return (
        <div>
          <h1
            className="text-[28px] sm:text-[38px] font-light text-[#1E1915] tracking-[0.14em] sm:tracking-[0.18em] leading-snug break-keep"
            style={{ fontFamily: "'Gowun Batang', 'Nanum Myeongjo', serif" }}
          >
            {mainPart}
          </h1>
          {subPart && (
            <p
              className="text-[11px] sm:text-[12.5px] text-[#7A6F63] tracking-[0.32em] sm:tracking-[0.38em] mt-1.5 uppercase font-light"
              style={{ fontFamily: "'Gowun Batang', 'Nanum Myeongjo', serif" }}
            >
              — {subPart}
            </p>
          )}
        </div>
      );
    }
    return (
      <h1
        className="text-[26px] sm:text-[36px] font-light text-[#1E1915] tracking-[0.12em] sm:tracking-[0.14em] leading-snug break-keep"
        style={{ fontFamily: "'Gowun Batang', 'Nanum Myeongjo', serif" }}
      >
        {raw}
      </h1>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#F3ECE1] text-[#2B2520] pb-24 selection:bg-[#DFD3C3]"
      style={{ fontFamily: "'Gowun Batang', 'Nanum Myeongjo', 'Noto Serif KR', serif" }}
    >
      {/* 얇고 분위기 있는 펜글씨/명조 웹폰트 */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Nanum+Myeongjo:wght@400;700&display=swap');
      `}</style>

      {/* 미니멀 상단 네비게이션 */}
      <header className="sticky top-0 z-30 bg-[#F3ECE1]/90 backdrop-blur-md border-b border-[#E4DACB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-5 h-13 flex items-center justify-between gap-2">
          <span className="text-xs tracking-[0.18em] sm:tracking-[0.22em] text-[#6E6358] font-normal truncate">
            {config.blogTitle}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => triggerHomeScreenFlow(false)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#B8A68E] bg-[#E8DEC9] hover:bg-[#DFD2BA] text-[#2F2720] text-[11px] font-bold transition-colors shadow-2xs"
              title="홈 화면에 바로가기 추가"
            >
              <Smartphone className="w-3 h-3 shrink-0" />
              <span>홈화면 추가</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#D6CBB9] bg-[#FAF6F0] text-[#5A5046] hover:border-[#8C7D6B] text-[11px] transition-colors"
              title="주소 공유"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-700" />
                  <span>복사됨</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  <span>공유</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-3.5 sm:px-8 pt-5 sm:pt-10">
        {/* 상단 메인 소개 영역 (제목과 시적 소개 내용만 심플하게) */}
        <section className="relative rounded-2xl overflow-hidden bg-[#F7F2E9] border border-[#E3D9C8] px-5 py-8 sm:px-12 sm:py-12 shadow-[0_10px_30px_rgba(60,46,33,0.05)] mb-9 sm:mb-12">
          {/* 은은한 창살 & 햇살 나뭇잎 그림자 */}
          <div
            className="pointer-events-none absolute -top-6 -right-6 w-64 h-64 opacity-[0.09]"
            style={{
              background:
                'radial-gradient(circle at 75% 25%, #5C4B3B 0%, transparent 65%)'
            }}
          />
          <svg
            className="pointer-events-none absolute top-0 right-0 w-56 h-56 text-[#4A3C2F] opacity-[0.08]"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            <path d="M90 0 L200 45 L200 52 L85 5 Z" />
            <path d="M110 0 L200 35 L200 40 L105 2 Z" />
            <path d="M70 15 L200 68 L200 74 L66 20 Z" />
            <path d="M140 0 L115 70 L121 72 L146 0 Z" />
            <path d="M170 0 L145 80 L151 82 L176 0 Z" />
            <path d="M120 75 Q140 85 155 110 Q135 100 120 75 Z" />
            <path d="M105 82 Q118 102 118 128 Q105 108 105 82 Z" />
            <path d="M135 68 Q162 72 182 90 Q155 86 135 68 Z" />
            <path d="M88 90 Q95 110 88 132 Q82 110 88 90 Z" />
          </svg>

          <div className="relative z-10">
            {config.topCaption && (
              <p className="text-[11px] sm:text-xs text-[#8C7F70] tracking-[0.22em] mb-2.5 font-normal">
                {config.topCaption}
              </p>
            )}

            {renderFormattedTitle()}

            <div className="mt-6 sm:mt-7">
              <p className="text-[13.5px] sm:text-[15px] text-[#352E28] leading-[1.95] sm:leading-[2.05] tracking-[0.02em] sm:tracking-[0.03em] whitespace-pre-line font-normal break-keep">
                {config.introText}
              </p>
            </div>
          </div>
        </section>

        {/* 갤러리 앨범 헤더 */}
        <div className="flex items-center justify-between mb-6 px-1 border-b border-[#E2D8C7] pb-2.5">
          <h2 className="text-[14px] sm:text-[15px] text-[#3A3129] tracking-[0.14em] font-normal">
            소소한 기록
          </h2>
          <span className="text-[10.5px] text-[#8C7F70] tracking-[0.16em]">
            HANOOK GALLERY
          </span>
        </div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(n => (
              <div
                key={n}
                className="bg-[#F7F2E9] rounded-xl p-3 border border-[#E3D9C8] animate-pulse"
              >
                <div className="aspect-square w-full bg-[#E5DCCB] rounded-lg mb-3" />
                <div className="h-3.5 w-3/4 bg-[#E5DCCB] rounded mb-2" />
                <div className="h-3 w-full bg-[#ECE4D6] rounded" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-[#F7F2E9] rounded-2xl p-12 text-center border border-[#E3D9C8]">
            <p className="text-sm text-[#4A3F35] tracking-[0.08em] mb-1.5">
              첫 번째 이야기를 준비하고 있습니다.
            </p>
            <p className="text-xs text-[#8C7F70] leading-relaxed">
              꽃육점의 정갈한 일상과 기록하고 싶은 순간들이 이곳에 담깁니다.
            </p>
          </div>
        ) : (
          /* 라틀리에 드 송 스타일 앨범/갤러리 그리드 (모바일 2열, 태블릿 3열, PC 4열) */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
            {posts.map(post => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer flex flex-col bg-[#F9F5EE] rounded-xl overflow-hidden border border-[#E3D9C8] hover:border-[#BDAE99] shadow-[0_4px_16px_rgba(60,46,33,0.04)] hover:shadow-[0_8px_24px_rgba(60,46,33,0.09)] transition-all"
              >
                {/* 정사각형 앨범 썸네일 영역 */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#EBE4D8]">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title || '꽃육점 이야기'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-[#8C7F70]">
                      <ImageIcon className="w-6 h-6 mb-1.5 opacity-50" />
                      <span className="text-[11px] tracking-[0.06em] line-clamp-2 break-keep">
                        {post.title || '꽃육점의 기록'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 사진 아래 제목 & 간단한 내용만 심플하게 표시 (모바일에서도 글씨 안 잘리게 정렬) */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {post.title && (
                      <h3 className="text-[13px] sm:text-[14.5px] text-[#221D18] tracking-[0.01em] leading-snug line-clamp-2 mb-1 font-normal break-keep">
                        {post.title}
                      </h3>
                    )}

                    <p className="text-[11.5px] sm:text-[12.5px] text-[#5C5147] leading-[1.55] line-clamp-2 break-keep font-normal">
                      {post.content}
                    </p>
                  </div>

                  <p className="mt-2 pt-1.5 border-t border-[#ECE3D5] text-[10px] sm:text-[10.5px] text-[#9A8E7F] tracking-[0.05em]">
                    {formatDate(post.created_at, post.dateLabel)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 하단 푸터 */}
        <footer className="mt-16 pt-6 border-t border-[#E2D8C7] text-center text-[11.5px] text-[#8C7F70] tracking-[0.12em]">
          <p className="text-[#5A5046]">{config.storeName}</p>
        </footer>
      </div>

      {/* 앨범 클릭 시 글 상세 보기 모달 (공감/태그 없이 깔끔하게 사진+글만) */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-[#F9F5EE] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-[#DFD5C5] my-auto max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#E6DDD0] flex items-center justify-between bg-[#F3ECE1]">
              <span className="text-xs text-[#7A6F63] tracking-[0.08em]">
                {formatDate(selectedPost.created_at, selectedPost.dateLabel)}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-full text-[#7A6F63] hover:text-[#2B2520] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {selectedPost.imageUrl && (
                <div className="rounded-xl overflow-hidden bg-[#EFE9DE] border border-[#E6DDD0]">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title || '꽃육점 사진'}
                    className="w-full max-h-[520px] object-contain mx-auto"
                  />
                </div>
              )}

              {selectedPost.title && (
                <h3 className="text-xl text-[#221D18] leading-snug tracking-[0.04em] font-normal break-keep">
                  {selectedPost.title}
                </h3>
              )}

              <p className="text-[15px] text-[#3D352E] leading-[2.0] tracking-[0.02em] whitespace-pre-line font-normal break-keep">
                {selectedPost.content}
              </p>
            </div>

            <div className="px-6 py-3.5 border-t border-[#E6DDD0] bg-[#F3ECE1] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="px-4 py-1.5 rounded-full border border-[#C5B7A3] bg-[#EAE0D0] text-[#3A3129] text-xs hover:bg-[#DFD3C0]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 홈 화면 바로가기 추가 1초 안내 모달 */}
      {installGuideType !== 'none' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setInstallGuideType('none')}
        >
          <div
            className="bg-[#F9F5EE] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-[#DFD5C5] p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DDD0] mb-4">
              <div className="flex items-center gap-2">
                <PlusSquare className="w-4 h-4 text-[#5A4B3C]" />
                <h3 className="text-sm font-bold text-[#221D18]">
                  휴대폰 홈 화면에 바로가기 추가
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInstallGuideType('none')}
                className="p-1 text-[#7A6F63] hover:text-[#221D18]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {installGuideType === 'samsung' && (
              <div className="space-y-3 text-xs sm:text-[13px] text-[#3D352E] leading-relaxed break-keep">
                <p className="font-bold text-[#221D18]">
                  갤럭시 (삼성 인터넷)에서 2초 만에 추가하는 법:
                </p>
                <div className="p-3.5 rounded-xl bg-[#EFE8DC] border border-[#E2D8C7] space-y-2">
                  <p>
                    1. 화면 오른쪽 맨 아래의 <b>[ ≡ ] (가로줄 3개)</b> 버튼을 누르세요.
                  </p>
                  <p>
                    2. 메뉴에서 <b>[ + 현재 페이지 추가 ]</b>를 누르세요.
                  </p>
                  <p>
                    3. <b>[ 홈 화면 ]</b>을 선택하면 바탕화면에 바로가기가 생깁니다!
                  </p>
                </div>
              </div>
            )}

            {installGuideType === 'standalone-chrome' && (
              <div className="space-y-3 text-xs sm:text-[13px] text-[#3D352E] leading-relaxed break-keep">
                <p className="font-bold text-[#221D18]">
                  현재 전체화면(설치된 앱) 안에서 열려 있습니다!
                </p>
                <div className="p-3.5 rounded-xl bg-[#EFE8DC] border border-[#E2D8C7] space-y-2">
                  <p>
                    휴대폰에 이미 <b>싹다폼 앱</b>이 설치되어 있어서 주소창과 메뉴 버튼이 없는 전체화면으로 열렸습니다.
                  </p>
                  <p>
                    아래 버튼을 누르면 <b>크롬 브라우저</b>로 바로 열려서 꽃육점 미니블로그를 별도 홈 화면 아이콘으로 추가하실 수 있습니다!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInstallGuideType('none');
                    openInAndroidChrome();
                  }}
                  className="w-full py-3 rounded-xl bg-[#5B21B6] text-white text-xs font-extrabold shadow-sm hover:bg-[#3B0764] transition-colors"
                >
                  크롬 브라우저로 열어서 홈 화면에 깔기 &rarr;
                </button>
              </div>
            )}

            {installGuideType === 'chrome' && (
              <div className="space-y-3 text-xs sm:text-[13px] text-[#3D352E] leading-relaxed break-keep">
                <p className="font-bold text-[#221D18]">
                  홈 화면에 바로가기 설치하기:
                </p>
                <div className="p-3.5 rounded-xl bg-[#EFE8DC] border border-[#E2D8C7] space-y-2">
                  <p>
                    • 상단 또는 하단에 메뉴 버튼이 안 보이는 전체화면이라면 아래 <b>[크롬 브라우저로 바로 열기]</b>를 눌러주세요.
                  </p>
                  <p>
                    • 크롬 화면이 열리면 <b>[홈 화면에 추가]</b> 버튼을 눌러 바탕화면에 바로 설치하실 수 있습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInstallGuideType('none');
                    openInAndroidChrome();
                  }}
                  className="w-full py-3 rounded-xl bg-[#5B21B6] text-white text-xs font-extrabold shadow-sm hover:bg-[#3B0764] transition-colors"
                >
                  크롬 브라우저로 바로 열기 &rarr;
                </button>
              </div>
            )}

            {installGuideType === 'ios' && (
              <div className="space-y-3 text-xs sm:text-[13px] text-[#3D352E] leading-relaxed break-keep">
                <p className="font-bold text-[#221D18]">
                  아이폰(Safari)에서 홈 화면에 추가하는 법:
                </p>
                <div className="p-3.5 rounded-xl bg-[#EFE8DC] border border-[#E2D8C7] space-y-2">
                  <p>
                    1. 화면 맨 아래 가운데에 있는 <b>[ 공유 📤 (네모 위 화살표) ]</b> 버튼을 누르세요.
                  </p>
                  <p>
                    2. 메뉴를 살짝 내려서 <b>[ 홈 화면에 추가 ➕ ]</b>를 누르면 완료됩니다!
                  </p>
                </div>
              </div>
            )}

            {installGuideType === 'kakao-ios' && (
              <div className="space-y-3 text-xs sm:text-[13px] text-[#3D352E] leading-relaxed break-keep">
                <p className="font-bold text-[#221D18]">
                  카카오톡에서 아이폰 홈 화면에 추가하는 법:
                </p>
                <div className="p-3.5 rounded-xl bg-[#EFE8DC] border border-[#E2D8C7] space-y-2">
                  <p>
                    1. 화면 오른쪽 맨 아래의 <b>[ 공유 📤 ]</b> 버튼을 누르고 <b>[ Safari로 열기 ]</b>를 선택하세요.
                  </p>
                  <p>
                    2. 사파리가 열리면 하단 가운데 <b>[ 공유 📤 ] &rarr; [ 홈 화면에 추가 ]</b>를 누르면 완료됩니다!
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setInstallGuideType('none')}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#3A3129] text-[#F9F5EE] text-xs font-bold hover:bg-[#221D18] transition-colors"
            >
              확인했어요
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
