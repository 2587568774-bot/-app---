const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const COLLECTOR = { host: '154.40.34.153', port: 18765 };
const ROOT = 'E:/无尽的/see-yunnan';
const WEB = path.join(ROOT, 'apps/web');
const OUT_TMP = path.join(ROOT, 'tmp-collector-import');
const PROMO_DIR = path.join(WEB, 'public/uploads/promo');
const MEDIA_DIR = path.join(ROOT, '素材');
const promoPath = path.join(WEB, 'src/data/promo-images.json');
const promo = JSON.parse(fs.readFileSync(promoPath, 'utf8'));
const PROXY = 'http://127.0.0.1:7897';

const CITY_SOURCES = [
  { slug: 'kunming', nameZh: '昆明', urls: ['https://zh.wikipedia.org/wiki/%E6%98%86%E6%98%8E%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Kunming'] },
  { slug: 'qujing', nameZh: '曲靖', urls: ['https://zh.wikipedia.org/wiki/%E6%9B%B2%E9%9D%96%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Qujing'] },
  { slug: 'yuxi', nameZh: '玉溪', urls: ['https://zh.wikipedia.org/wiki/%E7%8E%89%E6%BA%AA%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Yuxi'] },
  { slug: 'baoshan', nameZh: '保山', urls: ['https://zh.wikipedia.org/wiki/%E4%BF%9D%E5%B1%B1%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Baoshan,_Yunnan'] },
  { slug: 'zhaotong', nameZh: '昭通', urls: ['https://zh.wikipedia.org/wiki/%E6%98%AD%E9%80%9A%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Zhaotong'] },
  { slug: 'lijiang', nameZh: '丽江', urls: ['https://zh.wikipedia.org/wiki/%E4%B8%BD%E6%B1%9F%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Lijiang'] },
  { slug: 'puer', nameZh: '普洱', urls: ['https://zh.wikipedia.org/wiki/%E6%99%AE%E6%B4%B1%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Pu%27er_City'] },
  { slug: 'lincang', nameZh: '临沧', urls: ['https://zh.wikipedia.org/wiki/%E4%B8%B4%E6%B2%A7%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Lincang'] },
  { slug: 'chuxiong', nameZh: '楚雄', urls: ['https://zh.wikipedia.org/wiki/%E6%A5%9A%E9%9B%84%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Chuxiong_City'] },
  { slug: 'honghe', nameZh: '红河', urls: ['https://zh.wikipedia.org/wiki/%E7%BA%A2%E6%B2%B3%E5%93%88%E5%B0%BC%E6%97%8F%E5%BD%9D%E6%97%8F%E8%87%AA%E6%B2%BB%E5%B7%9E', 'https://commons.wikimedia.org/wiki/Category:Honghe_Hani_and_Yi_Autonomous_Prefecture'] },
  { slug: 'wenshan', nameZh: '文山', urls: ['https://zh.wikipedia.org/wiki/%E6%96%87%E5%B1%B1%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Wenshan_City'] },
  { slug: 'xishuangbanna', nameZh: '西双版纳', urls: ['https://zh.wikipedia.org/wiki/%E8%A5%BF%E5%8F%8C%E7%89%88%E7%BA%B3%E5%82%A3%E6%97%8F%E8%87%AA%E6%B2%BB%E5%B7%9E', 'https://commons.wikimedia.org/wiki/Category:Xishuangbanna'] },
  { slug: 'dali', nameZh: '大理', urls: ['https://zh.wikipedia.org/wiki/%E5%A4%A7%E7%90%86%E5%B8%82', 'https://www.dalitravel.cn/', 'https://commons.wikimedia.org/wiki/Category:Dali_City'] },
  { slug: 'dehong', nameZh: '德宏', urls: ['https://zh.wikipedia.org/wiki/%E5%BE%B7%E5%AE%8F%E5%82%A3%E6%97%8F%E6%99%AF%E9%A2%87%E6%97%8F%E8%87%AA%E6%B2%BB%E5%B7%9E', 'https://commons.wikimedia.org/wiki/Category:Dehong'] },
  { slug: 'nujiang', nameZh: '怒江', urls: ['https://zh.wikipedia.org/wiki/%E6%80%92%E6%B1%9F%E5%82%A3%E5%83%B4%E6%97%8F%E8%87%AA%E6%B2%BB%E5%B7%9E', 'https://commons.wikimedia.org/wiki/Category:Nujiang'] },
  { slug: 'diqing', nameZh: '迪庆', urls: ['https://zh.wikipedia.org/wiki/%E9%A6%99%E6%A0%BC%E9%87%8C%E6%8B%89%E5%B8%82', 'https://commons.wikimedia.org/wiki/Category:Shangri-La_City'] },
];

