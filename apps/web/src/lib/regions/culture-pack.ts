import type { Bilingual, EthnicGroup, FoodItem, PlaceCulturePack } from './culture-types';
import { getMergedCulturePack } from './culture-admin';

export type { Bilingual, EthnicGroup, FoodItem, PlaceCulturePack };
export { pickBi } from './culture-types';

export function getPlaceCulturePack(slug: string, parentSlug?: string): PlaceCulturePack {
  return getMergedCulturePack(slug, parentSlug);
}
