import dataset from '@/data/yunnan-regions.json';
import type { CityRecord, CountyRecord, PlaceView, RegionDataset } from './types';

const data = dataset as RegionDataset;
const FALLBACK = ['en', 'zh-Hans'] as const;

export function pickName(names: Partial<Record<string, string>> | undefined, locale: string): string {
  if (!names) return 'Unknown';
  if (names[locale]) return names[locale] as string;
  for (const key of FALLBACK) {
    if (names[key]) return names[key] as string;
  }
  return Object.values(names)[0] || 'Unknown';
}

export function getDataset(): RegionDataset {
  return data;
}

export function listCities(locale: string): PlaceView[] {
  return data.cities
    .map((city) => cityToView(city, locale))
    .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.name.localeCompare(b.name, locale));
}

export function getFeaturedCities(locale: string, limit = 5): PlaceView[] {
  return listCities(locale).filter((c) => c.is_featured).slice(0, limit);
}

export function getCityBySlug(slug: string): CityRecord | undefined {
  return data.cities.find((c) => c.slug === slug);
}

export function getCountyBySlug(slug: string): { city: CityRecord; county: CountyRecord } | undefined {
  for (const city of data.cities) {
    const county = city.counties.find((c) => c.slug === slug);
    if (county) return { city, county };
  }
  return undefined;
}

export function getPlaceBySlug(slug: string, locale: string): PlaceView | undefined {
  if (slug === data.province.slug) {
    return {
      code: data.province.code,
      slug: data.province.slug,
      level: 'province',
      name: pickName(data.province.names, locale),
      summary: pickName(
        {
          'zh-Hans': '云南位于中国西南，地形立体、气候多元。',
          en: 'Yunnan spans tropical valleys to alpine plateaus.',
        },
        locale,
      ),
      lat: data.province.lat,
      lng: data.province.lng,
      altitude_m: data.province.altitude_m,
      childCount: data.cities.length,
    };
  }

  const city = getCityBySlug(slug);
  if (city) return cityToView(city, locale);

  const found = getCountyBySlug(slug);
  if (!found) return undefined;
  return countyToView(found.city, found.county, locale);
}

export function listCountiesForCity(citySlug: string, locale: string): PlaceView[] {
  const city = getCityBySlug(citySlug);
  if (!city) return [];
  return city.counties.map((county) => countyToView(city, county, locale));
}

export function searchPlaces(query: string, locale: string, limit = 30): PlaceView[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: PlaceView[] = [];

  for (const city of data.cities) {
    const cityView = cityToView(city, locale);
    if (matches(city, cityView, q)) results.push(cityView);
    for (const county of city.counties) {
      const countyView = countyToView(city, county, locale);
      if (matches(county, countyView, q)) results.push(countyView);
    }
  }

  return results.slice(0, limit);
}

function matches(
  record: { slug: string; code: string; names: Partial<Record<string, string>> },
  view: PlaceView,
  q: string,
): boolean {
  if (record.slug.toLowerCase().includes(q) || record.code.includes(q)) return true;
  if (view.name.toLowerCase().includes(q)) return true;
  return Object.values(record.names).some((n) => n?.toLowerCase().includes(q));
}

function cityToView(city: CityRecord, locale: string): PlaceView {
  return {
    code: city.code,
    slug: city.slug,
    level: 'city',
    name: pickName(city.names, locale),
    summary: pickName(city.summary, locale),
    lat: city.lat,
    lng: city.lng,
    altitude_m: city.altitude_m,
    climate_type: city.climate_type,
    cost_of_living_index: city.cost_of_living_index,
    migration_friendliness: city.migration_friendliness,
    best_months: city.best_months,
    food_blurb: city.food_blurb,
    scenery_blurb: city.scenery_blurb,
    migration_blurb: city.migration_blurb,
    is_featured: city.is_featured,
    childCount: city.counties.length,
  };
}

function countyToView(city: CityRecord, county: CountyRecord, locale: string): PlaceView {
  return {
    code: county.code,
    slug: county.slug,
    level: 'county',
    name: pickName(county.names, locale),
    summary: pickName(county.summary, locale),
    lat: county.lat,
    lng: county.lng,
    altitude_m: county.altitude_m,
    climate_type: city.climate_type,
    cost_of_living_index: city.cost_of_living_index
      ? Math.max(30, city.cost_of_living_index - 3)
      : undefined,
    migration_friendliness: city.migration_friendliness,
    best_months: city.best_months,
    food_blurb: city.food_blurb,
    scenery_blurb: city.scenery_blurb,
    migration_blurb: city.migration_blurb,
    parentSlug: city.slug,
    parentName: pickName(city.names, locale),
  };
}

export function stats() {
  return {
    cities: data.cities.length,
    counties: data.cities.reduce((n, c) => n + c.counties.length, 0),
    source: data.source,
  };
}