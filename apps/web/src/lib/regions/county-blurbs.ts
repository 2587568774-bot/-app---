import countyBlurbs from '@/data/county-blurbs.json';

export type BiText = {
  en?: string;
  'zh-Hans'?: string;
  'zh-Hant'?: string;
  ja?: string;
  ko?: string;
  [key: string]: string | undefined;
};

export type CountyBlurb = {
  parentSlug?: string;
  altitude_m?: number | null;
  summary?: BiText;
  food?: BiText;
  scenery?: BiText;
  migration?: BiText;
};

type CountyBlurbFile = {
  counties?: Record<string, CountyBlurb>;
};

export function getCountyBlurb(slug: string): CountyBlurb | null {
  const pack = countyBlurbs as CountyBlurbFile;
  return pack.counties?.[slug.toLowerCase()] || null;
}

export function pickBlurb(map: BiText | undefined, locale: string, fallback = ''): string {
  if (!map) return fallback;
  if (map[locale]) return map[locale] || fallback;
  if (locale.startsWith('zh-Hant') && map['zh-Hant']) return map['zh-Hant'] || fallback;
  if (locale.startsWith('zh') && map['zh-Hans']) return map['zh-Hans'] || fallback;
  return map.en || map['zh-Hans'] || fallback;
}
