const fs = require("fs");

function loadEnv() {
  const lines = fs.readFileSync("E:/无尽的/see-yunnan/apps/web/.env.local", "utf8").split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return env;
}

const content = {
  "530100": { climate_type: "mild spring-like", col: 62, migration: 8.2, best_months: [3,4,5,9,10,11], food_en: "Crossing-the-bridge noodles, steam-pot chicken, and flower cakes define everyday Kunming food.", scenery_en: "Dianchi Lake, Western Hills, and easy day trips to Stone Forest.", migration_en: "Best starter city for newcomers: airport, hospitals, international schools, and services.", food_zh: "过桥米线、汽锅鸡和鲜花饼是昆明日常代表。", scenery_zh: "滇池、西山和石林一日游都很方便。", migration_zh: "机场、医院和国际学校齐全，适合作为移居起点。", summary_en: "Kunming is Yunnan's capital and the most practical base for travel or relocation.", summary_zh: "昆明是云南的省会，也是旅行与移居最实用的基地。", featured: true },
  "530300": { climate_type: "temperate plateau", col: 55, migration: 7.0, best_months: [3,4,5,9,10], food_en: "Local barbecue, sour-spicy dishes, and hearty plateau home cooking.", scenery_en: "Karst hills, old towns, and quieter countryside around Qujing.", migration_en: "Lower cost than Kunming with solid transport links eastward.", food_zh: "本地烧烤、酸辣菜和高原家常菜很有代表性。", scenery_zh: "喀斯特山地、古镇和周边田园风光。", migration_zh: "生活成本低于昆明，交通连接较好。", summary_en: "Qujing is an underrated eastern Yunnan hub with lower costs.", summary_zh: "曲靖是滇东常被低估的枢纽城市，生活成本更友好。" },
  "530400": { climate_type: "mild plateau lake", col: 58, migration: 7.4, best_months: [2,3,4,10,11], food_en: "Yuxi is known for quality produce, mushrooms, and lake-side restaurants.", scenery_en: "Fuxian Lake and clean plateau scenery close to Kunming.", migration_en: "Attractive for remote workers who want quieter life near the capital.", food_zh: "玉溪以优质农产品、菌子和湖边餐饮见长。", scenery_zh: "抚仙湖和干净的高原风景离昆明很近。", migration_zh: "适合想在省会附近过安静生活的远程工作者。", summary_en: "Yuxi combines lake scenery with convenient access to Kunming.", summary_zh: "玉溪兼具湖景与靠近昆明的便利。" },
  "530500": { climate_type: "mild mountain valleys", col: 54, migration: 7.1, best_months: [10,11,12,1,2,3], food_en: "Baoshan food mixes Han, Bai and borderland flavors with emerging coffee culture.", scenery_en: "Gaoligong Mountains, volcano fields, and Tengchong hot springs nearby.", migration_en: "Good for nature-oriented stays with improving city services.", food_zh: "保山美食融合汉族、白族与边地风味，咖啡文化也在成长。", scenery_zh: "高黎贡山、火山地貌和腾冲温泉都很近。", migration_zh: "适合喜欢自然、又希望城市配套逐步完善的人。", summary_en: "Baoshan is a western gateway to volcanoes, hot springs and mountains.", summary_zh: "保山是通往火山、温泉与高山的西部门户。", featured: true },
  "530600": { climate_type: "cool highland", col: 48, migration: 6.2, best_months: [4,5,9,10], food_en: "Zhaotong cuisine is bold, spicy, and built for highland winters.", scenery_en: "Dramatic mountains, canyons, and less-toured rural landscapes.", migration_en: "Lower living costs, but colder winters and fewer international services.", food_zh: "昭通菜偏麻辣厚重，适合高原冬季。", scenery_zh: "高山、峡谷和少有游客的乡村景观。", migration_zh: "生活成本更低，但冬季更冷、国际服务更少。", summary_en: "Zhaotong offers rugged highland scenery and budget living.", summary_zh: "昭通有粗犷的高原风景和更低的生活成本。" },
  "530700": { climate_type: "highland temperate", col: 68, migration: 7.8, best_months: [3,4,5,9,10], food_en: "Naxi specialties, yak products, and courtyard restaurant culture.", scenery_en: "Old Town, Jade Dragon Snow Mountain, and classic highland light.", migration_en: "Very popular with travelers; housing and tourism costs can rise quickly.", food_zh: "纳西风味、牦牛产品和院子餐厅文化突出。", scenery_zh: "古城、玉龙雪山和经典高原光线。", migration_zh: "游客很多，房价与旅游消费上涨较快。", summary_en: "Lijiang is one of Yunnan's most famous highland destinations.", summary_zh: "丽江是云南最知名的高原目的地之一。", featured: true },
  "530800": { climate_type: "subtropical river valleys", col: 56, migration: 6.9, best_months: [10,11,12,1,2,3], food_en: "Pu'er tea culture, ethnic minority dishes, and soft subtropical produce.", scenery_en: "Tea mountains, forests, and humid green valleys.", migration_en: "Great for tea lovers; humidity and slower pace suit some expats more than others.", food_zh: "普洱茶文化、少数民族菜和亚热带物产丰富。", scenery_zh: "茶山、森林与湿润绿色山谷。", migration_zh: "适合爱茶与慢生活的人，但湿度较高。", summary_en: "Pu'er is defined by tea mountains and a slower subtropical rhythm.", summary_zh: "普洱以茶山和更慢的亚热带节奏著称。" },
  "530900": { climate_type: "mild to warm valleys", col: 52, migration: 6.8, best_months: [10,11,12,1,2,3], food_en: "Lincang food is hearty with tea-region produce and borderland influence.", scenery_en: "Rolling tea hills, rivers, and less commercialized towns.", migration_en: "Lower tourism pressure and lower costs, with fewer English services.", food_zh: "临沧饮食扎实，茶区物产和边地影响明显。", scenery_zh: "起伏茶山、河流和商业化较低的城镇。", migration_zh: "旅游压力小、成本较低，但英语服务较少。", summary_en: "Lincang is a quieter tea-region alternative in southwest Yunnan.", summary_zh: "临沧是滇西南更安静的茶区选择。" },
  "532300": { climate_type: "mild plateau", col: 57, migration: 7.3, best_months: [3,4,5,9,10,11], food_en: "Yi cuisine, wild mushrooms in season, and robust local snacks.", scenery_en: "Dinosaur valley, red-earth countryside, and easy access around Chuxiong.", migration_en: "Practical mid-cost base between Kunming and Dali.", food_zh: "彝族风味、应季野生菌和扎实小吃。", scenery_zh: "恐龙谷、红土田园和楚雄周边短途很方便。", migration_zh: "昆明与大理之间实用的中等成本落脚点。", summary_en: "Chuxiong sits on the practical corridor between Kunming and western Yunnan.", summary_zh: "楚雄位于昆明通往滇西的实用走廊上。" },
  "532500": { climate_type: "mild to warm", col: 60, migration: 7.5, best_months: [10,11,12,1,2,3,4], food_en: "Rice noodles and Honghe valley produce with multi-ethnic flavors.", scenery_en: "Yuanyang rice terraces, old towns, and layered mountain villages.", migration_en: "Strong culture appeal; infrastructure varies widely by county.", food_zh: "米线、红河河谷物产和多样民族风味。", scenery_zh: "元阳梯田、古镇和层叠山村。", migration_zh: "文化吸引力强，但各县基础设施差异大。", summary_en: "Honghe is famous for terraces and multi-ethnic mountain towns.", summary_zh: "红河以梯田和多民族山城闻名。" },
  "532600": { climate_type: "mild subtropical", col: 53, migration: 6.7, best_months: [10,11,12,1,2,3], food_en: "Wenshan food is spicy-sour with strong Zhuang and local influences.", scenery_en: "Karst peaks, rural markets, and emerging outdoor spots.", migration_en: "Budget friendly, but still early for long-stay international services.", food_zh: "文山菜偏酸辣，壮族与本地风味明显。", scenery_zh: "喀斯特山峰、乡村集市和新兴户外点。", migration_zh: "预算友好，但长居国际服务仍在早期。", summary_en: "Wenshan offers karst scenery and lower-cost living in southeast Yunnan.", summary_zh: "文山提供滇东南喀斯特风景和更低生活成本。" },
  "532800": { climate_type: "tropical", col: 65, migration: 7.6, best_months: [11,12,1,2,3], food_en: "Dai cuisine, tropical fruit, grilled fish, and night-market energy.", scenery_en: "Rainforest, botanical gardens, and warm winter escape weather.", migration_en: "Popular winter base; heat and tourism peaks need planning.", food_zh: "傣味、热带水果、烤鱼和夜市氛围。", scenery_zh: "雨林、植物园和暖冬避寒气候。", migration_zh: "冬季很受欢迎，但湿热和旅游高峰需要规划。", summary_en: "Xishuangbanna is Yunnan's tropical winter escape.", summary_zh: "西双版纳是云南的热带避寒目的地。", featured: true },
  "532900": { climate_type: "mild lake basin", col: 66, migration: 8.0, best_months: [3,4,5,9,10,11], food_en: "Bai cuisine, Erhai lake fish, cheese, and cafe culture around Dali.", scenery_en: "Erhai Lake, Cangshan, old towns, and village cycling routes.", migration_en: "Top overseas favorite for lifestyle stays; choose quieter towns outside peak zones.", food_zh: "白族菜、洱海鱼、乳扇和大理咖啡文化。", scenery_zh: "洱海、苍山、古镇和骑行村落路线。", migration_zh: "海外长住热门地，建议避开过热核心区选安静乡镇。", summary_en: "Dali is the lifestyle favorite for many overseas visitors and remote workers.", summary_zh: "大理是很多海外访客和远程工作者的生活方式首选。", featured: true },
  "533100": { climate_type: "warm river valleys", col: 51, migration: 6.5, best_months: [10,11,12,1,2,3], food_en: "Dehong food blends Dai, Jingpo and Myanmar-border flavors.", scenery_en: "Palm trees, border towns, and soft winter light.", migration_en: "Interesting for culture explorers; services are smaller-city level.", food_zh: "德宏美食融合傣族、景颇族与边境风味。", scenery_zh: "棕榈树、边境小镇和柔和冬日光线。", migration_zh: "适合文化探索，但城市服务规模较小。", summary_en: "Dehong sits on Yunnan's western border with a distinctly tropical feel.", summary_zh: "德宏位于云南西部边境，带有鲜明的热带感。" },
  "533300": { climate_type: "mountain subtropical to alpine", col: 49, migration: 6.3, best_months: [3,4,5,10,11], food_en: "Nujiang meals are mountain-hearty with river-valley produce.", scenery_en: "One of China's great canyon landscapes and remote villages.", migration_en: "Adventure-first living; infrastructure and services are limited.", food_zh: "怒江餐食偏山地扎实，河谷物产丰富。", scenery_zh: "中国最壮丽的峡谷景观与偏远村落之一。", migration_zh: "更适合冒险型停留，基础设施有限。", summary_en: "Nujiang is for canyon scenery and off-grid adventure more than comfort living.", summary_zh: "怒江更适合峡谷风光和冒险，而不是舒适型长居。" },
  "533400": { climate_type: "cold highland", col: 70, migration: 6.9, best_months: [5,6,9,10], food_en: "Tibetan-influenced food, yak butter tea, and highland ingredients.", scenery_en: "Shangri-La meadows, monasteries, and high-altitude light.", migration_en: "Stunning but high-altitude; prepare for thinner air and colder nights.", food_zh: "藏式风味、酥油茶和高原食材。", scenery_zh: "香格里拉草甸、寺庙和高原光线。", migration_zh: "风景极美但海拔高，需适应稀薄空气和更冷夜晚。", summary_en: "Diqing / Shangri-La is Yunnan's high-altitude gateway to Tibetan culture.", summary_zh: "迪庆/香格里拉是云南通往藏地文化的高原门户。", featured: true }
};

