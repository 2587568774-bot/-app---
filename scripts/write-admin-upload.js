const fs = require('fs');
const path = require('path');
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  console.log('wrote', file);
}

// patch admin.ts save fields
const adminPath = 'E:/无尽的/see-yunnan/apps/web/src/lib/regions/admin.ts';
let admin = fs.readFileSync(adminPath, 'utf8');
if (!admin.includes('cover_url:')) {
  admin = admin.replace(
    `      is_featured: Boolean(payload.is_featured),
      altitude_m: num(payload.altitude_m, found.city.altitude_m) ?? found.city.altitude_m,
    };
  } else {
    drafts.counties[slug] = {
      ...(drafts.counties[slug] || {}),
      parentSlug: found.city.slug,
      names: {
        ...(found.county.names || {}),
        ...((payload.names as object) || {}),
      },
      summary: {
        ...(found.county.summary || {}),
        ...((payload.summary as object) || {}),
      },
      altitude_m: num(payload.altitude_m, found.county.altitude_m) ?? found.county.altitude_m,
    };
  }`,
    `      is_featured: Boolean(payload.is_featured),
      altitude_m: num(payload.altitude_m, found.city.altitude_m) ?? found.city.altitude_m,
      cover_url: strOrKeep(payload.cover_url, found.city.cover_url),
      gallery: arrOrKeep(payload.gallery, found.city.gallery),
    };
  } else {
    drafts.counties[slug] = {
      ...(drafts.counties[slug] || {}),
      parentSlug: found.city.slug,
      names: {
        ...(found.county.names || {}),
        ...((payload.names as object) || {}),
      },
      summary: {
        ...(found.county.summary || {}),
        ...((payload.summary as object) || {}),
      },
      altitude_m: num(payload.altitude_m, found.county.altitude_m) ?? found.county.altitude_m,
      cover_url: strOrKeep(payload.cover_url, found.county.cover_url),
      gallery: arrOrKeep(payload.gallery, found.county.gallery),
    };
  }`,
  );
  admin = admin.replace(
    `function num(v: unknown, fallback?: number) {
  if (v === '' || v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}`,
    `function num(v: unknown, fallback?: number) {
  if (v === '' || v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function strOrKeep(v: unknown, fallback?: string) {
  if (v === undefined) return fallback;
  const s = String(v || '').trim();
  return s || undefined;
}

function arrOrKeep(v: unknown, fallback?: string[]) {
  if (v === undefined) return fallback;
  if (!Array.isArray(v)) return fallback;
  return v.map((x) => String(x || '').trim()).filter(Boolean);
}`,
  );
  write(adminPath, admin);
}

write('E:/无尽的/see-yunnan/apps/web/src/app/api/admin/uploads/route.ts', `import { NextResponse } from 'next/server';
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

    const filename = \`\${Date.now().toString(36)}-\${Math.random().toString(36).slice(2, 8)}.\${ext}\`;
    const full = path.join(dir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(full, buffer);

    const url = \`/uploads/regions/\${safeSlug}/\${filename}\`;
    return NextResponse.json({ ok: true, url, filename, size: file.size, type: file.type });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 },
    );
  }
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/components/admin-region-editor.tsx', `'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Props = {
  slug: string;
  kind: 'city' | 'county';
  locale: string;
  initial: {
    nameZh: string;
    nameEn: string;
    summaryZh: string;
    summaryEn: string;
    climate_type?: string;
    cost_of_living_index?: number;
    migration_friendliness?: number;
    food_blurb?: string;
    scenery_blurb?: string;
    migration_blurb?: string;
    altitude_m?: number;
    is_featured?: boolean;
    completeness: number;
    cover_url?: string;
    gallery?: string[];
  };
};