const REJECT = /人像|人物|肖像|游客|合影|美女|帅哥|姑娘|小伙|演员|主持人|模特|people|person|portrait|face|selfie|model|woman|man|girl|boy|crowd|会议|推进会|强调|整治|联赛|运动员|健儿|出征|省运会|民生|改革|建言|领导|讲话|考察|调研|慰问|干部|书记|市长|州长|新闻发布|记者|采访|emblem|coat of arms|flag of|location of|locator|地图定位|位置图|市徽|旗帜/i;
const MAP_OR_ICON = /in_Yunnan|Location_of|Emblem|Flag_of|\.svg|map of|locator/i;

function ensure(d){fs.mkdirSync(d,{recursive:true});}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

function requestCollector(pathName, method='GET', body=null){
  return new Promise((resolve,reject)=>{
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      host: COLLECTOR.host, port: COLLECTOR.port, path: pathName, method,
      headers: data ? {'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)} : {},
      timeout: 180000,
    };
    const req = http.request(opts, res=>{
      let b=''; res.on('data',c=>b+=c); res.on('end',()=>resolve({status:res.statusCode, body:b}));
    });
    req.on('error',reject);
    req.on('timeout',()=>{req.destroy(new Error('timeout'));});
    if(data) req.write(data);
    req.end();
  });
}

async function collect(url, region){
  const res = await requestCollector('/api/collect','POST',{url, preferredRegion:region, note:'风景建筑自然景观，不要人像人物合影会议'});
  try { return JSON.parse(res.body); } catch { return {ok:false, error:res.body.slice(0,200)}; }
}

function preferFullWikimedia(url){
  // /wikipedia/x/y/Name.jpg/250px-Name.jpg -> /x/y/Name.jpg
  const m = url.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/thumb\/(.+?)\/\d+px-(.+)$/i);
  if(m) return `${m[1]}/${m[2]}`;
  // sometimes /thumb/.../Name.jpg/250px-Name.jpg with encoded names
  const m2 = url.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/thumb\/([^/]+\/[^/]+\/[^/]+)\/\d+px-/i);
  if(m2){
    // reconstruct: commons/thumb/a/ab/file.jpg/250px-file.jpg -> commons/a/ab/file.jpg
    const parts = url.split('/thumb/');
    if(parts.length===2){
      const rest = parts[1].replace(/\/\d+px-[^/]+$/,'');
      return parts[0] + '/' + rest;
    }
  }
  return url;
}

function allowed(item){
  const url = String(item.url||'');
  const alt = String(item.alt||'');
  const t = `${url} ${alt}`;
  if(REJECT.test(t) || MAP_OR_ICON.test(t)) return false;
  if(!/\.(jpe?g|png|webp)($|\?)/i.test(url) && !/upload\.wikimedia\.org/i.test(url)) return false;
  if(/\.svg/i.test(url)) return false;
  return true;
}

function score(item){
  const t=`${item.url||''} ${item.alt||''}`;
  let s=0;
  if(/upload\.wikimedia\.org/i.test(item.url||'')) s+=3;
  if(/aerial|night|lake|mountain|pagoda|tower|park|view|old.?town|square|temple|lake|river|bridge|scenery|滇池|翠湖|古|塔|山|湖|城|夜|航拍/i.test(t)) s+=4;
  if(item.suggested_asset_type==='cover') s+=2;
  if(MAP_OR_ICON.test(t)) s-=10;
  return s;
}

function extFromUrl(url){
  try{
    const p=new URL(url).pathname;
    const m=p.match(/\.(jpe?g|png|webp)$/i);
    return m ? m[0].toLowerCase().replace('jpeg','jpg') : '.jpg';
  }catch{return '.jpg';}
}

function curlDownload(url, dest){
  const r = spawnSync('curl.exe', [
    '-sS','--max-time','90','--proxy', PROXY, '-L',
    '-A','Mozilla/5.0 (Windows NT 10.0; Win64; x64) SeeYunnan/1.0',
    '-o', dest, url
  ], {encoding:'utf8'});
  if(r.status !== 0) throw new Error(r.stderr || ('curl exit '+r.status));
  if(!fs.existsSync(dest)) throw new Error('no file');
  const st = fs.statSync(dest);
  if(st.size < 8000) throw new Error('too small '+st.size);
  // detect html error page
  const head = fs.readFileSync(dest).subarray(0,200).toString('utf8');
  if(/<!DOCTYPE html|<html/i.test(head)) throw new Error('got html not image');
  return st.size;
}

