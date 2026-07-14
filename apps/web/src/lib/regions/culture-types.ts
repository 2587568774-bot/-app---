export type Bilingual = { en: string; 'zh-Hans': string };

export type FoodItem = {
  name: Bilingual;
  note: Bilingual;
  image: string;
};

export type EthnicGroup = {
  name: Bilingual;
  share: string;
};

export type PlaceCulturePack = {
  foodItems: FoodItem[];
  cultureImages: string[];
  ethnicGroups: EthnicGroup[];
  ethnicNote: Bilingual;
};

export function pickBi(map: Bilingual, locale: string): string {
  if (locale.startsWith('zh')) return map['zh-Hans'] || map.en;
  return map.en;
}
