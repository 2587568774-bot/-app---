import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { SearchBox } from '@/components/search-box';
import { YunnanMap } from '@/components/yunnan-map';
import { CitiesHero } from '@/components/cities-hero';
import { getFeaturedCities, listCities, listMapCities, stats } from '@/lib/regions/data-server';

export default async function CitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('cities');
  const tc = await getTranslations('common');
  const cities = await listCities(locale);
  const featured = await getFeaturedCities(locale, 6);
  const mapCities = await listMapCities(locale);
  const s = await stats();
  const statsLine = t('statsLine', {
    cities: s.cities,
    counties: s.counties,
    source: s.source,
  });

  const heroPlaces = (featured.length >= 4 ? featured : cities).slice(0, 6);

  return (
    <div className="space-y-8">
      {/* 1. Visual hero */}
      <CitiesHero locale={locale} featured={heroPlaces} statsLine={statsLine} />

      {/* 2. Admin map — under images, above city cards */}
      <div className="rounded-[2rem] border border-ink/10 bg-white p-5 md:p-6">
        <YunnanMap locale={locale} cities={mapCities} />
      </div>

      {/* 3. Browse + search + city cards */}
      <div className="space-y-4 rounded-[2rem] border border-ink/10 bg-white p-5 md:p-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-ink">{t('browseTitle')}</h2>
          <p className="max-w-2xl text-sm text-ink/65">{t('intro')}</p>
        </div>
        <SearchBox locale={locale} placeholder={tc('searchPlaceholder')} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cities.map((city) => (
          <PlaceCard key={city.code} place={city} locale={locale} />
        ))}
      </div>
    </div>
  );
}
