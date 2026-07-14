const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_PROMO = path.join(ROOT, 'apps/web/src/data/promo-images.json');
const OUT_SITES = path.join(ROOT, 'apps/web/src/data/tourism-sites.json');
const UPLOAD_DIR = path.join(ROOT, 'apps/web/public/uploads/promo');
const sitesDoc = JSON.parse(fs.readFileSync(OUT_SITES, 'utf8'));
const promo = JSON.parse(fs.readFileSync(OUT_PROMO, 'utf8'));
const sites = sitesDoc.cities || [];

function listLocal(slug) {
  const dir = path.join(UPLOAD_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map((f) => {
      const full = path.join(dir, f);
      const size = fs.statSync(full).size;
      return {
        file: f,
        full,
        size,
        url: `/uploads/promo/${slug}/${f}`,
        score: size + (/fill-|scenic|banner|slide|hero/i.test(f) ? 200000 : 0) - (/logo|icon|conac|jiucuo|baog/i.test(f) ? 500000 : 0),
      };
    })
    .filter((x) => x.size >= 30000)
    .sort((a, b) => b.score - a.score);
}

for (const site of sites) {
  const local = listLocal(site.slug);
  if (!local.length) continue;
  const gallery = local.slice(0, 6).map((x) => x.url);
  const prev = promo.cities[site.slug] || {};
  promo.cities[site.slug] = {
    cover: gallery[0],
    gallery,
    credit: prev.credit || `${site.nameZh} promo`,
    tourism_site: site.url,
    tourism_site_name: site.nameZh,
    source: prev.source || 'local',
    replace_with: `Replace with official photos from ${site.nameZh} (${site.url}) via admin upload`,
  };
  console.log(site.slug, Math.round(local[0].size/1024)+'kb', gallery[0], 'n='+gallery.length);
}

// ensure clean tourism sites doc
const cleanSites = {
  generated_at: new Date().toISOString(),
  note: '16 prefecture-level culture/tourism entry points for See Yunnan. Prefer bureau/tourism portals; municipal government portals used when dedicated tourism domains are unavailable.',
  cities: sites.map((s) => ({
    slug: s.slug,
    nameZh: s.nameZh,
    nameEn: s.nameEn,
    url: s.url,
    type: s.type,
  })),
};
fs.writeFileSync(OUT_SITES, JSON.stringify(cleanSites, null, 2) + '\n', 'utf8');

promo.generated_at = new Date().toISOString();
promo.note = '16-city promo pack. Local files under /uploads/promo/{slug}/. Prefer tourism-site mirrors; open scenic fills used where official sites block scraping. Admin upload overrides these.';
promo.source = 'tourism-sites+local-promo';
fs.writeFileSync(OUT_PROMO, JSON.stringify(promo, null, 2) + '\n', 'utf8');
console.log('updated promo + tourism sites');
