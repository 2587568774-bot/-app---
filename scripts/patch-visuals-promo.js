const fs = require('fs');
const p = 'apps/web/src/lib/regions/visuals.ts';
let s = fs.readFileSync(p, 'utf8');
if (!s.includes("from './promo-images'")) {
  s = "import { getPromoImages } from './promo-images';\n" + s;
}
const neu = `export function resolvePlaceImages(input: {
  slug: string;
  parentSlug?: string;
  cover_url?: string | null;
  gallery?: string[] | null;
}): { cover: string; gallery: string[]; credit: string; mood: string } {
  const visual = getPlaceVisual(input.slug, input.parentSlug);
  const promo = getPromoImages(input.slug, input.parentSlug);
  const promoGallery = (promo?.gallery || []).filter(Boolean) as string[];
  const galleryList = [
    ...(input.cover_url ? [input.cover_url] : []),
    ...((input.gallery || []).filter(Boolean) as string[]),
    ...promoGallery,
    ...visual.gallery,
  ];
  const unique = [...new Set(galleryList)].filter(Boolean);
  const hasLocal = Boolean(input.cover_url || (input.gallery && input.gallery.length));
  return {
    cover: input.cover_url || promo?.cover || unique[0] || visual.cover,
    gallery: unique.length ? unique : [visual.cover],
    credit: hasLocal
      ? 'Local upload'
      : promo?.cover
        ? promo.credit || 'Promo tourism images'
        : visual.credit,
    mood: visual.mood,
  };
}`;
if (!s.includes('export function resolvePlaceImages')) {
  console.error('resolvePlaceImages missing');
  process.exit(1);
}
s = s.replace(/export function resolvePlaceImages\([\s\S]*?\n\}/m, neu.trim());
fs.writeFileSync(p, s);
console.log('patched visuals.ts');
