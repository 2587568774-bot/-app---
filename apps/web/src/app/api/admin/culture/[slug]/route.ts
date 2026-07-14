import { NextResponse } from 'next/server';
import {
  getMergedCulturePack,
  saveCultureDraft,
  type CultureDraft,
} from '@/lib/regions/culture-admin';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const parentSlug = url.searchParams.get('parent') || undefined;
  const pack = getMergedCulturePack(slug, parentSlug);
  return NextResponse.json({ ok: true, slug, pack });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const body = (await request.json()) as CultureDraft;
    const result = saveCultureDraft(slug, body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const pack = getMergedCulturePack(slug);
    return NextResponse.json({ ok: true, pack });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Save failed' },
      { status: 500 },
    );
  }
}
