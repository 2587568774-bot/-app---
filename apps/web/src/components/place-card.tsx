import Link from 'next/link';
import type { PlaceView } from '@/lib/regions/types';

export function PlaceCard({
  place,
  locale,
}: {
  place: PlaceView;
  locale: string;
}) {
  const href =
    place.level === 'county'
      ? `/${locale}/places/${place.slug}`
      : `/${locale}/cities/${place.slug}`;

  return (
    <Link
      href={href}
      className="block rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition hover:border-plateau/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{place.name}</h3>
          <p className="mt-1 text-sm text-ink/60">
            {place.altitude_m} m
            {place.childCount != null ? ` · ${place.childCount}` : ''}
            {place.parentName ? ` · ${place.parentName}` : ''}
          </p>
        </div>
        {place.is_featured ? (
          <span className="rounded-full bg-camellia/10 px-2 py-1 text-xs font-medium text-camellia">
            Featured
          </span>
        ) : null}
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-ink/70">{place.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink/60">
        {place.climate_type ? (
          <span className="rounded-full bg-paper px-2 py-1">{place.climate_type}</span>
        ) : null}
        {place.migration_friendliness != null ? (
          <span className="rounded-full bg-paper px-2 py-1">Mig {place.migration_friendliness}</span>
        ) : null}
        {place.cost_of_living_index != null ? (
          <span className="rounded-full bg-paper px-2 py-1">COL {place.cost_of_living_index}</span>
        ) : null}
      </div>
    </Link>
  );
}