'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  MAP_VB,
  YUNNAN_MAP_PINS,
  YUNNAN_OUTLINE_PATH,
  YUNNAN_PREFECTURE_PATHS,
} from '@/lib/maps/map-points';
import {
  MapPlaceSheet,
  type MapCitySelection,
  type MapCountyItem,
} from '@/components/map-place-sheet';

export type YunnanMapCity = {
  slug: string;
  name: string;
  summary?: string;
  lat: number;
  lng: number;
  counties: MapCountyItem[];
};

export function YunnanMap({
  locale,
  cities,
}: {
  locale: string;
  cities: YunnanMapCity[];
}) {
  const t = useTranslations('map');
  const activeLocale = useLocale();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<MapCountyItem | null>(null);

  const cityBySlug = useMemo(() => {
    const map = new Map<string, YunnanMapCity>();
    for (const c of cities) map.set(c.slug, c);
    return map;
  }, [cities]);

  const selectedCity: MapCitySelection | null = selectedSlug
    ? (() => {
        const c = cityBySlug.get(selectedSlug);
        if (!c) return null;
        return {
          slug: c.slug,
          name: c.name,
          summary: c.summary,
          lat: c.lat,
          lng: c.lng,
          counties: c.counties,
        };
      })()
    : null;

  function selectCity(next: string) {
    setSelectedSlug(next);
    setSelectedCounty(null);
  }

  const isZh = activeLocale.startsWith('zh');

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-ink">{t('title')}</h2>
          <p className="mt-1 text-sm text-ink/60">{t('hint')}</p>
        </div>
        <p className="text-xs text-ink/45">{t('geoNote')}</p>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-ink/10 bg-[#e8eef0] shadow-sm">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 18%, rgba(31,111,139,0.14), transparent 42%), radial-gradient(circle at 82% 72%, rgba(196,92,38,0.10), transparent 38%), linear-gradient(180deg, #f7f4ef 0%, #e4ecee 100%)',
          }}
        />

        <svg
          viewBox={`0 0 ${MAP_VB.w} ${MAP_VB.h}`}
          className="relative z-[1] h-auto w-full"
          role="img"
          aria-label={t('title')}
        >
          <defs>
            <linearGradient id="yn-land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1F6F8B" stopOpacity="0.14" />
              <stop offset="55%" stopColor="#2F6F4E" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#C45C26" stopOpacity="0.10" />
            </linearGradient>
            <linearGradient id="yn-active" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C45C26" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#1F6F8B" stopOpacity="0.22" />
            </linearGradient>
            <filter id="yn-shadow" x="-8%" y="-8%" width="116%" height="116%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#1A1A1A" floodOpacity="0.14" />
            </filter>
          </defs>

          {/* Neighbor labels */}
          <text x="18" y="28" fill="#1A1A1A" fillOpacity="0.3" style={{ fontSize: 12 }}>
            {isZh ? '西藏 / 四川' : 'Tibet / Sichuan'}
          </text>
          <text x="310" y="48" fill="#1A1A1A" fillOpacity="0.3" style={{ fontSize: 12 }}>
            {isZh ? '贵州' : 'Guizhou'}
          </text>
          <text x="340" y="300" fill="#1A1A1A" fillOpacity="0.3" style={{ fontSize: 12 }}>
            {isZh ? '广西' : 'Guangxi'}
          </text>
          <text x="14" y="320" fill="#1A1A1A" fillOpacity="0.3" style={{ fontSize: 12 }}>
            {isZh ? '缅甸' : 'Myanmar'}
          </text>
          <text x="150" y="505" fill="#1A1A1A" fillOpacity="0.3" style={{ fontSize: 12 }}>
            {isZh ? '老挝 / 越南' : 'Laos / Vietnam'}
          </text>

          {/* Province fill */}
          <path
            d={YUNNAN_OUTLINE_PATH}
            fill="url(#yn-land)"
            stroke="none"
            filter="url(#yn-shadow)"
          />

          {/* Prefecture polygons — real admin boundaries */}
          {Object.entries(YUNNAN_PREFECTURE_PATHS).map(([slug, d]) => {
            const active = selectedSlug === slug;
            const hasCity = cityBySlug.has(slug);
            return (
              <path
                key={slug}
                d={d}
                fill={active ? 'url(#yn-active)' : 'rgba(255,255,255,0.28)'}
                stroke={active ? '#C45C26' : '#1F6F8B'}
                strokeOpacity={active ? 0.9 : 0.45}
                strokeWidth={active ? 2.2 : 1.1}
                className={hasCity ? 'cursor-pointer transition-colors' : undefined}
                onClick={() => {
                  if (hasCity) selectCity(slug);
                }}
              >
                <title>{cityBySlug.get(slug)?.name || slug}</title>
              </path>
            );
          })}

          {/* Outer province stroke on top */}
          <path
            d={YUNNAN_OUTLINE_PATH}
            fill="none"
            stroke="#1F6F8B"
            strokeOpacity="0.75"
            strokeWidth="2.4"
          />

          {/* Pins + labels */}
          {YUNNAN_MAP_PINS.map((pin) => {
            const city = cityBySlug.get(pin.slug);
            if (!city) return null;
            const active = selectedSlug === pin.slug;
            const label = isZh ? pin.shortZh : pin.shortEn;
            const labelW = Math.max(34, label.length * 10 + 12);
            const labelY = pin.y + 17;
            return (
              <g
                key={pin.slug}
                className="cursor-pointer"
                onClick={() => selectCity(pin.slug)}
              >
                <circle cx={pin.x} cy={pin.y} r={15} fill="transparent" />
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={active ? 7 : 5.2}
                  fill={active ? '#C45C26' : '#1F6F8B'}
                  stroke="#F7F4EF"
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {active ? (
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={12}
                    fill="none"
                    stroke="#C45C26"
                    strokeOpacity="0.35"
                    strokeWidth="2"
                  />
                ) : null}
                <rect
                  x={pin.x - labelW / 2}
                  y={labelY - 9}
                  width={labelW}
                  height={15}
                  rx={7.5}
                  fill={active ? '#C45C26' : 'rgba(247,244,239,0.94)'}
                  stroke={active ? '#C45C26' : 'rgba(26,26,26,0.08)'}
                  strokeWidth="1"
                />
                <text
                  x={pin.x}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: active ? '#ffffff' : '#1A1A1A',
                  }}
                >
                  {label}
                </text>
                <title>{city.name}</title>
              </g>
            );
          })}
        </svg>
      </div>

      <MapPlaceSheet
        open={Boolean(selectedCity)}
        locale={locale}
        city={selectedCity}
        county={selectedCounty}
        onClose={() => {
          setSelectedSlug(null);
          setSelectedCounty(null);
        }}
        onBackToCity={() => setSelectedCounty(null)}
        onSelectCounty={(county) => setSelectedCounty(county)}
      />
    </section>
  );
}
