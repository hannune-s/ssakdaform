"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Share2,
  Calendar,
  Sparkles,
  ChevronRight,
  ExternalLink,
  PenSquare,
  MapPin,
  Phone,
  Clock,
  X,
  Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface HanookPost {
  id: number;
  created_at: string;
  title: string;
  content: string;
  imageUrl?: string;
  dateLabel?: string;
  tag?: string;
  likes?: number;
}

export interface HanookConfig {
  blogTitle: string;
  blogSubtitle: string;
  introText: string;
  ownerName: string;
  storeName: string;
  phone: string;
  address: string;
  hours: string;
  ctaTitle: string;
  ctaUrl: string;
}

export const DEFAULT_HANOOK_CONFIG: HanookConfig = {
  blogTitle: "L’atelier de Song",
  blogSubtitle: "진심이 담긴, 꽃,육점 — 라틀리에 드 송",
  introText:
    "이곳은 저의 작업실이자 갤러리입니다.\n오랜 세월 동안 정성으로 만들어온 작품들과 앞으로 만들어갈 이야기, 그리고 매일 기록하고 싶은 꽃육점의 소소한 순간들을 담아가려고 합니다.",
  ownerName: "송하나",
  storeName: "(주) 꽃육점 - HANOOK",
  phone: "031-984-9389",
  address: "김포시 양촌읍 양곡3로1번길 92 1층",
  hours: "매일 정성껏 준비합니다",
  ctaTitle: "꽃육점 단골 등록 & 세일소식 받기",
  ctaUrl: "/f/j00337/1"
};

