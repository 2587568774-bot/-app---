const fs = require("fs");
const path = require("path");

function write(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8");
  console.log("wrote", file);
}

const en = {
  meta: {
    title: "See Yunnan",
    description: "Discover Yunnan county by county — weather, life cost, guides, and more.",
  },
  common: {
    brand: "See Yunnan",
    tagline: "看见云南",
    fillingIn: "Filling in",
    viewAll: "View all",
    search: "Search",
    filter: "Filter",
    searchPlaceholder: "Search Dali, Lijiang, Shangri-La...",
    source: "source",
    back: "Back",
    save: "Save",
    saving: "Saving…",
    loading: "Loading…",
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
    intro: "Browse all prefecture-level cities with weather, cost, migration feel, and local mood photos.",
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
    liveWeather: "Live weather",
    loadingWeather: "Loading weather…",
    weatherUnavailable: "Weather unavailable",
    migrationScore: "Migration {score}/10",
    costIndex: "Cost index {score}",
    bestMonths: "Best: {months}",
  },
  guides: {
    title: "Guides",
    empty: "No guides yet.",
    apply: "Become a guide",
    intro:
      "Local guides for Yunnan travel and relocation. Phase 1 uses inquiry leads (no online checkout yet).",
    noMatch: "No approved guides match your filters.",
    searchName: "Search name / specialty",
    regionSlug: "Region slug",
    language: "Language",
  },
  pricing: {
    title: "Premium",
    badge: "Premium",
    price: "${price} / month",
    b1: "Ad-free browsing",
    b2: "Offline packs for selected places",
    b3: "Priority guide matching",
    note: "Early stage: personal payment + admin grant is supported before Stripe is fully connected.",
    cta: "View account / request access",
    personalPath: "Personal payment path (current)",
    step1: "Pay ${price} via personal PayPal / transfer.",
    step2: "Send your login email + payment proof to the operator.",
    step3: "Admin opens /admin/premium and grants 1 month by email.",
    step4: "Check Premium status on Account with the same email.",
    commissionNote:
      "Guide marketplace commission target: {pct}% later. Phase 1 only does inquiry leads.",
    adminGrant: "Admin grant page",
  },
  account: {
    title: "Account",
    subtitle: "Manage login and Premium access for the overseas edition.",
    unknown: "Connect Supabase to load profile and subscription.",
    signedOut: "You are not signed in.",
    signedIn: "Signed in",
    loginHint: "Use email magic link after Supabase env keys are configured.",
    premium: "Premium status",
    notConfigured: "Supabase not configured",
    notConfiguredHint: "Add URL + anon key in apps/web/.env.local to enable login.",
    notSignedHint:
      "Use email magic link login. Premium can also be checked by email below for the early personal-payment path.",
    login: "Login",
    signOut: "Sign out",
    signedOutMsg: "Signed out.",
    becomeGuide: "Become a guide",
    premiumLink: "Premium",
  },
  login: {
    title: "Log in",
    email: "Email",
    send: "Send magic link",
    google: "Continue with Google",
    hint: "Auth works after you add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    magicSent: "Magic link sent. Check your email.",
  },
  premiumPanel: {
    title: "Premium status",
    check: "Check",
    active: "Premium active",
    free: "Free",
    status: "Status",
    until: "Until {date} · {provider} · ${price}",
    savePack: "Save offline pack",
    regionSlug: "region slug",
    earlyPath: "Early path: pay personally, then admin grants Premium by email. Stripe comes next.",
  },
  admin: {
    title: "Admin",
    intro: "Local CMS shell for regions + guides. Supabase role lock / production writes come later.",
    locked: "Use Region CMS to polish content. Supabase role lock comes later.",
    regions: "Regions",
    regionCms: "Region CMS",
    regionCmsDesc: "Edit place content, track completeness, save local drafts.",
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
    countyBranch: "Under",
    lowCompleteness: "Low completeness",
    regionDrafts: "Region drafts",
    pendingGuides: "Pending guides",
    newInquiries: "New inquiries",
    guideReview: "Guide review",
    guideReviewDesc: "Approve or reject open guide applications.",
    premiumGrants: "Premium grants",
    premiumGrantsDesc: "Manually activate members after personal payment.",
    inquiryInbox: "Inquiry inbox",
    inquiryInboxDesc: "Track traveler leads sent to guides.",
  },
};

