'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  };
};

export function AdminRegionEditor({ slug, kind, locale, initial }: Props) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initial);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/regions/${slug}`, {
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
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setMsg('Saved to local admin drafts. Connect Supabase later for production writes.');
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
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

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name (zh-Hans)" value={form.nameZh} onChange={(v) => setForm({ ...form, nameZh: v })} />
        <Field label="Name (en)" value={form.nameEn} onChange={(v) => setForm({ ...form, nameEn: v })} />
        <Field label="Summary (zh-Hans)" value={form.summaryZh} onChange={(v) => setForm({ ...form, summaryZh: v })} textarea />
        <Field label="Summary (en)" value={form.summaryEn} onChange={(v) => setForm({ ...form, summaryEn: v })} textarea />
        <Field label="Altitude (m)" value={String(form.altitude_m ?? '')} onChange={(v) => setForm({ ...form, altitude_m: Number(v) || 0 })} />
        {kind === 'city' ? (
          <>
            <Field label="Climate type" value={form.climate_type || ''} onChange={(v) => setForm({ ...form, climate_type: v })} />
            <Field label="Cost of living (1-100)" value={String(form.cost_of_living_index ?? '')} onChange={(v) => setForm({ ...form, cost_of_living_index: Number(v) || 0 })} />
            <Field label="Migration score (1-10)" value={String(form.migration_friendliness ?? '')} onChange={(v) => setForm({ ...form, migration_friendliness: Number(v) || 0 })} />
            <Field label="Food" value={form.food_blurb || ''} onChange={(v) => setForm({ ...form, food_blurb: v })} textarea />
            <Field label="Scenery" value={form.scenery_blurb || ''} onChange={(v) => setForm({ ...form, scenery_blurb: v })} textarea />
            <Field label="Migration notes" value={form.migration_blurb || ''} onChange={(v) => setForm({ ...form, migration_blurb: v })} textarea />
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
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Save draft'}
        </button>
        <a href={`/${locale}/admin/regions`} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm">
          Back to list
        </a>
        <a
          href={kind === 'city' ? `/${locale}/cities/${slug}` : `/${locale}/places/${slug}`}
          className="rounded-full border border-ink/15 px-5 py-2.5 text-sm"
          target="_blank"
        >
          Preview public page
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
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink/80">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-ink/15 px-3 py-2"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-ink/15 px-3 py-2"
        />
      )}
    </label>
  );
}