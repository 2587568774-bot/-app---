const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, 'apps/web');
const PROMO = path.join(WEB, 'public/uploads/promo');
const MEDIA = path.join(ROOT, '素材');
const promoPath = path.join(WEB, 'src/data/promo-images.json');
const promo = JSON.parse(fs.readFileSync(promoPath, 'utf8'));
const PROXY = 'http://127.0.0.1:7897';

// Landscape-only candidates (no portraits, maps, emblems, icons)
const JOBS = {
  nujiang: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/The_Grand_Canyon_of_the_Nujiang_River%2C_Yunnan%2C_China_-_2019_May.jpg/1280px-The_Grand_Canyon_of_the_Nujiang_River%2C_Yunnan%2C_China_-_2019_May.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/%E7%9A%87%E5%86%A0%E5%B1%B1%E5%8F%8A%E9%99%84%E8%BF%91%E5%B1%B1%E5%B3%B0_-_2024-06-01.jpg/1280px-%E7%9A%87%E5%86%A0%E5%B1%B1%E5%8F%8A%E9%99%84%E8%BF%91%E5%B1%B1%E5%B3%B0_-_2024-06-01.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/%E6%B3%B8%E6%B0%B4%E5%85%AD%E5%BA%93%E8%80%81%E5%9F%8E%E5%A4%A9%E9%99%85%E7%BA%BF_-_%E8%88%AA%E6%8B%8D_-_%E5%85%A8%E6%99%AF_-_2024-05-31_02.jpg/1280px-%E6%B3%B8%E6%B0%B4%E5%85%AD%E5%BA%93%E8%80%81%E5%9F%8E%E5%A4%A9%E9%99%85%E7%BA%BF_-_%E8%88%AA%E6%8B%8D_-_%E5%85%A8%E6%99%AF_-_2024-05-31_02.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/%E8%B4%A1%E5%B1%B1%E5%8E%BF%E5%9F%8E%E5%A4%A9%E9%99%85%E7%BA%BF_-_%E8%88%AA%E6%8B%8D_-_2024-06-02_20.jpg/1280px-%E8%B4%A1%E5%B1%B1%E5%8E%BF%E5%9F%8E%E5%A4%A9%E9%99%85%E7%BA%BF_-_%E8%88%AA%E6%8B%8D_-_2024-06-02_20.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/%E8%8C%A8%E5%BC%80%E8%80%B6%E7%A8%A3%E5%9C%A3%E5%BF%83%E5%A0%82_-_2024-06-02_01.jpg/1280px-%E8%8C%A8%E5%BC%80%E8%80%B6%E7%A8%A3%E5%9C%A3%E5%BF%83%E5%A0%82_-_2024-06-02_01.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/%E5%90%8C%E5%BF%83%E5%B9%BF%E5%9C%BA_-_2024-05-31_02.jpg/1280px-%E5%90%8C%E5%BF%83%E5%B9%BF%E5%9C%BA_-_2024-05-31_02.jpg',
  ],
  puer: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/%E6%99%AE%E6%B4%B1%E5%B8%82_3.jpg/1280px-%E6%99%AE%E6%B4%B1%E5%B8%82_3.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/%E6%80%9D%E8%8C%85%E6%96%87%E5%BA%99_-_2024-10-06.jpg/1280px-%E6%80%9D%E8%8C%85%E6%96%87%E5%BA%99_-_2024-10-06.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/%E6%99%AE%E6%B4%B1%E6%96%87%E5%8C%96%E4%B8%AD%E5%BF%83_-_%E6%99%AE%E6%B4%B1%E5%A4%A7%E5%89%A7%E9%99%A2_-_2024-10-07_02.jpg/1280px-%E6%99%AE%E6%B4%B1%E6%96%87%E5%8C%96%E4%B8%AD%E5%BF%83_-_%E6%99%AE%E6%B4%B1%E5%A4%A7%E5%89%A7%E9%99%A2_-_2024-10-07_02.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/%E7%BA%A2%E6%97%97%E5%B9%BF%E5%9C%BA_-_2024-10-07_02.jpg/1280px-%E7%BA%A2%E6%97%97%E5%B9%BF%E5%9C%BA_-_2024-10-07_02.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/%E5%80%92%E7%94%9F%E6%A0%B9%E5%85%AC%E5%9B%AD_-_2024-10-06_01.jpg/1280px-%E5%80%92%E7%94%9F%E6%A0%B9%E5%85%AC%E5%9B%AD_-_2024-10-06_01.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/%E6%88%B4%E5%AE%B6%E5%B7%B7_-_8%E5%8F%B7_-_2024-10-07.jpg/1280px-%E6%88%B4%E5%AE%B6%E5%B7%B7_-_8%E5%8F%B7_-_2024-10-07.jpg',
  ],
};

function ensure(d) { fs.mkdirSync(d, { recursive: true }); }

