import {
  cityToView,
  countyToView,
  listCitiesFrom,
  pickName,
  searchPlacesIn,
} from './data';
import { getMergedDataset } from './admin';
import type { CityRecord, PlaceView } from './types';

export function listCities(locale: string): PlaceView[] {
  return listCitiesFrom(getMergedDataset(), locale);
}

export function getFeaturedCities(locale: string, limit = 5): PlaceView[] {
  return listCities(locale).filter((c) => c.is_featured).slice(0, limit);
}

export function getCityBySlug(slug: string): CityRecord | undefined {
  return getMergedDataset().cities.find((c) => c.slug === slug);
}

export function getCountyBySlug(slug: string) {
  for (const city of getMergedDataset().cities) {
    const county = city.counties.find((c) => c.slug === slug);
    if (county) return { city, county };
  }
  return undefined;
}

export function listCountiesForCity(citySlug: string, locale: string): PlaceView[] {
  const city = getCityBySlug(citySlug);
  if (!city) return [];
  return city.counties.map((county) => countyToView(city, county, locale));
}

export function searchPlaces(query: string, locale: string, limit = 30): PlaceView[] {
  return searchPlacesIn(getMergedDataset(), query, locale, limit);
}

export function stats() {
  const data = getMergedDataset();
  return {
    cities: data.cities.length,
    counties: data.cities.reduce((n, c) => n + c.counties.length, 0),
    source: data.source,
  };
}

export { pickName, cityToView, countyToView };