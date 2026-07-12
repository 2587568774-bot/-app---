'use client';

import { useEffect, useState } from 'react';

type WeatherPayload = {
  temperature?: number;
  weathercode?: number;
  windspeed?: number;
  time?: string;
  error?: string;
};

const WEATHER_LABELS: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  61: 'Rain',
  71: 'Snow',
  80: 'Rain showers',
  95: 'Thunderstorm',
};

export function WeatherStrip({ lat, lng }: { lat: number; lng: number }) {
  const [data, setData] = useState<WeatherPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        const json = (await res.json()) as WeatherPayload;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData({ error: 'Weather unavailable' });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  if (!data) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/60">
        Loading weather…
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/60">
        {data.error}
      </div>
    );
  }

  const label =
    data.weathercode != null ? WEATHER_LABELS[data.weathercode] || `Code ${data.weathercode}` : '—';

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-plateau/20 bg-plateau/5 px-4 py-3 text-sm">
      <span className="font-semibold text-plateau">Live weather</span>
      <span>{data.temperature != null ? `${data.temperature}°C` : '—'}</span>
      <span>{label}</span>
      <span className="text-ink/60">
        Wind {data.windspeed != null ? `${data.windspeed} km/h` : '—'}
      </span>
    </div>
  );
}