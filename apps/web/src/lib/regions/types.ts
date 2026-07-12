export type LocaleCode = 'en' | 'zh-Hans' | 'zh-Hant' | 'ja' | 'ko';

export type NamedMap = Partial<Record<LocaleCode, string>> & { en?: string; 'zh-Hans'?: string };

export type CountyRecord = {
  code: string;
  slug: string;
  level: 'county';
  lat: number;
  lng: number;
  altitude_m: number;
  names: NamedMap;
  summary: NamedMap;
};

export type CityRecord = {
  code: string;
  slug: string;
  level: 'city';
  lat: number;
  lng: number;
  altitude_m: number;
  is_featured?: boolean;
  climate_type?: string;
  cost_of_living_index?: number;
  migration_friendliness?: number;
  best_months?: number[];
  names: NamedMap;
  summary: NamedMap;
  food_blurb?: string;
  scenery_blurb?: string;
  migration_blurb?: string;
  counties: CountyRecord[];
};

export type RegionDataset = {
  province: {
    code: string;
    slug: string;
    level: 'province';
    lat: number;
    lng: number;
    altitude_m: number;
    names: NamedMap;
  };
  cities: CityRecord[];
  generated_at: string;
  source: string;
};

export type PlaceView = {
  code: string;
  slug: string;
  level: 'province' | 'city' | 'county';
  name: string;
  summary: string;
  lat: number;
  lng: number;
  altitude_m: number;
  climate_type?: string;
  cost_of_living_index?: number;
  migration_friendliness?: number;
  best_months?: number[];
  food_blurb?: string;
  scenery_blurb?: string;
  migration_blurb?: string;
  is_featured?: boolean;
  parentSlug?: string;
  parentName?: string;
  childCount?: number;
};