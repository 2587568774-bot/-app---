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

const BOOST = {
  baoshan: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
  ],
  qujing: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
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
      headers: { 'User-Agent': 'Mozilla/5.0 SeeYunnan/1.3', Accept: 'image/*,*/*' },
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
      const size = fs.statSync(full).size;
      return { file: f, full, size, url: '/uploads/promo/' + slug + '/' + f };
    })
    .filter((x) => x.size >= 40000)
    .sort((a, b) => b.size - a.size);
}

(async () => {
  for (const [slug, urls] of Object.entries(BOOST)) {
    const dir = path.join(UPLOAD_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    const sizes = new Set(listLocal(slug).map((x) => x.size));
    let i = 0;
    for (const remote of urls) {
      if (listLocal(slug).length >= 8) break;
      i += 1;
      try {
        const res = await request(remote);
        if (res.status < 200 || res.status >= 400) throw new Error('http ' + res.status);
        if (res.body.length < 40000) throw new Error('small');
        if (sizes.has(res.body.length)) continue;
        const ext = res.type.includes('png') ? '.png' : '.jpg';
        const full = path.join(dir, 'boost-' + String(i).padStart(2, '0') + ext);
        fs.writeFileSync(full, res.body);
        sizes.add(res.body.length);
        console.log(slug, 'boost', path.basename(full), Math.round(res.body.length / 1024) + 'kb');
      } catch (e) {
        console.log(slug, 'skip', e.message);
      }
    }
  }

  const promo = {
    generated_at: new Date().toISOString(),
    note: '16-city promo pack for See Yunnan. Local images in /uploads/promo/{slug}/. Tourism/government site mirrors preferred; open scenic fills used where sites block scraping. Admin upload overrides this pack.',
    source: 'tourism-sites+local-promo',
    cities: {},
  };

  for (const site of sites) {
    const local = listLocal(site.slug);
    const gallery = local.slice(0, 6).map((x) => x.url);
    if (!gallery.length) {
      console.log('MISSING', site.slug);
      continue;
    }
    promo.cities[site.slug] = {
      cover: gallery[0],
      gallery,
      credit: site.nameZh + ' promo pack',
      tourism_site: site.url,
      tourism_site_name: site.nameZh,
      source: 'local-promo',
      replace_with: 'Replace with official photos from ' + site.nameZh + ' (' + site.url + ') via admin upload',
    };
    console.log(site.slug, gallery.length, Math.round(local[0].size / 1024) + 'kb', gallery[0]);
  }

  fs.writeFileSync(OUT_PROMO, JSON.stringify(promo, null, 2) + '\n', 'utf8');

  const md = [
    '# Promo images',
    '',
    'Image priority:',
    '1. Admin upload on region',
    '2. Local promo pack `/uploads/promo/{slug}/` via `promo-images.json`',
    '3. Built-in PLACE_VISUALS defaults',
    '',
    '## 16 tourism entry points',
    '',
    ...sites.map((s) => '- **' + s.nameZh + '** (`' + s.slug + '`): ' + s.url),
    '',
    '## Replace later',
    '',
    '1. Admin region editor upload, or',
    '2. Put files into `apps/web/public/uploads/promo/{slug}/` then run `node scripts/finalize-promo-pack.js`',
    '',
  ].join('\n');
  fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'docs', 'promo-images.md'), md, 'utf8');
  console.log('DONE');
})().catch((e) => { console.error(e); process.exit(1); });
