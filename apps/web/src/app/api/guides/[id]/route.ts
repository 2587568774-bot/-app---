import { NextResponse } from 'next/server';
import { getGuide } from '@/lib/guides/store';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const guide = getGuide(id);
  if (!guide || guide.status !== 'approved') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ guide });
}