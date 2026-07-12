import { NextResponse } from 'next/server';

const cache = new Map<string, { at: number; payload: unknown }>();
const TTL_MS = 15 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return NextResponse.json(hit.payload);
  }

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(lat));
    url.searchParams.set('longitude', String(lng));
    url.searchParams.set('current_weather', 'true');
    url.searchParams.set('timezone', 'Asia/Shanghai');

    const res = await fetch(url.toString(), { next: { revalidate: 900 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream weather failed' }, { status: 502 });
    }
    const json = await res.json();
    const current = json.current_weather || {};
    const payload = {
      temperature: current.temperature,
      windspeed: current.windspeed,
      weathercode: current.weathercode,
      time: current.time,
      lat,
      lng,
      source: 'open-meteo',
    };
    cache.set(key, { at: Date.now(), payload });
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: 'Weather unavailable' }, { status: 503 });
  }
}