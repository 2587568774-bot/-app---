import fs from 'fs';
import path from 'path';
import dataset from '@/data/yunnan-regions.json';
import type { CityRecord, CountyRecord, RegionDataset } from './types';
import { scoreCity, scoreCounty } from './completeness';

export type AdminDraft = {
  updated_at: string;
  cities: Record<string, Partial<CityRecord>>;
  counties: Record<string, Partial<CountyRecord> & { parentSlug?: string }>;
};

const draftPath = path.join(process.cwd(), 'src/data/admin-drafts.json');

function emptyDraft(): AdminDraft {
  return { updated_at: new Date().toISOString(), cities: {}, counties: {} };
}

export function readDrafts(): AdminDraft {
  try {
    if (!fs.existsSync(draftPath)) return emptyDraft();
    return JSON.parse(fs.readFileSync(draftPath, 'utf8')) as AdminDraft;
  } catch {
    return emptyDraft();
  }
}

export function writeDrafts(draft: AdminDraft) {
  const dir = path.dirname(draftPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  draft.updated_at = new Date().toISOString();
  fs.writeFileSync(draftPath, JSON.stringify(draft, null, 2), 'utf8');
}

export function getMergedDataset(): RegionDataset {
  const base = structuredClone(dataset) as RegionDataset;
  const drafts = readDrafts();

  for (const city of base.cities) {
    const patch = drafts.cities[city.slug];
    if (patch) Object.assign(city, patch, { counties: city.counties });
    for (const county of city.counties) {
      const cpatch = drafts.counties[county.slug];
      if (cpatch) {
        const { parentSlug, ...rest } = cpatch; void parentSlug;
        Object.assign(county, rest);
      }
    }
  }
  return base;
}

export type AdminListItem = {
  slug: string;
  code: string;
  level: 'city' | 'county';
  name: string;
  parentSlug?: string;
  parentName?: string;
  completeness: number;
  is_featured?: boolean;
};

export function listAdminRegions(locale = 'zh-Hans'): AdminListItem[] {
  const data = getMergedDataset();
  const items: AdminListItem[] = [];
  for (const city of data.cities) {
    items.push({
      slug: city.slug,
      code: city.code,
      level: 'city',
      name: city.names[locale as 'zh-Hans'] || city.names.en || city.slug,
      completeness: scoreCity(city),
      is_featured: city.is_featured,
    });
    for (const county of city.counties) {
      items.push({
        slug: county.slug,
        code: county.code,
        level: 'county',
        name: county.names[locale as 'zh-Hans'] || county.names.en || county.slug,
        parentSlug: city.slug,
        parentName: city.names[locale as 'zh-Hans'] || city.names.en || city.slug,
        completeness: scoreCounty(county, city),
      });
    }
  }
  return items.sort((a, b) => a.completeness - b.completeness || a.name.localeCompare(b.name, 'zh'));
}

export function getAdminPlace(slug: string) {
  const data = getMergedDataset();
  const city = data.cities.find((c) => c.slug === slug);
  if (city) {
    return { kind: 'city' as const, city, completeness: scoreCity(city) };
  }
  for (const parent of data.cities) {
    const county = parent.counties.find((c) => c.slug === slug);
    if (county) {
      return {
        kind: 'county' as const,
        city: parent,
        county,
        completeness: scoreCounty(county, parent),
      };
    }
  }
  return null;
}

export function saveAdminPlace(
  slug: string,
  payload: Record<string, unknown>,
): { ok: true } | { ok: false; error: string } {
  const found = getAdminPlace(slug);
  if (!found) return { ok: false, error: 'Place not found' };
  const drafts = readDrafts();

  if (found.kind === 'city') {
    drafts.cities[slug] = {
      ...(drafts.cities[slug] || {}),
      names: {
        ...(found.city.names || {}),
        ...((payload.names as object) || {}),
      },
      summary: {
        ...(found.city.summary || {}),
        ...((payload.summary as object) || {}),
      },
      climate_type: String(payload.climate_type ?? found.city.climate_type ?? ''),
      cost_of_living_index: num(payload.cost_of_living_index, found.city.cost_of_living_index),
      migration_friendliness: num(payload.migration_friendliness, found.city.migration_friendliness),
      food_blurb: String(payload.food_blurb ?? found.city.food_blurb ?? ''),
      scenery_blurb: String(payload.scenery_blurb ?? found.city.scenery_blurb ?? ''),
      migration_blurb: String(payload.migration_blurb ?? found.city.migration_blurb ?? ''),
      is_featured: Boolean(payload.is_featured),
      altitude_m: num(payload.altitude_m, found.city.altitude_m) ?? found.city.altitude_m,
      cover_url: strOrKeep(payload.cover_url, found.city.cover_url),
      gallery: arrOrKeep(payload.gallery, found.city.gallery),
    };
  } else {
    drafts.counties[slug] = {
      ...(drafts.counties[slug] || {}),
      parentSlug: found.city.slug,
      names: {
        ...(found.county.names || {}),
        ...((payload.names as object) || {}),
      },
      summary: {
        ...(found.county.summary || {}),
        ...((payload.summary as object) || {}),
      },
      altitude_m: num(payload.altitude_m, found.county.altitude_m) ?? found.county.altitude_m,
      cover_url: strOrKeep(payload.cover_url, found.county.cover_url),
      gallery: arrOrKeep(payload.gallery, found.county.gallery),
    };
  }

  writeDrafts(drafts);
  return { ok: true };
}

function num(v: unknown, fallback?: number) {
  if (v === '' || v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function strOrKeep(v: unknown, fallback?: string) {
  if (v === undefined) return fallback;
  const s = String(v || '').trim();
  return s || undefined;
}

function arrOrKeep(v: unknown, fallback?: string[]) {
  if (v === undefined) return fallback;
  if (!Array.isArray(v)) return fallback;
  return v.map((x) => String(x || '').trim()).filter(Boolean);
}