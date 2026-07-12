import {
  cityToView,
  countyToView,
  listCitiesFrom,
  pickName,
  searchPlacesIn,
} from './data';
import { getMergedDataset } from './admin';
import { shouldUseSupabase } from '@/lib/data-source';
import { loadRegionsFromSupabase } from './supabase-regions';
import type { CityRecord, PlaceView, RegionDataset } from './types';

let cachedSupabase: { at: number; data: RegionDataset | null } | null = null;
const TTL = 60_000;

async function resolveDataset(): Promise<RegionDataset> {
  if (shouldUseSupabase()) {
    const now = Date.now();
    if (cachedSupabase && now - cachedSupabase.at < TTL && cachedSupabase.data) {
      return cachedSupabase.data;
    }
    const remote = await loadRegionsFromSupabase();
    if (remote && remote.cities.length > 0) {
      cachedSupabase = { at: now, data: remote };
      return remote;
    }
  }
  // local JSON + admin drafts
  return getMergedDataset();
}

export async function listCities(locale: string): Promise<PlaceView[]> {
  const data = await resolveDataset();
  return listCitiesFrom(data, locale);
}

export async function getFeaturedCities(locale: string, limit = 5): Promise<PlaceView[]> {
  const cities = await listCities(locale);
  return cities.filter((c) => c.is_featured).slice(0, limit);
}

export async function getCityBySlug(slug: string): Promise<CityRecord | undefined> {
  const data = await resolveDataset();
  return data.cities.find((c) => c.slug === slug);
}

export async function getCountyBySlug(slug: string) {
  const data = await resolveDataset();
  for (const city of data.cities) {
    const county = city.counties.find((c) => c.slug === slug);
    if (county) return { city, county };
  }
  return undefined;
}

export async function listCountiesForCity(citySlug: string, locale: string): Promise<PlaceView[]> {
  const city = await getCityBySlug(citySlug);
  if (!city) return [];
  return city.counties.map((county) => countyToView(city, county, locale));
}

export async function searchPlaces(query: string, locale: string, limit = 30): Promise<PlaceView[]> {
  const data = await resolveDataset();
  return searchPlacesIn(data, query, locale, limit);
}

export async function stats() {
  const data = await resolveDataset();
  return {
    cities: data.cities.length,
    counties: data.cities.reduce((n, c) => n + c.counties.length, 0),
    source: data.source,
  };
}

export async function getDataSourceLabel() {
  const data = await resolveDataset();
  return data.source;
}

export { pickName, cityToView, countyToView };