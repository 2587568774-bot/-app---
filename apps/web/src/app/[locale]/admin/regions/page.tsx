import Link from 'next/link';
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
            <Link href={`/${locale}/admin`} className="hover:text-plateau">
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
