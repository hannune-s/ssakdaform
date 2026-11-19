import { supabase } from './supabase';

export interface StoreSubscriptionInfo {
  recordId?: string;
  storeId: string;
  plan: string;
  status: '정상 이용중' | '무료체험' | '이용정지';
  nextBilling: string; // YYYY-MM-DD
}

const LOCAL_SUB_CACHE_KEY = 'ssakdaform_hq_subscriptions';

export function getDefaultNextBillingDate(createdAt?: string): string {
  const base = createdAt ? new Date(createdAt) : new Date();
  if (isNaN(base.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 30);
    return fallback.toISOString().split('T')[0];
  }
  const next = new Date(base);
  next.setDate(next.getDate() + 30);
  return next.toISOString().split('T')[0];
}

export function isSubscriptionExpired(sub: StoreSubscriptionInfo, storeId?: string): boolean {
  if (storeId === 'demo' || sub.storeId === 'demo') {
    // 데모 체험 매장은 언제나 열려 있도록 예외 처리 (단, 어드민 테스트용으로 명시적 '이용정지'를 준 경우는 반영)
    if (sub.status === '이용정지') return true;
    return false;
  }
  if (sub.status === '이용정지') return true;
  if (!sub.nextBilling) return false;

  // 오늘 날짜(YYYY-MM-DD)와 만료일 비교
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return sub.nextBilling < todayStr;
}

export async function fetchAllStoreSubscriptions(): Promise<Record<string, StoreSubscriptionInfo>> {
  const map: Record<string, StoreSubscriptionInfo> = {};

  // 1. 로컬 캐시 먼저 읽기 (보조용)
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_SUB_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.keys(parsed).forEach(k => {
          map[k] = {
            storeId: k,
            plan: parsed[k].plan || '월간 이용권 (9,900원)',
            status: parsed[k].status || '정상 이용중',
            nextBilling: parsed[k].nextBilling || getDefaultNextBillingDate()
          };
        });
      }
    } catch {}
  }

  // 2. Supabase DB (__hq_subscription__) 조회하여 최신 상태 덮어쓰기
  try {
    const { data } = await supabase
      .from('ssakdaform_responses')
      .select('*')
      .eq('store_id', '__hq__')
      .eq('form_id', '__hq_subscription__')
      .order('submitted_at', { ascending: true });

    if (data && data.length > 0) {
      data.forEach(row => {
        const d = row.data || {};
        if (d.storeId) {
          map[d.storeId] = {
            recordId: row.id,
            storeId: d.storeId,
            plan: d.plan || '월간 이용권 (9,900원)',
            status: d.status || '정상 이용중',
            nextBilling: d.nextBilling || getDefaultNextBillingDate()
          };
        }
      });
    }
  } catch (e) {
    console.error('Failed to fetch subscriptions:', e);
  }

  return map;
}

export async function fetchStoreSubscription(storeId: string, storeCreatedAt?: string): Promise<StoreSubscriptionInfo> {
  const all = await fetchAllStoreSubscriptions();
  if (all[storeId]) {
    return all[storeId];
  }
  return {
    storeId,
    plan: '월간 이용권 (9,900원)',
    status: '정상 이용중',
    nextBilling: getDefaultNextBillingDate(storeCreatedAt)
  };
}

export async function saveStoreSubscription(sub: StoreSubscriptionInfo): Promise<StoreSubscriptionInfo> {
  // 로컬 스토리지 동기화
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_SUB_CACHE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[sub.storeId] = {
        plan: sub.plan,
        status: sub.status,
        nextBilling: sub.nextBilling
      };
      localStorage.setItem(LOCAL_SUB_CACHE_KEY, JSON.stringify(parsed));
    } catch {}
  }

  // 기존 DB 레코드 확인
  const { data: existingRows } = await supabase
    .from('ssakdaform_responses')
    .select('*')
    .eq('store_id', '__hq__')
    .eq('form_id', '__hq_subscription__');

  const existing = (existingRows || []).find(r => r.data?.storeId === sub.storeId);

  if (existing) {
    await supabase
      .from('ssakdaform_responses')
      .update({
        status: sub.status,
        data: {
          storeId: sub.storeId,
          plan: sub.plan,
          status: sub.status,
          nextBilling: sub.nextBilling
        }
      })
      .eq('id', existing.id);
    return { ...sub, recordId: existing.id };
  } else {
    const { data: inserted } = await supabase
      .from('ssakdaform_responses')
      .insert([
        {
          store_id: '__hq__',
          form_id: '__hq_subscription__',
          status: sub.status,
          data: {
            storeId: sub.storeId,
            plan: sub.plan,
            status: sub.status,
            nextBilling: sub.nextBilling
          }
        }
      ])
      .select('*')
      .maybeSingle();

    return { ...sub, recordId: inserted?.id };
  }
}