async function api(method, path, body) {
  const env = loadEnv();
  const res = await fetch(env.NEXT_PUBLIC_SUPABASE_URL + path, {
    method,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
      "User-Agent": "see-yunnan-server/1.0",
      Prefer: "return=representation,resolution=merge-duplicates",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(method + " " + path + " => " + res.status + " " + text);
  return text ? JSON.parse(text) : null;
}

(async () => {
  const cities = await api("GET", "/rest/v1/regions?select=id,code,slug&level=eq.city&order=code");
  let updated = 0;
  for (const city of cities) {
    const c = content[city.code];
    if (!c) {
      console.log("skip", city.slug);
      continue;
    }

    await api("PATCH", "/rest/v1/region_metrics?region_id=eq." + city.id, {
      climate_type: c.climate_type,
      cost_of_living_index: c.col,
      migration_friendliness: c.migration,
      best_months: c.best_months,
      data_source: "seed-m1.5-enriched",
    });

    await api("PATCH", "/rest/v1/region_i18n?region_id=eq." + city.id + "&locale=eq.en", {
      summary: c.summary_en,
      food_blurb: c.food_en,
      scenery_blurb: c.scenery_en,
      migration_blurb: c.migration_en,
      machine_translated: false,
    });

    await api("PATCH", "/rest/v1/region_i18n?region_id=eq." + city.id + "&locale=eq.zh-Hans", {
      summary: c.summary_zh,
      food_blurb: c.food_zh,
      scenery_blurb: c.scenery_zh,
      migration_blurb: c.migration_zh,
      machine_translated: false,
    });

    await api("PATCH", "/rest/v1/regions?id=eq." + city.id, {
      is_featured: !!c.featured,
      completeness_score: c.featured ? 80 : 70,
      status: "published",
    });

    updated += 1;
    console.log("updated", city.slug);
  }

  for (const row of [
    { key: "premium_price_usd", value: 19.9 },
    { key: "platform_commission_rate", value: 0.15 },
    { key: "ads_enabled", value: true },
    { key: "personal_payment_note", value: "PayPal / personal transfer accepted in early stage" },
  ]) {
    const patched = await api("PATCH", "/rest/v1/app_settings?key=eq." + row.key, { value: row.value });
    if (!patched || patched.length === 0) {
      await api("POST", "/rest/v1/app_settings", { key: row.key, value: row.value });
    }
  }

  console.log("done", updated);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});