import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || 'demo');
  let storeName = decodedSlug === 'demo' ? '싹다상점 강남본점' : '우리 매장';

  try {
    const { data: row } = await supabase
      .from('ssakdaform_stores')
      .select('store_name')
      .eq('store_id', decodedSlug)
      .maybeSingle();
    if (row?.store_name) {
      storeName = row.store_name;
    }
  } catch {}

  const cleanTitle = storeName.replace(/^주\)|\(주\)/g, '').trim() || storeName;

  return {
    title: storeName,
    description: `${storeName} 단골 특가 소식 & 간편 접수`,
    manifest: `/api/manifest/store/${encodeURIComponent(decodedSlug)}`,
    appleWebApp: {
      capable: true,
      title: cleanTitle,
      statusBarStyle: 'default',
    },
  };
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