const zhHans = {
  meta: {
    title: "看见云南",
    description: "按县了解云南：天气、生活成本、向导等。",
  },
  common: {
    brand: "看见云南",
    tagline: "See Yunnan",
    fillingIn: "完善中",
    viewAll: "查看全部",
    search: "搜索",
    filter: "筛选",
    searchPlaceholder: "搜索 大理 / 丽江 / 香格里拉...",
    source: "数据来源",
    back: "返回",
    save: "保存",
    saving: "保存中…",
    loading: "加载中…",
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
    liveWeather: "实时天气",
    loadingWeather: "天气加载中…",
    weatherUnavailable: "天气暂不可用",
    migrationScore: "移居 {score}/10",
    costIndex: "生活成本 {score}",
    bestMonths: "最佳月份：{months}",
  },
  guides: {
    title: "向导",
    empty: "暂无向导。",
    apply: "申请成为向导",
    intro: "服务旅行与移居的本地向导。第一阶段先做咨询线索，暂不在线分账。",
    noMatch: "没有符合筛选条件的已审核向导。",
    searchName: "搜索姓名 / 专长",
    regionSlug: "地区 slug",
    language: "语言",
  },
  pricing: {
    title: "会员",
    badge: "会员",
    price: "${price} / 月",
    b1: "去广告",
    b2: "离线包",
    b3: "向导优先匹配",
    note: "早期支持个人收款后由管理员开通。",
    cta: "前往账户 / 申请开通",
    personalPath: "个人收款开通路径（当前）",
    step1: "通过个人 PayPal / 转账支付 ${price}。",
    step2: "把登录邮箱和付款凭证发给运营。",
    step3: "管理员在 /admin/premium 按邮箱开通 1 个月。",
    step4: "在“我的”页面用同一邮箱查询会员状态。",
    commissionNote: "向导市场后续抽成目标：{pct}%。第一阶段仅做咨询线索。",
    adminGrant: "后台开通页",
  },
  account: {
    title: "我的",
    subtitle: "管理登录与海外版会员权限。",
    unknown: "连接 Supabase 后可加载资料与订阅。",
    signedOut: "尚未登录。",
    signedIn: "已登录",
    loginHint: "配置 Supabase 后可使用邮箱登录链接。",
    premium: "会员状态",
    notConfigured: "尚未配置 Supabase",
    notConfiguredHint: "请在 apps/web/.env.local 中配置 URL 和 anon key 以启用登录。",
    notSignedHint: "可使用邮箱登录链接。早期也可在下方用邮箱查询个人收款开通的会员状态。",
    login: "登录",
    signOut: "退出登录",
    signedOutMsg: "已退出登录。",
    becomeGuide: "成为向导",
    premiumLink: "会员",
  },
  login: {
    title: "登录",
    email: "邮箱",
    send: "发送登录链接",
    google: "使用 Google 继续",
    hint: "请先配置 Supabase 环境变量。",
    magicSent: "登录链接已发送，请查收邮箱。",
  },
  premiumPanel: {
    title: "会员状态",
    check: "查询",
    active: "会员有效",
    free: "免费用户",
    status: "状态",
    until: "有效期至 {date} · {provider} · ${price}",
    savePack: "保存离线包",
    regionSlug: "地区 slug",
    earlyPath: "早期路径：个人付款后由管理员按邮箱开通会员。Stripe 后续接入。",
  },
  admin: {
    title: "管理后台",
    intro: "本地 CMS：区划与向导。Supabase 角色锁定与生产写入稍后接入。",
    locked: "可用区划 CMS 精修内容。Supabase 管理员权限稍后接入。",
    regions: "区划管理",
    regionCms: "区划内容管理",
    regionCmsDesc: "编辑地点内容、跟踪完整度、保存本地草稿。",
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
    countyBranch: "隶属于",
    lowCompleteness: "完整度偏低",
    regionDrafts: "区划草稿",
    pendingGuides: "待审向导",
    newInquiries: "新咨询",
    guideReview: "向导审核",
    guideReviewDesc: "批准或拒绝向导申请。",
    premiumGrants: "会员开通",
    premiumGrantsDesc: "个人收款后手动开通会员。",
    inquiryInbox: "咨询收件箱",
    inquiryInboxDesc: "跟踪发给向导的旅行者线索。",
  },
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const zhHant = clone(zhHans);
zhHant.meta.title = "看見雲南";
zhHant.meta.description = "按縣了解雲南：天氣、生活成本、嚮導等。";
zhHant.common.brand = "看見雲南";
zhHant.nav.guides = "嚮導";
zhHant.nav.pricing = "會員";
zhHant.nav.login = "登入";
zhHant.home.title = "看見雲南，下沉到每一個縣";
zhHant.home.subtitle = "天氣、氣候、海拔、美食、景色、生活成本、移居友好度，並連接本地嚮導。";
zhHant.home.ctaExplore = "瀏覽城市";
zhHant.home.ctaPremium = "開通會員 · $19.90/月";
zhHant.cities.title = "雲南城市";
zhHant.cities.countiesTitle = "下屬縣（{count}）";
zhHant.cities.localGuides = "本地嚮導";
zhHant.guides.title = "嚮導";
zhHant.guides.apply = "申請成為嚮導";
zhHant.pricing.title = "會員";
zhHant.account.title = "我的";
zhHant.admin.regionCms = "區劃內容管理";
zhHant.admin.treeHint = "按 地州 → 縣 歸納。市和縣都可上傳圖片。";
zhHant.admin.upload = "上傳圖片";
zhHant.admin.expand = "展開下屬縣";
zhHant.admin.collapse = "收起下屬縣";
zhHant.admin.countyBranch = "隸屬於";
zhHant.admin.guideReview = "嚮導審核";
zhHant.admin.premiumGrants = "會員開通";

const ja = clone(en);
ja.meta.title = "シー・ユンナン";
ja.common.brand = "シー・ユンナン";
ja.nav.discover = "探索";
ja.nav.guides = "ガイド";
ja.nav.pricing = "プレミアム";
ja.nav.account = "アカウント";
ja.nav.admin = "管理";
ja.nav.login = "ログイン";
ja.home.title = "雲南を、県まで見る";
ja.cities.title = "雲南の都市";
ja.cities.countiesTitle = "県 ({count})";
ja.cities.localGuides = "現地ガイド";
ja.guides.title = "ガイド";
ja.guides.apply = "ガイドになる";
ja.pricing.title = "プレミアム";
ja.account.title = "アカウント";
ja.login.title = "ログイン";
ja.admin.title = "管理";
ja.admin.regionCms = "地域CMS";
ja.admin.treeHint = "都市 → 県 の階層。どちらも画像アップロード可。";
ja.admin.upload = "画像アップロード";
ja.admin.expand = "県を表示";
ja.admin.collapse = "県を隠す";
ja.admin.countyBranch = "所属";

const ko = clone(en);
ko.meta.title = "시 윈난";
ko.common.brand = "시 윈난";
ko.nav.discover = "탐색";
ko.nav.guides = "가이드";
ko.nav.pricing = "프리미엄";
ko.nav.account = "계정";
ko.nav.admin = "관리";
ko.nav.login = "로그인";
ko.home.title = "윈난을 현 단위까지 보다";
ko.cities.title = "윈난 도시";
ko.cities.countiesTitle = "현 ({count})";
ko.cities.localGuides = "현지 가이드";
ko.guides.title = "가이드";
ko.guides.apply = "가이드 되기";
ko.pricing.title = "프리미엄";
ko.account.title = "계정";
ko.login.title = "로그인";
ko.admin.title = "관리";
ko.admin.regionCms = "지역 CMS";
ko.admin.treeHint = "도시 → 현 계층. 둘 다 이미지 업로드 가능.";
ko.admin.upload = "이미지 업로드";
ko.admin.expand = "현 펼치기";
ko.admin.collapse = "현 접기";
ko.admin.countyBranch = "소속";

const dir = "E:/无尽的/see-yunnan/apps/web/src/messages";
write(path.join(dir, "en.json"), en);
write(path.join(dir, "zh-Hans.json"), zhHans);
write(path.join(dir, "zh-Hant.json"), zhHant);
write(path.join(dir, "ja.json"), ja);
write(path.join(dir, "ko.json"), ko);
console.log("all messages done");