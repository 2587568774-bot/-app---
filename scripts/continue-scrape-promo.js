const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_PROMO = path.join(ROOT, 'apps/web/src/data/promo-images.json');
const OUT_SITES = path.join(ROOT, 'apps/web/src/data/tourism-sites.json');
const UPLOAD_DIR = path.join(ROOT, 'apps/web/public/uploads/promo');

const sitesDoc = JSON.parse(fs.readFileSync(OUT_SITES, 'utf8'));
const promo = JSON.parse(fs.readFileSync(OUT_PROMO, 'utf8'));
const sites = sitesDoc.cities;

// Prefer tourism-related pages / known scenic queries
const EXTRA_PAGES = {
  kunming: ['https://whhlyj.km.gov.cn/'],
  dali: ['https://www.dalitravel.cn/', 'https://www.dalitravel.cn/scenic.html'],
  lijiang: ['https://www.lijiang.cn/', 'https://www.lijiang.cn/ljly/'],
  qujing: ['https://www.qj.gov.cn/'],
  yuxi: ['https://www.yuxi.gov.cn/'],
  baoshan: ['https://www.baoshan.gov.cn/'],
  zhaotong: ['https://www.zt.gov.cn/'],
  puer: ['https://www.puershi.gov.cn/'],
  lincang: ['https://www.lincang.gov.cn/'],
  chuxiong: ['https://www.cxz.gov.cn/'],
  honghe: ['https://www.hh.gov.cn/'],
  wenshan: ['https://www.ynws.gov.cn/'],
  xishuangbanna: ['https://www.xsbn.gov.cn/'],
  dehong: ['https://www.dh.gov.cn/'],
  nujiang: ['https://www.nujiang.gov.cn/'],
  diqing: ['https://www.diqing.gov.cn/'],
};

const COMMONS = {
  kunming: ['Stone Forest Yunnan', 'Dianchi Lake Kunming'],
  dali: ['Erhai Lake Dali', 'Three Pagodas Dali'],
  lijiang: ['Lijiang Old Town', 'Jade Dragon Snow Mountain'],
  xishuangbanna: ['Xishuangbanna Tropical Botanical Garden', 'Xishuangbanna Yunnan'],
  diqing: ['Shangri-La Yunnan', 'Pudacuo National Park'],
  honghe: ['Yuanyang Rice Terraces', 'Honghe Hani Terraces'],
  baoshan: ['Tengchong Yunnan', 'Gaoligong'],
  dehong: ['Ruili Yunnan', 'Mangshi Yunnan'],
  nujiang: ['Nujiang Grand Canyon', 'Bingzhongluo'],
  yuxi: ['Fuxian Lake Yunnan', 'Fuxian Lake'],
  qujing: ['Luoping canola fields', 'Jiulong Waterfalls Yunnan'],
  puer: ["Pu'er tea plantation", 'Pu er tea Yunnan'],
  chuxiong: ['Yuanmou Earth Forest', 'Chuxiong Yunnan'],
  wenshan: ['Puzhehei Yunnan', 'Puzhehei'],
  lincang: ['Lincang Yunnan tea', 'Wuliang Mountain'],
  zhaotong: ['Dashanbao Yunnan', 'black-necked crane Yunnan'],
};

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function withTimeout(p, ms, label){
  let t; return Promise.race([
    p.finally(()=>clearTimeout(t)),
    new Promise((_,rej)=>{ t=setTimeout(()=>rej(new Error('timeout '+label)), ms); })
  ]);
}

