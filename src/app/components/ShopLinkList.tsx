"use client";

import { ChevronRight } from 'lucide-react';

interface ShopLinkItem {
  title?: string;
  url?: string;
  subtitle?: string;
}

export default function ShopLinkList({
  links,
  storeId,
  hideDefaultDelivery = false,
  className = "mb-4 space-y-2"
}: {
  links?: ShopLinkItem[];
  storeId?: string;
  hideDefaultDelivery?: boolean;
  className?: string;
}) {
  const rawLinks = Array.isArray(links)
    ? links.filter(l => l && l.url && String(l.url).trim() !== '')
    : [];

  const hasCustomDeliveryLink = rawLinks.some(l => {
    const t = String(l.title || '');
    const u = String(l.url || '');
    return t.includes('택배') || u.includes('delivery-preset');
  });

  const validLinks: ShopLinkItem[] = [...rawLinks];
  if (!hideDefaultDelivery && storeId && !hasCustomDeliveryLink) {
    validLinks.unshift({
      title: '택배 신청해요~',
      subtitle: '간편 택배 발송 신청',
      url: `/form/delivery-preset?store=${encodeURIComponent(storeId)}`
    });
  }

  if (validLinks.length === 0) return null;

  const isBlogItem = (item: ShopLinkItem) => {
    const t = String(item.title || '').toLowerCase();
    const u = String(item.url || '').toLowerCase();
    return (
      t.includes('기록') ||
      t.includes('블로그') ||
      t.includes('이야기') ||
      u.includes('/hanook') ||
      u.includes('blog')
    );
  };

  const isDealItem = (item: ShopLinkItem) => {
    const t = String(item.title || '').toLowerCase();
    const u = String(item.url || '').toLowerCase();
    return (
      t.includes('득템') ||
      t.includes('세일') ||
      t.includes('특가') ||
      t.includes('할인') ||
      u.includes('/sale')
    );
  };

  const getCompactMeta = (linkItem: ShopLinkItem, displayTitle: string, isFullRow: boolean) => {
    const customSub = String(linkItem.subtitle || '').trim();
    const blog = isBlogItem(linkItem);
    const isDealLink = isDealItem(linkItem);
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
            ? '홈화면에 꼭 추가해주세요! 실시간 세일·득템 소식'
            : '세일소식 · 홈화면 추가'),
        actionLabel: '세일소식 받기'
      };
    }

    if (isDeliveryLink) {
      return {
        subtitle:
          customSub ||
          (isFullRow
            ? '간편한 택배 발송 신청은 여기에서'
            : '간편 택배 발송 신청'),
        actionLabel: '접수하기'
      };
    }

    return {
      subtitle: customSub || '터치하여 바로 이동',
      actionLabel: '보러가기'
    };
  };

  const renderCard = (linkItem: ShopLinkItem, idx: number, isFullRow: boolean) => {
    const rawUrl = String(linkItem.url || '').trim();
    const isInternalForm =
      rawUrl.startsWith('/form/') ||
      rawUrl.startsWith('/f/') ||
      rawUrl.includes('delivery-preset') ||
      rawUrl.includes('resume-preset');
    const targetUrl =
      rawUrl.startsWith('http') || rawUrl.startsWith('/') ? rawUrl : `https://${rawUrl}`;
    const displayTitle = linkItem.title || '바로가기';
    const blog = isBlogItem(linkItem);
    const deal = isDealItem(linkItem);
    const { subtitle, actionLabel } = getCompactMeta(linkItem, displayTitle, isFullRow);

    // 1. 상단 1줄 전체 폭 카드 (소소한 기록 블로그 또는 1줄 단독 내가먼저 득템!)
    if (isFullRow) {
      if (deal) {
        return (
          <a
            key={idx}
            href={targetUrl}
            target={isInternalForm ? "_self" : "_blank"}
            rel="noreferrer"
            className="w-full px-3.5 sm:px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFF1F2] via-[#FFF5F5] to-[#FFE4E6] hover:from-[#FFE4E6] hover:to-[#FECDD3] border-2 border-rose-300 hover:border-rose-400 shadow-[0_4px_12px_rgba(225,29,72,0.10)] transition-all flex items-center justify-between gap-2.5 group active:scale-[0.99]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-[14.5px] sm:text-[15px] font-black text-rose-950 tracking-tight break-keep">
                  {displayTitle}
                </p>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-extrabold">
                  실시간 특가
                </span>
              </div>
              <p className="text-[11.5px] sm:text-[12px] font-bold text-rose-800/90 mt-0.5 break-keep">
                {subtitle}
              </p>
            </div>
            <div className="flex items-center gap-0.5 px-3 py-1.5 rounded-lg bg-rose-600 group-hover:bg-rose-700 text-white text-[11.5px] font-extrabold shadow-xs transition-colors shrink-0">
              <span>{actionLabel}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </a>
        );
      }

      return (
        <a
          key={idx}
          href={targetUrl}
          target={isInternalForm ? "_self" : "_blank"}
          rel="noreferrer"
          className={`w-full px-3.5 sm:px-4 py-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 group active:scale-[0.99] ${
            blog
              ? 'bg-gradient-to-r from-[#F3E8FF] via-[#F8F2FF] to-[#EDE9FE] hover:from-[#E9D5FF] hover:to-[#DDD6FE] border-[#C4B5FD] shadow-2xs'
              : 'bg-white hover:bg-purple-50/40 border-purple-200 shadow-2xs'
          }`}
        >
          <div className="min-w-0 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <p className="text-[14px] sm:text-[14.5px] font-black text-[#3B0764] tracking-tight break-keep">
              {displayTitle}
            </p>
            <p className="text-[11.5px] sm:text-[12px] font-semibold text-[#6D28D9]/85 break-keep">
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

    // 2. 2열 컴팩트 슬림 버튼 (득템/세일 링크인 경우에도 화사한 로즈 톤으로 강조)
    if (deal) {
      return (
        <a
          key={idx}
          href={targetUrl}
          target={isInternalForm ? "_self" : "_blank"}
          rel="noreferrer"
          className="px-3 sm:px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFF1F2] to-[#FFE4E6] hover:from-[#FFE4E6] hover:to-[#FECDD3] border-2 border-rose-300 hover:border-rose-400 shadow-2xs transition-all flex items-center justify-between gap-1.5 group active:scale-[0.99]"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[13px] sm:text-[14px] font-black text-rose-950 tracking-tight leading-snug break-keep">
              {displayTitle}
            </p>
            <p className="text-[11px] sm:text-[11.5px] font-bold text-rose-700 leading-snug mt-0.5 break-keep">
              {subtitle}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </a>
      );
    }

    return (
      <a
        key={idx}
        href={targetUrl}
        target={isInternalForm ? "_self" : "_blank"}
        rel="noreferrer"
        className="px-3 sm:px-3.5 py-2.5 rounded-xl bg-white hover:bg-purple-50/50 border border-purple-200/90 hover:border-[#7C3AED] shadow-2xs transition-all flex items-center justify-between gap-1.5 group active:scale-[0.99]"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[13px] sm:text-[14px] font-black text-[#3B0764] tracking-tight leading-snug break-keep">
            {displayTitle}
          </p>
          <p className="text-[11px] sm:text-[11.5px] font-semibold text-gray-500 leading-snug mt-0.5 break-keep">
            {subtitle}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#7C3AED] group-hover:translate-x-0.5 transition-transform shrink-0" />
      </a>
    );
  };

  // 블로그(소소한 기록)는 언제나 상단 1줄 전체 모양 고정, 나머지 링크가 1개면 1줄 전체 폭으로 강조, 2개 이상이면 2열 배치
  const blogLinks = validLinks.filter(isBlogItem);
  const otherLinks = validLinks.filter(l => !isBlogItem(l));

  return (
    <div className={className}>
      {blogLinks.map((item, idx) => renderCard(item, idx, true))}

      {otherLinks.length >= 2 ? (
        <div className="grid grid-cols-2 gap-2">
          {otherLinks.map((item, idx) => renderCard(item, 100 + idx, false))}
        </div>
      ) : (
        otherLinks.map((item, idx) => renderCard(item, 100 + idx, true))
      )}
    </div>
  );
}
