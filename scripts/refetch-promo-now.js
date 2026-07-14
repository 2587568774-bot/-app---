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

const SITES = JSON.parse(fs.readFileSync(OUT_SITES, 'utf8')).cities;

const COMMONS_QUERIES = {
  kunming: ['Stone Forest Yunnan', 'Dianchi Lake Kunming', 'Kunming Green Lake park'],
  dali: ['Erhai Lake Dali', 'Dali Ancient City', 'Three Pagodas of Chongsheng Temple'],
  lijiang: ['Lijiang Old Town', 'Jade Dragon Snow Mountain', 'Lijiang Yunnan China'],
  xishuangbanna: ['Xishuangbanna', 'Xishuangbanna Tropical Botanical Garden', 'Dai people Yunnan temple'],
  diqing: ['Shangri-La Yunnan', 'Pudacuo National Park', 'Meili Snow Mountain'],
  honghe: ['Yuanyang Rice Terraces', 'Jianshui Confucius Temple', 'Honghe Hani Terraces'],
  baoshan: ['Tengchong Yunnan', 'Rehai Hot Spring Tengchong', 'Gaoligong Mountains'],
  dehong: ['Ruili Yunnan', 'Mangshi Yunnan', 'Dehong Dai'],
  nujiang: ['Nujiang Grand Canyon', 'Bingzhongluo Yunnan', 'Nujiang river canyon'],
  yuxi: ['Fuxian Lake', 'Yuxi Yunnan China', 'Chengjiang fossil site'],
  qujing: ['Luoping canola fields', 'Jiulong Waterfalls Yunnan', 'Qujing Yunnan'],
  puer: ["Pu'er tea plantation Yunnan", 'Pu er tea mountain', 'Simao Yunnan'],
  chuxiong: ['Yuanmou Earth Forest', 'Chuxiong Yunnan', 'Yi people Yunnan'],
  wenshan: ['Puzhehei', 'Wenshan Yunnan karst', 'Bamei village Yunnan'],
  lincang: ['Lincang Yunnan', 'Wuliang Mountain Yunnan', 'tea mountain Yunnan fog'],
  zhaotong: ['Dashanbao Yunnan', 'black-necked crane Yunnan', 'Zhaotong Yunnan highland'],
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
      timeout: opts.timeout || 15000,
      headers: Object.assign({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': opts.accept || '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': opts.referer || (u.origin + '/'),
      }, opts.headers || {}),
      rejectUnauthorized: false,
    }, (res) => {
      const status = res.statusCode || 0;
      const loc = res.headers.location;
      if ([301,302,303,307,308].includes(status) && loc && (opts.redirects || 0) < 5) {
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
    /content=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) {
      const raw = m[2] || m[1];
      const full = absUrl(pageUrl, raw);
      if (!full) continue;
      const low = full.toLowerCase();
      if (/logo|icon|avatar|sprite|qrcode|favicon|button|arrow|share|weixin|wechat|badge|1x1|pixel|loading|blank|tongji|stat/i.test(low)) continue;
      urls.add(full.split('#')[0]);
    }
  }
  return [...urls];
}

async function scrapeSiteImages(site) {
  try {
    const res = await request(site.url, { accept: 'text/html,application/xhtml+xml', maxBytes: 900000, timeout: 12000 });
    if (res.status < 200 || res.status >= 400) {
      console.log(site.slug, 'site status', res.status);
      return [];
    }
    const html = res.body.toString('utf8');
    const imgs = extractImageUrls(html, res.url || site.url);
    imgs.sort((a, b) => {
      const score = (u) => {
        let s = 0;
        if (/banner|slide|focus|swiper|hero|scenic|travel|tour|spot|photo|album|upload|attach|picture/i.test(u)) s += 4;
        if (/thumb|small|mini|60x|80x|100x|120x/i.test(u)) s -= 6;
        return s;
      };
      return score(b) - score(a);
    });
    return imgs.slice(0, 14);
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
  api.searchParams.set('gsrlimit', '8');
  api.searchParams.set('prop', 'imageinfo');
  api.searchParams.set('iiprop', 'url|mime|size');
  api.searchParams.set('iiurlwidth', '1600');
  api.searchParams.set('format', 'json');
  api.searchParams.set('origin', '*');
  const res = await request(api.toString(), { accept: 'application/json', timeout: 20000, maxBytes: 2500000, referer: 'https://commons.wikimedia.org/' });
  if (res.status !== 200) throw new Error('commons http ' + res.status);
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
    for (let i = 0; i < 3; i++) {
      try {
        const urls = await searchCommons(q);
        all.push(...urls);
        console.log(slug, 'commons', q, urls.length);
        break;
      } catch (e) {
        console.log('commons retry', slug, q, i+1, e.message);
        await sleep(600 * (i+1));
      }
    }
    await sleep(250);
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
  const res = await request(url, { timeout: 20000, maxBytes: 8_000_000, referer: referer || undefined });
  if (res.status < 200 || res.status >= 400) throw new Error('http ' + res.status);
  const type = String(res.headers['content-type'] || '');
  if (res.body.length < 20000) throw new Error('small ' + res.body.length);
  if (!type.startsWith('image/') && !/\.(jpg|jpeg|png|webp)(\?|$)/i.test(url)) throw new Error('not image ' + type);
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

function clearDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    try { fs.unlinkSync(path.join(dir, f)); } catch {}
  }
}

