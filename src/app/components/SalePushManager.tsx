"use client";

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Send,
  Save,
  PowerOff,
  Clock,
  Calendar,
  MessageSquare,
  ShoppingBag,
  Bell,
  Eye,
  X,
  Flower2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getEffectiveAdminStoreId, getLoggedInStore } from '@/lib/storeSession';

export interface SaleItem {
  id: string;
  name: string;
  salePrice: string;
  originalPrice?: string;
  soldOut: boolean;
}

export interface StoreSaleData {
  storeId: string;
  isActive: boolean;
  title: string;
  period: string;
  saleDate?: string;
  startTime?: string;
  endTime?: string;
  untilSoldOut?: boolean;
  story: string;
  items: SaleItem[];
  updatedAt: string;
}

function getTodayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatKoreanTime(timeStr: string) {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return timeStr;
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return mStr === '00' ? `${ampm} ${h12}시` : `${ampm} ${h12}시 ${mStr}분`;
}

function formatNumberWithComma(val: string) {
  if (!val) return '';
  // 숫자에 천 단위 콤마 자동 삽입 (예: "10000" -> "10,000", "10000원" -> "10,000원")
  return val.replace(/\d+/g, (num) => {
    const n = Number(num);
    return isNaN(n) ? num : n.toLocaleString('ko-KR');
  });
}

export function buildFormattedPeriod(
  saleDate: string,
  startTime: string,
  endTime: string,
  untilSoldOut: boolean
) {
  let dateLabel = '';
  if (saleDate) {
    const [y, m, d] = saleDate.split('-').map(Number);
    if (y && m && d) {
      const dt = new Date(y, m - 1, d);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const dayName = days[dt.getDay()];
      dateLabel = `${m}월 ${d}일(${dayName})`;
    }
  }
  const startLabel = formatKoreanTime(startTime);
  const endLabel = formatKoreanTime(endTime);
  const timeRange =
    startLabel && endLabel
      ? `${startLabel} ~ ${endLabel}`
      : startLabel || endLabel || '';

  let result = [dateLabel, timeRange].filter(Boolean).join(' ');
  if (untilSoldOut) {
    result = result ? `${result} (소진 시 마감)` : '소진 시 마감';
  }
  return result;
}

