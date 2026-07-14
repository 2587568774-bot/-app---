const fs = require("fs");
function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
  console.log("wrote", file);
}

write("E:/无尽的/see-yunnan/apps/web/src/components/admin-region-tree.tsx", `'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type AdminTreeCity = {
  slug: string;
  code: string;
  name: string;
  completeness: number;
  is_featured?: boolean;
  counties: Array<{
    slug: string;
    code: string;
    name: string;
    completeness: number;
  }>;
};

export function AdminRegionTree({
  locale,
  cities,
  labels,
}: {
  locale: string;
  cities: AdminTreeCity[];
  labels: {
    expand: string;
    collapse: string;
    edit: string;
    upload: string;
    noCounties: string;
    cityBranch: string;
    countyBranch: string;
    score: string;
  };
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const c of cities.slice(0, 3)) init[c.slug] = true;
    return init;
  });

  const totalCounties = useMemo(
    () => cities.reduce((n, c) => n + c.counties.length, 0),
    [cities],
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/55">
        {cities.length} cities · {totalCounties} counties
      </p>
      <div className="space-y-3">
        {cities.map((city) => {
          const expanded = Boolean(open[city.slug]);
          return (
            <section key={city.slug} className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-plateau">{labels.cityBranch}</p>
                  <h2 className="text-lg font-semibold">{city.name}</h2>
                  <p className="text-xs text-ink/45">
                    {city.slug} · {city.code} · {labels.score} {city.completeness}
                    {city.is_featured ? ' · featured' : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen((s) => ({ ...s, [city.slug]: !expanded }))}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-sm"
                  >
                    {expanded ? labels.collapse : labels.expand}
                    {city.counties.length ? \` (\${city.counties.length})\` : ''}
                  </button>
                  <Link
                    href={\`/\${locale}/admin/regions/\${city.slug}\`}
                    className="rounded-full bg-plateau px-3 py-1.5 text-sm font-medium text-white"
                  >
                    {labels.upload}
                  </Link>
                  <Link
                    href={\`/\${locale}/admin/regions/\${city.slug}\`}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-sm"
                  >
                    {labels.edit}
                  </Link>
                </div>
              </div>

              {expanded ? (
                <div className="border-t border-ink/5 bg-paper/40 px-4 py-3">
                  {city.counties.length === 0 ? (
                    <p className="text-sm text-ink/50">{labels.noCounties}</p>
                  ) : (
                    <div className="space-y-2">
                      {city.counties.map((county) => (
                        <div
                          key={county.slug}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white px-3 py-2"
                        >
                          <div>
                            <p className="text-[11px] text-ink/45">
                              {labels.countyBranch.replace('{city}', city.name)}
                            </p>
                            <p className="font-medium">{county.name}</p>
                            <p className="text-xs text-ink/45">
                              {county.slug} · {county.code} · {labels.score} {county.completeness}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={\`/\${locale}/admin/regions/\${county.slug}\`}
                              className="rounded-full bg-camellia px-3 py-1.5 text-sm font-medium text-white"
                            >
                              {labels.upload}
                            </Link>
                            <Link
                              href={\`/\${locale}/admin/regions/\${county.slug}\`}
                              className="rounded-full border border-ink/15 px-3 py-1.5 text-sm"
                            >
                              {labels.edit}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
`);

