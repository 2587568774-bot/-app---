import { NextResponse } from 'next/server';
import { updateInquiryStatus } from '@/lib/guides/store';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();
  const status = body?.status;
  if (!['new', 'contacted', 'closed'].includes(status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 });
  }
  const result = updateInquiryStatus(id, status);
  if (!result.ok) return NextResponse.json(result, { status: 404 });
  return NextResponse.json(result);
}