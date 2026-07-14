import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { AdSlot } from '@/components/ad-slot';
import { WeatherStrip } from '@/components/weather-strip';
import { PlaceIntelGrid } from '@/components/place-intel-grid';
import { MetricChips } from '@/components/metric-chips';
import { PlaceHero } from '@/components/place-hero';
import { CulturePanel } from '@/components/culture-panel';
import { ImageGallery } from '@/components/image-gallery';
import { GuideCard } from '@/components/guide-card';
import { getCityBySlug, listCountiesForCity, pickName } from '@/lib/regions/data-server';
import { listApprovedGuides } from '@/lib/guides/store';
import { getPlaceVisual, resolvePlaceImages } from '@/lib/regions/visuals';

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('cities');
  const tc = await getTranslations('common');
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  const name = pickName(city.names, locale);
  const summary = pickName(city.summary, locale);
  const counties = await listCountiesForCity(slug, locale);
  const guides = listApprovedGuides({ region: slug }).slice(0, 3);
  const visual = getPlaceVisual(slug);
  const images = resolvePlaceImages({
    slug,
    cover_url: city.cover_url,
    gallery: city.gallery,
  });

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/cities`} className="hover:text-plateau">
            {t('breadcrumb')}
          </Link>
          <span> / {name}</span>
        </p>
        <PlaceHero
          title={name}
          subtitle={summary || tc('fillingIn')}
          cover={images.cover}
          mood={visual.mood}
          tags={visual.tags}
          eyebrow={t('cityGuideEyebrow')}
        />
        <MetricChips
          altitudeM={city.altitude_m}
          climateType={city.climate_type}
          migrationFriendliness={city.migration_friendliness}
          costOfLivingIndex={city.cost_of_living_index}
          bestMonths={city.best_months}
        />
      </div>

      <WeatherStrip lat={city.lat} lng={city.lng} />
      <CulturePanel visual={visual} locale={locale} slug={slug} />
      <ImageGallery images={images.gallery} title={t('galleryTitle', { name })} locale={locale} />
      <AdSlot show />
      <PlaceIntelGrid
        food={city.food_blurb}
        scenery={city.scenery_blurb}
        migration={city.migration_blurb}
        locale={locale}
        slug={slug}
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('countiesTitle', { count: counties.length })}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {counties.map((county) => (
            <PlaceCard key={county.code} place={county} locale={locale} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">{t('localGuides')}</h2>
          <Link href={`/${locale}/guides?region=${slug}`} className="text-sm text-plateau hover:underline">
            {tc('viewAll')}
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

