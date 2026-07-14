const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = "E:/无尽的/see-yunnan";
const PROMO = path.join(ROOT, "apps/web/public/uploads/promo");
const MEDIA = path.join(ROOT, "素材");
const promoPath = path.join(ROOT, "apps/web/src/data/promo-images.json");
const PROXY = "http://127.0.0.1:7897";

const JOBS = {
  nujiang: [
    "https://upload.wikimedia.org/wikipedia/commons/d/d7/The_Grand_Canyon_of_the_Nujiang_River%2C_Yunnan%2C_China_-_2019_May.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5d/%E7%9A%87%E5%86%A0%E5%B1%B1%E5%8F%8A%E9%99%84%E8%BF%91%E5%B1%B1%E5%B3%B0_-_2024-06-01.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/59/%E6%B3%B8%E6%B0%B4%E5%85%AD%E5%BA%93%E8%80%81%E5%9F%8E%E5%A4%A9%E9%99%85%E7%BA%BF_-_%E8%88%AA%E6%8B%8D_-_%E5%85%A8%E6%99%AF_-_2024-05-31_02.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/88/%E8%B4%A1%E5%B1%B1%E5%8E%BF%E5%9F%8E%E5%A4%A9%E9%99%85%E7%BA%BF_-_%E8%88%AA%E6%8B%8D_-_2024-06-02_20.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/c/cf/%E8%8C%A8%E5%BC%80%E8%80%B6%E7%A8%A3%E5%9C%A3%E5%BF%83%E5%A0%82_-_2024-06-02_01.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/20/%E5%90%8C%E5%BF%83%E5%B9%BF%E5%9C%BA_-_2024-05-31_02.jpg"
  ],
  puer: [
    "https://upload.wikimedia.org/wikipedia/commons/2/2d/%E5%80%92%E7%94%9F%E6%A0%B9%E5%85%AC%E5%9B%AD_-_2024-10-06_01.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/28/%E6%99%AE%E6%B4%B1%E5%B8%82_3.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/%E6%80%9D%E8%8C%85%E6%96%87%E5%BA%99_-_2024-10-06.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/0e/%E6%99%AE%E6%B4%B1%E6%96%87%E5%8C%96%E4%B8%AD%E5%BF%83_-_%E6%99%AE%E6%B4%B1%E5%A4%A7%E5%89%A7%E9%99%A2_-_2024-10-07_02.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f4/%E7%BA%A2%E6%97%97%E5%B9%BF%E5%9C%BA_-_2024-10-07_02.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/ef/%E6%88%B4%E5%AE%B6%E5%B7%B7_-_8%E5%8F%B7_-_2024-10-07.jpg"
  ]
};

function ensure(d){ fs.mkdirSync(d,{recursive:true}); }
function isImg(buf){ return (buf[0]===0xff&&buf[1]===0xd8) || (buf[0]===0x89&&buf[1]===0x50); }
function okFile(p, min=50000){
  if(!fs.existsSync(p)) return false;
  const st=fs.statSync(p);
  if(st.size<min) return false;
  return isImg(fs.readFileSync(p).subarray(0,4));
}

function download(url, dest){
  try { if(fs.existsSync(dest)) fs.unlinkSync(dest); } catch{}
  const tmp = dest + ".part";
  try { if(fs.existsSync(tmp)) fs.unlinkSync(tmp); } catch{}
  for (const useProxy of [true, false]) {
    const args = ["-sS","--max-time","150","-L","-A","Mozilla/5.0 SeeYunnan/1.0","-o",tmp,url];
    if (useProxy) args.splice(1,0,"--proxy",PROXY);
    const r = spawnSync("curl.exe", args, {encoding:"utf8"});
    if (r.status !== 0 || !fs.existsSync(tmp)) continue;
    const st = fs.statSync(tmp);
    const head = fs.readFileSync(tmp).subarray(0,8);
    if (st.size >= 50000 && isImg(head)) {
      fs.renameSync(tmp, dest);
      return {size: st.size, proxy: useProxy};
    }
    try { fs.unlinkSync(tmp); } catch{}
  }
  throw new Error("dl fail");
}

const promo = JSON.parse(fs.readFileSync(promoPath,"utf8"));
const report=[];

