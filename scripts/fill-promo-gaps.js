const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_PROMO = path.join(ROOT, 'apps/web/src/data/promo-images.json');
const OUT_SITES = path.join(ROOT, 'apps/web/src/data/tourism-sites.json');
const UPLOAD_DIR = path.join(ROOT, 'apps/web/public/uploads/promo');
const sites = JSON.parse(fs.readFileSync(OUT_SITES, 'utf8')).cities;
const promo = JSON.parse(fs.readFileSync(OUT_PROMO, 'utf8'));

const FILL = {
  zhaotong: [
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
  ],
  lijiang: [
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
  ],
  lincang: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80',
  ],
  honghe: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  ],
  wenshan: [
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
  ],
  xishuangbanna: [
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  ],
};

function request(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.request({
      protocol: u.protocol,
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'GET',
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 SeeYunnanPromo/1.1',
        'Accept': 'image/*,*/*',
      },
    }, (res) => {
      if ([301,302,307,308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        return resolve(request(new URL(res.headers.location, url).toString()));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode || 0, body: Buffer.concat(chunks), type: res.headers['content-type'] || '' }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end();
  });
}

function listLocal(slug) {
  const dir = path.join(UPLOAD_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map((f) => {
      const full = path.join(dir, f);
      return { full, size: fs.statSync(full).size, url: `/uploads/promo/${slug}/${f}`, file: f };
    })
    .filter((x) => x.size >= 25000)
    .sort((a, b) => a.file.localeCompare(b.file));
}

function siteMeta(slug) {
  return sites.find((s) => s.slug === slug) || { nameZh: slug, url: '' };
}

(async () => {
  for (const [slug, urls] of Object.entries(FILL)) {
    let local = listLocal(slug);
    console.log(slug, 'before', local.length);
    const dir = path.join(UPLOAD_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    let i = local.length;
    for (const remote of urls) {
      if (local.length >= 6) break;
      i += 1;
      try {
        const res = await request(remote);
        if (res.status < 200 || res.status >= 400) throw new Error('http ' + res.status);
        if (res.body.length < 25000) throw new Error('small');
        const ext = (res.type.includes('png') || remote.includes('.png')) ? '.png' : '.jpg';
        const full = path.join(dir, `fill-${String(i).padStart(2, '0')}${ext}`);
        fs.writeFileSync(full, res.body);
        local.push({ full, size: res.body.length, url: `/uploads/promo/${slug}/${path.basename(full)}`, file: path.basename(full) });
        console.log(slug, 'saved', path.basename(full), Math.round(res.body.length / 1024) + 'kb');
      } catch (e) {
        console.log(slug, 'skip', e.message);
      }
    }
    local = listLocal(slug);
    const meta = siteMeta(slug);
    const gallery = local.slice(0, 6).map((x) => x.url);
    // if download failed, keep remote urls mixed in
    const finalGallery = gallery.length >= 2 ? gallery : [...gallery, ...urls].slice(0, 6);
    promo.cities[slug] = {
      cover: finalGallery[0] || null,
      gallery: finalGallery,
      credit: `${meta.nameZh || slug} + open scenic fill`,
      tourism_site: meta.url,
      tourism_site_name: meta.nameZh,
      source: gallery.length ? 'mixed-local-fill' : 'open-scenic-fallback',
      replace_with: `Replace with official photos from ${meta.nameZh} (${meta.url}) via admin upload`,
    };
    console.log(slug, 'final', finalGallery.length, finalGallery[0]);
  }

  // rebuild all cities from local files first, preserve tourism meta
  for (const site of sites) {
    const local = listLocal(site.slug);
    if (!local.length) continue;
    const gallery = local.slice(0, 6).map((x) => x.url);
    const prev = promo.cities[site.slug] || {};
    // if current cover is local or we have enough local, prefer local pack
    if (gallery.length >= 2) {
      promo.cities[site.slug] = {
        cover: gallery[0],
        gallery: gallery.length >= 4 ? gallery : [...gallery, ...((prev.gallery || []).filter((u) => !u.startsWith('/uploads/')))].slice(0, 6),
        credit: prev.credit || `${site.nameZh} promo`,
        tourism_site: site.url,
        tourism_site_name: site.nameZh,
        source: prev.source || 'local',
        replace_with: `Replace with official photos from ${site.nameZh} (${site.url}) via admin upload`,
      };
    }
  }

  promo.generated_at = new Date().toISOString();
  promo.note = '16-city promo pack for See Yunnan. Local mirrored tourism/government images preferred; open scenic fills used where sites block scraping. Replace via admin upload anytime.';
  promo.source = 'tourism-sites+local+open-scenic-fill';
  fs.writeFileSync(OUT_PROMO, JSON.stringify(promo, null, 2) + '\n', 'utf8');
  console.log('wrote', OUT_PROMO);
  for (const [k, v] of Object.entries(promo.cities)) {
    console.log(k, (v.gallery || []).length, String(v.cover || '').slice(0, 70));
  }
})().catch((e) => { console.error(e); process.exit(1); });
