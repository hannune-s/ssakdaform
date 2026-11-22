import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } from '@/lib/pushConfig';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const webpush = require('web-push');

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storeId, storeName, title, message, url } = body;

    if (!storeId) {
      return NextResponse.json({ error: 'storeId is required' }, { status: 400 });
    }

    const { data: rows, error } = await supabase
      .from('ssakdaform_responses')
      .select('id, data')
      .eq('store_id', '__hq__')
      .eq('form_id', '__store_push_sub__');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const storeSubs = (rows || []).filter(
      (r: { id: string; data?: { storeId?: string; subscription?: unknown } }) =>
        r.data?.storeId === storeId && r.data?.subscription
    );

    const payload = JSON.stringify({
      title: storeName ? `🔥 [${storeName}] ${title}` : `🔥 ${title}`,
      body: message || '단골 식구분들을 위한 실시간 깜짝 특가가 오픈되었습니다! 지금 확인해보세요.',
      url: url || `/store/${storeId}?sale=1`,
      storeId,
      timestamp: Date.now(),
    });

    let sentCount = 0;
    let failedCount = 0;
    const expiredIds: string[] = [];

    // Deduplicate by endpoint
    const seenEndpoints = new Set<string>();
    const uniqueSubs = storeSubs.filter((row: { id: string; data?: { endpoint?: string; subscription?: { endpoint?: string } } }) => {
      const ep = row.data?.endpoint || row.data?.subscription?.endpoint;
      if (!ep || seenEndpoints.has(ep)) return false;
      seenEndpoints.add(ep);
      return true;
    });

    await Promise.all(
      uniqueSubs.map(async (row: { id: string; data: { subscription: unknown } }) => {
        try {
          await webpush.sendNotification(row.data.subscription, payload);
          sentCount++;
        } catch (err: unknown) {
          failedCount++;
          const statusCode = (err as { statusCode?: number })?.statusCode;
          if (statusCode === 404 || statusCode === 410) {
            expiredIds.push(row.id);
          }
        }
      })
    );

    if (expiredIds.length > 0) {
      await supabase.from('ssakdaform_responses').delete().in('id', expiredIds);
    }

    return NextResponse.json({
      ok: true,
      totalSubscribers: uniqueSubs.length,
      sentCount,
      failedCount,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error)?.message || 'Failed to send push notifications' },
      { status: 500 }
    );
  }
}
