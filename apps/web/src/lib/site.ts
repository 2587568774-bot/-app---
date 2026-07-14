/** Public site URL used for SEO / sitemap / Open Graph. */
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`;
  }
  return 'http://localhost:3000';
}

export const SITE_NAME = 'See Yunnan / 看见云南';
export const SITE_DESCRIPTION_EN =
  'Discover Yunnan county by county — weather, altitude, food, culture, cost of living, migration tips, maps, and local guides.';
export const SITE_DESCRIPTION_ZH =
  '看见云南：按市州到县级了解天气、海拔、美食、人文、生活成本、移居友好度、地图导航与本地向导。';
