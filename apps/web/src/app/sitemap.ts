import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getSiteUrl } from '@/lib/site';
import regions from '@/data/yunnan-regions.json';

const staticPaths = ['', '/cities', '/guides', '/pricing', '/search', '/guides/apply'];

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${site}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === '' || path === '/cities' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : path === '/cities' ? 0.9 : 0.7,
      });
    }

    for (const city of (regions as { cities: Array<{ slug: string; counties?: Array<{ slug: string }> }> }).cities) {
      entries.push({
        url: `${site}/${locale}/cities/${city.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
      for (const county of city.counties || []) {
        entries.push({
          url: `${site}/${locale}/places/${county.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
