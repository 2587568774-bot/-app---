'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { PlaceView } from '@/lib/regions/types';
import { resolvePlaceImages } from '@/lib/regions/visuals';

export function PlaceCard({
  place,
  locale = 'en',
}: {
  place: PlaceView;
  locale?: string;
}) {
  const t = useTranslations('places');
  const href =
    place.level === 'county'
      ? `/${locale}/places/${place.slug}`
      : `/${locale}/cities/${place.slug}`;
  const images = resolvePlaceImages({
    slug: place.slug,
    parentSlug: place.parentSlug,
    cover_url: place.cover_url,
    gallery: place.gallery,
  });

  const metaParts: string[] = [];
  if (place.altitude_m != null) metaParts.push(t('metaAltitude', { m: place.altitude_m }));
  if (place.childCount != null) metaParts.push(t('metaCounties', { count: place.childCount }));
  if (place.parentName) metaParts.push(t('metaParent', { name: place.parentName }));

  return (
    <a
      href={href}
      className="group block cursor-pointer overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-plateau/40 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden">
        <Image
          src={images.cover}
          alt={place.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{place.name}</h3>
            {metaParts.length ? (
              <p className="text-xs text-white/80">{metaParts.join(' · ')}</p>
            ) : null}
          </div>
          {place.is_featured ? (
            <span className="rounded-full bg-camellia px-2 py-1 text-[11px] font-medium text-white">
              {t('featuredBadge')}
            </span>
          ) : null}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <p className="line-clamp-2 text-sm leading-6 text-ink/70">{place.summary}</p>
        <p className="line-clamp-1 text-xs text-plateau">{images.mood}</p>
        <div className="flex flex-wrap gap-2 text-xs text-ink/60">
          {place.climate_type ? (
            <span className="rounded-full bg-paper px-2 py-1">{place.climate_type}</span>
          ) : null}
          {place.migration_friendliness != null ? (
            <span className="rounded-full bg-paper px-2 py-1">
              {t('chipMigration', { score: place.migration_friendliness })}
            </span>
          ) : null}
          {place.cost_of_living_index != null ? (
            <span className="rounded-full bg-paper px-2 py-1">
              {t('chipCost', { score: place.cost_of_living_index })}
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
}
