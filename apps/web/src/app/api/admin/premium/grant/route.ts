import { NextResponse } from 'next/server';
import { grantPremium, listSubscriptions, revokePremium } from '@/lib/premium/store';

export async function GET() {
  return NextResponse.json({ subscriptions: listSubscriptions() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body?.email || '').trim();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });
  const sub = grantPremium({
    email,
    months: Number(body?.months) || 1,
    note: body?.note ? String(body.note) : 'manual grant',
    provider: 'manual',
  });
  return NextResponse.json({ ok: true, subscription: sub });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const email = String(body?.email || '').trim();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });
  const result = revokePremium(email);
  if (!result.ok) return NextResponse.json(result, { status: 404 });
  return NextResponse.json(result);
}