import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { WeatherStrip } from '@/components/weather-strip';
import { getCountyBySlug, pickName } from '@/lib/regions/data';

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const found = getCountyBySlug(slug);
  if (!found) notFound();

  const { city, county } = found;
  const name = pickName(county.names, locale);
  const summary = pickName(county.summary, locale);
  const cityName = pickName(city.names, locale);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/cities`} className="hover:text-plateau">
            Cities
          </Link>
          <span> / </span>
          <Link href={`/${locale}/cities/${city.slug}`} className="hover:text-plateau">
            {cityName}
          </Link>
          <span> / {name}</span>
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">{name}</h1>
        <p className="max-w-3xl text-ink/70">{summary}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border border-ink/10 bg-white px-3 py-1">{county.altitude_m} m</span>
          {city.climate_type ? (
            <span className="rounded-full border border-ink/10 bg-white px-3 py-1">{city.climate_type}</span>
          ) : null}
          {city.migration_friendliness != null ? (
            <span className="rounded-full border border-ink/10 bg-white px-3 py-1">
              Migration {city.migration_friendliness}/10
            </span>
          ) : null}
          {city.cost_of_living_index != null ? (
            <span className="rounded-full border border-ink/10 bg-white px-3 py-1">
              COL {Math.max(30, city.cost_of_living_index - 3)}
            </span>
          ) : null}
        </div>
      </div>

      <WeatherStrip lat={county.lat} lng={county.lng} />

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
    </div>
  );
}