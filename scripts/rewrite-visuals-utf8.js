const fs = require("fs");
const path = require("path");
const q = ["auto=format", "fit=crop", "w=1600", "q=80"].join("&");
const u = (id) => `https://images.unsplash.com/${id}?${q}`;
const POOL = {
  lake: [u("photo-1439066615861-d1af74d74000"), u("photo-1501785888041-af3ef285b470"), u("photo-1500534314209-a25ddb2bd429")],
  mountain: [u("photo-1464822759023-fed622ff2c3b"), u("photo-1469474968028-56623f02e42e"), u("photo-1500530855697-b586d89ba3ee")],
  town: [u("photo-1547981609-4b6bfe67ca0b"), u("photo-1508804185872-d7badad00f7d"), u("photo-1449824913935-59a10b8d2000")],
  forest: [u("photo-1441974231531-c6227db76b6e"), u("photo-1470071459604-3b5ec3a7fe05"), u("photo-1448375240586-882707db888b")],
  tropical: [u("photo-1528183429752-a97d0bf99b5a"), u("photo-1506905925346-21bda4d32df4"), u("photo-1469474968028-56623f02e42e")],
  plateau: [u("photo-1599571234909-29edebc01d48"), u("photo-1472214103451-9374bd1c798e"), u("photo-1506905925346-21bda4d32df4")],
  mist: [u("photo-1501785888041-af3ef285b470"), u("photo-1470071459604-3b5ec3a7fe05"), u("photo-1469474968028-56623f02e42e")],
  village: [u("photo-1508804185872-d7badad00f7d"), u("photo-1449824913935-59a10b8d2000"), u("photo-1547981609-4b6bfe67ca0b")],
};
function gallery(...keys) {
  const out = [];
  for (const k of keys) out.push(...(POOL[k] || []));
  return [...new Set(out)].slice(0, 6);
}
const cities = {
  kunming: { cover: POOL.plateau[0], gallery: gallery("plateau","lake","town"), credit: "Unsplash", mood: "Spring city under soft plateau light", culture: { en: "Kunming is Yunnan open front door: flower markets, university energy, gentle urban pace. Many newcomers settle services here first.", "zh-Hans": "昆明是云南的大门：花市、大学城和相对轻松的城市节奏。很多外来者会先在这里安顿配套，再走向全省。" }, lifestyle: { en: "Office days, lake walks, spicy rice noodles, and weekend escapes to nearby mountains or Fuxian Lake.", "zh-Hans": "日常是写字楼、湖边散步、一碗热米线，周末去附近山里或抚仙湖换口气。" }, tags: ["capital","flowers","starter-city","services"] },
  dali: { cover: POOL.town[1], gallery: gallery("town","lake","village"), credit: "Unsplash", mood: "Lake wind, old town lanes, slow mornings", culture: { en: "Bai courtyards, Erhai sunsets, and cafe culture. Overseas remote workers love the lifestyle; quieter villages outside peak zones feel more real.", "zh-Hans": "白族院落、洱海日落和咖啡馆文化。海外远程工作者很喜欢这里；离开过热核心区，周边村落更像真正的大理。" }, lifestyle: { en: "Lake cycling, market breakfasts, freelancers and long-stay travelers.", "zh-Hans": "环湖骑行、早市早餐，创作者和长住旅人混在一起。" }, tags: ["erhai","bai-culture","lifestyle","cafes"] },
  lijiang: { cover: POOL.town[0], gallery: gallery("town","mountain","village"), credit: "Unsplash", mood: "Stone lanes under snow mountain light", culture: { en: "Naxi heritage, courtyard inns, and high-altitude romance. The old town is theatrical; countryside air lingers longer.", "zh-Hans": "纳西文化、院子客栈和高原浪漫。夜晚古城很戏剧化，真正难忘的是周边田野和雪山空气。" }, lifestyle: { en: "Tourism is strong, so costs rise. Great for immersive short stays.", "zh-Hans": "旅游旺，成本偏高。适合深度短居。" }, tags: ["naxi","old-town","highland","travel-icon"] },
  xishuangbanna: { cover: POOL.tropical[0], gallery: gallery("tropical","forest"), credit: "Unsplash", mood: "Tropical canopy and warm winter light", culture: { en: "Closer to Southeast Asia than highland Yunnan: Dai temples, night markets, tropical fruit, rainforest humidity.", "zh-Hans": "更像东南亚：傣寺、夜市、热带水果和雨林湿度。" }, lifestyle: { en: "Fruit stalls, botanical gardens, hot evenings. Strong winter-escape base.", "zh-Hans": "水果摊、植物园和湿热夜晚。很适合过冬。" }, tags: ["tropical","dai","winter-escape","rainforest"] },
  diqing: { cover: POOL.mountain[0], gallery: gallery("mountain","mist","plateau"), credit: "Unsplash", mood: "High meadows and monastery silence", culture: { en: "Shangri-La opens into Tibetan cultural landscapes: prayer flags, butter tea, monasteries, thin bright air.", "zh-Hans": "香格里拉通向藏地文化：经幡、酥油茶、寺庙和稀薄明亮的空气。" }, lifestyle: { en: "Beautiful and demanding. Altitude shapes every plan.", "zh-Hans": "很美也很考验人，海拔会改写所有计划。" }, tags: ["shangri-la","tibetan","altitude","monasteries"] },
  baoshan: { cover: POOL.mountain[2], gallery: gallery("mountain","forest","mist"), credit: "Unsplash", mood: "Western mountains, volcano country nearby", culture: { en: "Quieter western gateway toward Tengchong hot springs and volcanic landforms.", "zh-Hans": "更安静的西部门户，通往腾冲温泉与火山地貌。" }, lifestyle: { en: "Less polished lifestyle branding, more nature and lower tourist density.", "zh-Hans": "包装更少，自然更多，游客密度更低。" }, tags: ["west-yunnan","hot-springs","mountains","quiet"] },
  honghe: { cover: POOL.forest[1], gallery: gallery("forest","mist","village"), credit: "Unsplash", mood: "Terraces carved into mountain light", culture: { en: "Famous for Yuanyang rice terraces and multi-ethnic mountain towns.", "zh-Hans": "以元阳梯田和多民族山城闻名。" }, lifestyle: { en: "Incredible for culture and photography; infrastructure varies by county.", "zh-Hans": "文化和摄影极强，各县配套差异大。" }, tags: ["terraces","hani","mountain-towns","culture"] },
  nujiang: { cover: POOL.mountain[1], gallery: gallery("mountain","mist","forest"), credit: "Unsplash", mood: "Deep canyon roads and river mist", culture: { en: "Adventure country: great canyon systems and remote villages far from polished tourism.", "zh-Hans": "冒险之地：壮阔峡谷和偏远村落，远离精致旅游线。" }, lifestyle: { en: "Come for landscape intensity, not convenience.", "zh-Hans": "来这里是为了风景强度，不是便利。" }, tags: ["canyon","remote","adventure","river"] },
  yuxi: { cover: POOL.lake[0], gallery: gallery("lake","plateau","village"), credit: "Unsplash", mood: "Clear lakes close to the capital", culture: { en: "Near Kunming but calmer, with Fuxian Lake and a cleaner weekend-town feel.", "zh-Hans": "离昆明不远却更安静，有抚仙湖和周末小镇气质。" }, lifestyle: { en: "A practical near-capital option for remote workers who want water and quiet.", "zh-Hans": "适合想靠近省会又要湖水和安静的远程工作者。" }, tags: ["lake","quiet","near-kunming","weekend"] },
  qujing: { cover: POOL.lake[1], gallery: gallery("plateau","mist","town"), credit: "Unsplash", mood: "Eastern plateau practicality", culture: { en: "Less marketed than Dali or Lijiang: ordinary city life, lower costs, eastern links.", "zh-Hans": "没有大理丽江那么会营销：更日常的城市生活、更低成本、滇东位置。" }, lifestyle: { en: "Better for practical living experiments than postcard tourism.", "zh-Hans": "更适合务实生活实验，而不是明信片旅游。" }, tags: ["practical","lower-cost","east-yunnan"] },
  chuxiong: { cover: POOL.forest[0], gallery: gallery("forest","plateau","village"), credit: "Unsplash", mood: "Corridor city between Kunming and the west", culture: { en: "Yi cultural notes and a useful mid-point identity on the road west.", "zh-Hans": "有彝族文化痕迹，是通往滇西的实用中转。" }, lifestyle: { en: "Mid costs with access both toward Kunming and western Yunnan.", "zh-Hans": "中等成本，兼顾昆明和滇西。" }, tags: ["corridor","yi","mid-cost"] },
  wenshan: { cover: POOL.mist[0], gallery: gallery("mist","forest","village"), credit: "Unsplash", mood: "Karst edges and rural markets", culture: { en: "Karst scenery and Zhuang cultural texture with less overseas hype.", "zh-Hans": "喀斯特风景和壮族文化肌理，海外热度更低。" }, lifestyle: { en: "Budget-friendly and still early for polished long-stay infrastructure.", "zh-Hans": "预算友好，长住精致配套仍在早期。" }, tags: ["karst","budget","southeast"] },
  lincang: { cover: POOL.forest[0], gallery: gallery("forest","mist","mountain"), credit: "Unsplash", mood: "Tea hills and slower southwest days", culture: { en: "Tea country with lower commercial noise and fewer staged tourist streets.", "zh-Hans": "茶区商业噪音更低，更少舞台化旅游街。" }, lifestyle: { en: "Low pressure if you accept fewer English-language services.", "zh-Hans": "低压力，也能接受英语服务较少。" }, tags: ["tea","quiet","southwest"] },
  dehong: { cover: POOL.tropical[0], gallery: gallery("tropical","forest","village"), credit: "Unsplash", mood: "Border palms and soft winter light", culture: { en: "Myanmar-border feel with Dai and Jingpo presence and tropical west-Yunnan light.", "zh-Hans": "贴着缅甸边境，有傣族景颇族文化和滇西热带感。" }, lifestyle: { en: "Interesting for culture explorers; services remain smaller-scale.", "zh-Hans": "适合文化探索，城市服务规模偏小。" }, tags: ["border","tropical","dai-jingpo"] },
  zhaotong: { cover: POOL.mountain[0], gallery: gallery("mountain","mist","plateau"), credit: "Unsplash", mood: "Rugged highland practicality", culture: { en: "Highland and less polished for lifestyle branding: rugged terrain and lower costs.", "zh-Hans": "偏高原、包装更少：粗犷地形和更低成本。" }, lifestyle: { en: "Colder winters and thinner international services.", "zh-Hans": "冬天更冷，国际服务更薄。" }, tags: ["highland","budget","rugged"] },
  puer: { cover: POOL.forest[0], gallery: gallery("forest","tropical","mist"), credit: "Unsplash", mood: "Tea mountains in humid green air", culture: { en: "Tea hills, minority villages, and a slower subtropical rhythm for people who want green over nightlife.", "zh-Hans": "茶山、少数民族村寨，以及喜欢绿色胜过夜生活的亚热带慢节奏。" }, lifestyle: { en: "Humidity is real. Ideal for tea-focused stays and green quiet.", "zh-Hans": "湿度真实存在。适合以茶为主题的安静停留。" }, tags: ["tea","green","subtropical"] },
};
cities["pu-er"] = cities.puer;
const body = `export type PlaceVisual = {
  cover: string;
  gallery: string[];
  credit: string;
  mood: string;
  culture: { en: string; 'zh-Hans': string };
  lifestyle: { en: string; 'zh-Hans': string };
  tags: string[];
};

const DEFAULT_COVER = ${JSON.stringify(POOL.mountain[0])};
const DEFAULT_GALLERY = ${JSON.stringify(gallery("mountain", "lake", "forest"))};

export const PLACE_VISUALS: Record<string, PlaceVisual> = ${JSON.stringify(cities, null, 2)};

function hashSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

export function getPlaceVisual(slug: string, parentSlug?: string): PlaceVisual {
  const key = slug.toLowerCase();
  const parentKey = (parentSlug || '').toLowerCase();
  const base =
    PLACE_VISUALS[key] ||
    PLACE_VISUALS[parentKey] ||
    Object.entries(PLACE_VISUALS).find(([k]) => key.startsWith(k) || parentKey.startsWith(k))?.[1];

  if (!base) {
    return {
      cover: DEFAULT_COVER,
      gallery: DEFAULT_GALLERY,
      credit: 'Unsplash',
      mood: 'Yunnan light and mountain air',
      culture: {
        en: 'This place sits inside Yunnan wider story of altitude shifts, ethnic diversity, and landscapes from tropics to snow.',
        'zh-Hans': '这里属于云南更大的故事：海拔变化、民族多样，从热带到雪山的风景切换。',
      },
      lifestyle: {
        en: 'Use weather, altitude, and nearby city services as first filters before deciding how long to stay.',
        'zh-Hans': '先看天气、海拔和附近城市配套，再决定能待多久。',
      },
      tags: ['yunnan', 'explore'],
    };
  }

  const galleryList = base.gallery?.length ? base.gallery : [base.cover];
  const idx = hashSlug(key) % galleryList.length;
  const isCountyLike = Boolean(parentSlug) || !PLACE_VISUALS[key];
  return {
    ...base,
    cover: isCountyLike ? galleryList[idx] : base.cover || galleryList[0],
    gallery: galleryList,
  };
}

export function pickLocalized(map: { en: string; 'zh-Hans': string }, locale: string): string {
  if (locale.startsWith('zh')) return map['zh-Hans'] || map.en;
  return map.en;
}

export function resolvePlaceImages(input: {
  slug: string;
  parentSlug?: string;
  cover_url?: string | null;
  gallery?: string[] | null;
}): { cover: string; gallery: string[]; credit: string; mood: string } {
  const visual = getPlaceVisual(input.slug, input.parentSlug);
  const galleryList = [
    ...(input.cover_url ? [input.cover_url] : []),
    ...((input.gallery || []).filter(Boolean) as string[]),
    ...visual.gallery,
  ];
  const unique = [...new Set(galleryList)].filter(Boolean);
  return {
    cover: input.cover_url || unique[0] || visual.cover,
    gallery: unique.length ? unique : [visual.cover],
    credit: input.cover_url ? 'Local upload' : visual.credit,
    mood: visual.mood,
  };
}
`;
const out = "E:/无尽的/see-yunnan/apps/web/src/lib/regions/visuals.ts";
fs.writeFileSync(out, body, { encoding: "utf8" });
// verify chinese not garbled
const sample = fs.readFileSync(out, "utf8");
console.log("has kunming zh", sample.includes("昆明是云南的大门"));
console.log("bytes", fs.statSync(out).size);