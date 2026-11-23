"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Camera,
  Trash2,
  Edit3,
  Plus,
  Check,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Settings,
  Lock,
  Image as ImageIcon,
  Calendar,
  Save,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getActiveStoreId, getLoggedInStore } from '@/lib/storeSession';
import { verifyPassword, hashPassword } from '@/lib/passwordCrypto';
import {
  DEFAULT_HANOOK_CONFIG,
  HanookConfig,
  HanookPost
} from '../page';

// 암호화된 해시값으로만 비교 (j00337)
const HANOOK_ADMIN_HASH =
  'cfda75eaf6e085d316a9d803906d7f0d529e6b8f44e2d18fb95a7623e12ff6b0';

// 휴대폰 고화질 사진을 선명도는 그대로 유지하면서 용량만 ~80-140KB(WebP)로 줄이는 함수
async function compressImageForSupabase(file: File): Promise<{
  dataUrl: string;
  originalKB: number;
  compressedKB: number;
  width: number;
  height: number;
}> {
  const originalKB = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'));
      img.onload = () => {
        // 스마트폰 레티나 화면에서도 선명한 최적 해상도 (최대 1080px)
        const MAX_SIDE = 1080;
        let targetW = img.width;
        let targetH = img.height;

        if (targetW > MAX_SIDE || targetH > MAX_SIDE) {
          if (targetW >= targetH) {
            targetH = Math.round((targetH * MAX_SIDE) / targetW);
            targetW = MAX_SIDE;
          } else {
            targetW = Math.round((targetW * MAX_SIDE) / targetH);
            targetH = MAX_SIDE;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('캔버스를 초기화하지 못했습니다.'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // 1차: WebP 고화질(0.84) 시도
        let dataUrl = canvas.toDataURL('image/webp', 0.84);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.84);
        }

        // 만약 사진 디테일이 매우 복잡해서 170KB를 넘으면 0.76으로 한 번 더 깔끔하게 다이어트
        let compressedKB = Math.round((dataUrl.length * 3) / 4 / 1024);
        if (compressedKB > 170) {
          dataUrl = canvas.toDataURL('image/webp', 0.76);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.76);
          }
          compressedKB = Math.round((dataUrl.length * 3) / 4 / 1024);
        }

        resolve({
          dataUrl,
          originalKB,
          compressedKB,
          width: targetW,
          height: targetH
        });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

const TAG_OPTIONS = [
  '오늘의 이야기',
  '작업실 노트',
  '오늘의 한우·작품',
  '단골 식구들께',
  '소소한 일상'
];

export default function HanookAdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [posts, setPosts] = useState<HanookPost[]>([]);
  const [config, setConfig] = useState<HanookConfig>(DEFAULT_HANOOK_CONFIG);
  const [configRowId, setConfigRowId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 글 작성 / 수정 폼 상태
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dateLabel, setDateLabel] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageStats, setImageStats] = useState<{
    originalKB: number;
    compressedKB: number;
    width: number;
    height: number;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 상단 미니홈피 소개글 설정 열기/닫기
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 이미 j00337 사장님으로 로그인되어 있거나 이전에 인증했으면 바로 열림
    try {
      const activeId = getActiveStoreId();
      const loggedIn = getLoggedInStore();
      const savedUnlock = sessionStorage.getItem('hanook_admin_unlocked');
      if (
        activeId === 'j00337' ||
        loggedIn?.store_id === 'j00337' ||
        savedUnlock === 'true'
      ) {
        setIsUnlocked(true);
      }
    } catch {}

    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const { data: rows } = await supabase
        .from('ssakdaform_responses')
        .select('*')
        .eq('store_id', 'hanook')
        .order('id', { ascending: false });

      if (rows && rows.length > 0) {
        const cfgRow = rows.find((r: any) => r.form_id === '__hanook_config__');
        if (cfgRow) {
          setConfigRowId(cfgRow.id);
          if (cfgRow.data) {
            setConfig({ ...DEFAULT_HANOOK_CONFIG, ...cfgRow.data });
          }
        }

        const postRows = rows
          .filter((r: any) => r.form_id === '__hanook_post__')
          .map((r: any) => ({
            id: r.id,
            created_at: r.submitted_at || r.created_at || new Date().toISOString(),
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
      console.error('Load error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const trimmed = pinInput.trim();
    if (!trimmed) {
      setPinError('비밀번호를 입력해 주세요.');
      return;
    }

    const inputLowerHash = await hashPassword(trimmed.toLowerCase());

    if (inputLowerHash === HANOOK_ADMIN_HASH) {
      sessionStorage.setItem('hanook_admin_unlocked', 'true');
      setIsUnlocked(true);
    } else {
      setPinError('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const result = await compressImageForSupabase(file);
      setImageUrl(result.dataUrl);
      setImageStats({
        originalKB: result.originalKB,
        compressedKB: result.compressedKB,
        width: result.width,
        height: result.height
      });
    } catch (err: any) {
      alert(err.message || '사진 처리 중 오류가 발생했습니다.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setEditingPostId(null);
    setTitle('');
    setContent('');
    setDateLabel('');
    setImageUrl('');
    setImageStats(null);
  };

  const handleEditClick = (post: HanookPost) => {
    setEditingPostId(post.id);
    setTitle(post.title || '');
    setContent(post.content || '');
    setDateLabel(post.dateLabel || '');
    setImageUrl(post.imageUrl || '');
    setImageStats(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim() && !imageUrl) {
      alert('사진이나 오늘의 이야기 내용을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const postPayload = {
        title: title.trim(),
        content: content.trim(),
        dateLabel: dateLabel.trim(),
        imageUrl
      };

      if (editingPostId) {
        const { error } = await supabase
          .from('ssakdaform_responses')
          .update({ data: postPayload })
          .eq('id', editingPostId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ssakdaform_responses')
          .insert([
            {
              store_id: 'hanook',
              form_id: '__hanook_post__',
              status: '게시중',
              data: postPayload
            }
          ]);
        if (error) throw error;
      }

      resetForm();
      await loadData();
      alert(editingPostId ? '이야기가 수정되었습니다!' : '새로운 이야기가 등록되었습니다!');
    } catch (err: any) {
      alert('저장 실패: ' + (err.message || '오류가 발생했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('이 이야기를 삭제하시겠습니까?')) return;
    try {
      const { error } = await supabase
        .from('ssakdaform_responses')
        .delete()
        .eq('id', postId);
      if (error) throw error;
      if (editingPostId === postId) resetForm();
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err: any) {
      alert('삭제 실패: ' + (err.message || '오류가 발생했습니다.'));
    }
  };

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    setConfigSaved(false);
    try {
      if (configRowId) {
        const { error } = await supabase
          .from('ssakdaform_responses')
          .update({ data: config })
          .eq('id', configRowId);
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase
          .from('ssakdaform_responses')
          .insert([
            {
              store_id: 'hanook',
              form_id: '__hanook_config__',
              status: '설정',
              data: config
            }
          ])
          .select('*')
          .maybeSingle();
        if (error) throw error;
        if (inserted) setConfigRowId(inserted.id);
      }
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 2000);
    } catch (err: any) {
      alert('설정 저장 실패: ' + (err.message || '오류'));
    } finally {
      setIsSavingConfig(false);
    }
  };

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

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm rounded-3xl p-7 shadow-xl border border-[#EAE2D6]">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5B21B6] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-center text-[#2C221E]">
            HANOOK 미니블로그 관리
          </h1>
          <p className="text-xs text-center text-[#8C7A6B] mt-1 mb-6">
            사장님 전용 글쓰기 페이지입니다.
            <br />
            매장 어드민 비밀번호를 입력해 주세요.
          </p>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              placeholder="매장 비밀번호 입력"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-purple-200 text-sm font-bold text-center"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-red-600 font-bold text-center">{pinError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#3B0764] hover:bg-[#5B21B6] text-white font-extrabold text-sm transition-colors shadow-sm"
            >
              관리 페이지 입장하기
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/hanook"
              className="text-xs font-bold text-[#8C7A6B] hover:text-[#5B21B6] underline"
            >
              고객용 미니블로그 보러가기 &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C221E] pb-16">
      {/* 상단 관리 헤더 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-3.5 sm:px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Link
              href="/hanook"
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors shrink-0"
              title="미니블로그로 돌아가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-sm sm:text-base font-black text-[#3B0764] truncate">
              HANOOK 어드민
            </h1>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11.5px] sm:text-xs font-bold transition-colors whitespace-nowrap"
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
              <span>소개글 설정</span>
            </button>
            <Link
              href="/hanook"
              target="_blank"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-100 text-[#4C1D95] hover:bg-[#5B21B6] hover:text-white text-[11.5px] sm:text-xs font-extrabold transition-colors whitespace-nowrap"
            >
              <span>고객 화면</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* 1. 미니홈피 상단 타이틀/소개글 설정 (접기/펼치기) */}
        {isConfigOpen && (
          <section className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-[#3B0764] flex items-center gap-1.5">
                <Settings className="w-4 h-4" />
                <span>미니홈피 상단 프로필 & 소개글 설정</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-700"
              >
                닫기 ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  메인 제목 (예: 꽃육점-HANOOK)
                </label>
                <input
                  type="text"
                  value={config.blogTitle}
                  onChange={e => setConfig({ ...config, blogTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                  placeholder="꽃육점-HANOOK"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  제목 위 작은 한 줄 문구
                </label>
                <input
                  type="text"
                  value={config.topCaption || ''}
                  onChange={e => setConfig({ ...config, topCaption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  placeholder="정성을 다듬어 온기를 내어놓는 곳"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                상단 소개글 (펜글씨·명조 감성 문구)
              </label>
              <textarea
                rows={4}
                value={config.introText}
                onChange={e => setConfig({ ...config, introText: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={isSavingConfig}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#3B0764] text-white text-xs font-extrabold transition-colors shadow-xs"
              >
                {configSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>저장 완료!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>프로필 설정 저장</span>
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* 2. 오늘의 이야기 글쓰기 / 수정 박스 */}
        <section className="bg-white rounded-3xl p-6 border border-[#EAE2D6] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-[#2C221E] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#5B21B6]" />
              <span>
                {editingPostId ? '이야기 수정하기' : '오늘의 새 이야기 올리기'}
              </span>
            </h2>
            {editingPostId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200"
              >
                <X className="w-3.5 h-3.5" />
                <span>새 글쓰기로 전환</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSavePost} className="space-y-4">
            {/* 사진 1장 업로드 & 자동 용량 최적화 */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                사진 1장 올리기 (휴대폰 사진 자동 고화질 용량 최적화)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {!imageUrl ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCompressing}
                  className="w-full py-8 px-4 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 text-[#5B21B6] flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-[#5B21B6]" />
                  </div>
                  <span className="text-sm font-extrabold">
                    {isCompressing
                      ? '화질은 유지하고 용량을 줄이는 중...'
                      : '터치하여 휴대폰 사진 1장 선택하기'}
                  </span>
                  <span className="text-[11.5px] text-gray-500 font-medium">
                    수 MB 원본 사진도 선명한 화질 그대로 약 100KB 내외로 자동 조정됩니다
                  </span>
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-purple-200 bg-[#F5F0E8]">
                  <img
                    src={imageUrl}
                    alt="미리보기"
                    className="w-full max-h-[360px] object-contain mx-auto"
                  />
                  <div className="p-3 bg-white border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      <Check className="w-3.5 h-3.5" />
                      {imageStats ? (
                        <span>
                          자동 최적화 완료: {imageStats.originalKB.toLocaleString()}KB &rarr;{' '}
                          <b>{imageStats.compressedKB.toLocaleString()}KB</b> ({imageStats.width}×
                          {imageStats.height})
                        </span>
                      ) : (
                        <span>사진 등록됨</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 text-[#5B21B6] text-xs font-extrabold hover:bg-purple-100"
                      >
                        다른 사진 변경
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          setImageStats(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-extrabold hover:bg-red-100"
                      >
                        사진 빼기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 제목 입력 */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                이야기 제목 (선택)
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예) 오늘 아침 정성껏 우려낸 한우 곰탕과 신선한 꽃갈비살"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] text-sm font-bold"
              />
            </div>

            {/* 본문 이야기 입력 */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                오늘의 소소한 이야기
              </label>
              <textarea
                rows={5}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="단골 식구들에게 전하고 싶은 오늘의 매장 이야기나 기록하고 싶은 순간을 편하게 적어주세요."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] text-sm leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="w-full py-3.5 rounded-2xl bg-[#3B0764] hover:bg-[#5B21B6] text-white font-black text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>
                {isSubmitting
                  ? '저장하는 중...'
                  : editingPostId
                  ? '수정 내용 저장하기'
                  : '미니블로그에 이야기 올리기'}
              </span>
            </button>
          </form>
        </section>

        {/* 3. 내가 올린 이야기 목록 (수정 / 삭제) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black text-[#2C221E]">
              등록된 이야기 관리 ({posts.length}개)
            </h3>
          </div>

          {isLoading ? (
            <p className="text-xs text-gray-500 py-6 text-center">불러오는 중...</p>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#EAE2D6] text-xs text-gray-500">
              아직 등록된 이야기가 없습니다. 위에서 첫 이야기를 올려보세요!
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#EAE2D6] shadow-2xs flex items-center gap-3"
                >
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-gray-100 border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-purple-50 text-purple-300 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.created_at, post.dateLabel)}
                      </span>
                    </div>
                    {post.title && (
                      <p className="text-xs sm:text-sm font-black text-gray-900 truncate">
                        {post.title}
                      </p>
                    )}
                    <p className="text-[11.5px] sm:text-xs text-gray-600 line-clamp-2 mt-0.5 leading-relaxed break-keep">
                      {post.content}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditClick(post)}
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 text-[#5B21B6] hover:bg-purple-100 text-[11.5px] font-extrabold transition-colors whitespace-nowrap"
                    >
                      <Edit3 className="w-3 h-3 shrink-0" />
                      <span>수정</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[11.5px] font-extrabold transition-colors whitespace-nowrap"
                    >
                      <Trash2 className="w-3 h-3 shrink-0" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
