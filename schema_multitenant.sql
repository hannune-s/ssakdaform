-- ============================================================================
-- 싹다폼 멀티테넌시 (1계정 1매장 독립 운영) 1단계 DB 구성 SQL
-- Supabase 대시보드 -> SQL Editor 에 아래 내용을 복사하여 [Run]을 눌러주세요.
-- ============================================================================

-- 1. 사장님 계정 및 매장 정보 테이블 (ssakdaform_stores) 생성
CREATE TABLE IF NOT EXISTS public.ssakdaform_stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,           -- 로그인 아이디
  email text NOT NULL,                     -- 이메일
  password text NOT NULL,                  -- 비밀번호
  owner_name text NOT NULL,                -- 대표자 성함
  phone text NOT NULL,                     -- 연락처
  store_id text UNIQUE NOT NULL,           -- 매장 전용 영문 아이디 (예: ssakdamart -> /store/ssakdamart)
  store_name text NOT NULL,                -- 상호명 (소속/단체명)
  address text NOT NULL,                   -- 사업장 주소
  custom_forms jsonb NOT NULL DEFAULT '[]'::jsonb, -- 매장별 맞춤형 폼 목록
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ssakdaform_stores RLS (권한) 설정
ALTER TABLE public.ssakdaform_stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on ssakdaform_stores" ON public.ssakdaform_stores;
CREATE POLICY "Allow public select on ssakdaform_stores"
  ON public.ssakdaform_stores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on ssakdaform_stores" ON public.ssakdaform_stores;
CREATE POLICY "Allow public insert on ssakdaform_stores"
  ON public.ssakdaform_stores FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on ssakdaform_stores" ON public.ssakdaform_stores;
CREATE POLICY "Allow public update on ssakdaform_stores"
  ON public.ssakdaform_stores FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on ssakdaform_stores" ON public.ssakdaform_stores;
CREATE POLICY "Allow public delete on ssakdaform_stores"
  ON public.ssakdaform_stores FOR DELETE USING (true);

-- 기본 데모 매장('demo') 초기 데이터 등록 (중복 방지)
INSERT INTO public.ssakdaform_stores (
  username, email, password, owner_name, phone, store_id, store_name, address
) VALUES (
  'demo', 'demo@ssakdaform.com', 'demo1234', '홍길동', '010-1234-5678', 'demo', '싹다마트 강남본점', '서울특별시 강남구 테헤란로 123 1층'
) ON CONFLICT (store_id) DO NOTHING;


-- 2. 기존 고객 접수 내역 테이블 (ssakdaform_responses)에 store_id 컬럼 추가
ALTER TABLE public.ssakdaform_responses
  ADD COLUMN IF NOT EXISTS store_id text NOT NULL DEFAULT 'demo';

CREATE INDEX IF NOT EXISTS idx_ssakdaform_responses_store_id
  ON public.ssakdaform_responses(store_id);

-- ssakdaform_responses 삭제(DELETE) 권한 보장
DROP POLICY IF EXISTS "Allow public delete on ssakdaform_responses" ON public.ssakdaform_responses;
CREATE POLICY "Allow public delete on ssakdaform_responses"
  ON public.ssakdaform_responses FOR DELETE USING (true);


-- 3. 기존 매장 계좌번호 테이블 (ssakdaform_store_accounts)에 store_id 컬럼 추가
ALTER TABLE public.ssakdaform_store_accounts
  ADD COLUMN IF NOT EXISTS store_id text NOT NULL DEFAULT 'demo';

CREATE INDEX IF NOT EXISTS idx_ssakdaform_store_accounts_store_id
  ON public.ssakdaform_store_accounts(store_id);