for (const [slug, urls] of Object.entries(JOBS)) {
  console.log("===", slug, "===");
  const dir = path.join(PROMO, slug);
  ensure(dir);
  for (const cat of ["01-州市封面","02-州市图集","06-风景景点"]) ensure(path.join(MEDIA, cat, slug));

  // wipe all wiki-* first then rebuild clean
  for (const f of fs.readdirSync(dir)) {
    if (/^wiki-/.test(f)) {
      try { fs.unlinkSync(path.join(dir,f)); } catch{}
    }
  }

  // restore known good media copies first if large enough
  const mediaAlbum = path.join(MEDIA, "02-州市图集", slug);
  if (fs.existsSync(mediaAlbum)) {
    const goods = fs.readdirSync(mediaAlbum).filter(f=>/^wiki-/.test(f) && okFile(path.join(mediaAlbum,f), 80000));
    goods.sort();
    for (const f of goods) {
      // will be re-numbered later; keep as temp restore
    }
  }

  const saved=[];
  // if puer already has the 6MB image elsewhere, seed it
  // seed from media good files first
  if (fs.existsSync(mediaAlbum)) {
    const goods = fs.readdirSync(mediaAlbum)
      .map(f=>({f,p:path.join(mediaAlbum,f), size:fs.statSync(path.join(mediaAlbum,f)).size}))
      .filter(x => okFile(x.p, 80000))
      .sort((a,b)=>b.size-a.size);
    for (const g of goods) {
      if (saved.length>=6) break;
      const name = `wiki-${String(saved.length+1).padStart(2,"0")}.jpg`;
      fs.copyFileSync(g.p, path.join(dir, name));
      saved.push({webPath:`/uploads/promo/${slug}/${name}`, size:g.size, from:"media"});
      console.log("seed", name, g.size);
    }
  }

  for (const url of urls) {
    if (saved.length >= 6) break;
    const name = `wiki-${String(saved.length+1).padStart(2,"0")}.jpg`;
    const dest = path.join(dir, name);
    try {
      const meta = download(url, dest);
      // dedupe by size
      const sizes = saved.map(s=>s.size);
      if (sizes.includes(meta.size)) {
        fs.unlinkSync(dest);
        console.log("dup skip", meta.size);
        continue;
      }
      fs.copyFileSync(dest, path.join(MEDIA, "02-州市图集", slug, name));
      if (saved.length===0) {
        fs.copyFileSync(dest, path.join(MEDIA, "01-州市封面", slug, name));
        fs.copyFileSync(dest, path.join(MEDIA, "06-风景景点", slug, name));
      }
      saved.push({webPath:`/uploads/promo/${slug}/${name}`, size: meta.size, from: meta.proxy?"proxy":"direct"});
      console.log("saved", name, meta.size, meta.proxy?"proxy":"direct");
    } catch(e) {
      console.log("fail", url.split("/").pop().slice(0,50));
    }
  }

  // also promote any leftover large non-wiki images for gallery fallback
  const prev = promo.cities[slug] || {};
  const oldGallery = (prev.gallery||[]).filter(g => {
    const fp = path.join(ROOT, "apps/web/public", g.replace(/^\//,""));
    return okFile(fp, 30000) && !/wiki-/.test(g);
  });

  if (saved.length) {
    // ensure cover is largest
    saved.sort((a,b)=>b.size-a.size);
    // re-number by size so cover is best
    const renamed=[];
    for (let i=0;i<saved.length;i++){
      const old = path.join(ROOT, "apps/web/public", saved[i].webPath.replace(/^\//,""));
      const name = `wiki-${String(i+1).padStart(2,"0")}.jpg`;
      const neu = path.join(dir, name);
      if (path.resolve(old) !== path.resolve(neu)) {
        if (fs.existsSync(neu)) fs.unlinkSync(neu);
        fs.renameSync(old, neu);
      }
      renamed.push({webPath:`/uploads/promo/${slug}/${name}`, size:saved[i].size});
      fs.copyFileSync(neu, path.join(MEDIA, "02-州市图集", slug, name));
      if (i===0) {
        fs.copyFileSync(neu, path.join(MEDIA, "01-州市封面", slug, name));
        fs.copyFileSync(neu, path.join(MEDIA, "06-风景景点", slug, name));
      }
    }
    const gallery = Array.from(new Set([...renamed.map(s=>s.webPath), ...oldGallery])).slice(0,10);
    promo.cities[slug] = {
      ...prev,
      cover: renamed[0].webPath,
      gallery,
      credit: `${slug} landscape via collector Wikipedia/Commons, no-portrait`,
      source: "collector-wiki",
      collected_at: new Date().toISOString()
    };
    report.push({slug, saved:renamed.length, cover:renamed[0], paths:renamed.map(s=>s.webPath)});
  } else {
    report.push({slug, saved:0});
  }
}

// If puer has the 6MB somewhere named wiki-05 from previous, already handled after wipe unless only in wrong place
// Check orphan large jpg in puer dir non-wiki
for (const slug of Object.keys(JOBS)) {
  const dir = path.join(PROMO, slug);
  const large = fs.readdirSync(dir)
    .map(f=>({f,p:path.join(dir,f),size:fs.statSync(path.join(dir,f)).size}))
    .filter(x=>okFile(x.p, 200000));
  console.log(slug, "large files:", large.map(x=>x.f+":"+x.size).join(", "));
}

promo.generated_at = new Date().toISOString();
promo.note = "Collector http://154.40.34.153:18765 + Wikipedia/Commons landscape; portraits/maps/icons filtered.";
fs.writeFileSync(promoPath, JSON.stringify(promo,null,2)+"\n");
console.log(JSON.stringify(report,null,2));