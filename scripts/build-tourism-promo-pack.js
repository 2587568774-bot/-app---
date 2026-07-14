const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'apps/web/src/data');
const OUT_SITES = path.join(DATA, 'tourism-sites.json');
const OUT_PROMO = path.join(DATA, 'promo-images.json');
const UPLOAD_DIR = path.join(ROOT, 'apps/web/public/uploads/promo');

const SITES = [
  { slug: 'kunming', nameZh: '昆明市文化和旅游局', nameEn: 'Kunming Culture and Tourism Bureau', url: 'https://whhlyj.km.gov.cn/', type: 'culture_tourism_bureau' },
  { slug: 'qujing', nameZh: '曲靖市人民政府门户网', nameEn: 'Qujing Municipal Government', url: 'https://www.qj.gov.cn/', type: 'city_portal' },
  { slug: 'yuxi', nameZh: '玉溪市人民政府', nameEn: 'Yuxi Municipal Government', url: 'https://www.yuxi.gov.cn/', type: 'city_portal' },
  { slug: 'baoshan', nameZh: '保山市人民政府门户网站', nameEn: 'Baoshan Municipal Government', url: 'https://www.baoshan.gov.cn/', type: 'city_portal' },
  { slug: 'zhaotong', nameZh: '昭通市人民政府门户网站', nameEn: 'Zhaotong Municipal Government', url: 'https://www.zt.gov.cn/', type: 'city_portal' },
  { slug: 'lijiang', nameZh: '丽江网', nameEn: 'Lijiang Tourism Media', url: 'https://www.lijiang.cn/', type: 'tourism_media' },
  { slug: 'puer', nameZh: '普洱市人民政府', nameEn: 'Pu\'er Municipal Government', url: 'https://www.puershi.gov.cn/', type: 'city_portal' },
  { slug: 'lincang', nameZh: '临沧市人民政府', nameEn: 'Lincang Municipal Government', url: 'https://www.lincang.gov.cn/', type: 'city_portal' },
  { slug: 'chuxiong', nameZh: '楚雄彝族自治州人民政府', nameEn: 'Chuxiong Prefecture Government', url: 'https://www.cxz.gov.cn/', type: 'city_portal' },
  { slug: 'honghe', nameZh: '红河哈尼族彝族自治州人民政府', nameEn: 'Honghe Prefecture Government', url: 'https://www.hh.gov.cn/', type: 'city_portal' },
  { slug: 'wenshan', nameZh: '文山壮族苗族自治州人民政府', nameEn: 'Wenshan Prefecture Government', url: 'https://www.ynws.gov.cn/', type: 'city_portal' },
  { slug: 'xishuangbanna', nameZh: '西双版纳傣族自治州人民政府', nameEn: 'Xishuangbanna Prefecture Government', url: 'https://www.xsbn.gov.cn/', type: 'city_portal' },
  { slug: 'dali', nameZh: '大理旅游网（大理旅游集团）', nameEn: 'Dali Tourism', url: 'https://www.dalitravel.cn/', type: 'tourism_operator' },
  { slug: 'dehong', nameZh: '德宏州人民政府门户网站', nameEn: 'Dehong Prefecture Government', url: 'https://www.dh.gov.cn/', type: 'city_portal' },
  { slug: 'nujiang', nameZh: '怒江傈僳族自治州人民政府', nameEn: 'Nujiang Prefecture Government', url: 'https://www.nujiang.gov.cn/', type: 'city_portal' },
  { slug: 'diqing', nameZh: '迪庆藏族自治州人民政府', nameEn: 'Diqing Prefecture Government', url: 'https://www.diqing.gov.cn/', type: 'city_portal' },
];

