import { getSupabasePublicClient } from '@/lib/supabase/public';
import type { CityRecord, CountyRecord, RegionDataset } from './types';

type RegionRow = {
  id: string;
  parent_id: string | null;
  level: 'province' | 'city' | 'county';
  code: string;
  slug: string;
  lat: number | null;
  lng: number | null;
  altitude_m: number | null;
  status: string;
  completeness_score: number;
  is_featured: boolean;
};

type I18nRow = {
  region_id: string;
  locale: string;
  name: string;
  summary: string | null;
  food_blurb: string | null;
  scenery_blurb: string | null;
  migration_blurb: string | null;
};

type MetricsRow = {
  region_id: string;
  climate_type: string | null;
  cost_of_living_index: number | null;
  migration_friendliness: number | null;
  best_months: number[] | null;
};

function namesFromI18n(rows: I18nRow[]) {
  const names: Record<string, string> = {};
  const summary: Record<string, string> = {};
  const foodBy: Record<string, string> = {};
  const sceneryBy: Record<string, string> = {};
  const migrationBy: Record<string, string> = {};
  for (const row of rows) {
    names[row.locale] = row.name;
    if (row.summary) summary[row.locale] = row.summary;
    if (row.food_blurb) foodBy[row.locale] = row.food_blurb;
    if (row.scenery_blurb) sceneryBy[row.locale] = row.scenery_blurb;
    if (row.migration_blurb) migrationBy[row.locale] = row.migration_blurb;
  }
  const pickBlurb = (map: Record<string, string>) =>
    map.en || map['zh-Hans'] || map['zh-Hant'] || map.ja || map.ko || Object.values(map)[0] || '';
  return {
    names,
    summary,
    food: pickBlurb(foodBy),
    scenery: pickBlurb(sceneryBy),
    migration: pickBlurb(migrationBy),
  };
}

export async function loadRegionsFromSupabase(): Promise<RegionDataset | null> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  const [{ data: regions, error: rErr }, { data: i18n, error: iErr }, { data: metrics, error: mErr }] =
    await Promise.all([
      supabase.from('regions').select('*').eq('status', 'published'),
      supabase.from('region_i18n').select('*'),
      supabase.from('region_metrics').select('*'),
    ]);

  if (rErr || iErr || mErr || !regions) {
    console.warn('[regions] supabase load failed', rErr?.message || iErr?.message || mErr?.message);
    return null;
  }

  const regionRows = regions as RegionRow[];
  const i18nRows = (i18n || []) as I18nRow[];
  const metricsRows = (metrics || []) as MetricsRow[];

  const i18nByRegion = new Map<string, I18nRow[]>();
  for (const row of i18nRows) {
    const list = i18nByRegion.get(row.region_id) || [];
    list.push(row);
    i18nByRegion.set(row.region_id, list);
  }
  const metricsByRegion = new Map(metricsRows.map((m) => [m.region_id, m]));

  const province = regionRows.find((r) => r.level === 'province');
  if (!province) return null;

  const citiesRows = regionRows.filter((r) => r.level === 'city');
  const countiesRows = regionRows.filter((r) => r.level === 'county');

  const cities: CityRecord[] = citiesRows.map((city) => {
    const i18nPack = namesFromI18n(i18nByRegion.get(city.id) || []);
    const m = metricsByRegion.get(city.id);
    const childCounties = countiesRows.filter((c) => c.parent_id === city.id);
    const counties: CountyRecord[] = childCounties.map((county) => {
      const ci = namesFromI18n(i18nByRegion.get(county.id) || []);
      return {
        code: county.code,
        slug: county.slug,
        level: 'county',
        lat: county.lat || 0,
        lng: county.lng || 0,
        altitude_m: county.altitude_m || 0,
        names: ci.names,
        summary: ci.summary,
      };
    });

    return {
      code: city.code,
      slug: city.slug,
      level: 'city',
      lat: city.lat || 0,
      lng: city.lng || 0,
      altitude_m: city.altitude_m || 0,
      is_featured: city.is_featured,
      climate_type: m?.climate_type || undefined,
      cost_of_living_index: m?.cost_of_living_index ?? undefined,
      migration_friendliness: m?.migration_friendliness ?? undefined,
      best_months: m?.best_months || undefined,
      names: i18nPack.names,
      summary: i18nPack.summary,
      food_blurb: i18nPack.food || undefined,
      scenery_blurb: i18nPack.scenery || undefined,
      migration_blurb: i18nPack.migration || undefined,
      counties,
    };
  });

  const pI18n = namesFromI18n(i18nByRegion.get(province.id) || []);

  return {
    province: {
      code: province.code,
      slug: province.slug,
      level: 'province',
      lat: province.lat || 25.0453,
      lng: province.lng || 102.7097,
      altitude_m: province.altitude_m || 1890,
      names: pI18n.names,
    },
    cities,
    generated_at: new Date().toISOString(),
    source: 'supabase',
  };
}