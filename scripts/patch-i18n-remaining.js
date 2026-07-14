const fs = require('fs');
const path = require('path');
function write(rel, content) {
  fs.writeFileSync(path.join('apps/web/src', rel), content, 'utf8');
  console.log('wrote', rel);
}

write('components/search-box.tsx', `'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function SearchBox({
  locale,
  placeholder,
  initialQuery = '',
}: {
  locale: string;
  placeholder?: string;
  initialQuery?: string;
}) {
  const router = useRouter();
  const t = useTranslations('common');
  const [q, setQ] = useState(initialQuery);
  const resolvedPlaceholder = placeholder || t('searchPlaceholder');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    router.push(\`/\${locale}/search?q=\${encodeURIComponent(value)}\`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={resolvedPlaceholder}
        className="w-full rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none ring-plateau/30 focus:ring"
      />
      <button
        type="submit"
        className="rounded-full bg-plateau px-4 py-2.5 text-sm font-medium text-white"
      >
        {t('search')}
      </button>
    </form>
  );
}
`);

write('components/admin-region-editor.tsx', `'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('admin');
  const tc = useTranslations('common');
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
      if (!res.ok) throw new Error(json.error || t('saveFailed'));
      setMsg(t('saved'));
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('saveFailed'));
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
      if (!res.ok) throw new Error(json.error || t('saveFailed'));
      const url = String(json.url);
      setForm((prev) => {
        const gallery = [...new Set([...(prev.gallery || []), url])];
        return {
          ...prev,
          cover_url: asCover || !prev.cover_url ? url : prev.cover_url,
          gallery,
        };
      });
      setMsg(t('saved'));
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('saveFailed'));
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
        <span className="rounded-full bg-paper px-3 py-1 text-sm">
          {t('completeness', { score: form.completeness })}
        </span>
      </div>

      <div className="rounded-2xl border border-dashed border-plateau/30 bg-plateau/5 p-4">
        <p className="text-sm font-medium text-plateau">{t('uploadCover')}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-ink/10 bg-white">
            {form.cover_url ? (
              <Image src={form.cover_url} alt="Cover" fill className="object-cover" sizes="180px" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-ink/40">—</div>
            )}
          </div>
          <div className="space-y-3">
            <Field
              label={t('coverUrl')}
              value={form.cover_url || ''}
              onChange={(v) => setForm({ ...form, cover_url: v })}
            />
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white">
                {uploading ? t('uploading') : t('uploadCover')}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => onUpload(e.target.files?.[0] || null, true)}
                />
              </label>
              <label className="cursor-pointer rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-medium">
                {uploading ? t('uploading') : t('uploadGallery')}
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
        <Field label={t('nameZh')} value={form.nameZh} onChange={(v) => setForm({ ...form, nameZh: v })} />
        <Field label={t('nameEn')} value={form.nameEn} onChange={(v) => setForm({ ...form, nameEn: v })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Area label={t('summaryZh')} value={form.summaryZh} onChange={(v) => setForm({ ...form, summaryZh: v })} />
        <Area label={t('summaryEn')} value={form.summaryEn} onChange={(v) => setForm({ ...form, summaryEn: v })} />
      </div>

      {kind === 'city' ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label={t('climate')} value={form.climate_type || ''} onChange={(v) => setForm({ ...form, climate_type: v })} />
            <Field
              label={t('costIndex')}
              value={String(form.cost_of_living_index ?? '')}
              onChange={(v) => setForm({ ...form, cost_of_living_index: v ? Number(v) : undefined })}
            />
            <Field
              label={t('migrationScore')}
              value={String(form.migration_friendliness ?? '')}
              onChange={(v) => setForm({ ...form, migration_friendliness: v ? Number(v) : undefined })}
            />
          </div>
          <Area label={t('food')} value={form.food_blurb || ''} onChange={(v) => setForm({ ...form, food_blurb: v })} />
          <Area label={t('scenery')} value={form.scenery_blurb || ''} onChange={(v) => setForm({ ...form, scenery_blurb: v })} />
          <Area label={t('migration')} value={form.migration_blurb || ''} onChange={(v) => setForm({ ...form, migration_blurb: v })} />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.is_featured)}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            {t('featured')}
          </label>
        </>
      ) : null}

      <Field
        label={t('altitude')}
        value={String(form.altitude_m ?? '')}
        onChange={(v) => setForm({ ...form, altitude_m: v ? Number(v) : undefined })}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? tc('saving') : tc('save')}
        </button>
        <a href={\`/\${locale}/admin/regions\`} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm">
          {tc('back')}
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

// remove unused import in guides page
const guidesPage = fs.readFileSync('apps/web/src/app/[locale]/guides/page.tsx', 'utf8')
  .replace("  const tc = await getTranslations('common');\n\n", '\n');
fs.writeFileSync('apps/web/src/app/[locale]/guides/page.tsx', guidesPage, 'utf8');
console.log('cleaned guides page');