function request(url, opts={}) {
  return new Promise((resolve, reject) => {
    let u; try { u = new URL(url); } catch(e){ return reject(e); }
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.request({
      protocol: u.protocol,
      hostname: u.hostname,
      port: u.port || undefined,
      path: u.pathname + u.search,
      method: 'GET',
      timeout: opts.timeout || 10000,
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
      if ([301,302,303,307,308].includes(status) && loc && (opts.redirects||0) < 5) {
        res.resume();
        return resolve(request(new URL(loc, url).toString(), Object.assign({}, opts, { redirects: (opts.redirects||0)+1 })));
      }
      const chunks = [];
      let size = 0;
      const max = opts.maxBytes || 6_000_000;
      res.on('data', (c) => { size += c.length; if (size <= max) chunks.push(c); });
      res.on('end', () => resolve({ status, headers: res.headers, body: Buffer.concat(chunks), url }));
    });
    req.on('timeout', () => req.destroy(new Error('socket-timeout')));
    req.on('error', reject);
    req.end();
  });
}

function absUrl(base, src){ try { return new URL(src, base).toString(); } catch { return null; } }

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
      if (/logo|icon|avatar|sprite|qrcode|favicon|button|arrow|share|weixin|wechat|badge|1x1|pixel|loading|blank|tongji|stat|conac|jiucuo|red\.png|baog|govicon|footer|header_bg|nav/i.test(low)) continue;
      urls.add(full.split('#')[0]);
    }
  }
  return [...urls];
}

async function scrapePages(slug, pages) {
  const all = [];
  for (const page of pages) {
    try {
      const res = await withTimeout(request(page, { accept: 'text/html', maxBytes: 900000, timeout: 9000 }), 11000, 'page');
      if (res.status < 200 || res.status >= 400) { console.log(slug, 'page status', res.status, page); continue; }
      const imgs = extractImageUrls(res.body.toString('utf8'), res.url || page);
      console.log(slug, 'page', page, 'imgs', imgs.length);
      all.push(...imgs);
    } catch (e) {
      console.log(slug, 'page fail', page, e.message);
    }
  }
  // rank scenic-looking
  const uniq = [...new Set(all)];
  uniq.sort((a,b) => {
    const score = (u) => (/banner|slide|focus|swiper|hero|scenic|travel|tour|upload|attach|picture|photo|album|news|content/i.test(u)?5:0) - (/thumb|small|mini|60x|80x|100x|120x/i.test(u)?8:0);
    return score(b) - score(a);
  });
  return uniq.slice(0, 16);
}

async function commonsSearch(query) {
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
  const res = await withTimeout(request(api.toString(), { accept: 'application/json', timeout: 12000, maxBytes: 2500000, referer: 'https://commons.wikimedia.org/' }), 14000, 'commons');
  if (res.status !== 200) throw new Error('commons ' + res.status);
  const json = JSON.parse(res.body.toString('utf8'));
  const pages = Object.values(json?.query?.pages || {});
  const out = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info || !String(info.mime||'').startsWith('image/')) continue;
    if ((info.size||0) < 50000) continue;
    out.push(info.thumburl || info.url);
  }
  return out;
}

async function commonsFor(slug) {
  const qs = COMMONS[slug] || [slug + ' Yunnan'];
  const all = [];
  for (const q of qs) {
    try {
      const urls = await commonsSearch(q);
      console.log(slug, 'commons', q, urls.length);
      all.push(...urls);
    } catch (e) {
      console.log(slug, 'commons fail', q, e.message);
    }
    await sleep(200);
  }
  return [...new Set(all)];
}