export default function HanookMiniBlogPage() {
  const [config, setConfig] = useState<HanookConfig>(DEFAULT_HANOOK_CONFIG);
  const [posts, setPosts] = useState<HanookPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<HanookPost | null>(null);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [showStoreInfo, setShowStoreInfo] = useState(false);

  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('hanook_liked_posts');
      if (savedLikes) setLikedIds(JSON.parse(savedLikes));
    } catch (e) {}

    loadHanookData();
  }, []);

  async function loadHanookData() {
    setIsLoading(true);
    try {
      const { data: rows } = await supabase
        .from('ssakdaform_responses')
        .select('*')
        .eq('store_id', 'hanook')
        .order('created_at', { ascending: false });

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
            created_at: r.created_at,
            title: r.data?.title || '',
            content: r.data?.content || '',
            imageUrl: r.data?.imageUrl || '',
            dateLabel: r.data?.dateLabel || '',
            tag: r.data?.tag || '오늘의 이야기',
            likes: Number(r.data?.likes || 0)
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
      const week = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
      return `${y}. ${m}. ${day} (${week})`;
    } catch {
      return '';
    }
  };

  const handleToggleLike = async (post: HanookPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const alreadyLiked = likedIds.includes(post.id);
    const nextLikes = Math.max(0, (post.likes || 0) + (alreadyLiked ? -1 : 1));
    const nextLikedIds = alreadyLiked
      ? likedIds.filter(id => id !== post.id)
      : [...likedIds, post.id];

    setLikedIds(nextLikedIds);
    try {
      localStorage.setItem('hanook_liked_posts', JSON.stringify(nextLikedIds));
    } catch {}

    setPosts(prev =>
      prev.map(p => (p.id === post.id ? { ...p, likes: nextLikes } : p))
    );
    if (selectedPost?.id === post.id) {
      setSelectedPost({ ...selectedPost, likes: nextLikes });
    }

    try {
      const { data: row } = await supabase
        .from('ssakdaform_responses')
        .select('data')
        .eq('id', post.id)
        .maybeSingle();

      if (row?.data) {
        await supabase
          .from('ssakdaform_responses')
          .update({ data: { ...row.data, likes: nextLikes } })
          .eq('id', post.id);
      }
    } catch {}
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: `${config.storeName} | ${config.blogTitle}`,
          text: config.blogSubtitle,
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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C221E] pb-16 selection:bg-purple-200">
      {/* 상단 미니홈피 감성 헤더 바 */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E0D5]">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5B21B6] shrink-0" />
            <span className="font-serif italic font-bold text-[15px] text-[#3B0764] truncate">
              {config.blogTitle}
            </span>
            <span className="text-xs text-[#8C7A6B] font-medium hidden sm:inline">
              | {config.storeName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-[#E2D9CC] text-[#4A3B32] hover:border-[#5B21B6] hover:text-[#5B21B6] text-xs font-bold transition-colors shadow-2xs"
              title="주소 공유하기"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>복사됨</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>공유</span>
                </>
              )}
            </button>
            <Link
              href="/hanook/admin"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#3B0764] text-white hover:bg-[#5B21B6] text-xs font-bold transition-colors shadow-2xs"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>글쓰기</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 pt-6">
        {/* 미니홈피 프로필 & 작업실 소개 카드 */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2E054E] via-[#3B0764] to-[#5B21B6] text-white p-6 sm:p-8 shadow-[0_14px_34px_rgba(59,7,100,0.22)] mb-6">
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '18px 18px'
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-purple-100 text-[11px] font-bold tracking-wide mb-3 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>HANOOK MINI STORY</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              {config.blogTitle}
            </h1>
            <p className="text-sm sm:text-[15px] font-bold text-purple-200 mt-1">
              {config.blogSubtitle}
            </p>

            <div className="w-10 h-0.5 bg-amber-300/80 my-4 rounded-full" />

            <p className="text-[13.5px] sm:text-sm text-purple-50/95 leading-relaxed whitespace-pre-line font-medium break-keep">
              {config.introText}
            </p>

            {/* 하단 액션 버튼 영역 */}
            <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setShowStoreInfo(!showStoreInfo)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/12 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/15"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>매장 안내 {showStoreInfo ? '닫기' : '보기'}</span>
              </button>

              {config.ctaUrl && (
                <Link
                  href={config.ctaUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#2E054E] text-xs sm:text-[13px] font-black transition-all shadow-sm"
                >
                  <span>{config.ctaTitle || '단골 등록 & 소식 받기'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* 매장 상세 정보 접기/펼치기 */}
            {showStoreInfo && (
              <div className="mt-3 p-4 rounded-2xl bg-black/25 border border-white/10 text-xs text-purple-100 space-y-1.5 animate-fadeIn">
                <p className="font-bold text-white text-[13px]">{config.storeName}</p>
                {config.ownerName && <p>• 대표: {config.ownerName}</p>}
                {config.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <a href={`tel:${config.phone}`} className="underline hover:text-white">
                      {config.phone}
                    </a>
                  </p>
                )}
                {config.address && (
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>{config.address}</span>
                  </p>
                )}
                {config.hours && (
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>{config.hours}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 오늘의 이야기 섹션 타이틀 */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#2C221E] tracking-tight">
              꽃육점의 소소한 이야기
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#5B21B6] text-xs font-extrabold">
              {posts.length}
            </span>
          </div>
          <span className="text-xs font-semibold text-[#8C7A6B]">
            최신순
          </span>
        </div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div
                key={n}
                className="bg-white rounded-3xl p-5 border border-[#EAE2D6] shadow-xs animate-pulse"
              >
                <div className="h-4 w-28 bg-gray-200 rounded mb-3" />
                <div className="h-56 w-full bg-gray-200 rounded-2xl mb-4" />
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          /* 아직 등록된 글이 없을 때 */
          <div className="bg-white rounded-3xl p-10 text-center border border-[#EAE2D6] shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#5B21B6] flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-[#2C221E] mb-1">
              첫 번째 이야기를 준비 중입니다
            </h3>
            <p className="text-xs text-[#8C7A6B] leading-relaxed mb-5">
              곧 꽃육점의 신선한 일상과 따뜻한 이야기가 이곳에 채워집니다.
            </p>
            <Link
              href="/hanook/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5B21B6] text-white text-xs font-extrabold hover:bg-[#3B0764] transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              <span>사장님 첫 글 작성하기</span>
            </Link>
          </div>
        ) : (
          /* 이야기 카드 리스트 */
          <div className="space-y-5">
            {posts.map(post => {
              const isLiked = likedIds.includes(post.id);
              return (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-3xl overflow-hidden border border-[#EAE2D6] hover:border-purple-300 shadow-[0_6px_20px_rgba(44,34,30,0.05)] transition-all cursor-pointer group"
                >
                  {/* 상단 날짜 & 태그 헤더 */}
                  <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5B21B6] text-[11px] font-extrabold border border-purple-100">
                        {post.tag || '오늘의 이야기'}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#8C7A6B]">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.created_at, post.dateLabel)}
                      </span>
                    </div>
                  </div>

                  {/* 사진 (있을 경우) */}
                  {post.imageUrl && (
                    <div className="px-4">
                      <div className="relative w-full overflow-hidden rounded-2xl bg-[#F5F0E8] border border-[#EFE8DC]">
                        <img
                          src={post.imageUrl}
                          alt={post.title || '꽃육점 이야기 사진'}
                          className="w-full max-h-[440px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  {/* 제목 & 본문 */}
                  <div className="p-5">
                    {post.title && (
                      <h3 className="text-[17px] sm:text-[18px] font-black text-[#231915] leading-snug mb-2 break-keep">
                        {post.title}
                      </h3>
                    )}
                    <p className="text-[14px] sm:text-[14.5px] text-[#4A3B32] leading-relaxed whitespace-pre-line break-keep">
                      {post.content}
                    </p>

                    {/* 하단 공감(하트) 바 */}
                    <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={e => handleToggleLike(post, e)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                          isLiked
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-[#F8F5F0] text-[#6E5D4F] hover:bg-rose-50 hover:text-rose-600 border border-transparent'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isLiked ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                        <span>공감해요</span>
                        {(post.likes || 0) > 0 && <span>{post.likes}</span>}
                      </button>

                      <span className="text-[11.5px] font-bold text-[#9C8B7A] group-hover:text-[#5B21B6] transition-colors">
                        자세히 보기 &gt;
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 하단 푸터 */}
        <footer className="mt-12 pt-6 border-t border-[#E6DEC8] text-center text-xs text-[#8C7A6B] space-y-1">
          <p className="font-bold text-[#5C4D42]">
            {config.storeName} | {config.blogTitle}
          </p>
          {config.address && <p>{config.address}</p>}
          {config.phone && <p>문의: {config.phone}</p>}
        </footer>
      </div>

      {/* 글 상세 보기 모달 */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#EAE2D6] my-auto max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5B21B6] text-[11px] font-extrabold">
                  {selectedPost.tag || '오늘의 이야기'}
                </span>
                <span className="text-xs font-semibold text-[#8C7A6B]">
                  {formatDate(selectedPost.created_at, selectedPost.dateLabel)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {selectedPost.imageUrl && (
                <div className="rounded-2xl overflow-hidden bg-[#F5F0E8] border border-[#EFE8DC]">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title || '꽃육점 사진'}
                    className="w-full max-h-[520px] object-contain mx-auto"
                  />
                </div>
              )}

              {selectedPost.title && (
                <h3 className="text-xl font-black text-[#231915] leading-snug break-keep">
                  {selectedPost.title}
                </h3>
              )}

              <p className="text-[15px] text-[#3D3028] leading-relaxed whitespace-pre-line break-keep">
                {selectedPost.content}
              </p>
            </div>

            <div className="px-5 py-3.5 border-t border-gray-100 bg-[#FAF7F2] flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleLike(selectedPost)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                  likedIds.includes(selectedPost.id)
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-white text-[#6E5D4F] border border-[#E2D9CC]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedIds.includes(selectedPost.id) ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                <span>공감해요 {(selectedPost.likes || 0) > 0 ? selectedPost.likes : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 rounded-xl bg-[#3B0764] text-white text-xs font-extrabold hover:bg-[#5B21B6]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
