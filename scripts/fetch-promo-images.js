const fs = require('fs');
const path = require('path');

const cities = [
  { slug: 'kunming', q: '石林 云南' },
  { slug: 'dali', q: '大理 洱海' },
  { slug: 'lijiang', q: '丽江古城' },
  { slug: 'xishuangbanna', q: '西双版纳' },
  { slug: 'diqing', q: '香格里拉 云南' },
  { slug: 'honghe', q: '元阳梯田' },
  { slug: 'baoshan', q: '腾冲 云南' },
  { slug: 'dehong', q: '瑞丽 云南' },
  { slug: 'nujiang', q: '怒江大峡谷' },
  { slug: 'yuxi', q: '抚仙湖' },
  { slug: 'qujing', q: '罗平 油菜花' },
  { slug: 'puer', q: '普洱 茶山' },
  { slug: 'chuxiong', q: '元谋土林' },
  { slug: 'wenshan', q: '普者黑' },
  { slug: 'lincang', q: '临沧 云南' },
  { slug: 'zhaotong', q: '大山包' },
];

async function searchCommons(query) {
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  api.searchParams.set('action', 'query');
  api.searchParams.set('generator', 'search');
  api.searchParams.set('gsrnamespace', '6');
  api.searchParams.set('gsrsearch', query);
  api.searchParams.set('gsrlimit', '6');
  api.searchParams.set('prop', 'imageinfo');
  api.searchParams.set('iiprop', 'url|mime|size');
  api.searchParams.set('iiurlwidth', '1600');
  api.searchParams.set('format', 'json');
  api.searchParams.set('origin', '*');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(api, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'SeeYunnanPromoBot/1.0' },
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    const pages = Object.values(json?.query?.pages || {});
    const urls = [];
    for (const p of pages) {
      const info = p.imageinfo?.[0];
      if (!info || !String(info.mime || '').startsWith('image/')) continue;
      if ((info.size || 0) < 40000) continue;
      urls.push(info.thumburl || info.url);
    }
    return urls;
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

(async () => {
  const out = {
    generated_at: new Date().toISOString(),
    note: 'Temporary open promo images (Wikimedia). Replace later with official municipal tourism assets.',
    source: 'wikimedia-commons',
    cities: {},
  };
  for (const city of cities) {
    let urls = [];
    for (let i = 0; i < 3; i++) {
      try {
        urls = await searchCommons(city.q);
        break;
      } catch (e) {
        console.log(city.slug, 'retry', i + 1, e.message);
        await sleep(800 * (i + 1));
      }
    }
    out.cities[city.slug] = {
      cover: urls[0] || null,
      gallery: urls.slice(0, 6),
      credit: 'Wikimedia Commons (temporary promo)',
      query: city.q,
      replace_with: 'Official culture/tourism bureau photos',
    };
    console.log(city.slug, urls.length);
    await sleep(400);
  }
  const file = path.join('apps/web/src/data/promo-images.json');
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
  console.log('wrote', file);
})();
