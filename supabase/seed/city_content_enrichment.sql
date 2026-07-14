-- See Yunnan M1.5 city content enrichment
-- Run after yunnan_regions.sql
-- Updates food/scenery/migration blurbs + metrics for all 16 cities
begin;

insert into public.app_settings (key, value)
values
  ('premium_price_usd', '19.9'::jsonb),
  ('platform_commission_rate', '0.15'::jsonb),
  ('ads_enabled', 'true'::jsonb),
  ('personal_payment_note', '"PayPal / personal transfer accepted in early stage"'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

create temporary table if not exists tmp_city_content (
  code text primary key,
  climate_type text,
  col integer,
  migration numeric(3,1),
  best_months integer[],
  food_en text,
  scenery_en text,
  migration_en text,
  food_zh text,
  scenery_zh text,
  migration_zh text,
  summary_en text,
  summary_zh text
) on commit drop;

truncate tmp_city_content;

insert into tmp_city_content values
('530100','mild spring-like',62,8.2,array[3,4,5,9,10,11],
 'Crossing-the-bridge noodles, steam-pot chicken, and flower cakes define everyday Kunming food.',
 'Dianchi Lake, Western Hills, and easy day trips to Stone Forest.',
 'Best starter city for newcomers: airport, hospitals, international schools, and services.',
 '过桥米线、汽锅鸡和鲜花饼是昆明日常代表。',
 '滇池、西山和石林一日游都很方便。',
 '机场、医院和国际学校齐全，适合作为移居起点。',
 'Kunming is Yunnan''s capital and the most practical base for travel or relocation.',
 '昆明是云南的省会，也是旅行与移居最实用的基地。'),
('530300','temperate plateau',55,7.0,array[3,4,5,9,10],
 'Local barbecue, sour-spicy dishes, and hearty plateau home cooking.',
 'Karst hills, old towns, and quieter countryside around Qujing.',
 'Lower cost than Kunming with solid transport links eastward.',
 '本地烧烤、酸辣菜和高原家常菜很有代表性。',
 '喀斯特山地、古镇和周边田园风光。',
 '生活成本低于昆明，交通连接较好。',
 'Qujing is an underrated eastern Yunnan hub with lower costs.',
 '曲靖是滇东常被低估的枢纽城市，生活成本更友好。'),
('530400','mild plateau lake',58,7.4,array[2,3,4,10,11],
 'Yuxi is known for quality produce, mushrooms, and lake-side restaurants.',
 'Fuxian Lake and clean plateau scenery close to Kunming.',
 'Attractive for remote workers who want quieter life near the capital.',
 '玉溪以优质农产品、菌子和湖边餐饮见长。',
 '抚仙湖和干净的高原风景离昆明很近。',
 '适合想在省会附近过安静生活的远程工作者。',
 'Yuxi combines lake scenery with convenient access to Kunming.',
 '玉溪兼具湖景与靠近昆明的便利。'),
('530500','mild mountain valleys',54,7.1,array[10,11,12,1,2,3],
 'Baoshan food mixes Han, Bai and borderland flavors with good coffee culture emerging.',
 'Gaoligong Mountains, volcano fields, and Tengchong hot springs nearby.',
 'Good for nature-oriented stays with improving city services.',
 '保山美食融合汉族、白族与边地风味，咖啡文化也在成长。',
 '高黎贡山、火山地貌和腾冲温泉都很近。',
 '适合喜欢自然、又希望城市配套逐步完善的人。',
 'Baoshan is a western gateway to volcanoes, hot springs and mountains.',
 '保山是通往火山、温泉与高山的西部门户。'),
('530600','cool highland',48,6.2,array[4,5,9,10],
 'Zhaotong cuisine is bold, spicy, and built for highland winters.',
 'Dramatic mountains, canyons, and less-toured rural landscapes.',
 'Lower living costs, but colder winters and fewer international services.',
 '昭通菜偏麻辣厚重，适合高原冬季。',
 '高山、峡谷和少有游客的乡村景观。',
 '生活成本更低，但冬季更冷、国际服务更少。',
 'Zhaotong offers rugged highland scenery and budget living.',
 '昭通有粗犷的高原风景和更低的生活成本。'),
('530700','highland temperate',68,7.8,array[3,4,5,9,10],
 'Naxi and local specialties, yak products, and courtyard restaurant culture.',
 'Old Town, Jade Dragon Snow Mountain, and classic highland light.',
 'Very popular with travelers; housing and tourism costs can rise quickly.',
 '纳西风味、牦牛产品和院子餐厅文化突出。',
 '古城、玉龙雪山和经典高原光线。',
 '游客很多，房价与旅游消费上涨较快。',
 'Lijiang is one of Yunnan''s most famous highland destinations.',
 '丽江是云南最知名的高原目的地之一。'),
('530800','subtropical river valleys',56,6.9,array[10,11,12,1,2,3],
 'Pu''er tea culture, ethnic minority dishes, and soft subtropical produce.',
 'Tea mountains, forests, and humid green valleys.',
 'Great for tea lovers; humidity and slower pace suit some expats more than others.',
 '普洱茶文化、少数民族菜和亚热带物产丰富。',
 '茶山、森林与湿润绿色山谷。',
 '适合爱茶与慢生活的人，但湿度较高。',
 'Pu''er is defined by tea mountains and a slower subtropical rhythm.',
 '普洱以茶山和更慢的亚热带节奏著称。'),
('530900','mild to warm valleys',52,6.8,array[10,11,12,1,2,3],
 'Lincang food is hearty with tea-region produce and borderland influence.',
 'Rolling tea hills, rivers, and less commercialized towns.',
 'Lower tourism pressure and lower costs, with fewer English services.',
 '临沧饮食扎实，茶区物产和边地影响明显。',
 '起伏茶山、河流和商业化较低的城镇。',
 '旅游压力小、成本较低，但英语服务较少。',
 'Lincang is a quieter tea-region alternative in southwest Yunnan.',
 '临沧是滇西南更安静的茶区选择。'),
('532300','mild plateau',57,7.3,array[3,4,5,9,10,11],
 'Yi cuisine, wild mushrooms in season, and robust local snacks.',
 'Dinosaur valley, red-earth countryside, and easy access around Chuxiong.',
 'Practical mid-cost base between Kunming and Dali.',
 '彝族风味、应季野生菌和扎实小吃。',
 '恐龙谷、红土田园和楚雄周边短途很方便。',
 '昆明与大理之间实用的中等成本落脚点。',
 'Chuxiong sits on the practical corridor between Kunming and western Yunnan.',
 '楚雄位于昆明通往滇西的实用走廊上。'),
('532500','mild to warm',60,7.5,array[10,11,12,1,2,3,4],
 'Cross-bridge influences, rice noodles, and Honghe valley produce.',
 'Yuanyang rice terraces, old towns, and layered mountain villages.',
 'Strong culture appeal; infrastructure varies widely by county.',
 '米线、红河河谷物产和多样民族风味。',
 '元阳梯田、古镇和层叠山村。',
 '文化吸引力强，但各县基础设施差异大。',
 'Honghe is famous for terraces and multi-ethnic mountain towns.',
 '红河以梯田和多民族山城闻名。'),
('532600','mild subtropical',53,6.7,array[10,11,12,1,2,3],
 'Wenshan food is spicy-sour with strong Zhuang and local influences.',
 'Karst peaks, rural markets, and emerging outdoor spots.',
 'Budget friendly, but still early for long-stay international services.',
 '文山菜偏酸辣，壮族与本地风味明显。',
 '喀斯特山峰、乡村集市和新兴户外点。',
 '预算友好，但长居国际服务仍在早期。',
 'Wenshan offers karst scenery and lower-cost living in southeast Yunnan.',
 '文山提供滇东南喀斯特风景和更低生活成本。'),
('532800','tropical',65,7.6,array[11,12,1,2,3],
 'Dai cuisine, tropical fruit, grilled fish, and night-market energy.',
 'Rainforest, botanical gardens, and warm winter escape weather.',
 'Popular winter base; heat and tourism peaks need planning.',
 '傣味、热带水果、烤鱼和夜市氛围。',
 '雨林、植物园和暖冬避寒气候。',
 '冬季很受欢迎，但湿热和旅游高峰需要规划。',
 'Xishuangbanna is Yunnan''s tropical winter escape.',
 '西双版纳是云南的热带避寒目的地。'),
('532900','mild lake basin',66,8.0,array[3,4,5,9,10,11],
 'Bai cuisine, Erhai lake fish, cheese, and cafe culture around Dali.',
 'Erhai Lake, Cangshan, old towns, and village cycling routes.',
 'Top overseas favorite for lifestyle stays; choose quieter towns outside peak zones.',
 '白族菜、洱海鱼、乳扇和大理咖啡文化。',
 '洱海、苍山、古镇和骑行村落路线。',
 '海外长住热门地，建议避开过热核心区选安静乡镇。',
 'Dali is the lifestyle favorite for many overseas visitors and remote workers.',
 '大理是很多海外访客和远程工作者的生活方式首选。'),
('533100','warm river valleys',51,6.5,array[10,11,12,1,2,3],
 'Dehong food blends Dai, Jingpo and Myanmar-border flavors.',
 'Palm trees, border towns, and soft winter light.',
 'Interesting for culture explorers; services are smaller-city level.',
 '德宏美食融合傣族、景颇族与边境风味。',
 '棕榈树、边境小镇和柔和冬日光线。',
 '适合文化探索，但城市服务规模较小。',
 'Dehong sits on Yunnan''s western border with a distinctly tropical feel.',
 '德宏位于云南西部边境，带有鲜明的热带感。'),
('533300','mountain subtropical to alpine',49,6.3,array[3,4,5,10,11],
 'Nujiang meals are mountain-hearty with river-valley produce.',
 'One of China''s great canyon landscapes and remote villages.',
 'Adventure-first living; infrastructure and services are limited.',
 '怒江餐食偏山地扎实，河谷物产丰富。',
 '中国最壮丽的峡谷景观与偏远村落之一。',
 '更适合冒险型停留，基础设施有限。',
 'Nujiang is for canyon scenery and off-grid adventure more than comfort living.',
 '怒江更适合峡谷风光和冒险，而不是舒适型长居。'),
('533400','cold highland',70,6.9,array[5,6,9,10],
 'Tibetan-influenced food, yak butter tea, and highland ingredients.',
 'Shangri-La meadows, monasteries, and high-altitude light.',
 'Stunning but high-altitude; best for visitors prepared for thinner air and colder nights.',
 '藏式风味、酥油茶和高原食材。',
 '香格里拉草甸、寺庙和高原光线。',
 '风景极美但海拔高，需适应稀薄空气和更冷夜晚。',
 'Diqing / Shangri-La is Yunnan''s high-altitude gateway to Tibetan culture.',
 '迪庆/香格里拉是云南通往藏地文化的高原门户。');

insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select r.id, t.climate_type, t.col, t.migration, t.best_months, 'seed-m1.5-enriched'
from public.regions r
join tmp_city_content t on t.code = r.code
on conflict (region_id) do update set
  climate_type = excluded.climate_type,
  cost_of_living_index = excluded.cost_of_living_index,
  migration_friendliness = excluded.migration_friendliness,
  best_months = excluded.best_months,
  data_source = excluded.data_source,
  updated_at = now();

insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select r.id, 'en', coalesce(i.name, initcap(replace(r.slug, '-', ' '))), t.summary_en, t.food_en, t.scenery_en, t.migration_en, false
from public.regions r
join tmp_city_content t on t.code = r.code
left join public.region_i18n i on i.region_id = r.id and i.locale = 'en'
on conflict (region_id, locale) do update set
  summary = excluded.summary,
  food_blurb = excluded.food_blurb,
  scenery_blurb = excluded.scenery_blurb,
  migration_blurb = excluded.migration_blurb,
  machine_translated = false;

insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select r.id, 'zh-Hans', coalesce(i.name, r.slug), t.summary_zh, t.food_zh, t.scenery_zh, t.migration_zh, false
from public.regions r
join tmp_city_content t on t.code = r.code
left join public.region_i18n i on i.region_id = r.id and i.locale = 'zh-Hans'
on conflict (region_id, locale) do update set
  summary = excluded.summary,
  food_blurb = excluded.food_blurb,
  scenery_blurb = excluded.scenery_blurb,
  migration_blurb = excluded.migration_blurb,
  machine_translated = false;

update public.regions
set is_featured = true, completeness_score = greatest(completeness_score, 75), status = 'published'
where code in ('530100','530700','532900','532800','530500','533400');

update public.regions
set completeness_score = greatest(completeness_score, 70), status = 'published'
where level = 'city';

commit;
