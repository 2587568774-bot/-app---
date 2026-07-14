'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type WeatherPayload = {
  temperature?: number;
  weathercode?: number;
  windspeed?: number;
  time?: string;
  error?: string;
};

export function WeatherStrip({ lat, lng }: { lat: number; lng: number }) {
  const t = useTranslations('weather');
  const [data, setData] = useState<WeatherPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        const json = (await res.json()) as WeatherPayload;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData({ error: t('unavailable') });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [lat, lng, t]);

  if (!data) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/60">
        {t('loading')}
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/60">
        {data.error === 'Weather unavailable' ? t('unavailable') : data.error}
      </div>
    );
  }

  const weatherKeyByCode: Record<number, string> = {
    0: 'clear',
    1: 'mainlyClear',
    2: 'partlyCloudy',
    3: 'overcast',
    45: 'fog',
    48: 'rimeFog',
    51: 'lightDrizzle',
    61: 'rain',
    71: 'snow',
    80: 'rainShowers',
    95: 'thunderstorm',
  };

  const label =
    data.weathercode != null
      ? weatherKeyByCode[data.weathercode]
        ? t(weatherKeyByCode[data.weathercode] as 'clear')
        : t('code', { code: data.weathercode })
      : '—';

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-plateau/20 bg-plateau/5 px-4 py-3 text-sm">
      <span className="font-semibold text-plateau">{t('live')}</span>
      <span>{data.temperature != null ? `${data.temperature}°C` : '—'}</span>
      <span>{label}</span>
      <span className="text-ink/60">
        {data.windspeed != null ? t('wind', { speed: data.windspeed }) : '—'}
      </span>
    </div>
  );
}
