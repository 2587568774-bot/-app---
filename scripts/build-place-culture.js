const fs = require('fs');
const path = require('path');

// Curated free Unsplash images (food / culture themes)
const IMG = {
  noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
  hotpot: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
  market: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
  grilled: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80',
  tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80',
  rice: 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?auto=format&fit=crop&w=1200&q=80',
  dumplings: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80',
  spicy: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80',
  fruit: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
  soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
  mushrooms: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  street: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  temple: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80',
  oldtown: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
  market2: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  people: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  festival: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  lake: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80',
  forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  village: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  bridge: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
  river: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
  flower: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
  craft: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80',
  music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
  prayer: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
  tropical: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  snow: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1200&q=80',
  canyon: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  dusk: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  farm: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
};

function bi(zh, en) {
  return { 'zh-Hans': zh, en };
}

function food(nameZh, nameEn, noteZh, noteEn, image) {
  return {
    name: bi(nameZh, nameEn),
    note: bi(noteZh, noteEn),
    image,
  };
}

function eth(zh, en, share) {
  return { name: bi(zh, en), share };
}

const cities = {
  kunming: {
    foodItems: [
      food('过桥米线', 'Crossing-the-bridge noodles', '高汤、薄肉片与时令配菜分层上桌。', 'Hot broth, thin meats, and seasonal toppings served tableside.', IMG.noodles),
      food('汽锅鸡', 'Steam-pot chicken', '汽锅慢炖，汤清肉香。', 'Slow steam-pot chicken with clear aromatic broth.', IMG.soup),
      food('宜良烤鸭', 'Yiliang roast duck', '皮脆肉嫩，宜良本地招牌。', 'Crisp-skinned roast duck, a Yiliang classic.', IMG.grilled),
    ],
    cultureImages: [IMG.flower, IMG.lake, IMG.market2, IMG.people],
    ethnicGroups: [
      eth('汉族', 'Han', '约 86%'),
      eth('彝族', 'Yi', '约 4%'),
      eth('回族', 'Hui', '约 3%'),
      eth('白族', 'Bai', '约 2%'),
      eth('其他', 'Others', '约 5%'),
    ],
    ethnicNote: bi(
      '省会城市汉族比例更高，彝族、回族等少数民族社区活跃，花市与大学城是重要人文场景。',
      'As the capital, Kunming is Han-majority with active Yi and Hui communities; flower markets and campuses shape daily culture.'
    ),
  },
  dali: {
    foodItems: [
      food('乳扇', 'Rushan cheese', '白族奶制品，烤制或生食皆可。', 'Bai dairy snack, grilled or fresh.', IMG.dumplings),
      food('酸辣鱼', 'Sour-spicy Erhai fish', '洱海风味，酸辣开胃。', 'Erhai-style fish with bright sour heat.', IMG.spicy),
      food('白族三道茶', 'Bai three-course tea', '一苦二甜三回味。', 'Bitter, sweet, then lingering aftertaste.', IMG.tea),
    ],
    cultureImages: [IMG.oldtown, IMG.lake, IMG.craft, IMG.village],
    ethnicGroups: [
      eth('白族', 'Bai', '约 33%'),
      eth('汉族', 'Han', '约 50%'),
      eth('彝族', 'Yi', '约 10%'),
      eth('回族', 'Hui', '约 3%'),
      eth('其他', 'Others', '约 4%'),
    ],
    ethnicNote: bi(
      '白族文化是大理名片：本主信仰、扎染、甲马与绕三灵。古镇外的村落更具生活质感。',
      'Bai culture defines Dali: Benzhu beliefs, tie-dye, and village festivals. Life outside the old town feels more grounded.'
    ),
  },
  lijiang: {
    foodItems: [
      food('丽江粑粑', 'Lijiang baba flatbread', '外脆内软，街头常见。', 'Crisp outside, soft inside — a street staple.', IMG.dumplings),
      food('腊排骨火锅', 'Cured rib hotpot', '纳西风味，高海拔暖身。', 'Naxi-style cured ribs for high-altitude evenings.', IMG.hotpot),
      food('鸡豆凉粉', 'Chickpea jelly', '清爽解腻的本地小吃。', 'Cool chickpea jelly snack.', IMG.market),
    ],
    cultureImages: [IMG.temple, IMG.oldtown, IMG.snow, IMG.music],
    ethnicGroups: [
      eth('纳西族', 'Naxi', '约 20%'),
      eth('汉族', 'Han', '约 55%'),
      eth('彝族', 'Yi', '约 12%'),
      eth('傈僳族', 'Lisu', '约 5%'),
      eth('其他', 'Others (Pumi, etc.)', '约 8%'),
    ],
    ethnicNote: bi(
      '纳西东巴文化、古城水系与雪山信仰交织；古城热闹，乡村更安静真实。',
      'Naxi Dongba culture, water lanes, and snow-mountain belief intertwine. Old town is theatrical; countryside is quieter.'
    ),
  },
  xishuangbanna: {
    foodItems: [
      food('傣味烧烤', 'Dai-style BBQ', '香茅、辣酱与热带香料。', 'Lemongrass, chili, and tropical spices.', IMG.grilled),
      food('菠萝饭', 'Pineapple rice', '酸甜果香配糯米。', 'Sweet-tart pineapple with sticky rice.', IMG.rice),
      food('舂鸡脚', 'Pounded chicken feet', '傣族风味，酸辣开胃。', 'Dai pounded chicken feet, sour and spicy.', IMG.spicy),
    ],
    cultureImages: [IMG.tropical, IMG.temple, IMG.festival, IMG.forest],
    ethnicGroups: [
      eth('傣族', 'Dai', '约 30%'),
      eth('汉族', 'Han', '约 30%'),
      eth('哈尼族', 'Hani', '约 19%'),
      eth('彝族', 'Yi', '约 5%'),
      eth('其他', 'Others (Lahu, Bulang, Jinuo…)', '约 16%'),
    ],
    ethnicNote: bi(
      '南传佛教、泼水节与热带村寨构成西双版纳人文主线，多民族杂居明显。',
      'Theravada Buddhism, Water-Splashing Festival, and tropical villages shape Banna’s multi-ethnic life.'
    ),
  },
  diqing: {
    foodItems: [
      food('酥油茶', 'Butter tea', '高原日常饮品，暖胃。', 'Daily highland drink for warmth.', IMG.tea),
      food('牦牛肉', 'Yak meat dishes', '炖煮或风干，藏餐核心。', 'Stewed or dried — a Tibetan staple.', IMG.soup),
      food('糌粑', 'Tsampa', '青稞炒面，方便便携。', 'Roasted barley flour, portable energy.', IMG.dumplings),
    ],
    cultureImages: [IMG.snow, IMG.prayer, IMG.mountain, IMG.village],
    ethnicGroups: [
      eth('藏族', 'Tibetan', '约 33%'),
      eth('傈僳族', 'Lisu', '约 15%'),
      eth('纳西族', 'Naxi', '约 12%'),
      eth('汉族', 'Han', '约 25%'),
      eth('其他', 'Others', '约 15%'),
    ],
    ethnicNote: bi(
      '迪庆以藏文化为主，同时有傈僳、纳西等多民族共居，寺院与牧场是人文核心。',
      'Diqing is Tibetan-led with Lisu and Naxi communities; monasteries and pastures anchor daily culture.'
    ),
  },
  honghe: {
    foodItems: [
      food('建水烧烤', 'Jianshui BBQ', '豆腐、肉串与夜市烟火。', 'Tofu, skewers, and night-market heat.', IMG.grilled),
      food('过桥米线', 'Crossing-the-bridge noodles', '红河也是米线重镇。', 'Honghe is also a noodles stronghold.', IMG.noodles),
      food('开远小卷粉', 'Kaiyuan rolled noodles', '酸辣清爽，本地早餐。', 'Sour-spicy local breakfast rolls.', IMG.spicy),
    ],
    cultureImages: [IMG.village, IMG.farm, IMG.oldtown, IMG.people],
    ethnicGroups: [
      eth('彝族', 'Yi', '约 24%'),
      eth('哈尼族', 'Hani', '约 17%'),
      eth('汉族', 'Han', '约 40%'),
      eth('苗族', 'Miao', '约 6%'),
      eth('其他', 'Others (Dai, Yao, Zhuang…)', '约 13%'),
    ],
    ethnicNote: bi(
      '哈尼梯田与彝族村寨是红河人文高地，南部跨境走廊带来多民族交融。',
      'Hani terraces and Yi villages define Honghe; the southern border corridor adds multi-ethnic exchange.'
    ),
  },
  chuxiong: {
    foodItems: [
      food('彝族菜', 'Yi cuisine', '山货、腊肉与火塘味道。', 'Mountain produce, cured meats, hearth flavors.', IMG.spicy),
      food('野生菌', 'Wild mushrooms', '雨季山珍，火锅或炒制。', 'Rainy-season mushrooms in hotpot or stir-fry.', IMG.mushrooms),
      food('羊汤锅', 'Mutton broth pot', '彝区常见暖身菜。', 'Common warming dish in Yi areas.', IMG.soup),
    ],
    cultureImages: [IMG.festival, IMG.village, IMG.mountain, IMG.craft],
    ethnicGroups: [
      eth('彝族', 'Yi', '约 30%'),
      eth('汉族', 'Han', '约 60%'),
      eth('苗族', 'Miao', '约 3%'),
      eth('回族', 'Hui', '约 2%'),
      eth('其他', 'Others', '约 5%'),
    ],
    ethnicNote: bi(
      '楚雄是彝族自治州，火把节、十月年与毕摩文化是重要标识。',
      'Chuxiong is a Yi autonomous prefecture; Torch Festival and Bimo heritage are key markers.'
    ),
  },
  dehong: {
    foodItems: [
      food('傣味', 'Dai flavors', '酸、香、辣与热带蔬菜。', 'Sour, fragrant, spicy tropical vegetables.', IMG.spicy),
      food('景颇菜', 'Jingpo cuisine', '山野菜与舂制调味。', 'Mountain greens and pounded seasonings.', IMG.market),
      food('手抓饭', 'Hand-grabbed rice', '节庆与家宴常见。', 'Common at festivals and family tables.', IMG.rice),
    ],
    cultureImages: [IMG.temple, IMG.tropical, IMG.people, IMG.festival],
    ethnicGroups: [
      eth('傣族', 'Dai', '约 28%'),
      eth('景颇族', 'Jingpo', '约 12%'),
      eth('汉族', 'Han', '约 45%'),
      eth('阿昌族', 'Achang', '约 3%'),
      eth('其他', 'Others (Lisu, De’ang…)', '约 12%'),
    ],
    ethnicNote: bi(
      '德宏边境口岸与南传佛教寺院并存，傣、景颇文化鲜明。',
      'Border trade and Theravada temples coexist; Dai and Jingpo cultures are distinctive.'
    ),
  },
  nujiang: {
    foodItems: [
      food('漆油鸡', 'Lacquer-oil chicken', '峡谷特色，浓香暖身。', 'Canyon specialty, rich and warming.', IMG.soup),
      food('峡谷山货', 'Canyon mountain produce', '菌类、野菜与河鱼。', 'Mushrooms, wild greens, river fish.', IMG.mushrooms),
      food('包谷酒', 'Corn liquor', '山民待客常见。', 'Common hospitality spirit.', IMG.tea),
    ],
    cultureImages: [IMG.canyon, IMG.river, IMG.village, IMG.people],
    ethnicGroups: [
      eth('傈僳族', 'Lisu', '约 50%'),
      eth('怒族', 'Nu', '约 10%'),
      eth('独龙族', 'Dulong', '约 2%'),
      eth('白族', 'Bai', '约 10%'),
      eth('其他', 'Others (Pumi, Han…)', '约 28%'),
    ],
    ethnicNote: bi(
      '怒江峡谷是傈僳、怒、独龙等民族家园，刀杆节与峡谷聚落极具辨识度。',
      'The Nujiang canyon is home to Lisu, Nu, and Dulong peoples; cliff villages and festivals stand out.'
    ),
  },
  wenshan: {
    foodItems: [
      food('酸汤鸡', 'Sour soup chicken', '酸香开胃，本地家常。', 'Bright sour soup chicken, everyday local food.', IMG.soup),
      food('三七鸡', 'Notoginseng chicken', '文山特产入汤。', 'Local notoginseng cooked into soup.', IMG.spicy),
      food('壮族五色饭', 'Zhuang five-color rice', '节庆五色糯米。', 'Festival five-color sticky rice.', IMG.rice),
    ],
    cultureImages: [IMG.farm, IMG.village, IMG.people, IMG.mountain],
    ethnicGroups: [
      eth('壮族', 'Zhuang', '约 30%'),
      eth('苗族', 'Miao', '约 14%'),
      eth('彝族', 'Yi', '约 11%'),
      eth('汉族', 'Han', '约 40%'),
      eth('其他', 'Others (Yao…)', '约 5%'),
    ],
    ethnicNote: bi(
      '文山壮苗文化浓厚，三七产业与边境集市构成日常生活。',
      'Zhuang and Miao cultures are strong; notoginseng farming and border markets shape daily life.'
    ),
  },
  puer: {
    foodItems: [
      food('普洱茶', 'Pu’er tea', '晒青与陈化，茶马古道遗产。', 'Sun-dried and aged — Tea Horse Road legacy.', IMG.tea),
      food('牛干巴', 'Dried beef', '滇南风味零食/下酒菜。', 'Southern Yunnan dried beef snack.', IMG.grilled),
      food('哈尼菜', 'Hani home cooking', '山野菜与酸辣搭配。', 'Mountain greens with sour-spicy notes.', IMG.market),
    ],
    cultureImages: [IMG.forest, IMG.farm, IMG.tea, IMG.village],
    ethnicGroups: [
      eth('哈尼族', 'Hani', '约 18%'),
      eth('彝族', 'Yi', '约 17%'),
      eth('傣族', 'Dai', '约 12%'),
      eth('汉族', 'Han', '约 40%'),
      eth('其他', 'Others (Lahu, Wa…)', '约 13%'),
    ],
    ethnicNote: bi(
      '普洱茶山与多民族村寨共生，哈尼、彝、傣文化交织明显。',
      'Tea mountains and multi-ethnic villages coexist; Hani, Yi, and Dai cultures intertwine.'
    ),
  },
  lincang: {
    foodItems: [
      food('滇红茶', 'Dianhong black tea', '凤庆等地红茶闻名。', 'Famous black tea from Fengqing area.', IMG.tea),
      food('坚果', 'Nuts & dried fruit', '核桃等山货丰富。', 'Walnuts and mountain produce.', IMG.fruit),
      food('佤族菜', 'Wa cuisine', '酸辣鲜明，山野风味。', 'Bold sour-spicy mountain flavors.', IMG.spicy),
    ],
    cultureImages: [IMG.mountain, IMG.village, IMG.people, IMG.farm],
    ethnicGroups: [
      eth('傣族', 'Dai', '约 12%'),
      eth('佤族', 'Wa', '约 10%'),
      eth('彝族', 'Yi', '约 10%'),
      eth('汉族', 'Han', '约 55%'),
      eth('其他', 'Others (Lahu, Bulang…)', '约 13%'),
    ],
    ethnicNote: bi(
      '临沧多民族聚居，佤族、傣族节庆与茶山生活是人文看点。',
      'Lincang is multi-ethnic; Wa and Dai festivals plus tea-mountain life are key draws.'
    ),
  },
  baoshan: {
    foodItems: [
      food('腾冲大救驾', 'Tengchong “Dajiujia”', '炒饵块，传说与早午餐经典。', 'Stir-fried rice cakes — a legendary breakfast/lunch classic.', IMG.rice),
      food('蒲缥甜梨', 'Pupiao pears', '当季水果清甜。', 'Seasonal sweet pears.', IMG.fruit),
      food('腾冲饵丝', 'Tengchong rice noodles', '清汤或浇头，日常主食。', 'Clear broth or topped noodles for everyday meals.', IMG.noodles),
    ],
    cultureImages: [IMG.oldtown, IMG.volcano || IMG.mountain, IMG.village, IMG.bridge],
    ethnicGroups: [
      eth('汉族', 'Han', '约 88%'),
      eth('彝族', 'Yi', '约 4%'),
      eth('傣族', 'Dai', '约 3%'),
      eth('白族', 'Bai', '约 2%'),
      eth('其他', 'Others (Lisu…)', '约 3%'),
    ],
    ethnicNote: bi(
      '保山以汉族为主，腾冲侨乡与和顺古镇保留浓厚边贸人文。',
      'Baoshan is Han-majority; Tengchong’s overseas-Chinese heritage and Heshun old town remain strong.'
    ),
  },
  yuxi: {
    foodItems: [
      food('抚仙湖铜锅鱼', 'Fuxian copper-pot fish', '湖鲜鲜甜，铜锅慢煮。', 'Fresh lake fish slow-cooked in copper pot.', IMG.soup),
      food('澄江藕粉', 'Chengjiang lotus root starch', '清甜小吃，送礼常见。', 'Sweet lotus starch snack, popular gift.', IMG.dessert || IMG.fruit),
      food('豆末糖', 'Bean-flour candy', '本地传统甜食。', 'Local traditional sweet.', IMG.dumplings),
    ],
    cultureImages: [IMG.lake, IMG.village, IMG.flower, IMG.people],
    ethnicGroups: [
      eth('汉族', 'Han', '约 68%'),
      eth('彝族', 'Yi', '约 20%'),
      eth('哈尼族', 'Hani', '约 5%'),
      eth('傣族', 'Dai', '约 3%'),
      eth('其他', 'Others', '约 4%'),
    ],
    ethnicNote: bi(
      '玉溪环湖生活与彝族村寨并存，抚仙湖周边形成休闲人文带。',
      'Lake living and Yi villages coexist; Fuxian Lake forms a leisure culture belt.'
    ),
  },
  qujing: {
    foodItems: [
      food('宣威火腿', 'Xuanwei ham', '云南火腿代表产地。', 'Signature Yunnan ham origin.', IMG.grilled),
      food('沾益辣子鸡', 'Zhanyi chili chicken', '麻辣干香，下饭神器。', 'Dry-spicy chili chicken, perfect with rice.', IMG.spicy),
      food('蒸饵丝', 'Steamed rice noodles', '曲靖早餐经典。', 'Classic Qujing breakfast noodles.', IMG.noodles),
    ],
    cultureImages: [IMG.farm, IMG.oldtown, IMG.people, IMG.bridge],
    ethnicGroups: [
      eth('汉族', 'Han', '约 92%'),
      eth('彝族', 'Yi', '约 3%'),
      eth('回族', 'Hui', '约 2%'),
      eth('苗族', 'Miao', '约 1%'),
      eth('其他', 'Others', '约 2%'),
    ],
    ethnicNote: bi(
      '曲靖以汉族为主，是滇东交通与商贸节点，乡土集市文化浓。',
      'Qujing is largely Han and a key eastern trade hub with strong market-town culture.'
    ),
  },
  zhaotong: {
    foodItems: [
      food('天麻炖鸡', 'Gastrodia chicken soup', '昭通特产入药膳。', 'Local gastrodia in medicinal chicken soup.', IMG.soup),
      food('昭通苹果', 'Zhaotong apples', '高海拔果品清甜。', 'High-altitude sweet apples.', IMG.fruit),
      food('酱肉', 'Sauce-cured meat', '家常下饭，烟火气足。', 'Home-style cured meat with deep flavor.', IMG.grilled),
    ],
    cultureImages: [IMG.mountain, IMG.farm, IMG.people, IMG.river],
    ethnicGroups: [
      eth('汉族', 'Han', '约 88%'),
      eth('苗族', 'Miao', '约 4%'),
      eth('彝族', 'Yi', '约 4%'),
      eth('回族', 'Hui', '约 2%'),
      eth('其他', 'Others', '约 2%'),
    ],
    ethnicNote: bi(
      '昭通地处滇东北，苗族、彝族村寨与乌蒙山区生活交织。',
      'In northeast Yunnan, Miao and Yi villages intertwine with Wumeng mountain life.'
    ),
  },
};

// fix accidental undefined refs
cities.baoshan.cultureImages = [IMG.oldtown, IMG.mountain, IMG.village, IMG.bridge];
cities.yuxi.foodItems[1].image = IMG.fruit;

const out = {
  generated_at: new Date().toISOString(),
  note: 'Indicative ethnic shares for product UX (not official census). Food/culture images via Unsplash placeholders; replace with licensed field photos later.',
  cities,
};

const outPath = 'apps/web/src/data/place-culture.json';
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log('wrote', outPath, 'cities', Object.keys(cities).length);
