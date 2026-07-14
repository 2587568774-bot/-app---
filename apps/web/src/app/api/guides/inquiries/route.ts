import { NextResponse } from 'next/server';
import { createInquiry, listInquiries } from '@/lib/guides/store';

export async function GET() {
  return NextResponse.json({ inquiries: listInquiries() });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.guide_id || !body?.message || !body?.contact_email) {
    return NextResponse.json({ error: 'guide_id, message, contact_email required' }, { status: 400 });
  }
  const result = createInquiry({
    guide_id: String(body.guide_id),
    message: String(body.message).trim(),
    contact_email: String(body.contact_email).trim(),
    contact_name: body.contact_name ? String(body.contact_name).trim() : undefined,
    region_slug: body.region_slug ? String(body.region_slug).trim() : undefined,
    estimated_budget_usd: body.estimated_budget_usd != null ? Number(body.estimated_budget_usd) : undefined,
  });
  if ('error' in result) return NextResponse.json(result, { status: 400 });
  return NextResponse.json({ ok: true, inquiry: result }, { status: 201 });
}
