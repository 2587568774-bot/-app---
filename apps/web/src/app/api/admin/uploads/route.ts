import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const slug = String(form.get('slug') || '').trim().toLowerCase();
    const file = form.get('file');

    if (!slug) {
      return NextResponse.json({ error: 'slug required' }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file required' }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Only jpg/png/webp/gif allowed' }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Max file size is 8MB' }, { status: 400 });
    }

    const ext =
      file.type === 'image/png'
        ? 'png'
        : file.type === 'image/webp'
          ? 'webp'
          : file.type === 'image/gif'
            ? 'gif'
            : 'jpg';

    const safeSlug = slug.replace(/[^a-z0-9-_]/g, '');
    const dir = path.join(process.cwd(), 'public', 'uploads', 'regions', safeSlug);
    fs.mkdirSync(dir, { recursive: true });

    const filename = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const full = path.join(dir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(full, buffer);

    const url = `/uploads/regions/${safeSlug}/${filename}`;
    return NextResponse.json({ ok: true, url, filename, size: file.size, type: file.type });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 },
    );
  }
}
