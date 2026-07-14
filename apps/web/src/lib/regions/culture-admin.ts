import fs from 'fs';
import path from 'path';
import basePack from '@/data/place-culture.json';
import type { Bilingual, EthnicGroup, FoodItem, PlaceCulturePack } from './culture-types';

export type CultureDraft = {
  foodItems?: FoodItem[];
  cultureImages?: string[];
  ethnicGroups?: EthnicGroup[];
  ethnicNote?: Bilingual;
};

export type CultureDraftStore = {
  updated_at: string;
  places: Record<string, CultureDraft>;
};

const draftPath = path.join(process.cwd(), 'src/data/culture-drafts.json');

function emptyStore(): CultureDraftStore {
  return { updated_at: new Date().toISOString(), places: {} };
}

export function readCultureDrafts(): CultureDraftStore {
  try {
    if (!fs.existsSync(draftPath)) return emptyStore();
    return JSON.parse(fs.readFileSync(draftPath, 'utf8')) as CultureDraftStore;
  } catch {
    return emptyStore();
  }
}

export function writeCultureDrafts(store: CultureDraftStore) {
  const dir = path.dirname(draftPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  store.updated_at = new Date().toISOString();
  fs.writeFileSync(draftPath, JSON.stringify(store, null, 2), 'utf8');
}

const cities = (basePack as { cities: Record<string, PlaceCulturePack> }).cities;

function resolveCityKey(slug: string, parentSlug?: string): string {
  const key = slug.toLowerCase();
  const parent = (parentSlug || '').toLowerCase();
  if (cities[key]) return key;
  if (cities[parent]) return parent;
  const hit = Object.keys(cities).find((c) => key.startsWith(c) || parent.startsWith(c));
  return hit || '';
}

const FALLBACK: PlaceCulturePack = {
  foodItems: [
    {
      name: { en: 'Local market food', 'zh-Hans': '本地市井小吃' },
      note: {
        en: 'Street markets and home kitchens are the fastest way into local taste.',
        'zh-Hans': '早市与家常馆是最快进入本地味道的方式。',
      },
      image:
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  cultureImages: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  ],
  ethnicGroups: [
    { name: { en: 'Han', 'zh-Hans': '汉族' }, share: 'majority' },
    { name: { en: 'Minority communities', 'zh-Hans': '少数民族社区' }, share: 'local' },
  ],
  ethnicNote: {
    en: 'Yunnan is one of China’s most ethnically diverse provinces.',
    'zh-Hans': '云南是中国民族多样性最高的省份之一。',
  },
};

export function getBaseCulturePack(slug: string, parentSlug?: string): PlaceCulturePack {
  const key = resolveCityKey(slug, parentSlug);
  return key && cities[key] ? structuredClone(cities[key]) : structuredClone(FALLBACK);
}

export function mergeCulturePack(
  base: PlaceCulturePack,
  draft?: CultureDraft | null,
): PlaceCulturePack {
  if (!draft) return base;
  return {
    foodItems:
      draft.foodItems && draft.foodItems.length > 0 ? draft.foodItems : base.foodItems,
    cultureImages:
      draft.cultureImages && draft.cultureImages.length > 0
        ? draft.cultureImages
        : base.cultureImages,
    ethnicGroups:
      draft.ethnicGroups && draft.ethnicGroups.length > 0
        ? draft.ethnicGroups
        : base.ethnicGroups,
    ethnicNote: draft.ethnicNote?.en || draft.ethnicNote?.['zh-Hans']
      ? {
          en: draft.ethnicNote.en || base.ethnicNote.en,
          'zh-Hans': draft.ethnicNote['zh-Hans'] || base.ethnicNote['zh-Hans'],
        }
      : base.ethnicNote,
  };
}

export function getMergedCulturePack(slug: string, parentSlug?: string): PlaceCulturePack {
  const drafts = readCultureDrafts();
  const base = getBaseCulturePack(slug, parentSlug);
  const own = drafts.places[slug];
  if (own) return mergeCulturePack(base, own);
  if (parentSlug && drafts.places[parentSlug]) {
    return mergeCulturePack(base, drafts.places[parentSlug]);
  }
  return base;
}

export function saveCultureDraft(
  slug: string,
  payload: CultureDraft,
): { ok: true } | { ok: false; error: string } {
  if (!slug) return { ok: false, error: 'slug required' };
  const store = readCultureDrafts();
  const prev = store.places[slug] || {};
  const next: CultureDraft = { ...prev };

  if (payload.foodItems !== undefined) {
    next.foodItems = normalizeFoodItems(payload.foodItems);
  }
  if (payload.cultureImages !== undefined) {
    next.cultureImages = (payload.cultureImages || [])
      .map((x) => String(x || '').trim())
      .filter(Boolean);
  }
  if (payload.ethnicGroups !== undefined) {
    next.ethnicGroups = normalizeEthnicGroups(payload.ethnicGroups);
  }
  if (payload.ethnicNote !== undefined) {
    next.ethnicNote = {
      en: String(payload.ethnicNote.en || '').trim(),
      'zh-Hans': String(payload.ethnicNote['zh-Hans'] || '').trim(),
    };
  }

  store.places[slug] = next;
  writeCultureDrafts(store);
  return { ok: true };
}

function normalizeFoodItems(items: FoodItem[]): FoodItem[] {
  return (items || [])
    .map((item) => ({
      name: {
        en: String(item?.name?.en || '').trim(),
        'zh-Hans': String(item?.name?.['zh-Hans'] || '').trim(),
      },
      note: {
        en: String(item?.note?.en || '').trim(),
        'zh-Hans': String(item?.note?.['zh-Hans'] || '').trim(),
      },
      image: String(item?.image || '').trim(),
    }))
    .filter((item) => item.name.en || item.name['zh-Hans'] || item.image);
}

function normalizeEthnicGroups(groups: EthnicGroup[]): EthnicGroup[] {
  return (groups || [])
    .map((g) => ({
      name: {
        en: String(g?.name?.en || '').trim(),
        'zh-Hans': String(g?.name?.['zh-Hans'] || '').trim(),
      },
      share: String(g?.share || '').trim(),
    }))
    .filter((g) => g.name.en || g.name['zh-Hans']);
}
