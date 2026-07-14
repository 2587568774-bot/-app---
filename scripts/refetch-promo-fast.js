const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'apps/web/src/data');
const OUT_PROMO = path.join(DATA, 'promo-images.json');
const OUT_SITES = path.join(DATA, 'tourism-sites.json');
const UPLOAD_DIR = path.join(ROOT, 'apps/web/public/uploads/promo');
const SITES = JSON.parse(fs.readFileSync(OUT_SITES, 'utf8')).cities;

const COMMONS_QUERIES = {
  kunming: ['Stone Forest Yunnan', 'Dianchi Lake'],
  dali: ['Erhai Lake', 'Three Pagodas Dali'],
  lijiang: ['Lijiang Old Town', 'Jade Dragon Snow Mountain'],
  xishuangbanna: ['Xishuangbanna Tropical Botanical Garden', 'Xishuangbanna'],
  diqing: ['Shangri-La Yunnan', 'Pudacuo'],
  honghe: ['Yuanyang Rice Terraces', 'Honghe Hani Terraces'],
  baoshan: ['Tengchong Yunnan', 'Rehai Tengchong'],
  dehong: ['Ruili Yunnan', 'Mangshi'],
  nujiang: ['Nujiang Grand Canyon', 'Bingzhongluo'],
  yuxi: ['Fuxian Lake', 'Yuxi Yunnan'],
  qujing: ['Luoping canola', 'Jiulong Waterfalls Yunnan'],
  puer: ["Pu'er tea", 'Pu er tea plantation'],
  chuxiong: ['Yuanmou Earth Forest', 'Chuxiong'],
  wenshan: ['Puzhehei', 'Wenshan Yunnan'],
  lincang: ['Lincang Yunnan', 'tea mountain Yunnan'],
  zhaotong: ['Dashanbao', 'black-necked crane Yunnan'],
};

// known good open remote fallbacks if all downloads fail
const REMOTE_FALLBACK = {
  kunming: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Stone_Forest.jpg/1280px-Stone_Forest.jpg',
    'https://images.unsplash.com/photo-1599571234909-29edebc01d48?auto=format&fit=crop&w=1600&q=80',
  ],
  dali: [
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1600&q=80',
  ],
  lijiang: [
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
  ],
  xishuangbanna: [
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
  ],
  diqing: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
  ],
  honghe: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  ],
  baoshan: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
  ],
  dehong: [
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80',
  ],
  nujiang: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80',
  ],
  yuxi: [
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  ],
  qujing: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
  ],
  puer: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80',
  ],
  chuxiong: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
  ],
  wenshan: [
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
  ],
  lincang: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
  ],
  zhaotong: [
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
  ],
};

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function withTimeout(promise, ms, label) {
  let t;
  return Promise.race([
    promise.finally(() => clearTimeout(t)),
    new Promise((_, rej) => { t = setTimeout(() => rej(new Error('timeout ' + label)), ms); }),
  ]);
}

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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': opts.accept || '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': opts.referer || (u.origin + '/'),
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
      let size = 0;
      const max = opts.maxBytes || 5_000_000;
      res.on('data', (c) => {
        size += c.length;
        if (size <= max) chunks.push(c);
      });
      res.on('end', () => resolve({ status, headers: res.headers, body: Buffer.concat(chunks), url }));
    });
    req.on('timeout', () => req.destroy(new Error('socket-timeout')));
    req.on('error', reject);
    req.end();
  });
}

function absUrl(base, src) {
  try { return new URL(src, base).toString(); } catch { return null; }
}

function extractImageUrls(html, pageUrl) {
  const urls = new Set();
  const reList = [
    /src=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi,
    /data-src=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi,
    /data-original=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi,
    /url\((['"]?)([^)'"]+\.(?:jpg|jpeg|png|webp)(?:\?[^)']*)?)\1\)/gi,
  ];
  for (const re of reList) {
    let m;
    while ((m = re.exec(html))) {
      const raw = m[2] || m[1];
      const full = absUrl(pageUrl, raw);
      if (!full) continue;
      const low = full.toLowerCase();
      if (/logo|icon|avatar|sprite|qrcode|favicon|button|arrow|share|weixin|wechat|badge|1x1|pixel|loading|blank|tongji|stat|conac|jiucuo|red\.png|baog/i.test(low)) continue;
      urls.add(full.split('#')[0]);
    }
  }
  return [...urls];
}

async function scrapeSiteImages(site) {
  try {
    const res = await withTimeout(request(site.url, { accept: 'text/html', maxBytes: 700000, timeout: 7000 }), 9000, 'scrape '+site.slug);
    if (res.status < 200 || res.status >= 400) return [];
    const html = res.body.toString('utf8');
    const imgs = extractImageUrls(html, res.url || site.url);
    imgs.sort((a,b) => {
      const score = (u) => (/banner|slide|focus|swiper|hero|scenic|travel|tour|upload|attach|picture/i.test(u)?4:0) - (/thumb|small|mini|60x|80x|100x/i.test(u)?6:0);
      return score(b)-score(a);
    });
    return imgs.slice(0, 12);
  } catch (e) {
    console.log('scrape fail', site.slug, e.message);
    return [];
  }
}

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
  const res = await withTimeout(request(api.toString(), { accept: 'application/json', timeout: 10000, maxBytes: 2000000, referer: 'https://commons.wikimedia.org/' }), 12000, 'commons');
  if (res.status !== 200) throw new Error('commons ' + res.status);
  const json = JSON.parse(res.body.toString('utf8'));
  const pages = Object.values(json?.query?.pages || {});
  const out = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info || !String(info.mime || '').startsWith('image/')) continue;
    if ((info.size || 0) < 40000) continue;
    out.push(info.thumburl || info.url);
  }
  return out;
}

