import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const decodedSlug = decodeURIComponent(slug || 'demo');

  let storeName = decodedSlug === 'demo' ? '싹다상점 강남본점' : `${decodedSlug} 매장`;

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

  const manifest = {
    id: `/store/${decodedSlug}`,
    name: storeName,
    short_name: storeName.replace(/^주\)|\(주\)/g, '').trim() || storeName,
    description: `${storeName} 단골 특가 알림 & 간편 접수`,
    start_url: `/store/${decodedSlug}`,
    scope: `/store/${decodedSlug}`,
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#3B0764',
    icons: [
      {
        src: '/icon-192.png?v=6',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png?v=6',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
