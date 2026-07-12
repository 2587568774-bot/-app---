import { NextResponse } from 'next/server';
import { getSubscriptionByEmail, isPremiumEmail, listOfflinePacks } from '@/lib/premium/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || '';
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });
  const premium = isPremiumEmail(email);
  return NextResponse.json({
    email: email.trim().toLowerCase(),
    premium,
    subscription: getSubscriptionByEmail(email) || null,
    offline_packs: listOfflinePacks(email),
  });
}