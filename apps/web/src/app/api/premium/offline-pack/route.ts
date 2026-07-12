import { NextResponse } from 'next/server';
import { getCityBySlug, getCountyBySlug } from '@/lib/regions/data-server';
import { saveOfflinePack } from '@/lib/premium/store';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body?.email || '').trim();
  const region_slug = String(body?.region_slug || '').trim();
  if (!email || !region_slug) {
    return NextResponse.json({ error: 'email and region_slug required' }, { status: 400 });
  }

  const saved = saveOfflinePack(email, region_slug);
  if ('error' in saved) return NextResponse.json(saved, { status: 403 });

  const city = await getCityBySlug(region_slug);
  const county = !city ? await getCountyBySlug(region_slug) : null;
  const payload = city
    ? {
        type: 'city',
        slug: city.slug,
        names: city.names,
        summary: city.summary,
        altitude_m: city.altitude_m,
        climate_type: city.climate_type,
        cost_of_living_index: city.cost_of_living_index,
        migration_friendliness: city.migration_friendliness,
        food_blurb: city.food_blurb,
        scenery_blurb: city.scenery_blurb,
        migration_blurb: city.migration_blurb,
        counties: city.counties.map((c) => ({
          slug: c.slug,
          names: c.names,
          summary: c.summary,
          altitude_m: c.altitude_m,
        })),
        note: 'Weather is live-only and not included in offline packs.',
      }
    : county
      ? {
          type: 'county',
          slug: county.county.slug,
          names: county.county.names,
          summary: county.county.summary,
          altitude_m: county.county.altitude_m,
          parent: county.city.slug,
          food_blurb: county.city.food_blurb,
          scenery_blurb: county.city.scenery_blurb,
          migration_blurb: county.city.migration_blurb,
          note: 'Weather is live-only and not included in offline packs.',
        }
      : null;

  if (!payload) return NextResponse.json({ error: 'Region not found' }, { status: 404 });

  return NextResponse.json({
    ok: true,
    pack: saved,
    payload,
  });
}