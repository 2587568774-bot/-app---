import { NextResponse } from 'next/server';
import { reviewGuide } from '@/lib/guides/store';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();
  const decision = body?.decision;
  if (decision !== 'approved' && decision !== 'rejected') {
    return NextResponse.json({ error: 'decision must be approved|rejected' }, { status: 400 });
  }
  const result = reviewGuide(id, decision, body?.reject_reason);
  if (!result.ok) return NextResponse.json(result, { status: 404 });
  return NextResponse.json(result);
}