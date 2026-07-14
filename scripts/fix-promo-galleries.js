const fs = require("fs");
const path = require("path");
const ROOT = "E:/无尽的/see-yunnan";
const promoPath = path.join(ROOT, "apps/web/src/data/promo-images.json");
const promo = JSON.parse(fs.readFileSync(promoPath, "utf8"));
const publicDir = path.join(ROOT, "apps/web/public");

function exists(webPath) {
  const fp = path.join(publicDir, webPath.replace(/^\//, ""));
  if (!fs.existsSync(fp)) return false;
  const st = fs.statSync(fp);
  if (st.size < 20000) return false;
  const head = fs.readFileSync(fp).subarray(0, 2);
  const ok = (head[0] === 0xff && head[1] === 0xd8) || (head[0] === 0x89 && head[1] === 0x50);
  return ok;
}

function pickGallery(slug, preferred) {
  const dir = path.join(publicDir, "uploads/promo", slug);
  const files = fs.readdirSync(dir)
    .map(f => ({ f, web: `/uploads/promo/${slug}/${f}`, size: fs.statSync(path.join(dir, f)).size }))
    .filter(x => exists(x.web))
    .sort((a, b) => {
      const ap = preferred.indexOf(xWeb(a.web));
      const bp = preferred.indexOf(xWeb(b.web));
      function xWeb(w){ return w; }
      const ai = preferred.indexOf(a.web);
      const bi = preferred.indexOf(b.web);
      if (ai === -1 && bi === -1) return b.size - a.size;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  // unique keep preferred order then size
  const ordered = [];
  for (const p of preferred) if (exists(p) && !ordered.includes(p)) ordered.push(p);
  for (const x of files.sort((a,b)=>b.size-a.size)) {
    if (!ordered.includes(x.web)) ordered.push(x.web);
  }
  return ordered.slice(0, 8);
}

const updates = {
  nujiang: {
    preferred: [
      "/uploads/promo/nujiang/wiki-01.jpg",
      "/uploads/promo/nujiang/wiki-02.jpg",
      "/uploads/promo/nujiang/img-05.png",
      "/uploads/promo/nujiang/img-03.jpg",
      "/uploads/promo/nujiang/img-01.jpg",
      "/uploads/promo/nujiang/grab-mrj6gzkf-09.png",
      "/uploads/promo/nujiang/grab-mrj6gzsa-11.png",
      "/uploads/promo/nujiang/img-02.jpg"
    ]
  },
  puer: {
    preferred: [
      "/uploads/promo/puer/wiki-01.jpg",
      "/uploads/promo/puer/grab-mrj6fv7p-12.png",
      "/uploads/promo/puer/grab-mrj6fv24-11.png",
      "/uploads/promo/puer/grab-mrj6bhey-11.png",
      "/uploads/promo/puer/img-06.jpg",
      "/uploads/promo/puer/img-03.jpg",
      "/uploads/promo/puer/grab-mrj6bhkm-12.png",
      "/uploads/promo/puer/img-04.png"
    ]
  }
};

for (const [slug, cfg] of Object.entries(updates)) {
  const gallery = pickGallery(slug, cfg.preferred);
  const cover = gallery[0];
  const prev = promo.cities[slug] || {};
  promo.cities[slug] = {
    ...prev,
    cover,
    gallery,
    credit: `${slug} landscape via collector Wikipedia/Commons + local promo, no-portrait filter`,
    source: "collector-wiki",
    collected_at: new Date().toISOString()
  };
  console.log(slug, "cover=", cover, "gallery=", gallery.length);
  gallery.forEach(g => console.log(" ", g));
}

// also sanitize ALL cities: drop missing gallery paths
for (const [slug, city] of Object.entries(promo.cities)) {
  const gallery = (city.gallery || []).filter(exists);
  if (!gallery.length) continue;
  if (!exists(city.cover)) city.cover = gallery[0];
  city.gallery = Array.from(new Set([city.cover, ...gallery])).slice(0, 10);
}

promo.generated_at = new Date().toISOString();
promo.note = "Collector http://154.40.34.153:18765 + Wikipedia/Commons landscape; portraits/maps filtered. nujiang/puer backfilled.";
fs.writeFileSync(promoPath, JSON.stringify(promo, null, 2) + "\n");
console.log("updated", promoPath);