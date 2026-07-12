import { setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { SearchBox } from '@/components/search-box';
import { listCities, stats } from '@/lib/regions/data-server';

export default async function CitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cities = await listCities(locale);
  const s = await stats();

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">Cities of Yunnan</h1>
        <p className="text-ink/60">
          {s.cities} cities / prefectures · {s.counties} counties · source: {s.source}
        </p>
        <SearchBox locale={locale} placeholder="Search Dali, 丽江, Shangri-La..." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cities.map((city) => (
          <PlaceCard key={city.code} place={city} locale={locale} />
        ))}
      </div>
    </div>
  );
}