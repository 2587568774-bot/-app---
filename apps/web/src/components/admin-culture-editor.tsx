'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { EthnicGroup, FoodItem, PlaceCulturePack } from '@/lib/regions/culture-types';

type Props = {
  slug: string;
  parentSlug?: string;
  initial: PlaceCulturePack;
};

function emptyFood(): FoodItem {
  return {
    name: { en: '', 'zh-Hans': '' },
    note: { en: '', 'zh-Hans': '' },
    image: '',
  };
}

function emptyEthnic(): EthnicGroup {
  return { name: { en: '', 'zh-Hans': '' }, share: '' };
}

export function AdminCultureEditor({ slug, parentSlug, initial }: Props) {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(
    initial.foodItems?.length ? initial.foodItems : [emptyFood()],
  );
  const [cultureImages, setCultureImages] = useState<string[]>(initial.cultureImages || []);
  const [ethnicGroups, setEthnicGroups] = useState<EthnicGroup[]>(
    initial.ethnicGroups?.length ? initial.ethnicGroups : [emptyEthnic()],
  );
  const [ethnicNoteZh, setEthnicNoteZh] = useState(initial.ethnicNote?.['zh-Hans'] || '');
  const [ethnicNoteEn, setEthnicNoteEn] = useState(initial.ethnicNote?.en || '');

  async function uploadFile(file: File | null): Promise<string | null> {
    if (!file) return null;
    setUploading(true);
    setMsg(null);
    try {
      const body = new FormData();
      body.set('slug', slug);
      body.set('file', file);
      const res = await fetch('/api/admin/uploads', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t('saveFailed'));
      return String(json.url);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('saveFailed'));
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/culture/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodItems,
          cultureImages,
          ethnicGroups,
          ethnicNote: { en: ethnicNoteEn, 'zh-Hans': ethnicNoteZh },
          parentSlug,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t('saveFailed'));
      setMsg(t('cultureSaved'));
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('saveFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-ink/10 bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold">{t('cultureEditorTitle')}</h2>
        <p className="mt-1 text-sm text-ink/60">{t('cultureEditorHint')}</p>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">{t('foodSection')}</h3>
          <button
            type="button"
            onClick={() => setFoodItems((prev) => [...prev, emptyFood()])}
            className="rounded-full border border-ink/15 px-3 py-1.5 text-xs"
          >
            {t('addFood')}
          </button>
        </div>
        {foodItems.map((item, idx) => (
          <div key={idx} className="grid gap-3 rounded-2xl border border-ink/10 bg-paper p-4 md:grid-cols-[140px_1fr]">
            <div className="space-y-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-ink/10 bg-white">
                {item.image ? (
                  <Image src={item.image} alt="" fill className="object-cover" sizes="140px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-ink/40">—</div>
                )}
              </div>
              <label className="block cursor-pointer rounded-full bg-plateau px-3 py-1.5 text-center text-xs font-medium text-white">
                {uploading ? t('uploading') : t('uploadFoodImage')}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading}
                  onChange={async (e) => {
                    const url = await uploadFile(e.target.files?.[0] || null);
                    if (!url) return;
                    setFoodItems((prev) =>
                      prev.map((f, i) => (i === idx ? { ...f, image: url } : f)),
                    );
                  }}
                />
              </label>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <Field
                label={t('foodNameZh')}
                value={item.name['zh-Hans']}
                onChange={(v) =>
                  setFoodItems((prev) =>
                    prev.map((f, i) =>
                      i === idx ? { ...f, name: { ...f.name, 'zh-Hans': v } } : f,
                    ),
                  )
                }
              />
              <Field
                label={t('foodNameEn')}
                value={item.name.en}
                onChange={(v) =>
                  setFoodItems((prev) =>
                    prev.map((f, i) => (i === idx ? { ...f, name: { ...f.name, en: v } } : f)),
                  )
                }
              />
              <Area
                label={t('foodNoteZh')}
                value={item.note['zh-Hans']}
                onChange={(v) =>
                  setFoodItems((prev) =>
                    prev.map((f, i) =>
                      i === idx ? { ...f, note: { ...f.note, 'zh-Hans': v } } : f,
                    ),
                  )
                }
              />
              <Area
                label={t('foodNoteEn')}
                value={item.note.en}
                onChange={(v) =>
                  setFoodItems((prev) =>
                    prev.map((f, i) => (i === idx ? { ...f, note: { ...f.note, en: v } } : f)),
                  )
                }
              />
              <div className="md:col-span-2">
                <Field
                  label={t('foodImageUrl')}
                  value={item.image}
                  onChange={(v) =>
                    setFoodItems((prev) =>
                      prev.map((f, i) => (i === idx ? { ...f, image: v } : f)),
                    )
                  }
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => setFoodItems((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-xs text-camellia hover:underline"
                >
                  {t('removeFood')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">{t('cultureImagesSection')}</h3>
          <label className="cursor-pointer rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-medium">
            {uploading ? t('uploading') : t('uploadCultureImage')}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={async (e) => {
                const url = await uploadFile(e.target.files?.[0] || null);
                if (!url) return;
                setCultureImages((prev) => [...new Set([...prev, url])]);
              }}
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="mb-1 block text-ink/60">{t('cultureImageUrls')}</span>
          <textarea
            value={cultureImages.join('\n')}
            onChange={(e) =>
              setCultureImages(
                e.target.value
                  .split('\n')
                  .map((x) => x.trim())
                  .filter(Boolean),
              )
            }
            rows={3}
            className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 font-mono text-xs"
          />
        </label>
        {cultureImages.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {cultureImages.map((url) => (
              <div key={url} className="relative h-16 w-20 overflow-hidden rounded-lg border border-ink/10">
                <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => setCultureImages((prev) => prev.filter((x) => x !== url))}
                  className="absolute right-1 top-1 rounded bg-black/60 px-1 text-[10px] text-white"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">{t('ethnicSection')}</h3>
          <button
            type="button"
            onClick={() => setEthnicGroups((prev) => [...prev, emptyEthnic()])}
            className="rounded-full border border-ink/15 px-3 py-1.5 text-xs"
          >
            {t('addEthnic')}
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Area label={t('ethnicNoteZh')} value={ethnicNoteZh} onChange={setEthnicNoteZh} />
          <Area label={t('ethnicNoteEn')} value={ethnicNoteEn} onChange={setEthnicNoteEn} />
        </div>
        {ethnicGroups.map((g, idx) => (
          <div key={idx} className="grid gap-2 rounded-xl border border-ink/10 bg-paper p-3 md:grid-cols-3">
            <Field
              label={t('ethnicNameZh')}
              value={g.name['zh-Hans']}
              onChange={(v) =>
                setEthnicGroups((prev) =>
                  prev.map((item, i) =>
                    i === idx ? { ...item, name: { ...item.name, 'zh-Hans': v } } : item,
                  ),
                )
              }
            />
            <Field
              label={t('ethnicNameEn')}
              value={g.name.en}
              onChange={(v) =>
                setEthnicGroups((prev) =>
                  prev.map((item, i) =>
                    i === idx ? { ...item, name: { ...item.name, en: v } } : item,
                  ),
                )
              }
            />
            <Field
              label={t('ethnicShare')}
              value={g.share}
              onChange={(v) =>
                setEthnicGroups((prev) =>
                  prev.map((item, i) => (i === idx ? { ...item, share: v } : item)),
                )
              }
            />
            <button
              type="button"
              onClick={() => setEthnicGroups((prev) => prev.filter((_, i) => i !== idx))}
              className="text-left text-xs text-camellia hover:underline md:col-span-3"
            >
              {t('removeEthnic')}
            </button>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? tc('saving') : t('saveCulture')}
        </button>
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
        className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2"
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
        rows={3}
        className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2"
      />
    </label>
  );
}

