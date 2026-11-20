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

  const getPlatformIcon = (titleStr: string, urlStr: string) => {
    const combined = `${titleStr} ${urlStr}`.toLowerCase();

    // 인스타그램: 화려한 배경 컬러 없이 깔끔한 작은 라인 로고만 표시
    if (
      combined.includes('instagram.com') ||
      combined.includes('instagr.am') ||
      combined.includes('인스타') ||
      combined.includes('insta')
    ) {
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    }

    return <ShoppingBag className="w-4 h-4" />;
  };

  return (
    <div className={className}>
      {validLinks.map((linkItem, idx) => {
        const rawUrl = String(linkItem.url || '').trim();
        const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
        const displayTitle = linkItem.title || '공식 쇼핑몰 바로가기';

        return (
          <a
            key={idx}
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full p-3.5 rounded-2xl bg-white hover:bg-purple-50/60 border-2 border-purple-200 hover:border-purple-400 shadow-xs transition-all flex items-center justify-between gap-3 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#5B21B6] flex items-center justify-center shrink-0">
                {getPlatformIcon(displayTitle, rawUrl)}
              </div>
              <div className="min-w-0">
                <p className="text-[14.5px] font-extrabold text-purple-950 truncate">
                  {displayTitle}
                </p>
                <p className="text-[12px] font-semibold text-gray-600 truncate mt-0.5">
                  클릭하여 사이트로 바로 이동합니다
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-800 group-hover:bg-[#5B21B6] group-hover:text-white text-[11.5px] font-extrabold transition-colors shrink-0">
              <span>바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