function listLocal(slug) {
  const dir = path.join(UPLOAD_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map((f) => {
      const full = path.join(dir, f);
      const size = fs.statSync(full).size;
      return { file: f, full, size, url: `/uploads/promo/${slug}/${f}`, score: size };
    })
    .filter((x) => x.size >= 40000)
    .sort((a,b) => b.score - a.score);
}

function extFrom(url, type) {
  const u = url.toLowerCase().split('?')[0];
  if (u.endsWith('.png') || (type||'').includes('png')) return '.png';
  if (u.endsWith('.webp') || (type||'').includes('webp')) return '.webp';
  return '.jpg';
}

async function download(localPath, url, referer) {
  const res = await withTimeout(request(url, { timeout: 12000, maxBytes: 8_000_000, referer }), 14000, 'dl');
  if (res.status < 200 || res.status >= 400) throw new Error('http ' + res.status);
  const type = String(res.headers['content-type'] || '');
  if (res.body.length < 40000) throw new Error('small ' + res.body.length);
  if (!type.startsWith('image/') && !/\.(jpg|jpeg|png|webp)(\?|$)/i.test(url)) throw new Error('not image');
  let finalPath = localPath;
  const ext = extFrom(url, type);
  if (!finalPath.endsWith(ext)) finalPath = finalPath.replace(/\.[a-z]+$/i, '') + ext;
  fs.mkdirSync(path.dirname(finalPath), { recursive: true });
  fs.writeFileSync(finalPath, res.body);
  return finalPath;
}

(async () => {
  // prioritize cities with fewer large local images or government-portal-only packs
  const order = sites.slice().sort((a,b) => listLocal(a.slug).length - listLocal(b.slug).length);

  for (const site of order) {
    console.log('===', site.slug);
    let local = listLocal(site.slug);
    console.log(site.slug, 'local before', local.length);

    // always try scrape a bit more, and commons if < 6 large images
    const pages = EXTRA_PAGES[site.slug] || [site.url];
    let candidates = await scrapePages(site.slug, pages);
    let sourceHint = candidates.length ? 'tourism-site' : '';

    if (local.length < 6) {
      const commons = await commonsFor(site.slug);
      candidates = [...candidates, ...commons];
      if (commons.length) sourceHint = sourceHint ? sourceHint + '+wikimedia' : 'wikimedia';
    }

    const dir = path.join(UPLOAD_DIR, site.slug);
    fs.mkdirSync(dir, { recursive: true });
    let i = 0;
    const existingSizes = new Set(local.map((x) => x.size));
    for (const remote of candidates) {
      if (listLocal(site.slug).length >= 8) break;
      i += 1;
      const tmp = path.join(dir, `grab-${Date.now().toString(36)}-${String(i).padStart(2,'0')}.jpg`);
      try {
        const saved = await download(tmp, remote, site.url);
        const size = fs.statSync(saved).size;
        if (existingSizes.has(size)) { fs.unlinkSync(saved); continue; }
        existingSizes.add(size);
        console.log(site.slug, 'saved', path.basename(saved), Math.round(size/1024)+'kb');
      } catch (e) {
        // quiet small skips
        if (!/small|http 403|http 404/.test(e.message)) console.log(site.slug, 'skip', e.message);
      }
      await sleep(120);
    }

    local = listLocal(site.slug);
    const gallery = local.slice(0, 6).map((x) => x.url);
    if (!gallery.length) {
      console.log(site.slug, 'NO IMAGES');
      continue;
    }
    const prev = promo.cities[site.slug] || {};
    promo.cities[site.slug] = {
      cover: gallery[0],
      gallery,
      credit: sourceHint.includes('tourism')
        ? `${site.nameZh} (mirrored promo)`
        : (prev.credit || `${site.nameZh} + open scenic`),
      tourism_site: site.url,
      tourism_site_name: site.nameZh,
      source: (sourceHint || prev.source || 'local') + '+local',
      replace_with: `Replace with official photos from ${site.nameZh} (${site.url}) via admin upload`,
    };
    console.log(site.slug, 'final', gallery.length, gallery[0]);
  }

  promo.generated_at = new Date().toISOString();
  promo.note = '16-city promo pack. Prefer local mirrors from tourism/government sites and Wikimedia scenic fills. Admin upload overrides these.';
  promo.source = 'tourism-sites+wikimedia+local';
  fs.writeFileSync(OUT_PROMO, JSON.stringify(promo, null, 2) + '\n', 'utf8');
  console.log('DONE');
  for (const [k,v] of Object.entries(promo.cities)) {
    console.log(k, (v.gallery||[]).length, v.source, v.cover);
  }
})().catch((e) => { console.error(e); process.exit(1); });
