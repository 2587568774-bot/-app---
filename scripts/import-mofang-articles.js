const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = "E:/无尽的/see-yunnan";
const OUT = path.join(ROOT, "tmp-mofang-import");
const PROMO = path.join(ROOT, "apps/web/public/uploads/promo");
const FOOD = path.join(ROOT, "apps/web/public/uploads/food");
const CULTURE = path.join(ROOT, "apps/web/public/uploads/culture");
const MEDIA = path.join(ROOT, "素材");
const COLLECTOR = { host: "154.40.34.153", port: 18765 };
const PROXY = "http://127.0.0.1:7897";

const H5_URLS = [
  "https://mofang.ybsjyyn.com/h5/66c456503b23086f414f7982",
  "https://mofang.ybsjyyn.com/h5/66d90dfe5fe1bd2b474bd422",
  "https://mofang.ybsjyyn.com/h5/66d929d337e2d410b67239e2",
  "https://mofang.ybsjyyn.com/h5/66d943d9327ed23096733f52",
  "https://mofang.ybsjyyn.com/h5/66c46f43783c640e5a5c61c2",
  "https://mofang.ybsjyyn.com/h5/672dc2c7776dce7a324c8b46",
  "https://mofang.ybsjyyn.com/h5/66d9471bbd7b0136d7237982",
  "https://mofang.ybsjyyn.com/h5/66d949cd6589a846bf21b402",
  "https://mofang.ybsjyyn.com/h5/66b1ee361ea396265a3e29a2",
  "https://mofang.ybsjyyn.com/h5/66d915718941164bc417c332",
  "https://mofang.ybsjyyn.com/h5/66c5c72d9ac34e065513c3e1",
  "https://mofang.ybsjyyn.com/h5/67a42fe6ca0c9a341008e761",
  "https://mofang.ybsjyyn.com/h5/66b1edc1affc277444289992",
  "https://mofang.ybsjyyn.com/h5/672dcc006cde9f14b56b2434",
  "https://mofang.ybsjyyn.com/h5/66d959a69272f22eb42d0c42",
  "https://mofang.ybsjyyn.com/h5/66c449b2997c9f37057e1b62",
];

const NAME_TO_SLUG = {
  昆明:"kunming",曲靖:"qujing",玉溪:"yuxi",保山:"baoshan",昭通:"zhaotong",
  丽江:"lijiang",普洱:"puer",临沧:"lincang",楚雄:"chuxiong",红河:"honghe",
  文山:"wenshan",西双版纳:"xishuangbanna",版纳:"xishuangbanna",大理:"dali",
  德宏:"dehong",怒江:"nujiang",迪庆:"diqing",香格里拉:"diqing",
};

const PORTRAIT = /人像|人物合影|合影留念|游客自拍|领导|会议|座谈|调研|考察|讲话|表彰|颁奖|模特|美女|帅哥|新郎|新娘|主持|演讲|采访|官员|书记|市长|县长|局长|宣誓|portrait|selfie|头像/i;
const FOOD_KW = /美食|小吃|米线|过桥|汽锅|饵块|饵丝|乳扇|乳饼|烤鸭|火腿|鲜花饼|菌|松茸|鸡枞|牛肝|竹笋|烧烤|火锅|特色菜|汤|粉|面|茶点|咖啡|糕|饼|粽|豆腐|凉粉|米干|卷粉|炸洋芋|蘸水|味道|特产|餐饮|甜品|酒|牛肉|猪肉|羊肉|菜|美味|食堂|饭店|food|cuisine|dish|noodle|delicacy|snack|restaurant/i;
const LAND_KW = /风景|景色|风光|景观|山水|峡谷|雪山|草甸|湖泊|洱海|滇池|古城|古镇|寺庙|佛塔|梯田|花海|公园|湿地|森林|瀑布|江|河|湖|山|峰|夜景|天际线|景区|景点|村寨|城墙|石林|溶洞|建筑|街巷|概况|介绍|攻略|旅行|旅游|线路|scenic|landscape|scenery|view|mountain|lake|river|temple|旧址|故居|文庙|纪念/i;
const REJECT = /logo|二维码|qrcode|avatar|icon|\.svg|占位|loading|1x1|pixel|wechat|支付宝|市徽|国徽|党徽|地图定位|行政区划|位置图|author_avatar/i;

