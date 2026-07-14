'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { buildAmapUrl, buildBaiduPanoramaUrl } from '@/lib/maps/links';

export type MapActionTarget = {
  name: string;
  lat?: number | null;
  lng?: number | null;
  detailsHref: string;
};

export function MapActionButtons({ target }: { target: MapActionTarget }) {
  const t = useTranslations('map');
  const { lat, lng } = target;
  const canJump =
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng);

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={target.detailsHref}
        className="rounded-full bg-plateau px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
      >
        {t('details')}
      </Link>
      {canJump ? (
        <>
          <a
            href={buildAmapUrl(lat, lng, target.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-plateau/40"
          >
            {t('amap')}
          </a>
          <a
            href={buildBaiduPanoramaUrl(lat, lng, target.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-camellia/40"
          >
            {t('baiduPano')}
          </a>
        </>
      ) : (
        <span className="rounded-full bg-paper px-3 py-1.5 text-xs text-ink/50">{t('noCoords')}</span>
      )}
    </div>
  );
}
