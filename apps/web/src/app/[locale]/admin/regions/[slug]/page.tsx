import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminRegionEditor } from '@/components/admin-region-editor';
import { AdminCultureEditor } from '@/components/admin-culture-editor';
import { getAdminPlace } from '@/lib/regions/admin';
import { getMergedCulturePack } from '@/lib/regions/culture-admin';

export default async function AdminRegionEditPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const place = getAdminPlace(slug);
  if (!place) notFound();

  const parentSlug = place.kind === 'county' ? place.city.slug : undefined;
  const culture = getMergedCulturePack(slug, parentSlug);

  const initial =
    place.kind === 'city'
      ? {
          nameZh: place.city.names['zh-Hans'] || '',
          nameEn: place.city.names.en || '',
          summaryZh: place.city.summary['zh-Hans'] || '',
          summaryEn: place.city.summary.en || '',
          climate_type: place.city.climate_type,
          cost_of_living_index: place.city.cost_of_living_index,
          migration_friendliness: place.city.migration_friendliness,
          food_blurb: place.city.food_blurb,
          scenery_blurb: place.city.scenery_blurb,
          migration_blurb: place.city.migration_blurb,
          altitude_m: place.city.altitude_m,
          is_featured: place.city.is_featured,
          completeness: place.completeness,
          cover_url: place.city.cover_url,
          gallery: place.city.gallery,
        }
      : {
          nameZh: place.county.names['zh-Hans'] || '',
          nameEn: place.county.names.en || '',
          summaryZh: place.county.summary['zh-Hans'] || '',
          summaryEn: place.county.summary.en || '',
          altitude_m: place.county.altitude_m,
          completeness: place.completeness,
          cover_url: place.county.cover_url,
          gallery: place.county.gallery,
        };

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink/50">
        <Link href={`/${locale}/admin`} className="hover:text-plateau">
          {t('title')}
        </Link>
        <span> / </span>
        <Link href={`/${locale}/admin/regions`} className="hover:text-plateau">
          {t('regions')}
        </Link>
        <span> / {slug}</span>
      </p>
      <AdminRegionEditor
        slug={slug}
        kind={place.kind}
        locale={locale}
        initial={initial}
      />
      <AdminCultureEditor slug={slug} parentSlug={parentSlug} initial={culture} />
    </div>
  );
}
