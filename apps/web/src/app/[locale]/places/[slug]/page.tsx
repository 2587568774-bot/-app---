import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { WeatherStrip } from '@/components/weather-strip';
import { PlaceIntelGrid } from '@/components/place-intel-grid';
import { MetricChips } from '@/components/metric-chips';
import { PlaceHero } from '@/components/place-hero';
import { CulturePanel } from '@/components/culture-panel';
import { ImageGallery } from '@/components/image-gallery';
import { GuideCard } from '@/components/guide-card';
import { getCountyBySlug, pickName } from '@/lib/regions/data-server';
import { getCountyBlurb, pickBlurb } from '@/lib/regions/county-blurbs';
import { listApprovedGuides } from '@/lib/guides/store';
import { getPlaceVisual, resolvePlaceImages } from '@/lib/regions/visuals';

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('places');
  const tc = await getTranslations('common');
  const tCities = await getTranslations('cities');
  const found = await getCountyBySlug(slug);
  if (!found) notFound();

  const { city, county } = found;
  const blurb = getCountyBlurb(slug);
  const name = pickName(county.names, locale);
  const summary =
    pickBlurb(blurb?.summary, locale) ||
    pickName(county.summary, locale) ||
    tc('fillingIn');
  const cityName = pickName(city.names, locale);
  const guides = listApprovedGuides({ region: city.slug }).slice(0, 2);
  const visual = getPlaceVisual(slug, city.slug);
  const images = resolvePlaceImages({
    slug,
    parentSlug: city.slug,
    cover_url: county.cover_url || city.cover_url,
    gallery: county.gallery || city.gallery,
  });

  const food = pickBlurb(blurb?.food, locale) || city.food_blurb;
  const scenery = pickBlurb(blurb?.scenery, locale) || city.scenery_blurb;
  const migration = pickBlurb(blurb?.migration, locale) || city.migration_blurb;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/cities`} className="hover:text-plateau">
            {tCities('breadcrumb')}
          </Link>
          <span> / </span>
          <Link href={`/${locale}/cities/${city.slug}`} className="hover:text-plateau">
            {cityName}
          </Link>
          <span> / {name}</span>
        </p>
        <PlaceHero
          title={name}
          subtitle={summary}
          cover={images.cover}
          mood={visual.mood}
          tags={visual.tags}
          eyebrow={t('countyIn', { city: cityName })}
        />
        <MetricChips
          altitudeM={county.altitude_m ?? blurb?.altitude_m ?? null}
          climateType={city.climate_type}
          migrationFriendliness={city.migration_friendliness}
          costOfLivingIndex={
            city.cost_of_living_index != null
              ? Math.max(30, city.cost_of_living_index - 3)
              : null
          }
          bestMonths={city.best_months}
        />
      </div>

      <WeatherStrip lat={county.lat} lng={county.lng} />
      <CulturePanel visual={visual} locale={locale} slug={slug} parentSlug={city.slug} />
      <ImageGallery images={images.gallery} title={t('galleryTitle', { name })} locale={locale} />
      <PlaceIntelGrid
        food={food}
        scenery={scenery}
        migration={migration}
        locale={locale}
        slug={slug}
        parentSlug={city.slug}
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">{t('guidesNear', { city: cityName })}</h2>
          <Link href={`/${locale}/guides?region=${city.slug}`} className="text-sm text-plateau hover:underline">
            {t('browseGuides')}
          </Link>
        </div>
        {guides.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-5 text-sm text-ink/60">
            {t('noGuides')}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
