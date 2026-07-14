const fs = require('fs');
const p = 'apps/web/src/lib/regions/visuals.ts';
let s = fs.readFileSync(p, 'utf8');
const idx = s.indexOf('export function resolvePlaceImages');
if (idx < 0) {
  console.error('missing function');
  process.exit(1);
}
const head = s.slice(0, idx);
const fn = `export function resolvePlaceImages(input: {
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
}
`;
let out = head + fn + '\n';
if (!out.includes("from './promo-images'")) {
  out = "import { getPromoImages } from './promo-images';\n" + out;
}
fs.writeFileSync(p, out);
console.log('ok', out.length);