write("E:/无尽的/see-yunnan/apps/web/src/app/[locale]/admin/regions/page.tsx", `import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminRegionTree, type AdminTreeCity } from '@/components/admin-region-tree';
import { listAdminRegions } from '@/lib/regions/admin';

export default async function AdminRegionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; level?: string }>;
}) {
  const { locale } = await params;
  const { q = '', level = 'all' } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  const items = listAdminRegions(locale.startsWith('zh') ? 'zh-Hans' : 'en');
  const needle = q.trim().toLowerCase();

  const cityMap = new Map<string, AdminTreeCity>();
  for (const item of items) {
    if (item.level === 'city') {
      cityMap.set(item.slug, {
        slug: item.slug,
        code: item.code,
        name: item.name,
        completeness: item.completeness,
        is_featured: item.is_featured,
        counties: [],
      });
    }
  }
  for (const item of items) {
    if (item.level !== 'county' || !item.parentSlug) continue;
    const parent = cityMap.get(item.parentSlug);
    if (!parent) continue;
    parent.counties.push({
      slug: item.slug,
      code: item.code,
      name: item.name,
      completeness: item.completeness,
    });
  }

  let cities = [...cityMap.values()].sort((a, b) => a.name.localeCompare(b.name, locale));
  for (const city of cities) {
    city.counties.sort((a, b) => a.name.localeCompare(b.name, locale));
  }

  if (needle) {
    cities = cities
      .map((city) => {
        const cityHit =
          city.name.toLowerCase().includes(needle) ||
          city.slug.includes(needle) ||
          city.code.includes(needle);
        const counties = city.counties.filter(
          (c) =>
            c.name.toLowerCase().includes(needle) ||
            c.slug.includes(needle) ||
            c.code.includes(needle),
        );
        if (cityHit) return city;
        if (counties.length) return { ...city, counties };
        return null;
      })
      .filter(Boolean) as AdminTreeCity[];
  }

  if (level === 'city') {
    cities = cities.map((c) => ({ ...c, counties: [] }));
  }
  if (level === 'county') {
    cities = cities
      .map((c) => ({ ...c, counties: c.counties }))
      .filter((c) => c.counties.length > 0);
  }

  const rowCount =
    level === 'county'
      ? cities.reduce((n, c) => n + c.counties.length, 0)
      : cities.reduce((n, c) => n + 1 + (level === 'city' ? 0 : c.counties.length), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-ink/50">
            <Link href={\`/\${locale}/admin\`} className="hover:text-plateau">
              {t('title')}
            </Link>
            <span> / {t('regions')}</span>
          </p>
          <h1 className="text-3xl font-semibold">{t('regionCms')}</h1>
          <p className="mt-1 text-sm text-ink/60">{t('treeHint')}</p>
          <p className="mt-1 text-sm text-ink/50">{t('rows', { count: rowCount })}</p>
        </div>
      </div>

      <form className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder={t('searchPlaceholder')}
          className="min-w-[220px] flex-1 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm"
        />
        <select
          name="level"
          defaultValue={level}
          className="rounded-full border border-ink/15 bg-white px-3 py-2 text-sm"
        >
          <option value="all">{t('allLevels')}</option>
          <option value="city">{t('cities')}</option>
          <option value="county">{t('counties')}</option>
        </select>
        <button type="submit" className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white">
          {t('filter')}
        </button>
      </form>

      <AdminRegionTree
        locale={locale}
        cities={cities}
        labels={{
          expand: t('expand'),
          collapse: t('collapse'),
          edit: t('edit'),
          upload: t('upload'),
          noCounties: t('noCounties'),
          cityBranch: t('cityBranch'),
          countyBranch: t('countyBranch'),
          score: t('score'),
        }}
      />
    </div>
  );
}
`);

// guides page soft i18n
write("E:/无尽的/see-yunnan/apps/web/src/app/[locale]/guides/page.tsx", `import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideCard } from '@/components/guide-card';
import { listApprovedGuides } from '@/lib/guides/store';

export default async function GuidesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; region?: string; language?: string }>;
}) {
  const { locale } = await params;
  const { q = '', region = '', language = '' } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('guides');

  const guides = listApprovedGuides({
    q: q || undefined,
    region: region || undefined,
    language: language || undefined,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{t('title')}</h1>
          <p className="mt-2 text-ink/60">{t('intro')}</p>
        </div>
        <Link
          href={\`/\${locale}/guides/apply\`}
          className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white"
        >
          {t('apply')}
        </Link>
      </div>

      <form className="grid gap-2 rounded-2xl border border-ink/10 bg-white p-4 md:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="name / specialty"
          className="rounded-full border border-ink/15 px-3 py-2 text-sm md:col-span-2"
        />
        <input
          name="region"
          defaultValue={region}
          placeholder="region slug"
          className="rounded-full border border-ink/15 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            name="language"
            defaultValue={language}
            placeholder="lang"
            className="w-full rounded-full border border-ink/15 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm text-white">
            Filter
          </button>
        </div>
      </form>

      {guides.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-6 text-ink/60">
          {t('noMatch')}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
`);

// ensure admin editor labels a bit clearer for county
let editor = fs.readFileSync("E:/无尽的/see-yunnan/apps/web/src/components/admin-region-editor.tsx", "utf8");
editor = editor.replace(
  "Upload your own photos (jpg/png/webp, max 8MB). Do not use copyrighted app assets without permission.",
  "Upload photos for this city or county (jpg/png/webp, max 8MB). County images are independent from the parent city."
);
editor = editor.replace(
  "{uploading ? 'Uploading…' : 'Upload cover'}",
  "{uploading ? 'Uploading…' : kind === 'county' ? 'Upload county cover' : 'Upload city cover'}"
);
editor = editor.replace(
  "{uploading ? 'Uploading…' : 'Add gallery photo'}",
  "{uploading ? 'Uploading…' : kind === 'county' ? 'Add county photo' : 'Add city photo'}"
);
fs.writeFileSync("E:/无尽的/see-yunnan/apps/web/src/components/admin-region-editor.tsx", editor, "utf8");
console.log("admin tree + i18n pages done");