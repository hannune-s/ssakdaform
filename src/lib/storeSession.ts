export interface StoreProfile {
  id?: string;
  username: string;
  email: string;
  owner_name: string;
  phone: string;
  store_id: string;
  store_name: string;
  address: string;
  custom_forms?: any[];
  created_at?: string;
}

const SESSION_KEY = 'ssakdaform_current_store';

export const DEFAULT_DEMO_STORE: StoreProfile = {
  username: 'demo',
  email: 'demo@ssakdaform.com',
  owner_name: '홍길동',
  phone: '010-1234-5678',
  store_id: 'demo',
  store_name: '싹다마트 강남본점',
  address: '서울특별시 강남구 테헤란로 123 1층',
  custom_forms: []
};

export function getLoggedInStore(): StoreProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoreProfile;
  } catch {
    return null;
  }
}

export function getActiveStoreId(): string {
  const store = getLoggedInStore();
  return store?.store_id || 'demo';
}

export function setLoggedInStore(profile: StoreProfile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  // 기존 호환용 로컬스토리지 동기화
  localStorage.setItem(
    'ssakdaform_store_details',
    JSON.stringify({
      storeName: profile.store_name,
      ownerName: profile.owner_name,
      contact: profile.phone,
      address: profile.address,
      storeId: profile.store_id,
      email: profile.email
    })
  );
}

export function clearLoggedInStore() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