// Place-specific open scenic images (Unsplash + Wikimedia) used when tourism sites block scraping.
// These are intentionally different per city so the UI is no longer a single repeated placeholder.
const FALLBACK = {
  kunming: [
    'https://images.unsplash.com/photo-1599571234909-29edebc01d48?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  ],
  dali: [
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
  ],
  lijiang: [
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
  ],
  xishuangbanna: [
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80',
  ],
  diqing: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
  ],
  honghe: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80',
  ],
  baoshan: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
  ],
  dehong: [
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  ],
  nujiang: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
  ],
  yuxi: [
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  ],
  qujing: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
  ],
  puer: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80',
  ],
  chuxiong: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80',
  ],
  wenshan: [
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
  ],
  lincang: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80',
  ],
  zhaotong: [
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
  ],
};

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

function request(url, opts = {}) {
  return new Promise((resolve, reject) => {
    let u;
    try { u = new URL(url); } catch (e) { return reject(e); }
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.request({
      protocol: u.protocol,
      hostname: u.hostname,
      port: u.port || undefined,
      path: u.pathname + u.search,
      method: 'GET',
      timeout: opts.timeout || 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36 SeeYunnan/1.0',
        'Accept': opts.accept || '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      rejectUnauthorized: false,
    }, (res) => {
      const status = res.statusCode || 0;
      const loc = res.headers.location;
      if ([301,302,303,307,308].includes(status) && loc && (opts.redirects || 0) < 4) {
        res.resume();
        return resolve(request(new URL(loc, url).toString(), Object.assign({}, opts, { redirects: (opts.redirects||0)+1 })));
      }
      const chunks = [];
      res.on('data', (c) => {
        if (!opts.maxBytes || Buffer.concat(chunks).length < opts.maxBytes) chunks.push(c);
      });
      res.on('end', () => resolve({ status, headers: res.headers, body: Buffer.concat(chunks), url }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end();
  });
}

function absUrl(base, src) {
  try { return new URL(src, base).toString(); } catch { return null; }
}

function extractImageUrls(html, pageUrl) {
  const urls = new Set();
  const patterns = [
    /src=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi,
    /data-src=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi,
    /data-original=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi,
    /url\((['"]?)([^)'"]+\.(?:jpg|jpeg|png|webp)(?:\?[^)']*)?)\1\)/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) {
      const raw = m[2] || m[1];
      const full = absUrl(pageUrl, raw);
      if (!full) continue;
      const low = full.toLowerCase();
      if (/logo|icon|avatar|sprite|qrcode|favicon|button|arrow|share|weixin|wechat|badge|1x1|pixel|loading|blank/i.test(low)) continue;
      urls.add(full.split('#')[0]);
    }
  }
  return [...urls];
}

async function scrapeSiteImages(site) {
  try {
    const res = await request(site.url, { accept: 'text/html', maxBytes: 700000, timeout: 7000 });
    if (res.status < 200 || res.status >= 400) return [];
    const html = res.body.toString('utf8');
    const imgs = extractImageUrls(html, res.url || site.url);
    imgs.sort((a, b) => {
      const score = (u) => (/banner|slide|focus|swiper|hero|scenic|travel|tour|upload|attach/i.test(u) ? 3 : 0) - (/thumb|small|mini|60x|80x|100x/i.test(u) ? 5 : 0);
      return score(b) - score(a);
    });
    return imgs.slice(0, 10);
  } catch (e) {
    console.log('scrape fail', site.slug, e.message);
    return [];
  }
}

function extFromUrl(url, contentType) {
  const u = url.toLowerCase().split('?')[0];
  if (u.endsWith('.png') || (contentType||'').includes('png')) return '.png';
  if (u.endsWith('.webp') || (contentType||'').includes('webp')) return '.webp';
  return '.jpg';
}

async function downloadTo(localPath, url) {
  const res = await request(url, { timeout: 9000, maxBytes: 6_000_000 });
  if (res.status < 200 || res.status >= 400) throw new Error('http ' + res.status);
  const type = String(res.headers['content-type'] || '');
  if (res.body.length < 25000) throw new Error('small ' + res.body.length);
  if (!type.startsWith('image/') && !/\.(jpg|jpeg|png|webp)(\?|$)/i.test(url)) throw new Error('not image');
  let finalPath = localPath;
  const ext = extFromUrl(url, type);
  if (!finalPath.endsWith(ext)) finalPath = finalPath.replace(/\.[a-z]+$/i, '') + ext;
  fs.mkdirSync(path.dirname(finalPath), { recursive: true });
  fs.writeFileSync(finalPath, res.body);
  return finalPath;
}

function publicPathFromAbs(abs) {
  return '/' + path.relative(path.join(ROOT, 'apps/web/public'), abs).split(path.sep).join('/');
}

function listLocalPromo(slug) {
  const dir = path.join(UPLOAD_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort()
    .map((f) => `/uploads/promo/${slug}/${f}`);
}

(async () => {
  fs.writeFileSync(OUT_SITES, JSON.stringify({
    generated_at: new Date().toISOString(),
    note: '16 prefecture-level tourism/culture entry points for See Yunnan. Prefer bureau/tourism portals; municipal government portals are fallbacks when bureau domains are unavailable or blocked.',
    cities: SITES,
  }, null, 2) + '\n', 'utf8');
  console.log('wrote tourism-sites.json');

  const promo = {
    generated_at: new Date().toISOString(),
    note: 'City promo pack. Priority: local mirrored tourism-site images > open scenic fallbacks. Official tourism bureau assets can replace these later via admin upload.',
    source: 'tourism-sites+curated-open-scenic',
    cities: {},
  };

  for (const site of SITES) {
    console.log('===', site.slug);
    let local = listLocalPromo(site.slug);
    let source = local.length ? 'local-cache' : 'open-scenic-fallback';
    let credit = local.length
      ? `${site.nameZh} (mirrored promo)`
      : `Open scenic promo; replace with assets from ${site.nameZh}`;

    // Only scrape sites likely to have scenic images and not hang forever.
    if (local.length < 3 && (site.type === 'culture_tourism_bureau' || site.type === 'tourism_media' || site.type === 'tourism_operator')) {
      const scraped = await scrapeSiteImages(site);
      console.log(site.slug, 'scraped', scraped.length);
      const dir = path.join(UPLOAD_DIR, site.slug);
      fs.mkdirSync(dir, { recursive: true });
      let i = local.length;
      for (const remote of scraped) {
        if (local.length >= 6) break;
        i += 1;
        const tmp = path.join(dir, `img-${String(i).padStart(2, '0')}.jpg`);
        try {
          const saved = await downloadTo(tmp, remote);
          local.push(publicPathFromAbs(saved));
          source = 'tourism-site-local';
          credit = `${site.nameZh} (mirrored)`;
          console.log(site.slug, 'saved', path.basename(saved));
        } catch (e) {
          console.log(site.slug, 'skip', e.message);
        }
      }
      local = [...new Set(local)];
    }

    let gallery = local.slice(0, 6);
    if (gallery.length < 3) {
      const fb = FALLBACK[site.slug] || FALLBACK.kunming;
      gallery = [...gallery, ...fb].slice(0, 6);
      if (source === 'local-cache' || source === 'tourism-site-local') source = source + '+fallback';
      else source = 'open-scenic-fallback';
      credit = `${site.nameZh} entry: ${site.url} · temporary open scenic images`;
    }

    promo.cities[site.slug] = {
      cover: gallery[0] || null,
      gallery,
      credit,
      tourism_site: site.url,
      tourism_site_name: site.nameZh,
      source,
      replace_with: `Replace with official photos from ${site.nameZh} (${site.url}) via admin upload`,
    };
    console.log(site.slug, 'final', gallery.length, gallery[0]);
    await sleep(100);
  }

  fs.writeFileSync(OUT_PROMO, JSON.stringify(promo, null, 2) + '\n', 'utf8');
  console.log('wrote promo-images.json');
  for (const [k, v] of Object.entries(promo.cities)) {
    console.log(k, (v.gallery || []).length, v.source, v.cover);
  }
})().catch((e) => { console.error(e); process.exit(1); });