export function AdminRegionEditor({ slug, kind, locale, initial }: Props) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    ...initial,
    gallery: initial.gallery || [],
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(\`/api/admin/regions/\${slug}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          names: { 'zh-Hans': form.nameZh, en: form.nameEn },
          summary: { 'zh-Hans': form.summaryZh, en: form.summaryEn },
          climate_type: form.climate_type,
          cost_of_living_index: form.cost_of_living_index,
          migration_friendliness: form.migration_friendliness,
          food_blurb: form.food_blurb,
          scenery_blurb: form.scenery_blurb,
          migration_blurb: form.migration_blurb,
          altitude_m: form.altitude_m,
          is_featured: form.is_featured,
          cover_url: form.cover_url,
          gallery: form.gallery,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setMsg('Saved. Cover and gallery are live after refresh.');
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function onUpload(file: File | null, asCover = false) {
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      const body = new FormData();
      body.set('slug', slug);
      body.set('file', file);
      const res = await fetch('/api/admin/uploads', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      const url = String(json.url);
      setForm((prev) => {
        const gallery = [...new Set([...(prev.gallery || []), url])];
        return {
          ...prev,
          cover_url: asCover || !prev.cover_url ? url : prev.cover_url,
          gallery,
        };
      });
      setMsg(\`Uploaded \${file.name}. Click Save to keep it.\`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryItem(url: string) {
    setForm((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((x) => x !== url),
      cover_url: prev.cover_url === url ? (prev.gallery || []).find((x) => x !== url) : prev.cover_url,
    }));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-ink/50">{kind}</p>
          <h2 className="text-xl font-semibold">{form.nameZh || form.nameEn || slug}</h2>
        </div>
        <span className="rounded-full bg-paper px-3 py-1 text-sm">Completeness {form.completeness}/100</span>
      </div>

      <div className="rounded-2xl border border-dashed border-plateau/30 bg-plateau/5 p-4">
        <p className="text-sm font-medium text-plateau">Images</p>
        <p className="mt-1 text-xs text-ink/55">
          Upload your own photos (jpg/png/webp, max 8MB). Do not use copyrighted app assets without permission.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-ink/10 bg-white">
            {form.cover_url ? (
              <Image src={form.cover_url} alt="Cover" fill className="object-cover" sizes="180px" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-ink/40">No cover</div>
            )}
          </div>
          <div className="space-y-3">
            <Field
              label="Cover URL"
              value={form.cover_url || ''}
              onChange={(v) => setForm({ ...form, cover_url: v })}
            />
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white">
                {uploading ? 'Uploading…' : 'Upload cover'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => onUpload(e.target.files?.[0] || null, true)}
                />
              </label>
              <label className="cursor-pointer rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-medium">
                {uploading ? 'Uploading…' : 'Add gallery photo'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => onUpload(e.target.files?.[0] || null, false)}
                />
              </label>
            </div>
            {(form.gallery || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(form.gallery || []).map((url) => (
                  <div key={url} className="relative h-16 w-20 overflow-hidden rounded-lg border border-ink/10">
                    <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(url)}
                      className="absolute right-1 top-1 rounded bg-black/60 px-1 text-[10px] text-white"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name (zh-Hans)" value={form.nameZh} onChange={(v) => setForm({ ...form, nameZh: v })} />
        <Field label="Name (en)" value={form.nameEn} onChange={(v) => setForm({ ...form, nameEn: v })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Area label="Summary (zh-Hans)" value={form.summaryZh} onChange={(v) => setForm({ ...form, summaryZh: v })} />
        <Area label="Summary (en)" value={form.summaryEn} onChange={(v) => setForm({ ...form, summaryEn: v })} />
      </div>

      {kind === 'city' ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Climate" value={form.climate_type || ''} onChange={(v) => setForm({ ...form, climate_type: v })} />
            <Field
              label="Cost of living"
              value={String(form.cost_of_living_index ?? '')}
              onChange={(v) => setForm({ ...form, cost_of_living_index: v ? Number(v) : undefined })}
            />
            <Field
              label="Migration score"
              value={String(form.migration_friendliness ?? '')}
              onChange={(v) => setForm({ ...form, migration_friendliness: v ? Number(v) : undefined })}
            />
          </div>
          <Area label="Food" value={form.food_blurb || ''} onChange={(v) => setForm({ ...form, food_blurb: v })} />
          <Area label="Scenery" value={form.scenery_blurb || ''} onChange={(v) => setForm({ ...form, scenery_blurb: v })} />
          <Area label="Migration" value={form.migration_blurb || ''} onChange={(v) => setForm({ ...form, migration_blurb: v })} />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.is_featured)}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            Featured on home
          </label>
        </>
      ) : null}

      <Field
        label="Altitude (m)"
        value={String(form.altitude_m ?? '')}
        onChange={(v) => setForm({ ...form, altitude_m: v ? Number(v) : undefined })}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
        <a href={\`/\${locale}/admin/regions\`} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm">
          Back
        </a>
      </div>
      {msg ? <p className="text-sm text-ink/70">{msg}</p> : null}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-ink/60">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink/15 px-3 py-2"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-ink/60">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-xl border border-ink/15 px-3 py-2"
      />
    </label>
  );
}
`);

// admin page initial cover/gallery
const pagePath = 'E:/无尽的/see-yunnan/apps/web/src/app/[locale]/admin/regions/[slug]/page.tsx';
let page = fs.readFileSync(pagePath, 'utf8');
if (!page.includes('cover_url:')) {
  page = page
    .replace(
      `          altitude_m: place.city.altitude_m,
          is_featured: place.city.is_featured,
          completeness: place.completeness,
        }`,
      `          altitude_m: place.city.altitude_m,
          is_featured: place.city.is_featured,
          completeness: place.completeness,
          cover_url: place.city.cover_url,
          gallery: place.city.gallery,
        }`,
    )
    .replace(
      `          altitude_m: place.county.altitude_m,
          completeness: place.completeness,
        };`,
      `          altitude_m: place.county.altitude_m,
          completeness: place.completeness,
          cover_url: place.county.cover_url,
          gallery: place.county.gallery,
        };`,
    );
  write(pagePath, page);
}

// ensure public uploads dir + gitkeep
write('E:/无尽的/see-yunnan/apps/web/public/uploads/regions/.gitkeep', '');

console.log('admin image upload ready');