"use client";

import { ChevronRight } from 'lucide-react';

interface ShopLinkItem {
  title?: string;
  url?: string;
  subtitle?: string;
}

export default function ShopLinkList({
  links,
  className = "mb-4 space-y-2"
}: {
  links?: ShopLinkItem[];
  className?: string;
}) {
  if (!Array.isArray(links)) return null;
  const validLinks = links.filter(l => l && l.url && String(l.url).trim() !== '');
  if (validLinks.length === 0) return null;

  const isBlogItem = (item: ShopLinkItem) => {
    const t = String(item.title || '').toLowerCase();
    const u = String(item.url || '').toLowerCase();
    return (
      t.includes('기록') ||
      t.includes('블로그') ||
      t.includes('이야기') ||
      t.includes('일상') ||
      u.includes('/hanook') ||
      u.includes('blog')
    );
  };

  const getCompactMeta = (linkItem: ShopLinkItem, displayTitle: string, isFullRow: boolean) => {
    const customSub = String(linkItem.subtitle || '').trim();
    const blog = isBlogItem(linkItem);
    const isDealLink =
      displayTitle.includes('득템') ||
      displayTitle.includes('세일') ||
      displayTitle.includes('특가') ||
      displayTitle.includes('할인');
    const isDeliveryLink =
      displayTitle.includes('택배') ||
      displayTitle.includes('배송');

    if (blog) {
      return {
        subtitle: customSub || '꽃육점의 일상속으로,',
        actionLabel: '블로그 보기'
      };
    }

    if (isDealLink) {
      return {
        subtitle:
          customSub ||
          (isFullRow
            ? '세일소식을 바로 받는 링크 (홈화면에 추가)'
            : '세일소식 · 홈화면 추가'),
        actionLabel: '소식받기'
      };
    }

    if (isDeliveryLink) {
      return {
        subtitle:
          customSub ||
          (isFullRow
            ? '간편한 택배 발송 신청은 여기에서'
            : '간편 택배 발송 접수'),
        actionLabel: '접수하기'
      };
    }

    return {
      subtitle: customSub || '터치하여 바로 이동',
      actionLabel: '보러가기'
    };
  };

  let orderedLinks = [...validLinks];
  const blogIdx = orderedLinks.findIndex(isBlogItem);
  if (orderedLinks.length === 3 && blogIdx > 0) {
    const [blogItem] = orderedLinks.splice(blogIdx, 1);
    orderedLinks = [blogItem, ...orderedLinks];
  }

  const renderCard = (linkItem: ShopLinkItem, idx: number, isFullRow: boolean) => {
    const rawUrl = String(linkItem.url || '').trim();
    const targetUrl =
      rawUrl.startsWith('http') || rawUrl.startsWith('/') ? rawUrl : `https://${rawUrl}`;
    const displayTitle = linkItem.title || '바로가기';
    const blog = isBlogItem(linkItem);
    const { subtitle, actionLabel } = getCompactMeta(linkItem, displayTitle, isFullRow);

    // 1. 상단 1칸 (소소한 기록 등): 아이콘/뱃지 없이 슬림하고 화사한 연보라 톤
    if (isFullRow) {
      return (
        <a
          key={idx}
          href={targetUrl}
          target="_blank"
          rel="noreferrer"
          className={`w-full px-4 py-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 group active:scale-[0.99] ${
            blog
              ? 'bg-gradient-to-r from-[#F3E8FF] via-[#F8F2FF] to-[#EDE9FE] hover:from-[#E9D5FF] hover:to-[#DDD6FE] border-[#C4B5FD] shadow-2xs'
              : 'bg-white hover:bg-purple-50/40 border-purple-200 shadow-2xs'
          }`}
        >
          <div className="min-w-0 flex items-baseline gap-2 flex-wrap">
            <p className="text-[14.5px] font-black text-[#3B0764] tracking-tight">
              {displayTitle}
            </p>
            <p className="text-[12px] font-semibold text-[#6D28D9]/80 truncate">
              {subtitle}
            </p>
          </div>
          <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-[#5B21B6] group-hover:bg-[#3B0764] text-white text-[11px] font-extrabold transition-colors shrink-0">
            <span>{actionLabel}</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </a>
      );
    }

    // 2. 하단 2열 슬림 버튼 (아이콘 없이 높이 확 줄인 컴팩트 박스)
    return (
      <a
        key={idx}
        href={targetUrl}
        target="_blank"
        rel="noreferrer"
        className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-purple-50/50 border border-purple-200/90 hover:border-[#7C3AED] shadow-2xs transition-all flex items-center justify-between gap-2 group active:scale-[0.99]"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] sm:text-[14px] font-black text-[#3B0764] tracking-tight leading-tight truncate">
            {displayTitle}
          </p>
          <p className="text-[11px] font-semibold text-gray-500 leading-tight mt-0.5 truncate">
            {subtitle}
          </p>
        </div>
        <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-purple-50 text-[#5B21B6] group-hover:bg-[#5B21B6] group-hover:text-white text-[10.5px] font-extrabold transition-colors shrink-0">
          <span>{actionLabel}</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </a>
    );
  };

  if (orderedLinks.length === 3) {
    return (
      <div className={className}>
        {renderCard(orderedLinks[0], 0, true)}
        <div className="grid grid-cols-2 gap-2">
          {renderCard(orderedLinks[1], 1, false)}
          {renderCard(orderedLinks[2], 2, false)}
        </div>
      </div>
    );
  }

  if (orderedLinks.length === 2) {
    return (
      <div className={className}>
        <div className="grid grid-cols-2 gap-2">
          {renderCard(orderedLinks[0], 0, false)}
          {renderCard(orderedLinks[1], 1, false)}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {orderedLinks.map((item, idx) => renderCard(item, idx, true))}
    </div>
  );
}