async function commonsForCity(slug) {
  const qs = COMMONS_QUERIES[slug] || [slug + ' Yunnan'];
  const all = [];
  for (const q of qs) {
    try {
      const urls = await searchCommons(q);
      console.log(slug, 'commons', q, urls.length);
      all.push(...urls);
    } catch (e) {
      console.log(slug, 'commons fail', q, e.message);
    }
    await sleep(200);
  }
  return [...new Set(all)];
}

function extFromUrl(url, contentType) {
  const u = url.toLowerCase().split('?')[0];
  if (u.endsWith('.png') || (contentType||'').includes('png')) return '.png';
  if (u.endsWith('.webp') || (contentType||'').includes('webp')) return '.webp';
  return '.jpg';
}

async function downloadTo(localPath, url, referer) {
  const res = await withTimeout(request(url, { timeout: 8000, maxBytes: 6_000_000, referer }), 10000, 'dl');
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

function listLocal(slug) {
  const dir = path.join(UPLOAD_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map((f) => {
      const full = path.join(dir, f);
      return { file: f, full, size: fs.statSync(full).size, url: `/uploads/promo/${slug}/${f}` };
    })
    .filter((x) => x.size >= 25000)
    .sort((a,b) => a.file.localeCompare(b.file));
}

function clearTiny(slug) {
  const dir = path.join(UPLOAD_DIR, slug);
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    try {
      if (fs.statSync(full).size < 25000) fs.unlinkSync(full);
    } catch {}
  }
}

(async () => {
  const promo = {
    generated_at: new Date().toISOString(),
    note: '16-city promo pack. Prefer local mirrored images from tourism/government sites; fill gaps with Wikimedia/Unsplash open scenic images. Replace anytime via admin upload.',
    source: 'tourism-sites+open-scenic',
    cities: {},
  };

  for (const site of SITES) {
    console.log('===', site.slug);
    clearTiny(site.slug);
    let local = listLocal(site.slug);
    let source = local.length ? 'local-existing' : '';
    let credit = local.length ? `${site.nameZh} (local promo)` : '';

    // scrape only if fewer than 4 good local images
    let candidates = [];
    if (local.length < 4) {
      const scraped = await scrapeSiteImages(site);
      console.log(site.slug, 'scraped', scraped.length);
      candidates = scraped;
      if (scraped.length) {
        source = 'tourism-site';
        credit = `${site.nameZh} (mirrored)`;
      }
    }

    if (local.length + candidates.length < 4) {
      const commons = await commonsForCity(site.slug);
      candidates = [...candidates, ...commons];
      if (!source || source === 'tourism-site') {
        source = source ? 'tourism-site+wikimedia' : 'wikimedia-commons';
        credit = source.includes('tourism') ? `${site.nameZh} + Wikimedia Commons` : `Wikimedia Commons · replace with ${site.nameZh}`;
      }
    }

    // also try unsplash/fallback remotes if still short
    if (local.length + candidates.length < 3) {
      candidates = [...candidates, ...(REMOTE_FALLBACK[site.slug] || [])];
      if (!source) {
        source = 'open-scenic-fallback';
        credit = `Open scenic promo · replace with ${site.nameZh}`;
      }
    }

    const dir = path.join(UPLOAD_DIR, site.slug);
    fs.mkdirSync(dir, { recursive: true });
    let i = local.length;
    for (const remote of candidates) {
      if (local.length >= 6) break;
      i += 1;
      const tmp = path.join(dir, `img-${String(i).padStart(2,'0')}.jpg`);
      try {
        const saved = await downloadTo(tmp, remote, site.url);
        // skip if duplicate size already present
        const size = fs.statSync(saved).size;
        if (local.some((x) => x.size === size)) {
          fs.unlinkSync(saved);
          continue;
        }
        local.push({ file: path.basename(saved), full: saved, size, url: publicPathFromAbs(saved) });
        console.log(site.slug, 'saved', path.basename(saved), Math.round(size/1024)+'kb');
      } catch (e) {
        console.log(site.slug, 'skip', e.message);
      }
    }

    local = listLocal(site.slug);
    let gallery = local.slice(0, 6).map((x) => x.url);
    let finalSource = (source || 'local') + (gallery.length ? '+local' : '');
    if (gallery.length < 2) {
      const fb = REMOTE_FALLBACK[site.slug] || REMOTE_FALLBACK.kunming;
      gallery = [...gallery, ...fb].slice(0, 6);
      finalSource = (source || 'open-scenic-fallback') + '+remote';
      credit = credit || `Open scenic promo · replace with ${site.nameZh}`;
    }
    if (!credit) credit = `${site.nameZh} promo images`;

    promo.cities[site.slug] = {
      cover: gallery[0] || null,
      gallery,
      credit,
      tourism_site: site.url,
      tourism_site_name: site.nameZh,
      source: finalSource,
      replace_with: `Replace with official photos from ${site.nameZh} (${site.url}) via admin upload`,
    };
    console.log(site.slug, 'final', gallery.length, gallery[0]);
  }

  fs.writeFileSync(OUT_PROMO, JSON.stringify(promo, null, 2) + '\n', 'utf8');
  console.log('DONE promo-images.json');
  for (const [k,v] of Object.entries(promo.cities)) {
    console.log(k, (v.gallery||[]).length, v.source, String(v.cover||'').slice(0,70));
  }
})().catch((e) => { console.error(e); process.exit(1); });
