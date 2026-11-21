"use client";

import { ShoppingBag, ChevronRight, Package, Sparkles } from 'lucide-react';

interface ShopLinkItem {
  title?: string;
  url?: string;
  subtitle?: string;
}

export default function ShopLinkList({
  links,
  className = "mb-6 space-y-3"
}: {
  links?: ShopLinkItem[];
  className?: string;
}) {
  if (!Array.isArray(links)) return null;
  const validLinks = links.filter(l => l && l.url && String(l.url).trim() !== '');
  if (validLinks.length === 0) return null;

  const getPlatformIcon = (titleStr: string, urlStr: string) => {
    const combined = `${titleStr} ${urlStr}`.toLowerCase();

    if (
      combined.includes('instagram.com') ||
      combined.includes('instagr.am') ||
      combined.includes('인스타') ||
      combined.includes('insta')
    ) {
      return (
        <svg
          className="w-5 h-5"
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

    if (titleStr.includes('택배') || titleStr.includes('배송')) {
      return <Package className="w-5 h-5" />;
    }

    if (
      titleStr.includes('득템') ||
      titleStr.includes('세일') ||
      titleStr.includes('특가') ||
      titleStr.includes('할인')
    ) {
      return <Sparkles className="w-5 h-5" />;
    }

    return <ShoppingBag className="w-5 h-5" />;
  };

  const getSubtitleAndAction = (linkItem: ShopLinkItem, displayTitle: string) => {
    const customSub = String(linkItem.subtitle || '').trim();
    const isDealLink =
      displayTitle.includes('득템') ||
      displayTitle.includes('세일') ||
      displayTitle.includes('특가') ||
      displayTitle.includes('할인');
    const isDeliveryLink =
      displayTitle.includes('택배') ||
      displayTitle.includes('배송');

    if (isDealLink) {
      return {
        subtitle:
          customSub ||
          '세일·특가 소식을 바로 받는 링크! 득템 기회를 얻으려면 접속 후 홈 화면에 꼭 추가하세요.',
        actionLabel: '소식받기'
      };
    }

    if (isDeliveryLink) {
      return {
        subtitle:
          customSub ||
          '간편한 택배 발송 신청은 여기에서 바로 접수해 주세요.',
        actionLabel: '접수하기'
      };
    }

    return {
      subtitle: customSub || '터치하여 매장 공식 페이지로 바로 이동합니다.',
      actionLabel: '보러가기'
    };
  };

  return (
    <div className={className}>
      {validLinks.map((linkItem, idx) => {
        const rawUrl = String(linkItem.url || '').trim();
        const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
        const displayTitle = linkItem.title || '공식 쇼핑몰 바로가기';
        const { subtitle, actionLabel } = getSubtitleAndAction(linkItem, displayTitle);

        return (
          <a
            key={idx}
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full p-4 rounded-2xl bg-white hover:bg-purple-50/40 border-2 border-[#7C3AED]/40 hover:border-[#5B21B6] shadow-[0_4px_14px_rgba(91,33,182,0.08)] transition-all flex items-center justify-between gap-3.5 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-[#5B21B6] flex items-center justify-center shrink-0">
                {getPlatformIcon(displayTitle, rawUrl)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] sm:text-[16.5px] font-black text-[#3B0764] tracking-tight leading-snug">
                  {displayTitle}
                </p>
                <p className="text-[12.5px] font-semibold text-gray-600 leading-snug mt-0.5 break-keep">
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 pl-3 pr-2.5 py-1.5 rounded-xl bg-purple-100/90 text-[#4C1D95] group-hover:bg-[#5B21B6] group-hover:text-white text-[12px] font-extrabold transition-colors shrink-0">
              <span>{actionLabel}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
