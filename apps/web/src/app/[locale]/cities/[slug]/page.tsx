import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { WeatherStrip } from '@/components/weather-strip';
import { getCityBySlug, listCountiesForCity, pickName } from '@/lib/regions/data-server';

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const name = pickName(city.names, locale);
  const summary = pickName(city.summary, locale);
  const counties = listCountiesForCity(slug, locale);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/cities`} className="hover:text-plateau">
            Cities
          </Link>
          <span> / {name}</span>
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">{name}</h1>
        <p className="max-w-3xl text-ink/70">{summary}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-white px-3 py-1 border border-ink/10">{city.altitude_m} m</span>
          {city.climate_type ? (
            <span className="rounded-full bg-white px-3 py-1 border border-ink/10">{city.climate_type}</span>
          ) : null}
          {city.migration_friendliness != null ? (
            <span className="rounded-full bg-white px-3 py-1 border border-ink/10">
              Migration {city.migration_friendliness}/10
            </span>
          ) : null}
          {city.cost_of_living_index != null ? (
            <span className="rounded-full bg-white px-3 py-1 border border-ink/10">
              COL {city.cost_of_living_index}
            </span>
          ) : null}
        </div>
      </div>

      <WeatherStrip lat={city.lat} lng={city.lng} />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">Food</h2>
          <p className="mt-2 text-sm text-ink/70">{city.food_blurb || '完善中 / Filling in'}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">Scenery</h2>
          <p className="mt-2 text-sm text-ink/70">{city.scenery_blurb || '完善中 / Filling in'}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">Migration</h2>
          <p className="mt-2 text-sm text-ink/70">{city.migration_blurb || '完善中 / Filling in'}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Counties ({counties.length})</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {counties.map((county) => (
            <PlaceCard key={county.code} place={county} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}