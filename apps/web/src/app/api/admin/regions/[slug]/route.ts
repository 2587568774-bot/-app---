import { NextResponse } from 'next/server';
import { getAdminPlace, saveAdminPlace } from '@/lib/regions/admin';

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const place = getAdminPlace(slug);
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(place);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const body = await request.json();
  const result = saveAdminPlace(slug, body || {});
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json({ ok: true, place: getAdminPlace(slug) });
}