const fs = require("fs");
const path = require("path");

function write(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8");
  console.log("wrote", file);
}

const base = {
  en: {
    meta: {
      title: "See Yunnan",
      description: "Discover Yunnan county by county — weather, life cost, guides, and more.",
    },
    common: {
      brand: "See Yunnan",
      tagline: "看见云南",
      fillingIn: "Filling in",
      viewAll: "View all",
      searchPlaceholder: "Search Dali, Lijiang, Shangri-La...",
      source: "source",
    },
    nav: {
      discover: "Discover",
      guides: "Guides",
      pricing: "Premium",
      account: "Account",
      admin: "Admin",
      login: "Log in",
    },
    home: {
      badge: "Overseas edition",
      title: "See Yunnan, county by county",
      subtitle:
        "Weather, climate, altitude, food, scenery, cost of living, and migration friendliness — then connect with local guides.",
      ctaExplore: "Browse cities",
      ctaPremium: "Go Premium · $19.90/mo",
      featuresTitle: "What you get",
      f1: "Full province map down to county level",
      f2: "Structured place intel in multiple languages",
      f3: "Local guides with open applications",
      f4: "Premium: ad-free, offline packs, priority matching",
      status: "Browse is live: full Yunnan city/county tree, search, and live weather.",
      featuredTitle: "Featured places",
      featuredHint: "Mood images + practical intel for first-time visitors.",
      cardLandscape: "Landscape first",
      cardLandscapeBody:
        "From tropical Banna to snow-line Shangri-La, every place starts with altitude, climate, and light.",
      cardHuman: "Human texture",
      cardHumanBody: "Food, migration feel, and local rhythm — not just a list of attractions.",
      cardGuide: "Guide bridge",
      cardGuideBody:
        "When information is not enough, connect with local guides for travel or relocation.",
      startHint: "Start with a city, then zoom into counties.",
      statsLine: "{cities} cities · {counties} counties · source: {source}",
    },
    cities: {
      title: "Cities of Yunnan",
      intro:
        "Browse all prefecture-level cities with weather, cost, migration feel, and local mood photos.",
      statsLine: "{cities} cities / prefectures · {counties} counties · source: {source}",
      breadcrumb: "Cities",
      countiesTitle: "Counties ({count})",
      localGuides: "Local guides",
      noGuides: "No approved guides for this city yet. Guides can apply anytime.",
      cityGuideEyebrow: "Yunnan city guide",
      galleryTitle: "{name} gallery",
    },
    places: {
      countyIn: "County in {city}",
      guidesNear: "Guides near {city}",
      browseGuides: "Browse guides",
      noGuides: "No local guide listed yet for this area.",
      galleryTitle: "{name} gallery",
    },
    culture: {
      peopleTitle: "People and culture",
      peopleHeading: "How it feels on the ground",
      dailyTitle: "Daily life",
      dailyHeading: "Who thrives here",
      photoNote: "Photo mood via {credit}. Replace later with your own licensed field photos.",
    },
    intel: {
      food: "Food",
      scenery: "Scenery",
      migration: "Migration",
      gallery: "Photo gallery",
      photosCount: "{count} photos",
    },
    guides: {
      title: "Guides",
      empty: "No guides yet.",
      apply: "Become a guide",
      intro:
        "Local guides for Yunnan travel and relocation. Phase 1 uses inquiry leads (no online checkout yet).",
      noMatch: "No approved guides match your filters.",
    },
    pricing: {
      title: "Premium",
      price: "$19.90 / month",
      b1: "Ad-free browsing",
      b2: "Offline packs for selected places",
      b3: "Priority guide matching",
      note: "Early stage: personal payment + admin grant is supported before Stripe is fully connected.",
      cta: "View account / request access",
    },
    account: {
      title: "Account",
      unknown: "Connect Supabase to load profile and subscription.",
      signedOut: "You are not signed in.",
      loginHint: "Use email magic link after Supabase env keys are configured.",
      premium: "Premium status",
    },
    login: {
      title: "Log in",
      email: "Email",
      send: "Send magic link",
      google: "Continue with Google",
      hint: "Auth works after you add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    },
    admin: {
      title: "Admin",
      locked: "Use Region CMS to polish content. Supabase role lock comes later.",
      regions: "Regions",
      regionCms: "Region CMS",
      treeHint: "Organized by city → county. Upload images for both levels.",
      cities: "Cities",
      counties: "Counties",
      allLevels: "All levels",
      parent: "Parent",
      score: "Score",
      edit: "Edit",
      upload: "Upload images",
      expand: "Show counties",
      collapse: "Hide counties",
      noCounties: "No counties",
      filter: "Filter",
      searchPlaceholder: "Search name / slug / code",
      rows: "{count} rows",
      cityBranch: "City branch",
      countyBranch: "County under {city}",
    },
  },
  "zh-Hans": {
    meta: {
      title: "看见云南",
      description: "按县了解云南：天气、生活成本、向导等。",
    },
    common: {
      brand: "看见云南",
      tagline: "See Yunnan",
      fillingIn: "完善中",
      viewAll: "查看全部",
      searchPlaceholder: "搜索 大理 / 丽江 / 香格里拉...",
      source: "数据来源",
    },
    nav: {
      discover: "探索",
      guides: "向导",
      pricing: "会员",
      account: "我的",
      admin: "后台",
      login: "登录",
    },
    home: {
      badge: "海外版",
      title: "看见云南，下沉到每一个县",
      subtitle: "天气、气候、海拔、美食、景色、生活成本、移居友好度，并连接本地向导。",
      ctaExplore: "浏览城市",
      ctaPremium: "开通会员 · $19.90/月",
      featuresTitle: "你将获得",
      f1: "全省到县级的结构化目录",
      f2: "多语言地区信息",
      f3: "向导开放入驻",
      f4: "会员：去广告、离线包、优先匹配向导",
      status: "浏览已上线：全省市县目录、搜索与实时天气。",
      featuredTitle: "精选目的地",
      featuredHint: "氛围图 + 实用信息，适合第一次了解云南。",
      cardLandscape: "先看风景",
      cardLandscapeBody: "从热带版纳到雪线香格里拉，每个地方都从海拔、气候和光线开始。",
      cardHuman: "人文肌理",
      cardHumanBody: "美食、移居感受和本地节奏，不只是景点清单。",
      cardGuide: "向导桥梁",
      cardGuideBody: "信息不够时，连接本地向导，支持旅行或移居。",
      startHint: "先从城市开始，再下钻到县。",
      statsLine: "{cities} 个市州 · {counties} 个县 · 来源：{source}",
    },
    cities: {
      title: "云南城市",
      intro: "浏览所有地州城市：天气、成本、移居感受与氛围图片。",
      statsLine: "{cities} 个市州 · {counties} 个县 · 来源：{source}",
      breadcrumb: "城市",
      countiesTitle: "下属县（{count}）",
      localGuides: "本地向导",
      noGuides: "该城市暂无已审核向导，欢迎申请入驻。",
      cityGuideEyebrow: "云南城市指南",
      galleryTitle: "{name} 图集",
    },
    places: {
      countyIn: "{city} 下属县",
      guidesNear: "{city} 附近向导",
      browseGuides: "浏览向导",
      noGuides: "该地区暂无本地向导。",
      galleryTitle: "{name} 图集",
    },
    culture: {
      peopleTitle: "人文与人群",
      peopleHeading: "到了当地是什么感觉",
      dailyTitle: "日常生活",
      dailyHeading: "谁更适合在这里",
      photoNote: "图片氛围来自 {credit}。后续可替换为你自己有授权的实拍图。",
    },
    intel: {
      food: "美食",
      scenery: "景色",
      migration: "移居",
      gallery: "图片集",
      photosCount: "{count} 张",
    },
    guides: {
      title: "向导",
      empty: "暂无向导。",
      apply: "申请成为向导",
      intro: "服务旅行与移居的本地向导。第一阶段先做咨询线索，暂不在线分账。",
      noMatch: "没有符合筛选条件的已审核向导。",
    },
    pricing: {
      title: "会员",
      price: "$19.90 / 月",
      b1: "去广告",
      b2: "离线包",
      b3: "向导优先匹配",
      note: "早期支持个人收款后由管理员开通。",
      cta: "前往账户 / 申请开通",
    },
    account: {
      title: "我的",
      unknown: "连接 Supabase 后可加载资料与订阅。",
      signedOut: "尚未登录。",
      loginHint: "配置 Supabase 后可使用邮箱登录链接。",
      premium: "会员状态",
    },
    login: {
      title: "登录",
      email: "邮箱",
      send: "发送登录链接",
      google: "使用 Google 继续",
      hint: "请先配置 Supabase 环境变量。",
    },
    admin: {
      title: "管理后台",
      locked: "可用区划 CMS 精修内容。Supabase 管理员权限稍后接入。",
      regions: "区划管理",
      regionCms: "区划内容管理",
      treeHint: "按 地州 → 县 归纳。市和县都可上传图片。",
      cities: "地州/市",
      counties: "县级单位",
      allLevels: "全部层级",
      parent: "上级",
      score: "完整度",
      edit: "编辑",
      upload: "上传图片",
      expand: "展开下属县",
      collapse: "收起下属县",
      noCounties: "无下属县",
      filter: "筛选",
      searchPlaceholder: "搜索名称 / slug / 代码",
      rows: "{count} 条",
      cityBranch: "地州分支",
      countyBranch: "隶属于 {city}",
    },
  },
};

// derive other locales lightly from en with key overrides
base["zh-Hant"] = JSON.parse(JSON.stringify(base["zh-Hans"]));
base["zh-Hant"].meta.title = "看見雲南";
base["zh-Hant"].meta.description = "按縣了解雲南：天氣、生活成本、嚮導等。";
base["zh-Hant"].common.brand = "看見雲南";
base["zh-Hant"].common.fillingIn = "完善中";
base["zh-Hant"].nav.discover = "探索";
base["zh-Hant"].nav.guides = "嚮導";
base["zh-Hant"].nav.pricing = "會員";
base["zh-Hant"].nav.account = "我的";
base["zh-Hant"].nav.admin = "後台";
base["zh-Hant"].nav.login = "登入";
base["zh-Hant"].home.title = "看見雲南，下沉到每一個縣";
base["zh-Hant"].home.subtitle = "天氣、氣候、海拔、美食、景色、生活成本、移居友好度，並連接本地嚮導。";
base["zh-Hant"].home.ctaExplore = "瀏覽城市";
base["zh-Hant"].home.ctaPremium = "開通會員 · $19.90/月";
base["zh-Hant"].cities.title = "雲南城市";
base["zh-Hant"].cities.countiesTitle = "下屬縣（{count}）";
base["zh-Hant"].cities.localGuides = "本地嚮導";
base["zh-Hant"].admin.regionCms = "區劃內容管理";
base["zh-Hant"].admin.treeHint = "按 地州 → 縣 歸納。市和縣都可上傳圖片。";
base["zh-Hant"].admin.cities = "地州/市";
base["zh-Hant"].admin.counties = "縣級單位";
base["zh-Hant"].admin.upload = "上傳圖片";
base["zh-Hant"].admin.expand = "展開下屬縣";
base["zh-Hant"].admin.collapse = "收起下屬縣";

base.ja = JSON.parse(JSON.stringify(base.en));
base.ja.meta.title = "シー・ユンナン";
base.ja.common.brand = "シー・ユンナン";
base.ja.nav.discover = "探索";
base.ja.nav.guides = "ガイド";
base.ja.nav.pricing = "プレミアム";
base.ja.nav.account = "アカウント";
base.ja.nav.admin = "管理";
base.ja.nav.login = "ログイン";
base.ja.home.title = "雲南を、県まで見る";
base.ja.cities.title = "雲南の都市";
base.ja.cities.countiesTitle = "県 ({count})";
base.ja.cities.localGuides = "現地ガイド";
base.ja.admin.regionCms = "地域CMS";
base.ja.admin.treeHint = "都市 → 県 の階層。どちらも画像アップロード可。";
base.ja.admin.upload = "画像アップロード";
base.ja.admin.expand = "県を表示";
base.ja.admin.collapse = "県を隠す";

base.ko = JSON.parse(JSON.stringify(base.en));
base.ko.meta.title = "시 윈난";
base.ko.common.brand = "시 윈난";
base.ko.nav.discover = "탐색";
base.ko.nav.guides = "가이드";
base.ko.nav.pricing = "프리미엄";
base.ko.nav.account = "계정";
base.ko.nav.admin = "관리";
base.ko.nav.login = "로그인";
base.ko.home.title = "윈난을 현 단위까지 보다";
base.ko.cities.title = "윈난 도시";
base.ko.cities.countiesTitle = "현 ({count})";
base.ko.cities.localGuides = "현지 가이드";
base.ko.admin.regionCms = "지역 CMS";
base.ko.admin.treeHint = "도시 → 현 계층. 둘 다 이미지 업로드 가능.";
base.ko.admin.upload = "이미지 업로드";
base.ko.admin.expand = "현 펼치기";
base.ko.admin.collapse = "현 접기";

const dir = "E:/无尽的/see-yunnan/apps/web/src/messages";
for (const [locale, messages] of Object.entries(base)) {
  write(path.join(dir, `${locale}.json`), messages);
}
console.log("messages rewritten");