export default function SalePushManager() {
  const [rowId, setRowId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [title, setTitle] = useState('오늘의 단골 특가 안내');
  const [saleDate, setSaleDate] = useState(getTodayStr());
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('19:00');
  const [untilSoldOut, setUntilSoldOut] = useState(true);

  const [story, setStory] = useState(
    '오늘 준비한 신선한 상품 중 조금 남은 귀한 물량을 단골분들께 먼저 기분 좋은 가격으로 나누어 드립니다.'
  );
  const [items, setItems] = useState<SaleItem[]>([
    { id: 'item-1', name: '', salePrice: '', originalPrice: '', soldOut: false }
  ]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const formattedPeriod = buildFormattedPeriod(saleDate, startTime, endTime, untilSoldOut);

  useEffect(() => {
    loadSaleData();
  }, []);

  async function loadSaleData() {
    setIsLoading(true);
    const storeId = getEffectiveAdminStoreId();
    try {
      const [{ data: rows }, { data: subRows }] = await Promise.all([
        supabase
          .from('ssakdaform_responses')
          .select('*')
          .eq('store_id', '__hq__')
          .eq('form_id', '__store_sale__')
          .order('submitted_at', { ascending: false }),
        supabase
          .from('ssakdaform_responses')
          .select('id, data')
          .eq('store_id', '__hq__')
          .eq('form_id', '__store_push_sub__')
      ]);

      const seenEndpoints = new Set<string>();
      (subRows || []).forEach((r: { data?: { storeId?: string; endpoint?: string } }) => {
        if (r.data?.storeId === storeId && r.data?.endpoint) {
          seenEndpoints.add(r.data.endpoint);
        }
      });
      setSubscriberCount(seenEndpoints.size);

      const myRow = (rows || []).find((r: { data?: { storeId?: string } }) => r.data?.storeId === storeId);
      if (myRow) {
        setRowId(myRow.id);
        const d = myRow.data as StoreSaleData;
        setIsActive(Boolean(d.isActive));
        if (d.title) setTitle(d.title);
        if (d.saleDate) setSaleDate(d.saleDate);
        if (d.startTime) setStartTime(d.startTime);
        if (d.endTime) setEndTime(d.endTime);
        if (d.untilSoldOut !== undefined) setUntilSoldOut(Boolean(d.untilSoldOut));
        if (d.story !== undefined) setStory(d.story);
        if (Array.isArray(d.items) && d.items.length > 0) {
          setItems(
            d.items.map(it => ({
              ...it,
              salePrice: formatNumberWithComma(String(it.salePrice || '').replace(/,/g, '')),
              originalPrice: formatNumberWithComma(String(it.originalPrice || '').replace(/,/g, ''))
            }))
          );
        }
      }
    } catch (e) {
      console.error('Failed to load sale data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}-${prev.length}`,
        name: '',
        salePrice: '',
        originalPrice: '',
        soldOut: false
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => {
      const next = prev.filter(it => it.id !== id);
      return next.length > 0
        ? next
        : [{ id: `item-${Date.now()}`, name: '', salePrice: '', originalPrice: '', soldOut: false }];
    });
  };

  const handleItemChange = (id: string, field: keyof SaleItem, value: string | boolean) => {
    let nextVal = value;
    if ((field === 'salePrice' || field === 'originalPrice') && typeof value === 'string') {
      const stripped = value.replace(/,/g, '');
      nextVal = formatNumberWithComma(stripped);
    }
    setItems(prev => prev.map(it => (it.id === id ? { ...it, [field]: nextVal } : it)));
  };

  // 품절 버튼을 누르면 즉시 DB에도 실시간 반영
  const handleToggleSoldOut = async (id: string) => {
    const nextItems = items.map(it =>
      it.id === id ? { ...it, soldOut: !it.soldOut } : it
    );
    setItems(nextItems);

    if (rowId) {
      const storeId = getEffectiveAdminStoreId();
      const payload: StoreSaleData = {
        storeId,
        isActive,
        title: title.trim(),
        period: formattedPeriod,
        saleDate,
        startTime,
        endTime,
        untilSoldOut,
        story: story.trim(),
        items: nextItems.filter(it => it.name.trim() !== ''),
        updatedAt: new Date().toISOString()
      };
      try {
        await supabase
          .from('ssakdaform_responses')
          .update({ data: payload })
          .eq('id', rowId);
      } catch {}
    }
  };

  const saveAndBroadcast = async (nextActiveState: boolean, shouldSendPush = true) => {
    const storeId = getEffectiveAdminStoreId();
    const validItems = items
      .map(it => ({
        ...it,
        name: it.name.trim(),
        salePrice: it.salePrice.trim(),
        originalPrice: (it.originalPrice || '').trim()
      }))
      .filter(it => it.name !== '');

    if (nextActiveState && validItems.length === 0) {
      alert('특가 품목을 최소 1개 이상 입력해 주세요.');
      return;
    }

    setIsSaving(true);
    const payload: StoreSaleData = {
      storeId,
      isActive: nextActiveState,
      title: title.trim() || '오늘의 단골 특가 안내',
      period: formattedPeriod,
      saleDate,
      startTime,
      endTime,
      untilSoldOut,
      story: story.trim(),
      items: validItems,
      updatedAt: new Date().toISOString()
    };

    try {
      if (rowId) {
        const { error } = await supabase
          .from('ssakdaform_responses')
          .update({
            status: nextActiveState ? '특가진행중' : '특가종료',
            data: payload
          })
          .eq('id', rowId);
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase
          .from('ssakdaform_responses')
          .insert([
            {
              store_id: '__hq__',
              form_id: '__store_sale__',
              status: nextActiveState ? '특가진행중' : '특가종료',
              data: payload
            }
          ])
          .select('*')
          .maybeSingle();
        if (error) throw error;
        if (inserted) setRowId(inserted.id);
      }

      setIsActive(nextActiveState);
      if (validItems.length > 0) setItems(validItems);

      let pushStatsMsg = '';
      if (nextActiveState && shouldSendPush) {
        const storeName = getLoggedInStore()?.store_name || '우리 매장';
        const pushMessage = `${validItems.map(i => `${i.name} ${i.salePrice}`).join(' / ')}${payload.period ? ` (${payload.period})` : ''}`;

        try {
          const res = await fetch('/api/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              storeId,
              storeName,
              title: payload.title,
              message: pushMessage,
              url: `/store/${storeId}?sale=1`,
            }),
          });
          if (res.ok) {
            const pushResult = await res.json();
            pushStatsMsg = `\n(세일 알림 구독 고객 ${pushResult.sentCount || 0}명에게 푸시 알림 전송 완료)`;
          }
        } catch (pushErr) {
          console.error('Push broadcast error:', pushErr);
        }

        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(`[${storeName}] ${payload.title}`, {
              body: pushMessage,
              icon: '/icon-192.png',
            });
          } catch {}
        }
      }

      if (!shouldSendPush) {
        alert(
          nextActiveState
            ? '내용이 저장되었습니다. (고객에게 푸시 알림은 다시 발송되지 않고 화면 내용만 즉시 반영됩니다)'
            : '내용이 임시 저장되었습니다. (고객 화면에는 아직 노출되지 않습니다)'
        );
      } else {
        alert(
          nextActiveState
            ? `특가 오픈 및 푸시 전송이 완료되었습니다.${pushStatsMsg}`
            : '특가가 종료(숨김) 처리되었습니다.'
        );
      }
    } catch (err: unknown) {
      alert('저장 중 오류가 발생했습니다: ' + ((err as Error)?.message || '오류'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500 font-medium">
        특가 설정을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-5">
      {/* 상단 상태 카드 (싹다폼 보라색 톤에 맞춘 차분한 디자인) */}
      <div
        className={`rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          isActive
            ? 'bg-[#F8F5FF] border-purple-200'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-[17px] font-extrabold text-gray-900 tracking-tight">
              단골 특가 &amp; 푸시 관리
            </h2>
            {isActive ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#5B21B6] text-white text-[11px] font-bold">
                현재 고객 화면 노출 중
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold">
                비활성 (대기 중)
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100/80 text-purple-900 text-[11px] font-bold">
              알림 구독 단골 {subscriberCount}명
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            세일 날짜와 시간, 품목과 가격을 입력해 전송하세요. 다 팔린 품목은 <b>[품절]</b> 버튼만 누르면 고객 화면에 즉시 반영됩니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-purple-200 hover:bg-purple-50 text-purple-900 text-xs font-bold shrink-0 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-purple-700" />
          <span>푸시화면 미리보기</span>
        </button>
      </div>

      {/* 메인 입력 카드 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 sm:p-7 space-y-6">
        {/* 1. 세일 제목 / 달력 날짜·시간 / 사장님 이야기 */}
        <div className="space-y-4">
          <h3 className="text-[15px] font-extrabold text-gray-900 pb-2 border-b border-gray-100">
            1. 세일 일정 및 안내
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              세일 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: 오늘 오후 한우 반짝 특가"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6]"
            />
          </div>

          {/* 달력 날짜 및 시간 선택 */}
          <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-700" />
                <span>세일 날짜 및 시간 설정</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  날짜 선택 (달력)
                </label>
                <input
                  type="date"
                  value={saleDate}
                  onChange={e => setSaleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  시작 시간
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  종료 시간
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#5B21B6]"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer pt-0.5">
              <input
                type="checkbox"
                checked={untilSoldOut}
                onChange={e => setUntilSoldOut(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#5B21B6] focus:ring-[#5B21B6]"
              />
              <span className="text-xs font-semibold text-gray-700">
                시간 뒤에 &ldquo;(소진 시 마감)&rdquo; 문구 함께 표시
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-purple-700" />
              <span>사장님 한마디 (선택)</span>
            </label>
            <textarea
              rows={2}
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder="예: 오늘 아침 작업하고 조금 남은 귀한 부위를 단골분들께 먼저 기분 좋은 가격으로 내어드립니다."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 leading-relaxed focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] resize-y"
            />
          </div>
        </div>

        {/* 2. 특가 품목 & 가격 & 원터치 품절 관리 */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-[15px] font-extrabold text-gray-900 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-purple-700" />
              <span>2. 특가 품목 및 품절 관리</span>
            </h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B21B6] border border-purple-200 text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>품목 추가</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center gap-2 ${
                  item.soldOut
                    ? 'bg-gray-50 border-gray-200 opacity-75'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-purple-50 text-[11px] font-bold text-purple-800 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => handleItemChange(item.id, 'name', e.target.value)}
                    placeholder="품목명 (예: 한우 국거리 300g)"
                    className={`w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold focus:outline-none focus:border-[#5B21B6] ${
                      item.soldOut ? 'line-through text-gray-400' : 'text-gray-900'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 sm:w-auto">
                  <input
                    type="text"
                    value={item.salePrice}
                    onChange={e => handleItemChange(item.id, 'salePrice', e.target.value)}
                    placeholder="특가 (예: 15,000원)"
                    className="w-32 px-3 py-2 rounded-lg border border-purple-300 bg-white text-sm font-bold text-[#5B21B6] focus:outline-none focus:border-[#5B21B6]"
                  />
                  <input
                    type="text"
                    value={item.originalPrice || ''}
                    onChange={e => handleItemChange(item.id, 'originalPrice', e.target.value)}
                    placeholder="기존가(선택)"
                    className="w-24 px-2.5 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-500 focus:outline-none focus:border-purple-400"
                  />

                  <button
                    type="button"
                    onClick={() => handleToggleSoldOut(item.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 border ${
                      item.soldOut
                        ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700'
                        : 'bg-purple-50 text-[#5B21B6] border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    {item.soldOut ? '품절됨 (해제)' : '품절처리'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                    title="품목 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 하단 미리보기 / 내용만 저장 / 푸시 전송 / 종료 버튼 */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex-1 py-3.5 px-4 rounded-xl bg-white hover:bg-purple-50 text-[#5B21B6] border border-purple-200 font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>푸시화면 미리보기</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => saveAndBroadcast(isActive, false)}
            className="flex-1 py-3.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4C1D95] border border-purple-200 font-bold text-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
            title="푸시 알림을 다시 발송하지 않고 수정한 내용만 저장합니다"
          >
            <Save className="w-4 h-4" />
            <span>내용만 저장</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => saveAndBroadcast(true, true)}
            className="flex-[1.6] py-3.5 px-5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-[15px] shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span>
              {isSaving
                ? '처리 중...'
                : isActive
                  ? '푸시 알림 재전송'
                  : '특가 오픈 & 푸시 전송'}
            </span>
          </button>

          {isActive && (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => saveAndBroadcast(false, true)}
              className="flex-1 py-3.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <PowerOff className="w-4 h-4" />
              <span>특가 종료</span>
            </button>
          )}
        </div>
      </div>

      {/* 어드민 내 고객 팝업 미리보기 모달 */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border border-rose-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#FFF1F2] via-[#FFF5F5] to-[#FFE4E6] border-b border-rose-200 px-5 py-5 relative">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-rose-200/60 hover:bg-rose-200 text-rose-900 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100/90 text-[#4C1D95] border border-purple-200 text-[11px] font-extrabold mb-1.5">
                단골 실시간 특가
              </span>
              <h3 className="text-[19px] font-black text-gray-900 leading-snug break-keep pr-6">
                {title || '오늘의 단골 특가 안내'}
              </h3>
              {formattedPeriod && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 border border-rose-300 shadow-2xs">
                  <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-[14px] sm:text-[14.5px] font-extrabold text-rose-700 tracking-tight break-keep">
                    {formattedPeriod}
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 space-y-3.5 max-h-[65vh] overflow-y-auto bg-white">
              {story && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[13px] text-amber-950 font-medium leading-relaxed whitespace-pre-line break-keep">
                  <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-[12.5px] mb-1.5">
                    <Flower2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>사장님 이야기</span>
                  </div>
                  {story}
                </div>
              )}

              <div className="divide-y divide-rose-100/80 border border-rose-200 rounded-xl overflow-hidden">
                {items
                  .filter(it => it.name.trim() !== '')
                  .map(item => {
                    const fmt = (v?: string) => {
                      if (!v) return '';
                      const t = v.trim();
                      const raw = t.replace(/,/g, '');
                      return /^\d+$/.test(raw) ? `${Number(raw).toLocaleString('ko-KR')}원` : t;
                    };
                    return (
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
                              {fmt(item.salePrice)}
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-extrabold tracking-tight shadow-2xs">
                              품절
                            </span>
                          </div>
                        ) : (
                          <div className="text-right shrink-0 flex flex-col items-end">
                            {item.originalPrice && (
                              <span className="text-[12.5px] font-bold text-gray-500 line-through leading-tight">
                                {fmt(item.originalPrice)}
                              </span>
                            )}
                            <span className="text-[18px] sm:text-[19px] font-black text-rose-600 tracking-tight leading-tight mt-0.5">
                              {fmt(item.salePrice)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800"
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
