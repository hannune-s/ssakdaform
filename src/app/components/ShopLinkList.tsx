"use client";

import { ShoppingBag, ExternalLink } from 'lucide-react';

interface ShopLinkItem {
  title?: string;
  url?: string;
}

export default function ShopLinkList({
  links,
  className = "mb-6 space-y-2.5"
}: {
  links?: ShopLinkItem[];
  className?: string;
}) {
  if (!Array.isArray(links)) return null;
  const validLinks = links.filter(l => l && l.url && String(l.url).trim() !== '');
  if (validLinks.length === 0) return null;

  const getPlatformMeta = (titleStr: string, urlStr: string) => {
    const combined = `${titleStr} ${urlStr}`.toLowerCase();

    // 1. 인스타그램
    if (
      combined.includes('instagram.com') ||
      combined.includes('instagr.am') ||
      combined.includes('인스타') ||
      combined.includes('insta')
    ) {
      return {
        type: 'instagram',
        badgeClass: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-xs',
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        )
      };
    }

    // 2. 카카오톡 / 오픈채팅 / 채널
    if (
      combined.includes('kakao.com') ||
      combined.includes('PF.kakao') ||
      combined.includes('카톡') ||
      combined.includes('카카오') ||
      combined.includes('오픈채팅')
    ) {
      return {
        type: 'kakao',
        badgeClass: 'bg-[#FEE500] text-[#3C1E1E] shadow-xs',
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4C6.48 4 2 7.52 2 11.85c0 2.79 1.86 5.24 4.65 6.62-.15.56-.56 2.04-.64 2.36-.1.39.14.39.3.28.12-.08 1.94-1.32 2.73-1.85.95.14 1.94.21 2.96.21 5.52 0 10-3.52 10-7.85S17.52 4 12 4z" />
          </svg>
        )
      };
    }

    // 3. 유튜브
    if (
      combined.includes('youtube.com') ||
      combined.includes('youtu.be') ||
      combined.includes('유튜브')
    ) {
      return {
        type: 'youtube',
        badgeClass: 'bg-[#FF0000] text-white shadow-xs',
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.54 15.57V8.43L15.82 12l-6.28 3.57z" />
          </svg>
        )
      };
    }

    // 4. 네이버 스마트스토어 / 블로그 / 밴드 / 플레이스
    if (
      combined.includes('naver.com') ||
      combined.includes('band.us') ||
      combined.includes('네이버') ||
      combined.includes('스마트스토어') ||
      combined.includes('밴드') ||
      combined.includes('블로그')
    ) {
      return {
        type: 'naver',
        badgeClass: 'bg-[#03C75A] text-white shadow-xs',
        icon: (
          <span className="font-black text-[15px] leading-none tracking-tighter">N</span>
        )
      };
    }

    // 5. 기본 쇼핑몰 / 일반 외부 링크
    return {
      type: 'shop',
      badgeClass: 'bg-purple-100 text-[#5B21B6]',
      icon: <ShoppingBag className="w-5 h-5" />
    };
  };

  return (
    <div className={className}>
      {validLinks.map((linkItem, idx) => {
        const rawUrl = String(linkItem.url || '').trim();
        const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
        const displayTitle = linkItem.title || '공식 쇼핑몰 바로가기';
        const platform = getPlatformMeta(displayTitle, rawUrl);

        return (
          <a
            key={idx}
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-purple-50/60 border-2 border-purple-200 hover:border-purple-400 shadow-xs transition-all flex items-center justify-between gap-3 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${platform.badgeClass}`}
              >
                {platform.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[14.5px] sm:text-[15.5px] font-extrabold text-purple-950 truncate">
                  {displayTitle}
                </p>
                <p className="text-[12px] sm:text-[12.5px] font-semibold text-gray-600 truncate mt-0.5">
                  클릭하여 사이트로 바로 이동합니다
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 group-hover:bg-[#5B21B6] group-hover:text-white text-[12px] font-extrabold transition-colors shrink-0">
              <span>바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