(async () => {
  const promo = {
    generated_at: new Date().toISOString(),
    note: 'City promo pack built after network refresh. Prefer mirrored tourism-site images; fallback to Wikimedia Commons scenic photos. Replace later via admin upload.',
    source: 'tourism-sites+wikimedia-commons',
    cities: {},
  };

  for (const site of SITES) {
    console.log('===', site.slug, site.url);
    const dir = path.join(UPLOAD_DIR, site.slug);
    fs.mkdirSync(dir, { recursive: true });

    let candidates = [];
    let source = 'wikimedia-commons';
    let credit = `${site.nameZh} · Wikimedia Commons scenic`;

    // scrape all sites now that network may be better
    const scraped = await scrapeSiteImages(site);
    console.log(site.slug, 'scraped', scraped.length);
    if (scraped.length) {
      candidates = scraped;
      source = 'tourism-site';
      credit = `${site.nameZh} (mirrored)`;
    }

    if (candidates.length < 4) {
      const commons = await commonsForCity(site.slug);
      candidates = [...candidates, ...commons];
      if (source === 'tourism-site') {
        source = 'tourism-site+wikimedia';
        credit = `${site.nameZh} + Wikimedia Commons`;
      } else {
        source = 'wikimedia-commons';
        credit = `Wikimedia Commons scenic · replace with ${site.nameZh}`;
      }
    }

    // fresh local set
    clearDir(dir);
    const local = [];
    let i = 0;
    for (const remote of candidates) {
      if (local.length >= 6) break;
      i += 1;
      const tmp = path.join(dir, `img-${String(i).padStart(2, '0')}.jpg`);
      try {
        const saved = await downloadTo(tmp, remote, site.url);
        local.push(publicPathFromAbs(saved));
        console.log(site.slug, 'saved', path.basename(saved), Math.round(fs.statSync(saved).size/1024)+'kb');
      } catch (e) {
        console.log(site.slug, 'skip', e.message, String(remote).slice(0,70));
      }
      await sleep(150);
    }

    let gallery = local.slice(0, 6);
    let cover = gallery[0] || null;
    let finalSource = source + '+local';
    if (!cover) {
      gallery = candidates.slice(0, 6);
      cover = gallery[0] || null;
      finalSource = source + '+remote';
    }

    promo.cities[site.slug] = {
      cover,
      gallery,
      credit,
      tourism_site: site.url,
      tourism_site_name: site.nameZh,
      source: finalSource,
      replace_with: `Replace with official photos from ${site.nameZh} (${site.url}) via admin upload`,
    };
    console.log(site.slug, 'final', gallery.length, cover);
  }

  fs.writeFileSync(OUT_PROMO, JSON.stringify(promo, null, 2) + '\n', 'utf8');
  console.log('wrote promo-images.json');
  for (const [k,v] of Object.entries(promo.cities)) {
    console.log(k, (v.gallery||[]).length, v.source, v.cover);
  }
  const missing = Object.entries(promo.cities).filter(([,v]) => !(v.gallery||[]).length).map(([k]) => k);
  if (missing.length) {
    console.log('MISSING', missing.join(','));
    process.exitCode = 2;
  }
})().catch((e) => { console.error(e); process.exit(1); });