function upgradeUrl(url) {
  // fix missing /wikipedia/ segment
  let u = url.replace('upload.wikimedia.org/commons/', 'upload.wikimedia.org/wikipedia/commons/');
  // bump thumb size
  u = u.replace(/\/\d+px-/, '/1280px-');
  // also try original full file path
  return u;
}

function originalUrl(url) {
  // https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/File.jpg/1280px-File.jpg
  // -> https://upload.wikimedia.org/wikipedia/commons/d/d7/File.jpg
  const m = url.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/thumb\/([^/]+\/[^/]+)\/([^/]+)\/\d+px-(.+)$/);
  if (m) return `${m[1]}/${m[2]}/${m[4]}`;
  return null;
}

function download(url, dest) {
  const attempts = [upgradeUrl(url), originalUrl(upgradeUrl(url)), url].filter(Boolean);
  // unique
  const seen = new Set();
  for (const u of attempts) {
    if (seen.has(u)) continue;
    seen.add(u);
    for (const useProxy of [true, false]) {
      const args = ['-sS', '--max-time', '90', '-L', '-A', 'Mozilla/5.0 SeeYunnanBot/1.0', '-o', dest, u];
      if (useProxy) args.splice(1, 0, '--proxy', PROXY);
      const r = spawnSync('curl.exe', args, { encoding: 'utf8' });
      if (r.status !== 0 || !fs.existsSync(dest)) continue;
      const st = fs.statSync(dest);
      if (st.size < 15000) continue;
      const head = fs.readFileSync(dest).subarray(0, 32);
      // JPEG FF D8 or PNG 89 50
      if (head[0] === 0xff && head[1] === 0xd8) return { size: st.size, url: u, proxy: useProxy };
      if (head[0] === 0x89 && head[1] === 0x50) return { size: st.size, url: u, proxy: useProxy };
      if (head[0] === 0x52 && head[1] === 0x49) return { size: st.size, url: u, proxy: useProxy }; // RIFF/webp
    }
  }
  throw new Error('download failed');
}

function processCity(slug, urls) {
  console.log(`\n=== ${slug} ===`);
  const dir = path.join(PROMO, slug);
  ensure(dir);
  for (const cat of ['01-州市封面', '02-州市图集', '06-风景景点']) {
    ensure(path.join(MEDIA, cat, slug));
  }

  // remove broken tiny wiki files
  for (const f of fs.readdirSync(dir)) {
    if (/^wiki-\d{2}\./.test(f)) {
      const p = path.join(dir, f);
      if (fs.statSync(p).size < 30000) {
        try { fs.unlinkSync(p); console.log(' remove tiny', f); } catch {}
      }
    }
  }

  const saved = [];
  for (const url of urls) {
    if (saved.length >= 6) break;
    const name = `wiki-${String(saved.length + 1).padStart(2, '0')}.jpg`;
    const dest = path.join(dir, name);
    try {
      const meta = download(url, dest);
      // rename if png
      const head = fs.readFileSync(dest).subarray(0, 4);
      let finalName = name;
      if (head[0] === 0x89) {
        finalName = name.replace('.jpg', '.png');
        fs.renameSync(dest, path.join(dir, finalName));
      }
      const finalPath = path.join(dir, finalName);
      fs.copyFileSync(finalPath, path.join(MEDIA, '02-州市图集', slug, finalName));
      if (saved.length === 0) {
        fs.copyFileSync(finalPath, path.join(MEDIA, '01-州市封面', slug, finalName));
        fs.copyFileSync(finalPath, path.join(MEDIA, '06-风景景点', slug, finalName));
      }
      const webPath = `/uploads/promo/${slug}/${finalName}`;
      saved.push({ webPath, size: meta.size, source: meta.url });
      console.log(' saved', finalName, meta.size, meta.proxy ? 'proxy' : 'direct');
    } catch (e) {
      console.log(' fail', e.message, url.slice(0, 90));
    }
  }

  if (saved.length) {
    const prev = (promo.cities && promo.cities[slug]) || {};
    const gallery = Array.from(new Set([
      ...saved.map((s) => s.webPath),
      ...((prev.gallery) || []),
    ])).slice(0, 12);
    promo.cities[slug] = {
      ...prev,
      cover: saved[0].webPath,
      gallery,
      credit: `${slug} landscape via collector (Wikipedia/Commons), no-portrait filter`,
      source: 'collector-wiki',
      collected_at: new Date().toISOString(),
    };
  }
  return { slug, saved: saved.length, paths: saved.map((s) => s.webPath) };
}

const report = [];
for (const [slug, urls] of Object.entries(JOBS)) {
  report.push(processCity(slug, urls));
}
promo.generated_at = new Date().toISOString();
promo.note = 'Collector + Wikipedia/Commons landscape images; portraits/maps/icons filtered.';
fs.writeFileSync(promoPath, JSON.stringify(promo, null, 2) + '\n');
console.log('\n==== REPORT ====');
console.log(JSON.stringify(report, null, 2));
