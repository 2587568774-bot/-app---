'use client';

import { useTranslations } from 'next-intl';
import { MapActionButtons, type MapActionTarget } from '@/components/map-action-buttons';

export type MapCountyItem = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  summary?: string;
};

export type MapCitySelection = {
  slug: string;
  name: string;
  summary?: string;
  lat: number;
  lng: number;
  counties: MapCountyItem[];
};

type Props = {
  open: boolean;
  locale: string;
  city: MapCitySelection | null;
  county: MapCountyItem | null;
  onClose: () => void;
  onBackToCity: () => void;
  onSelectCounty: (county: MapCountyItem) => void;
};

export function MapPlaceSheet({
  open,
  locale,
  city,
  county,
  onClose,
  onBackToCity,
  onSelectCounty,
}: Props) {
  const t = useTranslations('map');
  if (!open || !city) return null;

  const active = county
    ? ({
        name: county.name,
        lat: county.lat,
        lng: county.lng,
        detailsHref: `/${locale}/places/${county.slug}`,
      } satisfies MapActionTarget)
    : ({
        name: city.name,
        lat: city.lat,
        lng: city.lng,
        detailsHref: `/${locale}/cities/${city.slug}`,
      } satisfies MapActionTarget);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label={t('close')}
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 max-h-[78vh] w-full max-w-lg overflow-hidden rounded-t-3xl border border-ink/10 bg-paper shadow-xl md:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <div className="min-w-0">
            {county ? (
              <button
                type="button"
                onClick={onBackToCity}
                className="mb-1 text-xs font-medium text-plateau hover:underline"
              >
                ← {t('backToCity')}
              </button>
            ) : null}
            <h2 className="truncate text-lg font-semibold text-ink">
              {county ? county.name : city.name}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-ink/60">
              {county?.summary || city.summary || t('noSummary')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-ink/10 px-2.5 py-1 text-sm text-ink/60 hover:bg-white"
          >
            {t('close')}
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-4" style={{ maxHeight: 'calc(78vh - 5rem)' }}>
          <MapActionButtons target={active} />

          {!county ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-ink/80">
                {t('countiesTitle', { count: city.counties.length })}
              </h3>
              {city.counties.length === 0 ? (
                <p className="text-sm text-ink/50">{t('noCounties')}</p>
              ) : (
                <ul className="divide-y divide-ink/5 overflow-hidden rounded-2xl border border-ink/10 bg-white">
                  {city.counties.map((c) => (
                    <li key={c.slug}>
                      <button
                        type="button"
                        onClick={() => onSelectCounty(c)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-plateau/5"
                      >
                        <span className="font-medium text-ink">{c.name}</span>
                        <span className="text-xs text-ink/45">{t('selectCounty')}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
