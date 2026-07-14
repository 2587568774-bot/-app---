import promoImages from '@/data/promo-images.json';
import countyPromoImages from '@/data/county-promo-images.json';

export type PromoCityImages = {
  cover: string | null;
  gallery: string[];
  credit?: string;
  tourism_site?: string;
  tourism_site_name?: string;
  source?: string;
};

type CountyPromoFile = {
  counties?: Record<string, PromoCityImages & { parentSlug?: string }>;
  cities?: Record<string, PromoCityImages>;
};

type CityPromoFile = {
  cities?: Record<string, PromoCityImages>;
};

export function getPromoImages(slug: string, parentSlug?: string): PromoCityImages | null {
  const countyPack = countyPromoImages as CountyPromoFile;
  const cityPack = promoImages as CityPromoFile;
  const key = slug.toLowerCase();
  const parent = (parentSlug || '').toLowerCase();

  // 1) exact county pack
  if (countyPack.counties?.[key]) return countyPack.counties[key];

  // 2) exact city promo
  if (cityPack.cities?.[key]) return cityPack.cities[key];
  if (countyPack.cities?.[key]) return countyPack.cities[key];

  // 3) parent city promo for counties without own pack
  if (parent && cityPack.cities?.[parent]) return cityPack.cities[parent];
  if (parent && countyPack.cities?.[parent]) return countyPack.cities[parent];

  // 4) prefix fallback
  const cityKeys = Object.keys(cityPack.cities || {});
  const hit = cityKeys.find((c) => key.startsWith(c) || parent.startsWith(c));
  return hit ? cityPack.cities![hit] : null;
}
