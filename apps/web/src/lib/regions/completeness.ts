import type { CityRecord, CountyRecord } from './types';

export function scoreCity(city: Partial<CityRecord>): number {
  let score = 0;
  const checks: Array<[boolean, number]> = [
    [Boolean(city.lat && city.lng), 15],
    [Boolean(city.altitude_m), 10],
    [Boolean(city.climate_type), 10],
    [city.cost_of_living_index != null, 10],
    [city.migration_friendliness != null, 10],
    [Boolean(city.best_months?.length), 5],
    [Boolean(city.food_blurb), 10],
    [Boolean(city.scenery_blurb), 10],
    [Boolean(city.migration_blurb), 10],
    [Boolean(city.summary?.en || city.summary?.['zh-Hans']), 10],
  ];
  for (const [ok, points] of checks) if (ok) score += points;
  return Math.min(100, score);
}

export function scoreCounty(county: Partial<CountyRecord>, parent?: Partial<CityRecord>): number {
  let score = 20;
  if (county.lat && county.lng) score += 20;
  if (county.altitude_m) score += 15;
  if (county.summary?.en || county.summary?.['zh-Hans']) score += 20;
  if (parent?.food_blurb) score += 10;
  if (parent?.scenery_blurb) score += 10;
  if (parent?.climate_type) score += 5;
  return Math.min(100, score);
}

export function completenessLabel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 80) return 'high';
  if (score >= 55) return 'medium';
  return 'low';
}