function ensure(d){fs.mkdirSync(d,{recursive:true});}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function isImg(b){return (b[0]===0xff&&b[1]===0xd8)||(b[0]===0x89&&b[1]===0x50)||(b[0]===0x52&&b[1]===0x49);}
function isId(s){ return typeof s==="string" && /^[0-9a-f-]{20,40}$/i.test(s); }

function curlGet(url, dest, opts={}){
  const args=["-sS","--max-time",String(opts.timeout||40),"-L","-A","Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"];
  if(opts.proxy) args.push("--proxy", opts.proxy);
  if(dest) args.push("-o", dest);
  args.push(url);
  const r=spawnSync("curl.exe", args, {encoding: dest?"buffer":"utf8", maxBuffer:30*1024*1024});
  if(r.status!==0) throw new Error((r.stderr&&r.stderr.toString())||"curl fail");
  if(dest) return dest;
  return r.stdout.toString("utf8");
}
function httpJson(url){
  try { return JSON.parse(curlGet(url,null,{timeout:35})); }
  catch { return JSON.parse(curlGet(url,null,{timeout:35,proxy:PROXY})); }
}

function parseWindowConfig(html){
  const marker="window.config = ";
  const i=html.indexOf(marker);
  if(i<0) return null;
  let j=i+marker.length; while(html[j]&&/\s/.test(html[j])) j++;
  if(html[j]!=="{") return null;
  let depth=0,inStr=false,esc=false,k=j;
  for(;k<html.length;k++){
    const ch=html[k];
    if(inStr){ if(esc){esc=false;continue;} if(ch==="\\"){esc=true;continue;} if(ch==='"') inStr=false; continue; }
    if(ch==='"'){inStr=true;continue;}
    if(ch==="{") depth++;
    else if(ch==="}"){ depth--; if(depth===0){k++;break;} }
  }
  return JSON.parse(html.slice(j,k));
}
function guessSlug(title, shareTitle){
  const blob=`${title||""} ${shareTitle||""}`;
  for(const [name,slug] of Object.entries(NAME_TO_SLUG)) if(blob.includes(name)) return slug;
  return null;
}
function addImg(list, url, ctx){
  if(!url||typeof url!=="string") return;
  if(url.startsWith("//")) url="https:"+url;
  if(!/^https?:\/\//i.test(url)) return;
  if(!/material-center|myqcloud|tenyn|\.(jpe?g|png|webp)/i.test(url)) return;
  if(/avatar|logo|icon|qr/i.test(url)) return;
  list.push({url:url.replace(/^http:\/\//,"https://"), ctx:(ctx||"").slice(0,260)});
}

function collectFromConfig(cfg){
  const images=[]; const articleIds=new Set();
  function walk(o, ctx=""){
    if(!o) return;
    if(typeof o==="string"){
      if(/https?:|\/\//.test(o) && /material-center|myqcloud|tenyn|\.(jpe?g|png|webp)/i.test(o)) addImg(images,o,ctx);
      return;
    }
    if(Array.isArray(o)) return o.forEach((x,i)=>walk(x,ctx));
    if(typeof o==="object"){
      if(o.item_type && isId(o.id)){
        if(o.item_type==="tips" || o.item_type==="article" || o.item_type==="H5") articleIds.add(o.id);
      }
      if(o.origin_url) addImg(images,o.origin_url,ctx);
      if(o.thumb_url) addImg(images,o.thumb_url,ctx);
      if(o.model==="image"&&o.value) addImg(images,o.value,ctx);
      if(typeof o.src==="string") addImg(images,o.src,ctx);
      if(o.src&&o.src.default) addImg(images,o.src.default,ctx);
      if(typeof o.default==="string") addImg(images,o.default,ctx);
      if(o.thumbnail) addImg(images,o.thumbnail,ctx);
      if(o.cover_image) addImg(images,o.cover_image,ctx);
      let titleCtx=ctx;
      if(o.title&&typeof o.title==="object"&&o.title.default) titleCtx=`${ctx} ${o.title.default}`;
      if(typeof o.title==="string") titleCtx=`${ctx} ${o.title}`;
      for(const v of Object.values(o)) walk(v, titleCtx);
    }
  }
  walk(cfg);
  if(cfg.share&&cfg.share.thumbnail) addImg(images,cfg.share.thumbnail,"share");
  return {images, articleIds:[...articleIds]};
}

function deepExtractImages(node, ctx, out){
  if(!node) return;
  if(typeof node==="string"){
    const s=node.trim();
    if((s.startsWith("[")||s.startsWith("{")) && s.length>2){
      try { deepExtractImages(JSON.parse(s), ctx, out); return; } catch {}
    }
    // html content
    const re=/https?:\/\/[^"'\\\s>]+?\.(?:jpe?g|png|webp)(?:\?[^"'\\\s>]*)?/gi;
    let m; while((m=re.exec(node))) addImg(out,m[0],ctx);
    // qcloud without ext
    const re2=/https?:\/\/(?:manager|material-center)[^"'\\\s>]+\.(?:jpe?g|png|webp|jpeg)(?:\?[^"'\\\s>]*)?/gi;
    while((m=re2.exec(node))) addImg(out,m[0],ctx);
    return;
  }
  if(Array.isArray(node)) return node.forEach(x=>deepExtractImages(x,ctx,out));
  if(typeof node==="object"){
    if(node.model==="image"&&node.value) addImg(out,node.value,ctx);
    if(node.origin_url) addImg(out,node.origin_url,ctx);
    if(node.thumb_url) addImg(out,node.thumb_url,ctx);
    if(node.cover_image) addImg(out,node.cover_image,ctx);
    if(typeof node.src==="string") addImg(out,node.src,ctx);
    const name=node.name||node.title||"";
    const next=(ctx+" "+name).slice(0,300);
    for(const v of Object.values(node)) deepExtractImages(v,next,out);
  }
}

function extractFromData(data){
  const images=[]; const tipIds=new Set();
  if(!data) return {images, tipIds:[]};
  const root=`${data.title||""} ${data.brief||""} ${data.description||""} ${data.sub_type_name||""}`;
  if(data.image){ addImg(images,data.image.origin_url,root+" cover"); addImg(images,data.image.thumb_url,root+" cover"); }
  if(data.cover_image) addImg(images,data.cover_image,root+" cover");
  if(data.context_cover_image) addImg(images,data.context_cover_image,root+" cover");
  deepExtractImages(data.content, root, images);
  deepExtractImages(data.html_content, root, images);
  deepExtractImages(data.json_content, root, images);
  deepExtractImages(data.app_json_content, root, images);
  function findTips(o){
    if(!o) return;
    if(typeof o==="string"){
      const re=/tipdetail\?id=([0-9a-f-]{20,})/ig; let m;
      while((m=re.exec(o))) tipIds.add(m[1]);
      return;
    }
    if(Array.isArray(o)) return o.forEach(findTips);
    if(typeof o==="object"){
      if(o.href){ const m=(o.href.match(/id=([0-9a-f-]{20,})/i)||[])[1]; if(m) tipIds.add(m); }
      if(isId(o.id) && (o.title||o.name)) tipIds.add(o.id);
      Object.values(o).forEach(findTips);
    }
  }
  findTips(data.content);
  return {images, tipIds:[...tipIds]};
}

function hasUsefulArticle(d){
  if(!d) return false;
  if(d.title && String(d.title).trim()) return true;
  if(d.html_content && String(d.html_content).length>50) return true;
  if(d.json_content) return true;
  if(d.content && (Array.isArray(d.content)?d.content.length:true)) {
    if(Array.isArray(d.content) && d.content.length) return true;
    if(typeof d.content==="object" && d.content!==null) return true;
  }
  if(d.cover_image) return true;
  if(d.image && d.image.origin_url) return true;
  return false;
}
async function fetchArticle(id){
  // UUID tips style
  try {
    const j=httpJson(`https://mp-gw.ybsjyyn.com/app/article/api/detail?id=${id}`);
    if(j&&j.ret===0&&hasUsefulArticle(j.data)) return j.data;
  } catch {}
  // mongo c-article style
  try {
    const j=httpJson(`https://mp-gw.ybsjyyn.com/api/c-article/detail?id=${id}`);
    if(j&&j.ret===0&&hasUsefulArticle(j.data)) return j.data;
  } catch {}
  return null;
}

function classify(item){
  const t=`${item.url} ${item.ctx||""}`;
  if(REJECT.test(t)||PORTRAIT.test(t)) return "reject";
  const food=FOOD_KW.test(t); const land=LAND_KW.test(t);
  if(food && (!land || /美食|小吃|米线|菜|特产|餐饮|饭店/.test(t))) return "food";
  if(land || /cover|share|攻略|概况|介绍|景点|线路/.test(t)) return "land";
  return "land";
}
function upgradeUrl(url){
  return url.replace(/\?imageMogr2\/thumbnail\/\d+x.*/i,"").replace(/^http:\/\//,"https://");
}
function downloadImage(url, dest){
  const cands=[upgradeUrl(url), url];
  for(const u of cands){
    for(const proxy of [null, PROXY]){
      const tmp=dest+".part";
      try{
        curlGet(u,tmp,{timeout:50,proxy});
        if(!fs.existsSync(tmp)) continue;
        const st=fs.statSync(tmp);
        if(st.size<16000){fs.unlinkSync(tmp);continue;}
        const head=fs.readFileSync(tmp).subarray(0,8);
        if(!isImg(head)){fs.unlinkSync(tmp);continue;}
        if(st.size<24000 && head[0]===0x89){fs.unlinkSync(tmp);continue;}
        fs.renameSync(tmp,dest); return st.size;
      }catch{ try{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}catch{} }
    }
  }
  throw new Error("dl fail");
}
function requestCollector(url, region){
  return new Promise((resolve)=>{
    const data=JSON.stringify({url, preferredRegion:region||"云南", note:"风景美食不要人像"});
    const req=http.request({host:COLLECTOR.host,port:COLLECTOR.port,path:"/api/collect",method:"POST",headers:{"Content-Type":"application/json","Content-Length":Buffer.byteLength(data)},timeout:60000},res=>{
      let b=""; res.on("data",c=>b+=c); res.on("end",()=>{ try{resolve(JSON.parse(b));}catch{resolve({ok:false});} });
    });
    req.on("error",()=>resolve({ok:false}));
    req.on("timeout",()=>{req.destroy(); resolve({ok:false});});
    req.write(data); req.end();
  });
}

(async()=>{
  ensure(OUT); ensure(FOOD); ensure(CULTURE);
  const allBySlug={};

  for(let i=0;i<H5_URLS.length;i++){
    const h5=H5_URLS[i];
    console.log(`\n===== [${i+1}/16] ${h5} =====`);
    let html;
    try{ html=curlGet(h5,null,{timeout:40}); }catch(e){ console.log("h5 fail",e.message); continue; }
    const cfg=parseWindowConfig(html);
    if(!cfg){ console.log("no config"); continue; }
    const title=(cfg.topic&&cfg.topic.title)||(cfg.share&&cfg.share.title)||"";
    const shareTitle=(cfg.share&&cfg.share.title)||"";
    const slug=guessSlug(title,shareTitle)||`city${i+1}`;
    console.log("city=",title,"slug=",slug);

    // collector bookkeeping (user path)
    await requestCollector(h5, title||slug);

    const extracted=collectFromConfig(cfg);
    console.log("config imgs",extracted.images.length,"articles",extracted.articleIds.length);

    const bag=allBySlug[slug]||{land:[],food:[],sources:[]};
    bag.sources.push(h5);
    for(const im of extracted.images){
      const k=classify(im);
      if(k==="food") bag.food.push(im); else if(k==="land") bag.land.push(im);
    }

    const queue=[...extracted.articleIds];
    const seen=new Set(queue);
    let fetched=0;
    while(queue.length && fetched<22){
      const id=queue.shift();
      const data=await fetchArticle(id);
      if(!data) continue;
      fetched++;
      const {images, tipIds}=extractFromData(data);
      const t=data.title||"";
      console.log(" article", t.slice(0,28), "imgs", images.length, "tips", tipIds.length);
      for(const im of images){
        im.ctx=`${t} ${im.ctx||""}`;
        const k=classify(im);
        if(k==="food") bag.food.push(im); else if(k==="land") bag.land.push(im);
      }
      for(let ti=tipIds.length-1; ti>=0; ti--){
        const tid=tipIds[ti];
        if(!seen.has(tid)){ seen.add(tid); queue.unshift(tid); }
      }
      await sleep(60);
    }
    console.log(" fetched", fetched, "landCand", bag.land.length, "foodCand", bag.food.length);
    allBySlug[slug]=bag;
    fs.writeFileSync(path.join(OUT,`h5-${slug}.json`), JSON.stringify({title,slug,land:bag.land.length,food:bag.food.length},null,2));
  }

  const promoPath=path.join(ROOT,"apps/web/src/data/promo-images.json");
  const culturePath=path.join(ROOT,"apps/web/src/data/place-culture.json");
  const promo=JSON.parse(fs.readFileSync(promoPath,"utf8"));
  const culture=JSON.parse(fs.readFileSync(culturePath,"utf8"));
  const report={};

  for(const [slug,bag] of Object.entries(allBySlug)){
    console.log(`\n### DL ${slug} land=${bag.land.length} food=${bag.food.length}`);
    ensure(path.join(PROMO,slug)); ensure(path.join(FOOD,slug)); ensure(path.join(CULTURE,slug));
    for(const cat of ["01-州市封面","02-州市图集","03-美食","04-人文","06-风景景点"]) ensure(path.join(MEDIA,cat,slug));
    for(const dir of [path.join(PROMO,slug),path.join(FOOD,slug),path.join(CULTURE,slug)]){
      if(!fs.existsSync(dir)) continue;
      for(const f of fs.readdirSync(dir)) if(/^mofang-/.test(f)) try{fs.unlinkSync(path.join(dir,f));}catch{}
    }
    function uniq(arr){
      const m=new Map();
      for(const it of arr){ const u=upgradeUrl(it.url); if(!m.has(u)) m.set(u,{...it,url:u}); }
      return [...m.values()];
    }
    // score: prefer non-screenshot, larger likely later
    const lands=uniq(bag.land).filter(x=>!/截屏|screenshot/i.test(x.ctx+x.url));
    const foods=uniq(bag.food).filter(x=>!/截屏|screenshot/i.test(x.ctx+x.url));
    const savedLand=[];
    for(let i=0;i<lands.length && savedLand.length<8;i++){
      const it=lands[i];
      const name=`mofang-land-${String(savedLand.length+1).padStart(2,"0")}.jpg`;
      const dest=path.join(PROMO,slug,name);
      try{
        const size=downloadImage(it.url,dest);
        const head=fs.readFileSync(dest).subarray(0,2);
        let final=name;
        if(head[0]===0x89){ final=name.replace(".jpg",".png"); fs.renameSync(dest,path.join(PROMO,slug,final)); }
        const fp=path.join(PROMO,slug,final);
        fs.copyFileSync(fp, path.join(MEDIA,"02-州市图集",slug,final));
        if(savedLand.length===0){
          fs.copyFileSync(fp, path.join(MEDIA,"01-州市封面",slug,final));
          fs.copyFileSync(fp, path.join(MEDIA,"06-风景景点",slug,final));
        }
        savedLand.push({webPath:`/uploads/promo/${slug}/${final}`, size});
        console.log(" land", final, size);
      }catch{}
    }
    const savedFood=[];
    for(let i=0;i<foods.length && savedFood.length<6;i++){
      const it=foods[i];
      const name=`mofang-food-${String(savedFood.length+1).padStart(2,"0")}.jpg`;
      const dest=path.join(FOOD,slug,name);
      try{
        const size=downloadImage(it.url,dest);
        const head=fs.readFileSync(dest).subarray(0,2);
        let final=name;
        if(head[0]===0x89){ final=name.replace(".jpg",".png"); fs.renameSync(dest,path.join(FOOD,slug,final)); }
        const fp=path.join(FOOD,slug,final);
        fs.copyFileSync(fp, path.join(MEDIA,"03-美食",slug,final));
        savedFood.push({webPath:`/uploads/food/${slug}/${final}`, size});
        console.log(" food", final, size);
      }catch{}
    }

    if(savedLand.length){
      const prev=(promo.cities&&promo.cities[slug])||{};
      const old=(prev.gallery||[]).filter(g=>{
        const fp=path.join(ROOT,"apps/web/public",g.replace(/^\//,""));
        return fs.existsSync(fp)&&fs.statSync(fp).size>=16000;
      });
      const gallery=Array.from(new Set([...savedLand.map(s=>s.webPath),...old])).slice(0,10);
      promo.cities[slug]={
        ...prev,
        cover:savedLand[0].webPath,
        gallery,
        credit:`${slug} 游云南魔方指南（无人像过滤）`,
        source:"mofang-ybsjyyn",
        collected_at:new Date().toISOString(),
        tourism_site:bag.sources[0],
        tourism_site_name:"游云南·16市州旅游指南",
      };
    }
    if(!culture.cities[slug]) culture.cities[slug]={foodItems:[],cultureImages:[],ethnicGroups:[]};
    const city=culture.cities[slug];
    if(savedFood.length){
      const items=city.foodItems||[];
      for(let i=0;i<items.length;i++) items[i].image = savedFood[i % savedFood.length].webPath;
      if(!items.length){
        city.foodItems=savedFood.slice(0,3).map((f,idx)=>({
          name:{"zh-Hans":`本地美食${idx+1}`,en:`Local food ${idx+1}`},
          note:{"zh-Hans":"游云南指南美食图",en:"Guide food photo"},
          image:f.webPath,
        }));
      } else city.foodItems=items;
    }
    if(savedLand.length){
      city.cultureImages=savedLand.slice(0,4).map(s=>s.webPath);
      for(const s of savedLand.slice(0,4)){
        const base=path.basename(s.webPath);
        const src=path.join(ROOT,"apps/web/public",s.webPath.replace(/^\//,""));
        if(fs.existsSync(src)){
          fs.copyFileSync(src, path.join(CULTURE,slug,base));
          fs.copyFileSync(src, path.join(MEDIA,"04-人文",slug,base));
        }
      }
    }
    report[slug]={land:savedLand.length,food:savedFood.length,landFiles:savedLand.map(s=>s.webPath),foodFiles:savedFood.map(s=>s.webPath)};
  }

  promo.generated_at=new Date().toISOString();
  promo.note="Mofang 游云南 16市州 + article/c-article images; no portraits; food updated when detected.";
  culture.generated_at=new Date().toISOString();
  culture.note="Food/culture images from 游云南 mofang guides (no portraits).";
  fs.writeFileSync(promoPath, JSON.stringify(promo,null,2)+"\n");
  fs.writeFileSync(culturePath, JSON.stringify(culture,null,2)+"\n");
  fs.writeFileSync(path.join(OUT,"final-report.json"), JSON.stringify(report,null,2));
  console.log("\n==== FINAL ====");
  for(const [s,r] of Object.entries(report)) console.log(`${s}: land=${r.land} food=${r.food}`);
  console.log("TOTAL land", Object.values(report).reduce((a,b)=>a+b.land,0), "food", Object.values(report).reduce((a,b)=>a+b.food,0));
})().catch(e=>{console.error(e); process.exit(1);});