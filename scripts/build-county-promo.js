const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const regionsPath = path.join(ROOT, 'apps/web/src/data/yunnan-regions.json');
const promoPath = path.join(ROOT, 'apps/web/src/data/promo-images.json');
const outCountyPromo = path.join(ROOT, 'apps/web/src/data/county-promo-images.json');
const outCountyBlurbs = path.join(ROOT, 'apps/web/src/data/county-blurbs.json');

const regions = JSON.parse(fs.readFileSync(regionsPath, 'utf8'));
const promo = JSON.parse(fs.readFileSync(promoPath, 'utf8'));

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

const cities = {};
const counties = {};
let count = 0;

for (const city of regions.cities || []) {
  const pack = promo.cities?.[city.slug];
  const gallery = (pack?.gallery || []).filter(Boolean);
  const cover = pack?.cover || gallery[0] || null;
  if (cover || gallery.length) {
    cities[city.slug] = {
      cover,
      gallery: gallery.length ? gallery : cover ? [cover] : [],
      credit: pack?.credit || city.slug,
      tourism_site: pack?.tourism_site,
    };
  }

  for (const county of city.counties || []) {
    count += 1;
    const g = gallery.length ? gallery : cover ? [cover] : [];
    if (!g.length) continue;
    const idx = hash(county.slug) % g.length;
    const rotated = [...g.slice(idx), ...g.slice(0, idx)];
    counties[county.slug] = {
      parentSlug: city.slug,
      cover: rotated[0],
      gallery: rotated.slice(0, Math.min(6, rotated.length)),
      credit: (pack?.credit || city.slug) + ' · county variant',
      source: 'parent-city-rotated',
    };

    const zh = county.names?.['zh-Hans'] || county.slug;
    const en = county.names?.en || county.slug;
    const alt = county.altitude_m || city.altitude_m || null;
    const cityZh = city.names?.['zh-Hans'] || city.slug;
    const cityEn = city.names?.en || city.slug;
    outPushBlurb(county.slug, {
      parentSlug: city.slug,
      altitude_m: alt,
      names: county.names,
      summary: {
        en: `${en} sits in ${cityEn}${alt ? ` around ${alt} m` : ''}. Use this page for weather, lifestyle, food cues, and local guide leads before you plan a longer stay.`,
        'zh-Hans': `${zh}位于${cityZh}${alt ? `，海拔约 ${alt} 米` : ''}。这里适合先看天气、生活节奏、美食线索和本地向导，再决定停留多久。`,
        'zh-Hant': `${county.names?.['zh-Hant'] || zh}位於${city.names?.['zh-Hant'] || cityZh}${alt ? `，海拔約 ${alt} 公尺` : ''}。適合先看天氣、生活節奏、美食與在地向導，再決定停留多久。`,
        ja: `${en}は${cityEn}にあり${alt ? `、標高約${alt}m` : ''}。天気・暮らし・食・現地ガイドを確認してから滞在計画を立てましょう。`,
        ko: `${en}은(는) ${cityEn}에 있으며${alt ? ` 해발 약 ${alt}m` : ''}. 날씨, 생활 리듬, 음식, 현지 가이드를 먼저 확인한 뒤 체류를 계획하세요.`,
      },
      food: {
        en: `Local tables around ${en} follow ${cityEn} flavors: market breakfasts, regional noodles/rice dishes, and seasonal produce.`,
        'zh-Hans': `${zh}的餐桌贴近${cityZh}风味：早市、地方米线/米饭和应季食材。`,
      },
      scenery: {
        en: `${en} is a practical base for exploring ${cityEn}'s landscapes at a slower county pace.`,
        'zh-Hans': `${zh}适合以更慢的县级节奏，作为探索${cityZh}风景的落脚点。`,
      },
      migration: {
        en: `For relocation scouting, compare ${en}'s altitude, services distance to ${cityEn} center, and rainy-season access.`,
        'zh-Hans': `若考虑移居踩点，先比较${zh}的海拔、到${cityZh}中心的配套距离，以及雨季通行。`,
      },
    });
  }
}

function outPushBlurb(slug, data) {
  if (!globalThis.__blurbs) globalThis.__blurbs = {};
  globalThis.__blurbs[slug] = data;
}

const countyPromo = {
  generated_at: new Date().toISOString(),
  note: 'Per-county promo variants. Each county gets a rotated subset of its parent city promo gallery so cards/details feel distinct. Replace with true county photos via admin upload anytime.',
  source: 'parent-city-rotated',
  cities,
  counties,
};

const countyBlurbs = {
  generated_at: new Date().toISOString(),
  note: 'Lightweight per-county blurbs for place pages. Admin drafts and richer culture packs can override later.',
  counties: globalThis.__blurbs || {},
};

fs.writeFileSync(outCountyPromo, JSON.stringify(countyPromo, null, 2) + '\n', 'utf8');
fs.writeFileSync(outCountyBlurbs, JSON.stringify(countyBlurbs, null, 2) + '\n', 'utf8');
console.log('counties with promo', Object.keys(counties).length, '/', count);
console.log('wrote', outCountyPromo);
console.log('wrote', outCountyBlurbs);