async function processCity(city){
  console.log(`\n=== ${city.slug} ${city.nameZh} ===`);
  const all=[];
  for(const url of city.urls){
    try{
      console.log(' collect', url);
      const r = await collect(url, city.slug);
      const n = ((r.result&&r.result.image_candidates)||[]).length;
      console.log('  ok=', !!r.ok, 'imgs=', n, r.error||'');
      if(r.ok) for(const it of (r.result.image_candidates||[])) all.push(it);
    }catch(e){ console.log('  fail', e.message); }
    await sleep(400);
  }
  const uniq=new Map();
  for(const it of all) if(it.url && !uniq.has(it.url)) uniq.set(it.url,it);
  const list=[...uniq.values()].filter(allowed).sort((a,b)=>score(b)-score(a));
  console.log(' unique', uniq.size, 'allowed', list.length);

  ensure(path.join(PROMO_DIR, city.slug));
  for(const cat of ['01-州市封面','02-州市图集','06-风景景点']) ensure(path.join(MEDIA_DIR, cat, city.slug));
  ensure(path.join(OUT_TMP, city.slug));

  // clear old failed collector/wiki partials for this run prefix
  for(const f of fs.readdirSync(path.join(PROMO_DIR, city.slug))){
    if(/^wiki-\d{2}\./.test(f) || /^collector-\d{2}\./.test(f)){
      try{fs.unlinkSync(path.join(PROMO_DIR, city.slug, f));}catch{}
    }
  }

  const saved=[];
  for(let i=0;i<list.length && saved.length<6;i++){
    const item=list[i];
    const tryUrls = [preferFullWikimedia(item.url), item.url].filter((v,idx,arr)=>arr.indexOf(v)===idx);
    const name = `wiki-${String(saved.length+1).padStart(2,'0')}${extFromUrl(tryUrls[0])}`;
    const dest = path.join(PROMO_DIR, city.slug, name);
    let ok=false, size=0, used='';
    for(const u of tryUrls){
      try{
        size = curlDownload(u, dest);
        used=u; ok=true; break;
      }catch(e){
        // continue
      }
    }
    if(!ok){ console.log('  dl fail', (item.alt||item.url).slice(0,80)); continue; }
    fs.copyFileSync(dest, path.join(MEDIA_DIR,'02-州市图集',city.slug,name));
    if(saved.length===0){
      fs.copyFileSync(dest, path.join(MEDIA_DIR,'01-州市封面',city.slug,name));
      fs.copyFileSync(dest, path.join(MEDIA_DIR,'06-风景景点',city.slug,name));
    }
    saved.push({webPath:`/uploads/promo/${city.slug}/${name}`, alt:item.alt||'', source:used, size});
    console.log('  saved', name, size, (item.alt||'').slice(0,40));
  }

  if(saved.length){
    const prev=(promo.cities&&promo.cities[city.slug])||{};
    // Prefer new landscape images first, keep old promo as fallback
    const gallery=Array.from(new Set([...saved.map(s=>s.webPath), ...((prev.gallery)||[])])).slice(0,12);
    promo.cities[city.slug]={
      ...prev,
      cover: saved[0].webPath,
      gallery,
      credit: `${city.nameZh} landscape via collector (Wikipedia/Commons), no-portrait filter`,
      source: 'collector-wiki',
      collected_at: new Date().toISOString(),
      tourism_site: city.urls[0],
      tourism_site_name: city.nameZh,
    };
  }

  fs.writeFileSync(path.join(OUT_TMP, city.slug, 'result.json'), JSON.stringify({saved, allowed:list.length, candidates:uniq.size},null,2));
  return {slug:city.slug, candidates:uniq.size, allowed:list.length, saved:saved.length, paths:saved.map(s=>s.webPath)};
}

(async()=>{
  ensure(OUT_TMP);
  const report=[];
  for(const city of CITY_SOURCES){
    report.push(await processCity(city));
    await sleep(300);
  }
  promo.generated_at=new Date().toISOString();
  promo.note='Collector http://154.40.34.153:18765 + Wikipedia/Commons landscape images; portraits/news/maps filtered out.';
  fs.writeFileSync(promoPath, JSON.stringify(promo,null,2)+'\n');
  fs.writeFileSync(path.join(OUT_TMP,'import-report-final.json'), JSON.stringify(report,null,2));
  console.log('\n==== FINAL ====');
  for(const r of report) console.log(`${r.slug}: saved=${r.saved} allowed=${r.allowed} cand=${r.candidates}`);
  console.log('TOTAL', report.reduce((a,b)=>a+b.saved,0));
})().catch(e=>{console.error(e); process.exit(1);});
