-- Seed Yunnan province -> cities -> counties (M1)
-- Idempotent upserts by code
begin;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
values ('530000', 'yunnan', 'province', null, 25.0453, 102.7097, 1890, 'published', 80, true)
on conflict (code) do update set slug = excluded.slug, status = 'published', lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, completeness_score = excluded.completeness_score, is_featured = excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select r.id, 'zh-Hans', '云南省', '云南位于中国西南，地形立体、气候多元，从热带到高寒都有。', false from public.regions r where r.code = '530000'
on conflict (region_id, locale) do update set name = excluded.name, summary = excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select r.id, 'en', 'Yunnan Province', 'Yunnan in southwest China spans tropical valleys to alpine plateaus.', false from public.regions r where r.code = '530000'
on conflict (region_id, locale) do update set name = excluded.name, summary = excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select r.id, 'zh-Hant', '雲南省', '雲南位於中國西南，地形立體、氣候多元。', false from public.regions r where r.code = '530000'
on conflict (region_id, locale) do update set name = excluded.name, summary = excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select r.id, 'ja', '雲南省', '中国西南部に位置し、熱帯から高山まで多様な気候がある。', false from public.regions r where r.code = '530000'
on conflict (region_id, locale) do update set name = excluded.name, summary = excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select r.id, 'ko', '윈난성', '중국 서남부에 위치하며 열대에서 고산까지 기후가 다양하다.', false from public.regions r where r.code = '530000'
on conflict (region_id, locale) do update set name = excluded.name, summary = excluded.summary;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select r.id, 'diverse', 50, 7.5, array[3,4,5,10,11], 'seed-m1' from public.regions r where r.code='530000'
on conflict (region_id) do update set climate_type = excluded.climate_type, data_source = excluded.data_source;
-- city kunming
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530100', 'kunming', 'city', p.id, 25.0389, 102.7183, 1891, 'published', 100, true
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '昆明市', '昆明市是云南重要地区，海拔约1891米。', '过桥米线、汽锅鸡、宜良烤鸭', '滇池、西山、翠湖', '四季如春，医疗与教育配套全省最好，适合长期居住。', false from public.regions where code='530100'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Kunming', 'Kunming is a key prefecture-level area in Yunnan at about 1891 m elevation.', '过桥米线、汽锅鸡、宜良烤鸭', '滇池、西山、翠湖', '四季如春，医疗与教育配套全省最好，适合长期居住。', true from public.regions where code='530100'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '昆明市', 'Kunming is a key prefecture-level area in Yunnan at about 1891 m elevation.', true from public.regions where code='530100'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Kunming', 'Kunming is a key prefecture-level area in Yunnan at about 1891 m elevation.', true from public.regions where code='530100'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Kunming', 'Kunming is a key prefecture-level area in Yunnan at about 1891 m elevation.', true from public.regions where code='530100'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'subtropical_plateau', 62, 8.5, array[3,4,5,9,10,11], 'seed-m1' from public.regions where code='530100'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530102', 'kunming-wuhua', 'county', p.id, 25.0436, 102.7072, 1890, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '五华区', '五华区隶属昆明市，海拔约1890米。', false from public.regions where code='530102'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Wuhua', 'Wuhua is in Kunming, about 1890 m elevation.', true from public.regions where code='530102'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '五华区', 'Wuhua is in Kunming, about 1890 m elevation.', true from public.regions where code='530102'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Wuhua', 'Wuhua is in Kunming, about 1890 m elevation.', true from public.regions where code='530102'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Wuhua', 'Wuhua is in Kunming, about 1890 m elevation.', true from public.regions where code='530102'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530102'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530103', 'kunming-panlong', 'county', p.id, 25.0706, 102.752, 1900, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '盘龙区', '盘龙区隶属昆明市，海拔约1900米。', false from public.regions where code='530103'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Panlong', 'Panlong is in Kunming, about 1900 m elevation.', true from public.regions where code='530103'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '盘龙区', 'Panlong is in Kunming, about 1900 m elevation.', true from public.regions where code='530103'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Panlong', 'Panlong is in Kunming, about 1900 m elevation.', true from public.regions where code='530103'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Panlong', 'Panlong is in Kunming, about 1900 m elevation.', true from public.regions where code='530103'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530103'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530111', 'kunming-guandu', 'county', p.id, 25.015, 102.7436, 1895, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '官渡区', '官渡区隶属昆明市，海拔约1895米。', false from public.regions where code='530111'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Guandu', 'Guandu is in Kunming, about 1895 m elevation.', true from public.regions where code='530111'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '官渡区', 'Guandu is in Kunming, about 1895 m elevation.', true from public.regions where code='530111'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Guandu', 'Guandu is in Kunming, about 1895 m elevation.', true from public.regions where code='530111'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Guandu', 'Guandu is in Kunming, about 1895 m elevation.', true from public.regions where code='530111'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530111'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530112', 'kunming-xishan', 'county', p.id, 25.0383, 102.6647, 1900, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '西山区', '西山区隶属昆明市，海拔约1900米。', false from public.regions where code='530112'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Xishan', 'Xishan is in Kunming, about 1900 m elevation.', true from public.regions where code='530112'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '西山区', 'Xishan is in Kunming, about 1900 m elevation.', true from public.regions where code='530112'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Xishan', 'Xishan is in Kunming, about 1900 m elevation.', true from public.regions where code='530112'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Xishan', 'Xishan is in Kunming, about 1900 m elevation.', true from public.regions where code='530112'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530112'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530113', 'kunming-dongchuan', 'county', p.id, 26.0829, 103.1877, 1254, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '东川区', '东川区隶属昆明市，海拔约1254米。', false from public.regions where code='530113'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Dongchuan', 'Dongchuan is in Kunming, about 1254 m elevation.', true from public.regions where code='530113'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '东川区', 'Dongchuan is in Kunming, about 1254 m elevation.', true from public.regions where code='530113'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Dongchuan', 'Dongchuan is in Kunming, about 1254 m elevation.', true from public.regions where code='530113'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Dongchuan', 'Dongchuan is in Kunming, about 1254 m elevation.', true from public.regions where code='530113'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530113'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530114', 'kunming-chenggong', 'county', p.id, 24.8893, 102.8014, 1906, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '呈贡区', '呈贡区隶属昆明市，海拔约1906米。', false from public.regions where code='530114'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Chenggong', 'Chenggong is in Kunming, about 1906 m elevation.', true from public.regions where code='530114'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '呈贡区', 'Chenggong is in Kunming, about 1906 m elevation.', true from public.regions where code='530114'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Chenggong', 'Chenggong is in Kunming, about 1906 m elevation.', true from public.regions where code='530114'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Chenggong', 'Chenggong is in Kunming, about 1906 m elevation.', true from public.regions where code='530114'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530114'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530115', 'kunming-jinning', 'county', p.id, 24.6669, 102.5949, 1890, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '晋宁区', '晋宁区隶属昆明市，海拔约1890米。', false from public.regions where code='530115'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Jinning', 'Jinning is in Kunming, about 1890 m elevation.', true from public.regions where code='530115'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '晋宁区', 'Jinning is in Kunming, about 1890 m elevation.', true from public.regions where code='530115'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Jinning', 'Jinning is in Kunming, about 1890 m elevation.', true from public.regions where code='530115'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Jinning', 'Jinning is in Kunming, about 1890 m elevation.', true from public.regions where code='530115'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530115'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530124', 'kunming-fumin', 'county', p.id, 25.2219, 102.4971, 1690, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '富民县', '富民县隶属昆明市，海拔约1690米。', false from public.regions where code='530124'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Fumin', 'Fumin is in Kunming, about 1690 m elevation.', true from public.regions where code='530124'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '富民县', 'Fumin is in Kunming, about 1690 m elevation.', true from public.regions where code='530124'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Fumin', 'Fumin is in Kunming, about 1690 m elevation.', true from public.regions where code='530124'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Fumin', 'Fumin is in Kunming, about 1690 m elevation.', true from public.regions where code='530124'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530124'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530125', 'kunming-yiliang', 'county', p.id, 24.9198, 103.1459, 1530, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '宜良县', '宜良县隶属昆明市，海拔约1530米。', false from public.regions where code='530125'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yiliang', 'Yiliang is in Kunming, about 1530 m elevation.', true from public.regions where code='530125'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '宜良县', 'Yiliang is in Kunming, about 1530 m elevation.', true from public.regions where code='530125'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yiliang', 'Yiliang is in Kunming, about 1530 m elevation.', true from public.regions where code='530125'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yiliang', 'Yiliang is in Kunming, about 1530 m elevation.', true from public.regions where code='530125'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530125'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530126', 'kunming-shilin', 'county', p.id, 24.7715, 103.2905, 1680, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '石林彝族自治县', '石林彝族自治县隶属昆明市，海拔约1680米。', false from public.regions where code='530126'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Shilin', 'Shilin is in Kunming, about 1680 m elevation.', true from public.regions where code='530126'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '石林彝族自治县', 'Shilin is in Kunming, about 1680 m elevation.', true from public.regions where code='530126'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Shilin', 'Shilin is in Kunming, about 1680 m elevation.', true from public.regions where code='530126'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Shilin', 'Shilin is in Kunming, about 1680 m elevation.', true from public.regions where code='530126'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530126'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530127', 'kunming-songming', 'county', p.id, 25.339, 103.0369, 1910, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '嵩明县', '嵩明县隶属昆明市，海拔约1910米。', false from public.regions where code='530127'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Songming', 'Songming is in Kunming, about 1910 m elevation.', true from public.regions where code='530127'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '嵩明县', 'Songming is in Kunming, about 1910 m elevation.', true from public.regions where code='530127'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Songming', 'Songming is in Kunming, about 1910 m elevation.', true from public.regions where code='530127'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Songming', 'Songming is in Kunming, about 1910 m elevation.', true from public.regions where code='530127'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530127'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530128', 'kunming-luquan', 'county', p.id, 25.5513, 102.4697, 1670, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '禄劝彝族苗族自治县', '禄劝彝族苗族自治县隶属昆明市，海拔约1670米。', false from public.regions where code='530128'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Luquan', 'Luquan is in Kunming, about 1670 m elevation.', true from public.regions where code='530128'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '禄劝彝族苗族自治县', 'Luquan is in Kunming, about 1670 m elevation.', true from public.regions where code='530128'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Luquan', 'Luquan is in Kunming, about 1670 m elevation.', true from public.regions where code='530128'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Luquan', 'Luquan is in Kunming, about 1670 m elevation.', true from public.regions where code='530128'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530128'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530129', 'kunming-xundian', 'county', p.id, 25.5595, 103.2566, 1870, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '寻甸回族彝族自治县', '寻甸回族彝族自治县隶属昆明市，海拔约1870米。', false from public.regions where code='530129'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Xundian', 'Xundian is in Kunming, about 1870 m elevation.', true from public.regions where code='530129'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '寻甸回族彝族自治县', 'Xundian is in Kunming, about 1870 m elevation.', true from public.regions where code='530129'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Xundian', 'Xundian is in Kunming, about 1870 m elevation.', true from public.regions where code='530129'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Xundian', 'Xundian is in Kunming, about 1870 m elevation.', true from public.regions where code='530129'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530129'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530181', 'kunming-anning', 'county', p.id, 24.9195, 102.478, 1800, 'published', 60, false
from public.regions p where p.code = '530100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '安宁市', '安宁市隶属昆明市，海拔约1800米。', false from public.regions where code='530181'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Anning', 'Anning is in Kunming, about 1800 m elevation.', true from public.regions where code='530181'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '安宁市', 'Anning is in Kunming, about 1800 m elevation.', true from public.regions where code='530181'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Anning', 'Anning is in Kunming, about 1800 m elevation.', true from public.regions where code='530181'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Anning', 'Anning is in Kunming, about 1800 m elevation.', true from public.regions where code='530181'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530100'
join public.region_metrics m on m.region_id=p.id
where c.code='530181'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city qujing
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530300', 'qujing', 'city', p.id, 25.5016, 103.7979, 1873, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '曲靖市', '曲靖市是云南重要地区，海拔约1873米。', '宣威火腿、沾益辣子鸡', '珠江源、罗平油菜花', '滇东交通枢纽，生活成本低于昆明。', false from public.regions where code='530300'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Qujing', 'Qujing is a key prefecture-level area in Yunnan at about 1873 m elevation.', '宣威火腿、沾益辣子鸡', '珠江源、罗平油菜花', '滇东交通枢纽，生活成本低于昆明。', true from public.regions where code='530300'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '曲靖市', 'Qujing is a key prefecture-level area in Yunnan at about 1873 m elevation.', true from public.regions where code='530300'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Qujing', 'Qujing is a key prefecture-level area in Yunnan at about 1873 m elevation.', true from public.regions where code='530300'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Qujing', 'Qujing is a key prefecture-level area in Yunnan at about 1873 m elevation.', true from public.regions where code='530300'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'subtropical_plateau', 48, 7, array[4,5,9,10], 'seed-m1' from public.regions where code='530300'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530302', 'qujing-qilin', 'county', p.id, 25.5051, 103.805, 1870, 'published', 60, false
from public.regions p where p.code = '530300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '麒麟区', '麒麟区隶属曲靖市，海拔约1870米。', false from public.regions where code='530302'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Qilin', 'Qilin is in Qujing, about 1870 m elevation.', true from public.regions where code='530302'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '麒麟区', 'Qilin is in Qujing, about 1870 m elevation.', true from public.regions where code='530302'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Qilin', 'Qilin is in Qujing, about 1870 m elevation.', true from public.regions where code='530302'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Qilin', 'Qilin is in Qujing, about 1870 m elevation.', true from public.regions where code='530302'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530300'
join public.region_metrics m on m.region_id=p.id
where c.code='530302'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530303', 'qujing-zhanyi', 'county', p.id, 25.6005, 103.8223, 1900, 'published', 60, false
from public.regions p where p.code = '530300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '沾益区', '沾益区隶属曲靖市，海拔约1900米。', false from public.regions where code='530303'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Zhanyi', 'Zhanyi is in Qujing, about 1900 m elevation.', true from public.regions where code='530303'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '沾益区', 'Zhanyi is in Qujing, about 1900 m elevation.', true from public.regions where code='530303'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Zhanyi', 'Zhanyi is in Qujing, about 1900 m elevation.', true from public.regions where code='530303'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Zhanyi', 'Zhanyi is in Qujing, about 1900 m elevation.', true from public.regions where code='530303'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530300'
join public.region_metrics m on m.region_id=p.id
where c.code='530303'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530304', 'qujing-malong', 'county', p.id, 25.4281, 103.5785, 2000, 'published', 60, false
from public.regions p where p.code = '530300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '马龙区', '马龙区隶属曲靖市，海拔约2000米。', false from public.regions where code='530304'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Malong', 'Malong is in Qujing, about 2000 m elevation.', true from public.regions where code='530304'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '马龙区', 'Malong is in Qujing, about 2000 m elevation.', true from public.regions where code='530304'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Malong', 'Malong is in Qujing, about 2000 m elevation.', true from public.regions where code='530304'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Malong', 'Malong is in Qujing, about 2000 m elevation.', true from public.regions where code='530304'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530300'
join public.region_metrics m on m.region_id=p.id
where c.code='530304'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530322', 'qujing-luliang', 'county', p.id, 25.0297, 103.6669, 1840, 'published', 60, false
from public.regions p where p.code = '530300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '陆良县', '陆良县隶属曲靖市，海拔约1840米。', false from public.regions where code='530322'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Luliang', 'Luliang is in Qujing, about 1840 m elevation.', true from public.regions where code='530322'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '陆良县', 'Luliang is in Qujing, about 1840 m elevation.', true from public.regions where code='530322'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Luliang', 'Luliang is in Qujing, about 1840 m elevation.', true from public.regions where code='530322'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Luliang', 'Luliang is in Qujing, about 1840 m elevation.', true from public.regions where code='530322'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530300'
join public.region_metrics m on m.region_id=p.id
where c.code='530322'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530323', 'qujing-shizong', 'county', p.id, 24.8256, 103.9908, 1850, 'published', 60, false
from public.regions p where p.code = '530300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '师宗县', '师宗县隶属曲靖市，海拔约1850米。', false from public.regions where code='530323'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Shizong', 'Shizong is in Qujing, about 1850 m elevation.', true from public.regions where code='530323'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '师宗县', 'Shizong is in Qujing, about 1850 m elevation.', true from public.regions where code='530323'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Shizong', 'Shizong is in Qujing, about 1850 m elevation.', true from public.regions where code='530323'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Shizong', 'Shizong is in Qujing, about 1850 m elevation.', true from public.regions where code='530323'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530300'
join public.region_metrics m on m.region_id=p.id
where c.code='530323'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530324', 'qujing-luoping', 'county', p.id, 24.8856, 104.3087, 1480, 'published', 60, false
from public.regions p where p.code = '530300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '罗平县', '罗平县隶属曲靖市，海拔约1480米。', false from public.regions where code='530324'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Luoping', 'Luoping is in Qujing, about 1480 m elevation.', true from public.regions where code='530324'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '罗平县', 'Luoping is in Qujing, about 1480 m elevation.', true from public.regions where code='530324'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Luoping', 'Luoping is in Qujing, about 1480 m elevation.', true from public.regions where code='530324'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Luoping', 'Luoping is in Qujing, about 1480 m elevation.', true from public.regions where code='530324'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530300'
join public.region_metrics m on m.region_id=p.id
where c.code='530324'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530325', 'qujing-fuyuan', 'county', p.id, 25.6742, 104.255, 1830, 'published', 60, false
from public.regions p where p.code = '530300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '富源县', '富源县隶属曲靖市，海拔约1830米。', false from public.regions where code='530325'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Fuyuan', 'Fuyuan is in Qujing, about 1830 m elevation.', true from public.regions where code='530325'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '富源县', 'Fuyuan is in Qujing, about 1830 m elevation.', true from public.regions where code='530325'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Fuyuan', 'Fuyuan is in Qujing, about 1830 m elevation.', true from public.regions where code='530325'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Fuyuan', 'Fuyuan is in Qujing, about 1830 m elevation.', true from public.regions where code='530325'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530300'
join public.region_metrics m on m.region_id=p.id
where c.code='530325'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530326', 'qujing-huize', 'county', p.id, 26.4174, 103.2971, 2120, 'published', 60, false
from public.regions p where p.code = '530300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '会泽县', '会泽县隶属曲靖市，海拔约2120米。', false from public.regions where code='530326'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Huize', 'Huize is in Qujing, about 2120 m elevation.', true from public.regions where code='530326'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '会泽县', 'Huize is in Qujing, about 2120 m elevation.', true from public.regions where code='530326'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Huize', 'Huize is in Qujing, about 2120 m elevation.', true from public.regions where code='530326'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Huize', 'Huize is in Qujing, about 2120 m elevation.', true from public.regions where code='530326'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530300'
join public.region_metrics m on m.region_id=p.id
where c.code='530326'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530381', 'qujing-xuanwei', 'county', p.id, 26.2193, 104.1045, 1980, 'published', 60, false
from public.regions p where p.code = '530300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '宣威市', '宣威市隶属曲靖市，海拔约1980米。', false from public.regions where code='530381'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Xuanwei', 'Xuanwei is in Qujing, about 1980 m elevation.', true from public.regions where code='530381'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '宣威市', 'Xuanwei is in Qujing, about 1980 m elevation.', true from public.regions where code='530381'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Xuanwei', 'Xuanwei is in Qujing, about 1980 m elevation.', true from public.regions where code='530381'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Xuanwei', 'Xuanwei is in Qujing, about 1980 m elevation.', true from public.regions where code='530381'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530300'
join public.region_metrics m on m.region_id=p.id
where c.code='530381'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city yuxi
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530400', 'yuxi', 'city', p.id, 24.3505, 102.5439, 1637, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '玉溪市', '玉溪市是云南重要地区，海拔约1637米。', '抚仙湖铜锅鱼、澄江藕粉', '抚仙湖、星云湖', '毗邻昆明，湖区与轻工业并存。', false from public.regions where code='530400'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Yuxi', 'Yuxi is a key prefecture-level area in Yunnan at about 1637 m elevation.', '抚仙湖铜锅鱼、澄江藕粉', '抚仙湖、星云湖', '毗邻昆明，湖区与轻工业并存。', true from public.regions where code='530400'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '玉溪市', 'Yuxi is a key prefecture-level area in Yunnan at about 1637 m elevation.', true from public.regions where code='530400'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yuxi', 'Yuxi is a key prefecture-level area in Yunnan at about 1637 m elevation.', true from public.regions where code='530400'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yuxi', 'Yuxi is a key prefecture-level area in Yunnan at about 1637 m elevation.', true from public.regions where code='530400'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'subtropical_plateau', 50, 7.2, array[3,4,10,11], 'seed-m1' from public.regions where code='530400'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530402', 'yuxi-hongta', 'county', p.id, 24.3541, 102.5432, 1630, 'published', 60, false
from public.regions p where p.code = '530400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '红塔区', '红塔区隶属玉溪市，海拔约1630米。', false from public.regions where code='530402'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Hongta', 'Hongta is in Yuxi, about 1630 m elevation.', true from public.regions where code='530402'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '红塔区', 'Hongta is in Yuxi, about 1630 m elevation.', true from public.regions where code='530402'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Hongta', 'Hongta is in Yuxi, about 1630 m elevation.', true from public.regions where code='530402'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Hongta', 'Hongta is in Yuxi, about 1630 m elevation.', true from public.regions where code='530402'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530400'
join public.region_metrics m on m.region_id=p.id
where c.code='530402'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530403', 'yuxi-jiangchuan', 'county', p.id, 24.2874, 102.7498, 1730, 'published', 60, false
from public.regions p where p.code = '530400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '江川区', '江川区隶属玉溪市，海拔约1730米。', false from public.regions where code='530403'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Jiangchuan', 'Jiangchuan is in Yuxi, about 1730 m elevation.', true from public.regions where code='530403'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '江川区', 'Jiangchuan is in Yuxi, about 1730 m elevation.', true from public.regions where code='530403'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Jiangchuan', 'Jiangchuan is in Yuxi, about 1730 m elevation.', true from public.regions where code='530403'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Jiangchuan', 'Jiangchuan is in Yuxi, about 1730 m elevation.', true from public.regions where code='530403'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530400'
join public.region_metrics m on m.region_id=p.id
where c.code='530403'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530423', 'yuxi-tonghai', 'county', p.id, 24.1122, 102.76, 1800, 'published', 60, false
from public.regions p where p.code = '530400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '通海县', '通海县隶属玉溪市，海拔约1800米。', false from public.regions where code='530423'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Tonghai', 'Tonghai is in Yuxi, about 1800 m elevation.', true from public.regions where code='530423'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '通海县', 'Tonghai is in Yuxi, about 1800 m elevation.', true from public.regions where code='530423'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Tonghai', 'Tonghai is in Yuxi, about 1800 m elevation.', true from public.regions where code='530423'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Tonghai', 'Tonghai is in Yuxi, about 1800 m elevation.', true from public.regions where code='530423'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530400'
join public.region_metrics m on m.region_id=p.id
where c.code='530423'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530424', 'yuxi-huaning', 'county', p.id, 24.1926, 102.9283, 1600, 'published', 60, false
from public.regions p where p.code = '530400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '华宁县', '华宁县隶属玉溪市，海拔约1600米。', false from public.regions where code='530424'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Huaning', 'Huaning is in Yuxi, about 1600 m elevation.', true from public.regions where code='530424'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '华宁县', 'Huaning is in Yuxi, about 1600 m elevation.', true from public.regions where code='530424'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Huaning', 'Huaning is in Yuxi, about 1600 m elevation.', true from public.regions where code='530424'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Huaning', 'Huaning is in Yuxi, about 1600 m elevation.', true from public.regions where code='530424'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530400'
join public.region_metrics m on m.region_id=p.id
where c.code='530424'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530425', 'yuxi-yimen', 'county', p.id, 24.6717, 102.1635, 1570, 'published', 60, false
from public.regions p where p.code = '530400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '易门县', '易门县隶属玉溪市，海拔约1570米。', false from public.regions where code='530425'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yimen', 'Yimen is in Yuxi, about 1570 m elevation.', true from public.regions where code='530425'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '易门县', 'Yimen is in Yuxi, about 1570 m elevation.', true from public.regions where code='530425'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yimen', 'Yimen is in Yuxi, about 1570 m elevation.', true from public.regions where code='530425'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yimen', 'Yimen is in Yuxi, about 1570 m elevation.', true from public.regions where code='530425'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530400'
join public.region_metrics m on m.region_id=p.id
where c.code='530425'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530426', 'yuxi-eshan', 'county', p.id, 24.1733, 102.4058, 1540, 'published', 60, false
from public.regions p where p.code = '530400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '峨山彝族自治县', '峨山彝族自治县隶属玉溪市，海拔约1540米。', false from public.regions where code='530426'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Eshan', 'Eshan is in Yuxi, about 1540 m elevation.', true from public.regions where code='530426'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '峨山彝族自治县', 'Eshan is in Yuxi, about 1540 m elevation.', true from public.regions where code='530426'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Eshan', 'Eshan is in Yuxi, about 1540 m elevation.', true from public.regions where code='530426'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Eshan', 'Eshan is in Yuxi, about 1540 m elevation.', true from public.regions where code='530426'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530400'
join public.region_metrics m on m.region_id=p.id
where c.code='530426'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530427', 'yuxi-xinping', 'county', p.id, 24.07, 101.9906, 1480, 'published', 60, false
from public.regions p where p.code = '530400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '新平彝族傣族自治县', '新平彝族傣族自治县隶属玉溪市，海拔约1480米。', false from public.regions where code='530427'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Xinping', 'Xinping is in Yuxi, about 1480 m elevation.', true from public.regions where code='530427'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '新平彝族傣族自治县', 'Xinping is in Yuxi, about 1480 m elevation.', true from public.regions where code='530427'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Xinping', 'Xinping is in Yuxi, about 1480 m elevation.', true from public.regions where code='530427'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Xinping', 'Xinping is in Yuxi, about 1480 m elevation.', true from public.regions where code='530427'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530400'
join public.region_metrics m on m.region_id=p.id
where c.code='530427'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530428', 'yuxi-yuanjiang', 'county', p.id, 23.5965, 101.9981, 400, 'published', 60, false
from public.regions p where p.code = '530400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '元江哈尼族彝族傣族自治县', '元江哈尼族彝族傣族自治县隶属玉溪市，海拔约400米。', false from public.regions where code='530428'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yuanjiang', 'Yuanjiang is in Yuxi, about 400 m elevation.', true from public.regions where code='530428'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '元江哈尼族彝族傣族自治县', 'Yuanjiang is in Yuxi, about 400 m elevation.', true from public.regions where code='530428'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yuanjiang', 'Yuanjiang is in Yuxi, about 400 m elevation.', true from public.regions where code='530428'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yuanjiang', 'Yuanjiang is in Yuxi, about 400 m elevation.', true from public.regions where code='530428'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530400'
join public.region_metrics m on m.region_id=p.id
where c.code='530428'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530481', 'yuxi-chengjiang', 'county', p.id, 24.6757, 102.9166, 1740, 'published', 60, false
from public.regions p where p.code = '530400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '澄江市', '澄江市隶属玉溪市，海拔约1740米。', false from public.regions where code='530481'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Chengjiang', 'Chengjiang is in Yuxi, about 1740 m elevation.', true from public.regions where code='530481'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '澄江市', 'Chengjiang is in Yuxi, about 1740 m elevation.', true from public.regions where code='530481'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Chengjiang', 'Chengjiang is in Yuxi, about 1740 m elevation.', true from public.regions where code='530481'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Chengjiang', 'Chengjiang is in Yuxi, about 1740 m elevation.', true from public.regions where code='530481'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530400'
join public.region_metrics m on m.region_id=p.id
where c.code='530481'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city baoshan
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530500', 'baoshan', 'city', p.id, 25.112, 99.1618, 1655, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '保山市', '保山市是云南重要地区，海拔约1655米。', '蒲缥甜梨、腾冲大救驾', '高黎贡山、火山热海', '滇西门户，腾冲旅居热度高。', false from public.regions where code='530500'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Baoshan', 'Baoshan is a key prefecture-level area in Yunnan at about 1655 m elevation.', '蒲缥甜梨、腾冲大救驾', '高黎贡山、火山热海', '滇西门户，腾冲旅居热度高。', true from public.regions where code='530500'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '保山市', 'Baoshan is a key prefecture-level area in Yunnan at about 1655 m elevation.', true from public.regions where code='530500'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Baoshan', 'Baoshan is a key prefecture-level area in Yunnan at about 1655 m elevation.', true from public.regions where code='530500'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Baoshan', 'Baoshan is a key prefecture-level area in Yunnan at about 1655 m elevation.', true from public.regions where code='530500'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'subtropical_monsoon', 45, 6.8, array[10,11,12,1,2], 'seed-m1' from public.regions where code='530500'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530502', 'baoshan-longyang', 'county', p.id, 25.1121, 99.1656, 1655, 'published', 60, false
from public.regions p where p.code = '530500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '隆阳区', '隆阳区隶属保山市，海拔约1655米。', false from public.regions where code='530502'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Longyang', 'Longyang is in Baoshan, about 1655 m elevation.', true from public.regions where code='530502'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '隆阳区', 'Longyang is in Baoshan, about 1655 m elevation.', true from public.regions where code='530502'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Longyang', 'Longyang is in Baoshan, about 1655 m elevation.', true from public.regions where code='530502'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Longyang', 'Longyang is in Baoshan, about 1655 m elevation.', true from public.regions where code='530502'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530500'
join public.region_metrics m on m.region_id=p.id
where c.code='530502'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530521', 'baoshan-shidian', 'county', p.id, 24.7231, 99.1837, 1470, 'published', 60, false
from public.regions p where p.code = '530500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '施甸县', '施甸县隶属保山市，海拔约1470米。', false from public.regions where code='530521'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Shidian', 'Shidian is in Baoshan, about 1470 m elevation.', true from public.regions where code='530521'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '施甸县', 'Shidian is in Baoshan, about 1470 m elevation.', true from public.regions where code='530521'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Shidian', 'Shidian is in Baoshan, about 1470 m elevation.', true from public.regions where code='530521'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Shidian', 'Shidian is in Baoshan, about 1470 m elevation.', true from public.regions where code='530521'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530500'
join public.region_metrics m on m.region_id=p.id
where c.code='530521'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530523', 'baoshan-longling', 'county', p.id, 24.5881, 98.6893, 1540, 'published', 60, false
from public.regions p where p.code = '530500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '龙陵县', '龙陵县隶属保山市，海拔约1540米。', false from public.regions where code='530523'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Longling', 'Longling is in Baoshan, about 1540 m elevation.', true from public.regions where code='530523'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '龙陵县', 'Longling is in Baoshan, about 1540 m elevation.', true from public.regions where code='530523'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Longling', 'Longling is in Baoshan, about 1540 m elevation.', true from public.regions where code='530523'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Longling', 'Longling is in Baoshan, about 1540 m elevation.', true from public.regions where code='530523'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530500'
join public.region_metrics m on m.region_id=p.id
where c.code='530523'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530524', 'baoshan-changning', 'county', p.id, 24.8278, 99.6051, 1670, 'published', 60, false
from public.regions p where p.code = '530500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '昌宁县', '昌宁县隶属保山市，海拔约1670米。', false from public.regions where code='530524'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Changning', 'Changning is in Baoshan, about 1670 m elevation.', true from public.regions where code='530524'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '昌宁县', 'Changning is in Baoshan, about 1670 m elevation.', true from public.regions where code='530524'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Changning', 'Changning is in Baoshan, about 1670 m elevation.', true from public.regions where code='530524'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Changning', 'Changning is in Baoshan, about 1670 m elevation.', true from public.regions where code='530524'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530500'
join public.region_metrics m on m.region_id=p.id
where c.code='530524'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530581', 'baoshan-tengchong', 'county', p.id, 25.0203, 98.491, 1640, 'published', 60, false
from public.regions p where p.code = '530500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '腾冲市', '腾冲市隶属保山市，海拔约1640米。', false from public.regions where code='530581'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Tengchong', 'Tengchong is in Baoshan, about 1640 m elevation.', true from public.regions where code='530581'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '腾冲市', 'Tengchong is in Baoshan, about 1640 m elevation.', true from public.regions where code='530581'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Tengchong', 'Tengchong is in Baoshan, about 1640 m elevation.', true from public.regions where code='530581'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Tengchong', 'Tengchong is in Baoshan, about 1640 m elevation.', true from public.regions where code='530581'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530500'
join public.region_metrics m on m.region_id=p.id
where c.code='530581'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city zhaotong
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530600', 'zhaotong', 'city', p.id, 27.3383, 103.7172, 1920, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '昭通市', '昭通市是云南重要地区，海拔约1920米。', '天麻、苹果、酱肉', '大山包黑颈鹤、横江峡谷', '滇东北，气候凉爽，基础设施持续改善。', false from public.regions where code='530600'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Zhaotong', 'Zhaotong is a key prefecture-level area in Yunnan at about 1920 m elevation.', '天麻、苹果、酱肉', '大山包黑颈鹤、横江峡谷', '滇东北，气候凉爽，基础设施持续改善。', true from public.regions where code='530600'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '昭通市', 'Zhaotong is a key prefecture-level area in Yunnan at about 1920 m elevation.', true from public.regions where code='530600'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Zhaotong', 'Zhaotong is a key prefecture-level area in Yunnan at about 1920 m elevation.', true from public.regions where code='530600'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Zhaotong', 'Zhaotong is a key prefecture-level area in Yunnan at about 1920 m elevation.', true from public.regions where code='530600'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'temperate_highland', 40, 5.8, array[4,5,9,10], 'seed-m1' from public.regions where code='530600'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530602', 'zhaotong-zhaoyang', 'county', p.id, 27.32, 103.7065, 1920, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '昭阳区', '昭阳区隶属昭通市，海拔约1920米。', false from public.regions where code='530602'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Zhaoyang', 'Zhaoyang is in Zhaotong, about 1920 m elevation.', true from public.regions where code='530602'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '昭阳区', 'Zhaoyang is in Zhaotong, about 1920 m elevation.', true from public.regions where code='530602'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Zhaoyang', 'Zhaoyang is in Zhaotong, about 1920 m elevation.', true from public.regions where code='530602'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Zhaoyang', 'Zhaoyang is in Zhaotong, about 1920 m elevation.', true from public.regions where code='530602'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530602'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530621', 'zhaotong-ludian', 'county', p.id, 27.1916, 103.558, 1910, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '鲁甸县', '鲁甸县隶属昭通市，海拔约1910米。', false from public.regions where code='530621'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Ludian', 'Ludian is in Zhaotong, about 1910 m elevation.', true from public.regions where code='530621'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '鲁甸县', 'Ludian is in Zhaotong, about 1910 m elevation.', true from public.regions where code='530621'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Ludian', 'Ludian is in Zhaotong, about 1910 m elevation.', true from public.regions where code='530621'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Ludian', 'Ludian is in Zhaotong, about 1910 m elevation.', true from public.regions where code='530621'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530621'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530622', 'zhaotong-qiaojia', 'county', p.id, 26.9114, 102.924, 840, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '巧家县', '巧家县隶属昭通市，海拔约840米。', false from public.regions where code='530622'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Qiaojia', 'Qiaojia is in Zhaotong, about 840 m elevation.', true from public.regions where code='530622'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '巧家县', 'Qiaojia is in Zhaotong, about 840 m elevation.', true from public.regions where code='530622'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Qiaojia', 'Qiaojia is in Zhaotong, about 840 m elevation.', true from public.regions where code='530622'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Qiaojia', 'Qiaojia is in Zhaotong, about 840 m elevation.', true from public.regions where code='530622'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530622'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530623', 'zhaotong-yanjin', 'county', p.id, 28.1087, 104.234, 420, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '盐津县', '盐津县隶属昭通市，海拔约420米。', false from public.regions where code='530623'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yanjin', 'Yanjin is in Zhaotong, about 420 m elevation.', true from public.regions where code='530623'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '盐津县', 'Yanjin is in Zhaotong, about 420 m elevation.', true from public.regions where code='530623'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yanjin', 'Yanjin is in Zhaotong, about 420 m elevation.', true from public.regions where code='530623'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yanjin', 'Yanjin is in Zhaotong, about 420 m elevation.', true from public.regions where code='530623'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530623'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530624', 'zhaotong-daguan', 'county', p.id, 27.7481, 103.8916, 1100, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '大关县', '大关县隶属昭通市，海拔约1100米。', false from public.regions where code='530624'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Daguan', 'Daguan is in Zhaotong, about 1100 m elevation.', true from public.regions where code='530624'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '大关县', 'Daguan is in Zhaotong, about 1100 m elevation.', true from public.regions where code='530624'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Daguan', 'Daguan is in Zhaotong, about 1100 m elevation.', true from public.regions where code='530624'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Daguan', 'Daguan is in Zhaotong, about 1100 m elevation.', true from public.regions where code='530624'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530624'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530625', 'zhaotong-yongshan', 'county', p.id, 28.2289, 103.638, 900, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '永善县', '永善县隶属昭通市，海拔约900米。', false from public.regions where code='530625'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yongshan', 'Yongshan is in Zhaotong, about 900 m elevation.', true from public.regions where code='530625'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '永善县', 'Yongshan is in Zhaotong, about 900 m elevation.', true from public.regions where code='530625'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yongshan', 'Yongshan is in Zhaotong, about 900 m elevation.', true from public.regions where code='530625'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yongshan', 'Yongshan is in Zhaotong, about 900 m elevation.', true from public.regions where code='530625'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530625'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530626', 'zhaotong-suijiang', 'county', p.id, 28.5921, 103.956, 400, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '绥江县', '绥江县隶属昭通市，海拔约400米。', false from public.regions where code='530626'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Suijiang', 'Suijiang is in Zhaotong, about 400 m elevation.', true from public.regions where code='530626'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '绥江县', 'Suijiang is in Zhaotong, about 400 m elevation.', true from public.regions where code='530626'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Suijiang', 'Suijiang is in Zhaotong, about 400 m elevation.', true from public.regions where code='530626'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Suijiang', 'Suijiang is in Zhaotong, about 400 m elevation.', true from public.regions where code='530626'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530626'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530627', 'zhaotong-zhenxiong', 'county', p.id, 27.4416, 104.873, 1680, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '镇雄县', '镇雄县隶属昭通市，海拔约1680米。', false from public.regions where code='530627'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Zhenxiong', 'Zhenxiong is in Zhaotong, about 1680 m elevation.', true from public.regions where code='530627'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '镇雄县', 'Zhenxiong is in Zhaotong, about 1680 m elevation.', true from public.regions where code='530627'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Zhenxiong', 'Zhenxiong is in Zhaotong, about 1680 m elevation.', true from public.regions where code='530627'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Zhenxiong', 'Zhenxiong is in Zhaotong, about 1680 m elevation.', true from public.regions where code='530627'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530627'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530628', 'zhaotong-yiliang-zt', 'county', p.id, 27.6254, 104.0485, 1100, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '彝良县', '彝良县隶属昭通市，海拔约1100米。', false from public.regions where code='530628'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yiliang (ZT)', 'Yiliang (ZT) is in Zhaotong, about 1100 m elevation.', true from public.regions where code='530628'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '彝良县', 'Yiliang (ZT) is in Zhaotong, about 1100 m elevation.', true from public.regions where code='530628'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yiliang (ZT)', 'Yiliang (ZT) is in Zhaotong, about 1100 m elevation.', true from public.regions where code='530628'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yiliang (ZT)', 'Yiliang (ZT) is in Zhaotong, about 1100 m elevation.', true from public.regions where code='530628'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530628'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530629', 'zhaotong-weixin', 'county', p.id, 27.8434, 105.048, 1180, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '威信县', '威信县隶属昭通市，海拔约1180米。', false from public.regions where code='530629'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Weixin', 'Weixin is in Zhaotong, about 1180 m elevation.', true from public.regions where code='530629'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '威信县', 'Weixin is in Zhaotong, about 1180 m elevation.', true from public.regions where code='530629'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Weixin', 'Weixin is in Zhaotong, about 1180 m elevation.', true from public.regions where code='530629'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Weixin', 'Weixin is in Zhaotong, about 1180 m elevation.', true from public.regions where code='530629'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530629'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530681', 'zhaotong-shuifu', 'county', p.id, 28.6299, 104.4159, 300, 'published', 60, false
from public.regions p where p.code = '530600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '水富市', '水富市隶属昭通市，海拔约300米。', false from public.regions where code='530681'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Shuifu', 'Shuifu is in Zhaotong, about 300 m elevation.', true from public.regions where code='530681'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '水富市', 'Shuifu is in Zhaotong, about 300 m elevation.', true from public.regions where code='530681'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Shuifu', 'Shuifu is in Zhaotong, about 300 m elevation.', true from public.regions where code='530681'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Shuifu', 'Shuifu is in Zhaotong, about 300 m elevation.', true from public.regions where code='530681'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530600'
join public.region_metrics m on m.region_id=p.id
where c.code='530681'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city lijiang
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530700', 'lijiang', 'city', p.id, 26.855, 100.227, 2418, 'published', 100, true
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '丽江市', '丽江市是云南重要地区，海拔约2418米。', '丽江粑粑、腊排骨火锅', '玉龙雪山、古城、泸沽湖', '旅居热门，文旅产业强，旺季较吵。', false from public.regions where code='530700'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Lijiang', 'Lijiang is a key prefecture-level area in Yunnan at about 2418 m elevation.', '丽江粑粑、腊排骨火锅', '玉龙雪山、古城、泸沽湖', '旅居热门，文旅产业强，旺季较吵。', true from public.regions where code='530700'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '丽江市', 'Lijiang is a key prefecture-level area in Yunnan at about 2418 m elevation.', true from public.regions where code='530700'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Lijiang', 'Lijiang is a key prefecture-level area in Yunnan at about 2418 m elevation.', true from public.regions where code='530700'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Lijiang', 'Lijiang is a key prefecture-level area in Yunnan at about 2418 m elevation.', true from public.regions where code='530700'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'plateau_monsoon', 55, 7.6, array[3,4,5,9,10], 'seed-m1' from public.regions where code='530700'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530702', 'lijiang-gucheng', 'county', p.id, 26.8772, 100.2259, 2410, 'published', 60, false
from public.regions p where p.code = '530700'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '古城区', '古城区隶属丽江市，海拔约2410米。', false from public.regions where code='530702'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Gucheng', 'Gucheng is in Lijiang, about 2410 m elevation.', true from public.regions where code='530702'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '古城区', 'Gucheng is in Lijiang, about 2410 m elevation.', true from public.regions where code='530702'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Gucheng', 'Gucheng is in Lijiang, about 2410 m elevation.', true from public.regions where code='530702'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Gucheng', 'Gucheng is in Lijiang, about 2410 m elevation.', true from public.regions where code='530702'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530700'
join public.region_metrics m on m.region_id=p.id
where c.code='530702'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530721', 'lijiang-yulong', 'county', p.id, 26.8212, 100.2369, 2400, 'published', 60, false
from public.regions p where p.code = '530700'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '玉龙纳西族自治县', '玉龙纳西族自治县隶属丽江市，海拔约2400米。', false from public.regions where code='530721'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yulong', 'Yulong is in Lijiang, about 2400 m elevation.', true from public.regions where code='530721'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '玉龙纳西族自治县', 'Yulong is in Lijiang, about 2400 m elevation.', true from public.regions where code='530721'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yulong', 'Yulong is in Lijiang, about 2400 m elevation.', true from public.regions where code='530721'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yulong', 'Yulong is in Lijiang, about 2400 m elevation.', true from public.regions where code='530721'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530700'
join public.region_metrics m on m.region_id=p.id
where c.code='530721'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530722', 'lijiang-yongsheng', 'county', p.id, 26.6842, 100.7508, 2140, 'published', 60, false
from public.regions p where p.code = '530700'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '永胜县', '永胜县隶属丽江市，海拔约2140米。', false from public.regions where code='530722'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yongsheng', 'Yongsheng is in Lijiang, about 2140 m elevation.', true from public.regions where code='530722'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '永胜县', 'Yongsheng is in Lijiang, about 2140 m elevation.', true from public.regions where code='530722'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yongsheng', 'Yongsheng is in Lijiang, about 2140 m elevation.', true from public.regions where code='530722'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yongsheng', 'Yongsheng is in Lijiang, about 2140 m elevation.', true from public.regions where code='530722'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530700'
join public.region_metrics m on m.region_id=p.id
where c.code='530722'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530723', 'lijiang-huaping', 'county', p.id, 26.6292, 101.2662, 1170, 'published', 60, false
from public.regions p where p.code = '530700'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '华坪县', '华坪县隶属丽江市，海拔约1170米。', false from public.regions where code='530723'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Huaping', 'Huaping is in Lijiang, about 1170 m elevation.', true from public.regions where code='530723'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '华坪县', 'Huaping is in Lijiang, about 1170 m elevation.', true from public.regions where code='530723'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Huaping', 'Huaping is in Lijiang, about 1170 m elevation.', true from public.regions where code='530723'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Huaping', 'Huaping is in Lijiang, about 1170 m elevation.', true from public.regions where code='530723'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530700'
join public.region_metrics m on m.region_id=p.id
where c.code='530723'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530724', 'lijiang-ninglang', 'county', p.id, 27.282, 100.852, 2680, 'published', 60, false
from public.regions p where p.code = '530700'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '宁蒗彝族自治县', '宁蒗彝族自治县隶属丽江市，海拔约2680米。', false from public.regions where code='530724'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Ninglang', 'Ninglang is in Lijiang, about 2680 m elevation.', true from public.regions where code='530724'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '宁蒗彝族自治县', 'Ninglang is in Lijiang, about 2680 m elevation.', true from public.regions where code='530724'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Ninglang', 'Ninglang is in Lijiang, about 2680 m elevation.', true from public.regions where code='530724'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Ninglang', 'Ninglang is in Lijiang, about 2680 m elevation.', true from public.regions where code='530724'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530700'
join public.region_metrics m on m.region_id=p.id
where c.code='530724'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city puer
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530800', 'puer', 'city', p.id, 22.7773, 100.9726, 1302, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '普洱市', '普洱市是云南重要地区，海拔约1302米。', '普洱茶、牛干巴', '茶山、墨江北回归线标志园', '茶产业突出，气候温润，节奏慢。', false from public.regions where code='530800'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Pu''er', 'Pu''er is a key prefecture-level area in Yunnan at about 1302 m elevation.', '普洱茶、牛干巴', '茶山、墨江北回归线标志园', '茶产业突出，气候温润，节奏慢。', true from public.regions where code='530800'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '普洱市', 'Pu''er is a key prefecture-level area in Yunnan at about 1302 m elevation.', true from public.regions where code='530800'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Pu''er', 'Pu''er is a key prefecture-level area in Yunnan at about 1302 m elevation.', true from public.regions where code='530800'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Pu''er', 'Pu''er is a key prefecture-level area in Yunnan at about 1302 m elevation.', true from public.regions where code='530800'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'subtropical_monsoon', 44, 6.9, array[11,12,1,2,3], 'seed-m1' from public.regions where code='530800'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530802', 'puer-simao', 'county', p.id, 22.7869, 100.9772, 1300, 'published', 60, false
from public.regions p where p.code = '530800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '思茅区', '思茅区隶属普洱市，海拔约1300米。', false from public.regions where code='530802'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Simao', 'Simao is in Pu''er, about 1300 m elevation.', true from public.regions where code='530802'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '思茅区', 'Simao is in Pu''er, about 1300 m elevation.', true from public.regions where code='530802'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Simao', 'Simao is in Pu''er, about 1300 m elevation.', true from public.regions where code='530802'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Simao', 'Simao is in Pu''er, about 1300 m elevation.', true from public.regions where code='530802'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530800'
join public.region_metrics m on m.region_id=p.id
where c.code='530802'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530821', 'puer-ninger', 'county', p.id, 23.0484, 101.0459, 1320, 'published', 60, false
from public.regions p where p.code = '530800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '宁洱哈尼族彝族自治县', '宁洱哈尼族彝族自治县隶属普洱市，海拔约1320米。', false from public.regions where code='530821'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Ning''er', 'Ning''er is in Pu''er, about 1320 m elevation.', true from public.regions where code='530821'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '宁洱哈尼族彝族自治县', 'Ning''er is in Pu''er, about 1320 m elevation.', true from public.regions where code='530821'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Ning''er', 'Ning''er is in Pu''er, about 1320 m elevation.', true from public.regions where code='530821'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Ning''er', 'Ning''er is in Pu''er, about 1320 m elevation.', true from public.regions where code='530821'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530800'
join public.region_metrics m on m.region_id=p.id
where c.code='530821'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530822', 'puer-mojiang', 'county', p.id, 23.4319, 101.6876, 1280, 'published', 60, false
from public.regions p where p.code = '530800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '墨江哈尼族自治县', '墨江哈尼族自治县隶属普洱市，海拔约1280米。', false from public.regions where code='530822'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Mojiang', 'Mojiang is in Pu''er, about 1280 m elevation.', true from public.regions where code='530822'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '墨江哈尼族自治县', 'Mojiang is in Pu''er, about 1280 m elevation.', true from public.regions where code='530822'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Mojiang', 'Mojiang is in Pu''er, about 1280 m elevation.', true from public.regions where code='530822'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Mojiang', 'Mojiang is in Pu''er, about 1280 m elevation.', true from public.regions where code='530822'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530800'
join public.region_metrics m on m.region_id=p.id
where c.code='530822'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530823', 'puer-jingdong', 'county', p.id, 24.4467, 100.84, 1160, 'published', 60, false
from public.regions p where p.code = '530800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '景东彝族自治县', '景东彝族自治县隶属普洱市，海拔约1160米。', false from public.regions where code='530823'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Jingdong', 'Jingdong is in Pu''er, about 1160 m elevation.', true from public.regions where code='530823'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '景东彝族自治县', 'Jingdong is in Pu''er, about 1160 m elevation.', true from public.regions where code='530823'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Jingdong', 'Jingdong is in Pu''er, about 1160 m elevation.', true from public.regions where code='530823'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Jingdong', 'Jingdong is in Pu''er, about 1160 m elevation.', true from public.regions where code='530823'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530800'
join public.region_metrics m on m.region_id=p.id
where c.code='530823'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530824', 'puer-jinggu', 'county', p.id, 23.5003, 100.7026, 920, 'published', 60, false
from public.regions p where p.code = '530800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '景谷傣族彝族自治县', '景谷傣族彝族自治县隶属普洱市，海拔约920米。', false from public.regions where code='530824'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Jinggu', 'Jinggu is in Pu''er, about 920 m elevation.', true from public.regions where code='530824'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '景谷傣族彝族自治县', 'Jinggu is in Pu''er, about 920 m elevation.', true from public.regions where code='530824'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Jinggu', 'Jinggu is in Pu''er, about 920 m elevation.', true from public.regions where code='530824'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Jinggu', 'Jinggu is in Pu''er, about 920 m elevation.', true from public.regions where code='530824'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530800'
join public.region_metrics m on m.region_id=p.id
where c.code='530824'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530825', 'puer-zhenyuan', 'county', p.id, 24.0044, 101.1085, 1100, 'published', 60, false
from public.regions p where p.code = '530800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '镇沅彝族哈尼族拉祜族自治县', '镇沅彝族哈尼族拉祜族自治县隶属普洱市，海拔约1100米。', false from public.regions where code='530825'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Zhenyuan', 'Zhenyuan is in Pu''er, about 1100 m elevation.', true from public.regions where code='530825'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '镇沅彝族哈尼族拉祜族自治县', 'Zhenyuan is in Pu''er, about 1100 m elevation.', true from public.regions where code='530825'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Zhenyuan', 'Zhenyuan is in Pu''er, about 1100 m elevation.', true from public.regions where code='530825'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Zhenyuan', 'Zhenyuan is in Pu''er, about 1100 m elevation.', true from public.regions where code='530825'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530800'
join public.region_metrics m on m.region_id=p.id
where c.code='530825'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530826', 'puer-jiangcheng', 'county', p.id, 22.5859, 101.8591, 1120, 'published', 60, false
from public.regions p where p.code = '530800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '江城哈尼族彝族自治县', '江城哈尼族彝族自治县隶属普洱市，海拔约1120米。', false from public.regions where code='530826'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Jiangcheng', 'Jiangcheng is in Pu''er, about 1120 m elevation.', true from public.regions where code='530826'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '江城哈尼族彝族自治县', 'Jiangcheng is in Pu''er, about 1120 m elevation.', true from public.regions where code='530826'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Jiangcheng', 'Jiangcheng is in Pu''er, about 1120 m elevation.', true from public.regions where code='530826'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Jiangcheng', 'Jiangcheng is in Pu''er, about 1120 m elevation.', true from public.regions where code='530826'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530800'
join public.region_metrics m on m.region_id=p.id
where c.code='530826'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530827', 'puer-menglian', 'county', p.id, 22.3291, 99.5842, 1000, 'published', 60, false
from public.regions p where p.code = '530800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '孟连傣族拉祜族佤族自治县', '孟连傣族拉祜族佤族自治县隶属普洱市，海拔约1000米。', false from public.regions where code='530827'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Menglian', 'Menglian is in Pu''er, about 1000 m elevation.', true from public.regions where code='530827'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '孟连傣族拉祜族佤族自治县', 'Menglian is in Pu''er, about 1000 m elevation.', true from public.regions where code='530827'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Menglian', 'Menglian is in Pu''er, about 1000 m elevation.', true from public.regions where code='530827'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Menglian', 'Menglian is in Pu''er, about 1000 m elevation.', true from public.regions where code='530827'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530800'
join public.region_metrics m on m.region_id=p.id
where c.code='530827'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530828', 'puer-lancang', 'county', p.id, 22.5559, 99.9312, 1050, 'published', 60, false
from public.regions p where p.code = '530800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '澜沧拉祜族自治县', '澜沧拉祜族自治县隶属普洱市，海拔约1050米。', false from public.regions where code='530828'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Lancang', 'Lancang is in Pu''er, about 1050 m elevation.', true from public.regions where code='530828'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '澜沧拉祜族自治县', 'Lancang is in Pu''er, about 1050 m elevation.', true from public.regions where code='530828'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Lancang', 'Lancang is in Pu''er, about 1050 m elevation.', true from public.regions where code='530828'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Lancang', 'Lancang is in Pu''er, about 1050 m elevation.', true from public.regions where code='530828'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530800'
join public.region_metrics m on m.region_id=p.id
where c.code='530828'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530829', 'puer-ximeng', 'county', p.id, 22.6442, 99.5901, 1200, 'published', 60, false
from public.regions p where p.code = '530800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '西盟佤族自治县', '西盟佤族自治县隶属普洱市，海拔约1200米。', false from public.regions where code='530829'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Ximeng', 'Ximeng is in Pu''er, about 1200 m elevation.', true from public.regions where code='530829'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '西盟佤族自治县', 'Ximeng is in Pu''er, about 1200 m elevation.', true from public.regions where code='530829'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Ximeng', 'Ximeng is in Pu''er, about 1200 m elevation.', true from public.regions where code='530829'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Ximeng', 'Ximeng is in Pu''er, about 1200 m elevation.', true from public.regions where code='530829'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530800'
join public.region_metrics m on m.region_id=p.id
where c.code='530829'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city lincang
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530900', 'lincang', 'city', p.id, 23.8866, 100.0869, 1502, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '临沧市', '临沧市是云南重要地区，海拔约1502米。', '滇红茶、坚果', '沧源崖画、边境风光', '边境城市，生态好，配套逐步提升。', false from public.regions where code='530900'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Lincang', 'Lincang is a key prefecture-level area in Yunnan at about 1502 m elevation.', '滇红茶、坚果', '沧源崖画、边境风光', '边境城市，生态好，配套逐步提升。', true from public.regions where code='530900'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '临沧市', 'Lincang is a key prefecture-level area in Yunnan at about 1502 m elevation.', true from public.regions where code='530900'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Lincang', 'Lincang is a key prefecture-level area in Yunnan at about 1502 m elevation.', true from public.regions where code='530900'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Lincang', 'Lincang is a key prefecture-level area in Yunnan at about 1502 m elevation.', true from public.regions where code='530900'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'subtropical_monsoon', 42, 6.4, array[11,12,1,2], 'seed-m1' from public.regions where code='530900'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530902', 'lincang-linxiang', 'county', p.id, 23.8951, 100.0821, 1500, 'published', 60, false
from public.regions p where p.code = '530900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '临翔区', '临翔区隶属临沧市，海拔约1500米。', false from public.regions where code='530902'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Linxiang', 'Linxiang is in Lincang, about 1500 m elevation.', true from public.regions where code='530902'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '临翔区', 'Linxiang is in Lincang, about 1500 m elevation.', true from public.regions where code='530902'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Linxiang', 'Linxiang is in Lincang, about 1500 m elevation.', true from public.regions where code='530902'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Linxiang', 'Linxiang is in Lincang, about 1500 m elevation.', true from public.regions where code='530902'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530900'
join public.region_metrics m on m.region_id=p.id
where c.code='530902'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530921', 'lincang-fengqing', 'county', p.id, 24.5803, 99.9284, 1570, 'published', 60, false
from public.regions p where p.code = '530900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '凤庆县', '凤庆县隶属临沧市，海拔约1570米。', false from public.regions where code='530921'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Fengqing', 'Fengqing is in Lincang, about 1570 m elevation.', true from public.regions where code='530921'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '凤庆县', 'Fengqing is in Lincang, about 1570 m elevation.', true from public.regions where code='530921'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Fengqing', 'Fengqing is in Lincang, about 1570 m elevation.', true from public.regions where code='530921'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Fengqing', 'Fengqing is in Lincang, about 1570 m elevation.', true from public.regions where code='530921'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530900'
join public.region_metrics m on m.region_id=p.id
where c.code='530921'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530922', 'lincang-yunxian', 'county', p.id, 24.4391, 100.1308, 1100, 'published', 60, false
from public.regions p where p.code = '530900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '云县', '云县隶属临沧市，海拔约1100米。', false from public.regions where code='530922'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yun County', 'Yun County is in Lincang, about 1100 m elevation.', true from public.regions where code='530922'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '云县', 'Yun County is in Lincang, about 1100 m elevation.', true from public.regions where code='530922'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yun County', 'Yun County is in Lincang, about 1100 m elevation.', true from public.regions where code='530922'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yun County', 'Yun County is in Lincang, about 1100 m elevation.', true from public.regions where code='530922'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530900'
join public.region_metrics m on m.region_id=p.id
where c.code='530922'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530923', 'lincang-yongde', 'county', p.id, 24.0282, 99.2537, 1600, 'published', 60, false
from public.regions p where p.code = '530900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '永德县', '永德县隶属临沧市，海拔约1600米。', false from public.regions where code='530923'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yongde', 'Yongde is in Lincang, about 1600 m elevation.', true from public.regions where code='530923'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '永德县', 'Yongde is in Lincang, about 1600 m elevation.', true from public.regions where code='530923'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yongde', 'Yongde is in Lincang, about 1600 m elevation.', true from public.regions where code='530923'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yongde', 'Yongde is in Lincang, about 1600 m elevation.', true from public.regions where code='530923'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530900'
join public.region_metrics m on m.region_id=p.id
where c.code='530923'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530924', 'lincang-zhenkang', 'county', p.id, 23.7625, 98.8253, 1020, 'published', 60, false
from public.regions p where p.code = '530900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '镇康县', '镇康县隶属临沧市，海拔约1020米。', false from public.regions where code='530924'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Zhenkang', 'Zhenkang is in Lincang, about 1020 m elevation.', true from public.regions where code='530924'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '镇康县', 'Zhenkang is in Lincang, about 1020 m elevation.', true from public.regions where code='530924'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Zhenkang', 'Zhenkang is in Lincang, about 1020 m elevation.', true from public.regions where code='530924'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Zhenkang', 'Zhenkang is in Lincang, about 1020 m elevation.', true from public.regions where code='530924'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530900'
join public.region_metrics m on m.region_id=p.id
where c.code='530924'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530925', 'lincang-shuangjiang', 'county', p.id, 23.4731, 99.8277, 1040, 'published', 60, false
from public.regions p where p.code = '530900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '双江拉祜族佤族布朗族傣族自治县', '双江拉祜族佤族布朗族傣族自治县隶属临沧市，海拔约1040米。', false from public.regions where code='530925'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Shuangjiang', 'Shuangjiang is in Lincang, about 1040 m elevation.', true from public.regions where code='530925'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '双江拉祜族佤族布朗族傣族自治县', 'Shuangjiang is in Lincang, about 1040 m elevation.', true from public.regions where code='530925'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Shuangjiang', 'Shuangjiang is in Lincang, about 1040 m elevation.', true from public.regions where code='530925'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Shuangjiang', 'Shuangjiang is in Lincang, about 1040 m elevation.', true from public.regions where code='530925'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530900'
join public.region_metrics m on m.region_id=p.id
where c.code='530925'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530926', 'lincang-gengma', 'county', p.id, 23.5378, 99.3971, 1100, 'published', 60, false
from public.regions p where p.code = '530900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '耿马傣族佤族自治县', '耿马傣族佤族自治县隶属临沧市，海拔约1100米。', false from public.regions where code='530926'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Gengma', 'Gengma is in Lincang, about 1100 m elevation.', true from public.regions where code='530926'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '耿马傣族佤族自治县', 'Gengma is in Lincang, about 1100 m elevation.', true from public.regions where code='530926'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Gengma', 'Gengma is in Lincang, about 1100 m elevation.', true from public.regions where code='530926'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Gengma', 'Gengma is in Lincang, about 1100 m elevation.', true from public.regions where code='530926'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530900'
join public.region_metrics m on m.region_id=p.id
where c.code='530926'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '530927', 'lincang-cangyuan', 'county', p.id, 23.1469, 99.246, 1270, 'published', 60, false
from public.regions p where p.code = '530900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '沧源佤族自治县', '沧源佤族自治县隶属临沧市，海拔约1270米。', false from public.regions where code='530927'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Cangyuan', 'Cangyuan is in Lincang, about 1270 m elevation.', true from public.regions where code='530927'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '沧源佤族自治县', 'Cangyuan is in Lincang, about 1270 m elevation.', true from public.regions where code='530927'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Cangyuan', 'Cangyuan is in Lincang, about 1270 m elevation.', true from public.regions where code='530927'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Cangyuan', 'Cangyuan is in Lincang, about 1270 m elevation.', true from public.regions where code='530927'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='530900'
join public.region_metrics m on m.region_id=p.id
where c.code='530927'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city chuxiong
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532300', 'chuxiong', 'city', p.id, 25.0419, 101.546, 1773, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '楚雄彝族自治州', '楚雄彝族自治州是云南重要地区，海拔约1773米。', '彝族菜、野生菌', '世界恐龙谷、紫溪山', '滇中节点城市，生活节奏适中。', false from public.regions where code='532300'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Chuxiong', 'Chuxiong is a key prefecture-level area in Yunnan at about 1773 m elevation.', '彝族菜、野生菌', '世界恐龙谷、紫溪山', '滇中节点城市，生活节奏适中。', true from public.regions where code='532300'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '楚雄彝族自治州', 'Chuxiong is a key prefecture-level area in Yunnan at about 1773 m elevation.', true from public.regions where code='532300'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Chuxiong', 'Chuxiong is a key prefecture-level area in Yunnan at about 1773 m elevation.', true from public.regions where code='532300'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Chuxiong', 'Chuxiong is a key prefecture-level area in Yunnan at about 1773 m elevation.', true from public.regions where code='532300'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'subtropical_plateau', 46, 6.7, array[3,4,10,11], 'seed-m1' from public.regions where code='532300'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532301', 'chuxiong-city', 'county', p.id, 25.0329, 101.5459, 1770, 'published', 60, false
from public.regions p where p.code = '532300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '楚雄市', '楚雄市隶属楚雄彝族自治州，海拔约1770米。', false from public.regions where code='532301'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Chuxiong City', 'Chuxiong City is in Chuxiong, about 1770 m elevation.', true from public.regions where code='532301'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '楚雄市', 'Chuxiong City is in Chuxiong, about 1770 m elevation.', true from public.regions where code='532301'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Chuxiong City', 'Chuxiong City is in Chuxiong, about 1770 m elevation.', true from public.regions where code='532301'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Chuxiong City', 'Chuxiong City is in Chuxiong, about 1770 m elevation.', true from public.regions where code='532301'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532300'
join public.region_metrics m on m.region_id=p.id
where c.code='532301'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532302', 'chuxiong-lufeng', 'county', p.id, 25.1481, 102.0756, 1560, 'published', 60, false
from public.regions p where p.code = '532300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '禄丰市', '禄丰市隶属楚雄彝族自治州，海拔约1560米。', false from public.regions where code='532302'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Lufeng', 'Lufeng is in Chuxiong, about 1560 m elevation.', true from public.regions where code='532302'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '禄丰市', 'Lufeng is in Chuxiong, about 1560 m elevation.', true from public.regions where code='532302'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Lufeng', 'Lufeng is in Chuxiong, about 1560 m elevation.', true from public.regions where code='532302'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Lufeng', 'Lufeng is in Chuxiong, about 1560 m elevation.', true from public.regions where code='532302'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532300'
join public.region_metrics m on m.region_id=p.id
where c.code='532302'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532322', 'chuxiong-shuangbai', 'county', p.id, 24.6889, 101.6419, 1970, 'published', 60, false
from public.regions p where p.code = '532300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '双柏县', '双柏县隶属楚雄彝族自治州，海拔约1970米。', false from public.regions where code='532322'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Shuangbai', 'Shuangbai is in Chuxiong, about 1970 m elevation.', true from public.regions where code='532322'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '双柏县', 'Shuangbai is in Chuxiong, about 1970 m elevation.', true from public.regions where code='532322'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Shuangbai', 'Shuangbai is in Chuxiong, about 1970 m elevation.', true from public.regions where code='532322'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Shuangbai', 'Shuangbai is in Chuxiong, about 1970 m elevation.', true from public.regions where code='532322'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532300'
join public.region_metrics m on m.region_id=p.id
where c.code='532322'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532323', 'chuxiong-mouding', 'county', p.id, 25.3131, 101.543, 1760, 'published', 60, false
from public.regions p where p.code = '532300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '牟定县', '牟定县隶属楚雄彝族自治州，海拔约1760米。', false from public.regions where code='532323'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Mouding', 'Mouding is in Chuxiong, about 1760 m elevation.', true from public.regions where code='532323'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '牟定县', 'Mouding is in Chuxiong, about 1760 m elevation.', true from public.regions where code='532323'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Mouding', 'Mouding is in Chuxiong, about 1760 m elevation.', true from public.regions where code='532323'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Mouding', 'Mouding is in Chuxiong, about 1760 m elevation.', true from public.regions where code='532323'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532300'
join public.region_metrics m on m.region_id=p.id
where c.code='532323'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532324', 'chuxiong-nanhua', 'county', p.id, 25.1923, 101.2746, 1860, 'published', 60, false
from public.regions p where p.code = '532300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '南华县', '南华县隶属楚雄彝族自治州，海拔约1860米。', false from public.regions where code='532324'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Nanhua', 'Nanhua is in Chuxiong, about 1860 m elevation.', true from public.regions where code='532324'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '南华县', 'Nanhua is in Chuxiong, about 1860 m elevation.', true from public.regions where code='532324'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Nanhua', 'Nanhua is in Chuxiong, about 1860 m elevation.', true from public.regions where code='532324'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Nanhua', 'Nanhua is in Chuxiong, about 1860 m elevation.', true from public.regions where code='532324'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532300'
join public.region_metrics m on m.region_id=p.id
where c.code='532324'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532325', 'chuxiong-yaoan', 'county', p.id, 25.5042, 101.2417, 1870, 'published', 60, false
from public.regions p where p.code = '532300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '姚安县', '姚安县隶属楚雄彝族自治州，海拔约1870米。', false from public.regions where code='532325'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yao''an', 'Yao''an is in Chuxiong, about 1870 m elevation.', true from public.regions where code='532325'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '姚安县', 'Yao''an is in Chuxiong, about 1870 m elevation.', true from public.regions where code='532325'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yao''an', 'Yao''an is in Chuxiong, about 1870 m elevation.', true from public.regions where code='532325'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yao''an', 'Yao''an is in Chuxiong, about 1870 m elevation.', true from public.regions where code='532325'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532300'
join public.region_metrics m on m.region_id=p.id
where c.code='532325'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532326', 'chuxiong-dayao', 'county', p.id, 25.7211, 101.3366, 1860, 'published', 60, false
from public.regions p where p.code = '532300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '大姚县', '大姚县隶属楚雄彝族自治州，海拔约1860米。', false from public.regions where code='532326'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Dayao', 'Dayao is in Chuxiong, about 1860 m elevation.', true from public.regions where code='532326'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '大姚县', 'Dayao is in Chuxiong, about 1860 m elevation.', true from public.regions where code='532326'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Dayao', 'Dayao is in Chuxiong, about 1860 m elevation.', true from public.regions where code='532326'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Dayao', 'Dayao is in Chuxiong, about 1860 m elevation.', true from public.regions where code='532326'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532300'
join public.region_metrics m on m.region_id=p.id
where c.code='532326'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532327', 'chuxiong-yongren', 'county', p.id, 26.0562, 101.6669, 1540, 'published', 60, false
from public.regions p where p.code = '532300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '永仁县', '永仁县隶属楚雄彝族自治州，海拔约1540米。', false from public.regions where code='532327'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yongren', 'Yongren is in Chuxiong, about 1540 m elevation.', true from public.regions where code='532327'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '永仁县', 'Yongren is in Chuxiong, about 1540 m elevation.', true from public.regions where code='532327'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yongren', 'Yongren is in Chuxiong, about 1540 m elevation.', true from public.regions where code='532327'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yongren', 'Yongren is in Chuxiong, about 1540 m elevation.', true from public.regions where code='532327'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532300'
join public.region_metrics m on m.region_id=p.id
where c.code='532327'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532328', 'chuxiong-yuanmou', 'county', p.id, 25.7044, 101.8708, 1120, 'published', 60, false
from public.regions p where p.code = '532300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '元谋县', '元谋县隶属楚雄彝族自治州，海拔约1120米。', false from public.regions where code='532328'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yuanmou', 'Yuanmou is in Chuxiong, about 1120 m elevation.', true from public.regions where code='532328'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '元谋县', 'Yuanmou is in Chuxiong, about 1120 m elevation.', true from public.regions where code='532328'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yuanmou', 'Yuanmou is in Chuxiong, about 1120 m elevation.', true from public.regions where code='532328'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yuanmou', 'Yuanmou is in Chuxiong, about 1120 m elevation.', true from public.regions where code='532328'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532300'
join public.region_metrics m on m.region_id=p.id
where c.code='532328'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532329', 'chuxiong-wuding', 'county', p.id, 25.5303, 102.4039, 1720, 'published', 60, false
from public.regions p where p.code = '532300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '武定县', '武定县隶属楚雄彝族自治州，海拔约1720米。', false from public.regions where code='532329'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Wuding', 'Wuding is in Chuxiong, about 1720 m elevation.', true from public.regions where code='532329'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '武定县', 'Wuding is in Chuxiong, about 1720 m elevation.', true from public.regions where code='532329'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Wuding', 'Wuding is in Chuxiong, about 1720 m elevation.', true from public.regions where code='532329'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Wuding', 'Wuding is in Chuxiong, about 1720 m elevation.', true from public.regions where code='532329'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532300'
join public.region_metrics m on m.region_id=p.id
where c.code='532329'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city honghe
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532500', 'honghe', 'city', p.id, 23.3631, 103.3756, 1307, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '红河哈尼族彝族自治州', '红河哈尼族彝族自治州是云南重要地区，海拔约1307米。', '过桥米线发源地之一、建水烧烤', '元阳梯田、建水古城', '文旅与边贸并存，南部湿热北部温和。', false from public.regions where code='532500'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Honghe', 'Honghe is a key prefecture-level area in Yunnan at about 1307 m elevation.', '过桥米线发源地之一、建水烧烤', '元阳梯田、建水古城', '文旅与边贸并存，南部湿热北部温和。', true from public.regions where code='532500'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '红河哈尼族彝族自治州', 'Honghe is a key prefecture-level area in Yunnan at about 1307 m elevation.', true from public.regions where code='532500'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Honghe', 'Honghe is a key prefecture-level area in Yunnan at about 1307 m elevation.', true from public.regions where code='532500'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Honghe', 'Honghe is a key prefecture-level area in Yunnan at about 1307 m elevation.', true from public.regions where code='532500'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'subtropical_monsoon', 47, 7.1, array[10,11,12,1,2,3], 'seed-m1' from public.regions where code='532500'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532501', 'honghe-gejiu', 'county', p.id, 23.3591, 103.16, 1680, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '个旧市', '个旧市隶属红河哈尼族彝族自治州，海拔约1680米。', false from public.regions where code='532501'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Gejiu', 'Gejiu is in Honghe, about 1680 m elevation.', true from public.regions where code='532501'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '个旧市', 'Gejiu is in Honghe, about 1680 m elevation.', true from public.regions where code='532501'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Gejiu', 'Gejiu is in Honghe, about 1680 m elevation.', true from public.regions where code='532501'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Gejiu', 'Gejiu is in Honghe, about 1680 m elevation.', true from public.regions where code='532501'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532501'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532502', 'honghe-kaiyuan', 'county', p.id, 23.7133, 103.2666, 1050, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '开远市', '开远市隶属红河哈尼族彝族自治州，海拔约1050米。', false from public.regions where code='532502'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Kaiyuan', 'Kaiyuan is in Honghe, about 1050 m elevation.', true from public.regions where code='532502'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '开远市', 'Kaiyuan is in Honghe, about 1050 m elevation.', true from public.regions where code='532502'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Kaiyuan', 'Kaiyuan is in Honghe, about 1050 m elevation.', true from public.regions where code='532502'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Kaiyuan', 'Kaiyuan is in Honghe, about 1050 m elevation.', true from public.regions where code='532502'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532502'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532503', 'honghe-mengzi', 'county', p.id, 23.3962, 103.3649, 1300, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '蒙自市', '蒙自市隶属红河哈尼族彝族自治州，海拔约1300米。', false from public.regions where code='532503'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Mengzi', 'Mengzi is in Honghe, about 1300 m elevation.', true from public.regions where code='532503'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '蒙自市', 'Mengzi is in Honghe, about 1300 m elevation.', true from public.regions where code='532503'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Mengzi', 'Mengzi is in Honghe, about 1300 m elevation.', true from public.regions where code='532503'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Mengzi', 'Mengzi is in Honghe, about 1300 m elevation.', true from public.regions where code='532503'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532503'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532504', 'honghe-mile', 'county', p.id, 24.4107, 103.4145, 1430, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '弥勒市', '弥勒市隶属红河哈尼族彝族自治州，海拔约1430米。', false from public.regions where code='532504'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Mile', 'Mile is in Honghe, about 1430 m elevation.', true from public.regions where code='532504'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '弥勒市', 'Mile is in Honghe, about 1430 m elevation.', true from public.regions where code='532504'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Mile', 'Mile is in Honghe, about 1430 m elevation.', true from public.regions where code='532504'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Mile', 'Mile is in Honghe, about 1430 m elevation.', true from public.regions where code='532504'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532504'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532523', 'honghe-pingbian', 'county', p.id, 22.987, 103.687, 1410, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '屏边苗族自治县', '屏边苗族自治县隶属红河哈尼族彝族自治州，海拔约1410米。', false from public.regions where code='532523'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Pingbian', 'Pingbian is in Honghe, about 1410 m elevation.', true from public.regions where code='532523'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '屏边苗族自治县', 'Pingbian is in Honghe, about 1410 m elevation.', true from public.regions where code='532523'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Pingbian', 'Pingbian is in Honghe, about 1410 m elevation.', true from public.regions where code='532523'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Pingbian', 'Pingbian is in Honghe, about 1410 m elevation.', true from public.regions where code='532523'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532523'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532524', 'honghe-jianshui', 'county', p.id, 23.6347, 102.8266, 1320, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '建水县', '建水县隶属红河哈尼族彝族自治州，海拔约1320米。', false from public.regions where code='532524'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Jianshui', 'Jianshui is in Honghe, about 1320 m elevation.', true from public.regions where code='532524'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '建水县', 'Jianshui is in Honghe, about 1320 m elevation.', true from public.regions where code='532524'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Jianshui', 'Jianshui is in Honghe, about 1320 m elevation.', true from public.regions where code='532524'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Jianshui', 'Jianshui is in Honghe, about 1320 m elevation.', true from public.regions where code='532524'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532524'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532525', 'honghe-shiping', 'county', p.id, 23.7059, 102.4945, 1420, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '石屏县', '石屏县隶属红河哈尼族彝族自治州，海拔约1420米。', false from public.regions where code='532525'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Shiping', 'Shiping is in Honghe, about 1420 m elevation.', true from public.regions where code='532525'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '石屏县', 'Shiping is in Honghe, about 1420 m elevation.', true from public.regions where code='532525'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Shiping', 'Shiping is in Honghe, about 1420 m elevation.', true from public.regions where code='532525'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Shiping', 'Shiping is in Honghe, about 1420 m elevation.', true from public.regions where code='532525'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532525'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532527', 'honghe-luxi', 'county', p.id, 24.532, 103.7662, 1700, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '泸西县', '泸西县隶属红河哈尼族彝族自治州，海拔约1700米。', false from public.regions where code='532527'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Luxi', 'Luxi is in Honghe, about 1700 m elevation.', true from public.regions where code='532527'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '泸西县', 'Luxi is in Honghe, about 1700 m elevation.', true from public.regions where code='532527'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Luxi', 'Luxi is in Honghe, about 1700 m elevation.', true from public.regions where code='532527'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Luxi', 'Luxi is in Honghe, about 1700 m elevation.', true from public.regions where code='532527'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532527'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532528', 'honghe-yuanyang', 'county', p.id, 23.2197, 102.8352, 1540, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '元阳县', '元阳县隶属红河哈尼族彝族自治州，海拔约1540米。', false from public.regions where code='532528'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yuanyang', 'Yuanyang is in Honghe, about 1540 m elevation.', true from public.regions where code='532528'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '元阳县', 'Yuanyang is in Honghe, about 1540 m elevation.', true from public.regions where code='532528'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yuanyang', 'Yuanyang is in Honghe, about 1540 m elevation.', true from public.regions where code='532528'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yuanyang', 'Yuanyang is in Honghe, about 1540 m elevation.', true from public.regions where code='532528'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532528'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532529', 'honghe-honghe-county', 'county', p.id, 23.369, 102.4206, 1100, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '红河县', '红河县隶属红河哈尼族彝族自治州，海拔约1100米。', false from public.regions where code='532529'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Honghe County', 'Honghe County is in Honghe, about 1100 m elevation.', true from public.regions where code='532529'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '红河县', 'Honghe County is in Honghe, about 1100 m elevation.', true from public.regions where code='532529'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Honghe County', 'Honghe County is in Honghe, about 1100 m elevation.', true from public.regions where code='532529'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Honghe County', 'Honghe County is in Honghe, about 1100 m elevation.', true from public.regions where code='532529'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532529'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532530', 'honghe-jinping', 'county', p.id, 22.7795, 103.2264, 1260, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '金平苗族瑶族傣族自治县', '金平苗族瑶族傣族自治县隶属红河哈尼族彝族自治州，海拔约1260米。', false from public.regions where code='532530'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Jinping', 'Jinping is in Honghe, about 1260 m elevation.', true from public.regions where code='532530'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '金平苗族瑶族傣族自治县', 'Jinping is in Honghe, about 1260 m elevation.', true from public.regions where code='532530'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Jinping', 'Jinping is in Honghe, about 1260 m elevation.', true from public.regions where code='532530'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Jinping', 'Jinping is in Honghe, about 1260 m elevation.', true from public.regions where code='532530'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532530'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532531', 'honghe-lvchun', 'county', p.id, 22.9937, 102.3929, 1640, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '绿春县', '绿春县隶属红河哈尼族彝族自治州，海拔约1640米。', false from public.regions where code='532531'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Lvchun', 'Lvchun is in Honghe, about 1640 m elevation.', true from public.regions where code='532531'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '绿春县', 'Lvchun is in Honghe, about 1640 m elevation.', true from public.regions where code='532531'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Lvchun', 'Lvchun is in Honghe, about 1640 m elevation.', true from public.regions where code='532531'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Lvchun', 'Lvchun is in Honghe, about 1640 m elevation.', true from public.regions where code='532531'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532531'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532532', 'honghe-hekou', 'county', p.id, 22.5293, 103.9393, 100, 'published', 60, false
from public.regions p where p.code = '532500'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '河口瑶族自治县', '河口瑶族自治县隶属红河哈尼族彝族自治州，海拔约100米。', false from public.regions where code='532532'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Hekou', 'Hekou is in Honghe, about 100 m elevation.', true from public.regions where code='532532'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '河口瑶族自治县', 'Hekou is in Honghe, about 100 m elevation.', true from public.regions where code='532532'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Hekou', 'Hekou is in Honghe, about 100 m elevation.', true from public.regions where code='532532'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Hekou', 'Hekou is in Honghe, about 100 m elevation.', true from public.regions where code='532532'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532500'
join public.region_metrics m on m.region_id=p.id
where c.code='532532'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city wenshan
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532600', 'wenshan', 'city', p.id, 23.3695, 104.244, 1260, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '文山壮族苗族自治州', '文山壮族苗族自治州是云南重要地区，海拔约1260米。', '三七、酸汤鸡', '普者黑、坝美', '滇东南，喀斯特景观多，旅居潜力上升。', false from public.regions where code='532600'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Wenshan', 'Wenshan is a key prefecture-level area in Yunnan at about 1260 m elevation.', '三七、酸汤鸡', '普者黑、坝美', '滇东南，喀斯特景观多，旅居潜力上升。', true from public.regions where code='532600'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '文山壮族苗族自治州', 'Wenshan is a key prefecture-level area in Yunnan at about 1260 m elevation.', true from public.regions where code='532600'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Wenshan', 'Wenshan is a key prefecture-level area in Yunnan at about 1260 m elevation.', true from public.regions where code='532600'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Wenshan', 'Wenshan is a key prefecture-level area in Yunnan at about 1260 m elevation.', true from public.regions where code='532600'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'subtropical_monsoon', 43, 6.5, array[10,11,12,1,2,3], 'seed-m1' from public.regions where code='532600'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532601', 'wenshan-city', 'county', p.id, 23.3865, 104.2447, 1260, 'published', 60, false
from public.regions p where p.code = '532600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '文山市', '文山市隶属文山壮族苗族自治州，海拔约1260米。', false from public.regions where code='532601'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Wenshan City', 'Wenshan City is in Wenshan, about 1260 m elevation.', true from public.regions where code='532601'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '文山市', 'Wenshan City is in Wenshan, about 1260 m elevation.', true from public.regions where code='532601'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Wenshan City', 'Wenshan City is in Wenshan, about 1260 m elevation.', true from public.regions where code='532601'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Wenshan City', 'Wenshan City is in Wenshan, about 1260 m elevation.', true from public.regions where code='532601'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532600'
join public.region_metrics m on m.region_id=p.id
where c.code='532601'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532622', 'wenshan-yanshan', 'county', p.id, 23.6058, 104.3371, 1540, 'published', 60, false
from public.regions p where p.code = '532600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '砚山县', '砚山县隶属文山壮族苗族自治州，海拔约1540米。', false from public.regions where code='532622'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yanshan', 'Yanshan is in Wenshan, about 1540 m elevation.', true from public.regions where code='532622'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '砚山县', 'Yanshan is in Wenshan, about 1540 m elevation.', true from public.regions where code='532622'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yanshan', 'Yanshan is in Wenshan, about 1540 m elevation.', true from public.regions where code='532622'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yanshan', 'Yanshan is in Wenshan, about 1540 m elevation.', true from public.regions where code='532622'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532600'
join public.region_metrics m on m.region_id=p.id
where c.code='532622'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532623', 'wenshan-xichou', 'county', p.id, 23.4378, 104.6726, 1450, 'published', 60, false
from public.regions p where p.code = '532600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '西畴县', '西畴县隶属文山壮族苗族自治州，海拔约1450米。', false from public.regions where code='532623'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Xichou', 'Xichou is in Wenshan, about 1450 m elevation.', true from public.regions where code='532623'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '西畴县', 'Xichou is in Wenshan, about 1450 m elevation.', true from public.regions where code='532623'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Xichou', 'Xichou is in Wenshan, about 1450 m elevation.', true from public.regions where code='532623'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Xichou', 'Xichou is in Wenshan, about 1450 m elevation.', true from public.regions where code='532623'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532600'
join public.region_metrics m on m.region_id=p.id
where c.code='532623'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532624', 'wenshan-malipo', 'county', p.id, 23.1247, 104.7027, 1100, 'published', 60, false
from public.regions p where p.code = '532600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '麻栗坡县', '麻栗坡县隶属文山壮族苗族自治州，海拔约1100米。', false from public.regions where code='532624'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Malipo', 'Malipo is in Wenshan, about 1100 m elevation.', true from public.regions where code='532624'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '麻栗坡县', 'Malipo is in Wenshan, about 1100 m elevation.', true from public.regions where code='532624'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Malipo', 'Malipo is in Wenshan, about 1100 m elevation.', true from public.regions where code='532624'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Malipo', 'Malipo is in Wenshan, about 1100 m elevation.', true from public.regions where code='532624'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532600'
join public.region_metrics m on m.region_id=p.id
where c.code='532624'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532625', 'wenshan-maguan', 'county', p.id, 23.0129, 104.3941, 1330, 'published', 60, false
from public.regions p where p.code = '532600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '马关县', '马关县隶属文山壮族苗族自治州，海拔约1330米。', false from public.regions where code='532625'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Maguan', 'Maguan is in Wenshan, about 1330 m elevation.', true from public.regions where code='532625'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '马关县', 'Maguan is in Wenshan, about 1330 m elevation.', true from public.regions where code='532625'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Maguan', 'Maguan is in Wenshan, about 1330 m elevation.', true from public.regions where code='532625'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Maguan', 'Maguan is in Wenshan, about 1330 m elevation.', true from public.regions where code='532625'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532600'
join public.region_metrics m on m.region_id=p.id
where c.code='532625'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532626', 'wenshan-qiubei', 'county', p.id, 24.0409, 104.1944, 1450, 'published', 60, false
from public.regions p where p.code = '532600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '丘北县', '丘北县隶属文山壮族苗族自治州，海拔约1450米。', false from public.regions where code='532626'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Qiubei', 'Qiubei is in Wenshan, about 1450 m elevation.', true from public.regions where code='532626'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '丘北县', 'Qiubei is in Wenshan, about 1450 m elevation.', true from public.regions where code='532626'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Qiubei', 'Qiubei is in Wenshan, about 1450 m elevation.', true from public.regions where code='532626'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Qiubei', 'Qiubei is in Wenshan, about 1450 m elevation.', true from public.regions where code='532626'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532600'
join public.region_metrics m on m.region_id=p.id
where c.code='532626'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532627', 'wenshan-guangnan', 'county', p.id, 24.0464, 105.0551, 1250, 'published', 60, false
from public.regions p where p.code = '532600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '广南县', '广南县隶属文山壮族苗族自治州，海拔约1250米。', false from public.regions where code='532627'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Guangnan', 'Guangnan is in Wenshan, about 1250 m elevation.', true from public.regions where code='532627'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '广南县', 'Guangnan is in Wenshan, about 1250 m elevation.', true from public.regions where code='532627'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Guangnan', 'Guangnan is in Wenshan, about 1250 m elevation.', true from public.regions where code='532627'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Guangnan', 'Guangnan is in Wenshan, about 1250 m elevation.', true from public.regions where code='532627'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532600'
join public.region_metrics m on m.region_id=p.id
where c.code='532627'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532628', 'wenshan-funing', 'county', p.id, 23.6253, 105.6309, 680, 'published', 60, false
from public.regions p where p.code = '532600'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '富宁县', '富宁县隶属文山壮族苗族自治州，海拔约680米。', false from public.regions where code='532628'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Funing', 'Funing is in Wenshan, about 680 m elevation.', true from public.regions where code='532628'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '富宁县', 'Funing is in Wenshan, about 680 m elevation.', true from public.regions where code='532628'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Funing', 'Funing is in Wenshan, about 680 m elevation.', true from public.regions where code='532628'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Funing', 'Funing is in Wenshan, about 680 m elevation.', true from public.regions where code='532628'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532600'
join public.region_metrics m on m.region_id=p.id
where c.code='532628'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city xishuangbanna
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532800', 'xishuangbanna', 'city', p.id, 22.0017, 100.7979, 552, 'published', 100, true
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '西双版纳傣族自治州', '西双版纳傣族自治州是云南重要地区，海拔约552米。', '傣味、菠萝饭、烧烤', '热带雨林、勐泐大佛寺', '冬季避寒热门，潮湿炎热需适应。', false from public.regions where code='532800'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Xishuangbanna', 'Xishuangbanna is a key prefecture-level area in Yunnan at about 552 m elevation.', '傣味、菠萝饭、烧烤', '热带雨林、勐泐大佛寺', '冬季避寒热门，潮湿炎热需适应。', true from public.regions where code='532800'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '西双版纳傣族自治州', 'Xishuangbanna is a key prefecture-level area in Yunnan at about 552 m elevation.', true from public.regions where code='532800'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Xishuangbanna', 'Xishuangbanna is a key prefecture-level area in Yunnan at about 552 m elevation.', true from public.regions where code='532800'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Xishuangbanna', 'Xishuangbanna is a key prefecture-level area in Yunnan at about 552 m elevation.', true from public.regions where code='532800'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'tropical_monsoon', 52, 7.4, array[11,12,1,2,3], 'seed-m1' from public.regions where code='532800'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532801', 'xishuangbanna-jinghong', 'county', p.id, 22, 100.7717, 550, 'published', 60, false
from public.regions p where p.code = '532800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '景洪市', '景洪市隶属西双版纳傣族自治州，海拔约550米。', false from public.regions where code='532801'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Jinghong', 'Jinghong is in Xishuangbanna, about 550 m elevation.', true from public.regions where code='532801'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '景洪市', 'Jinghong is in Xishuangbanna, about 550 m elevation.', true from public.regions where code='532801'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Jinghong', 'Jinghong is in Xishuangbanna, about 550 m elevation.', true from public.regions where code='532801'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Jinghong', 'Jinghong is in Xishuangbanna, about 550 m elevation.', true from public.regions where code='532801'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532800'
join public.region_metrics m on m.region_id=p.id
where c.code='532801'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532822', 'xishuangbanna-menghai', 'county', p.id, 21.9573, 100.4525, 1170, 'published', 60, false
from public.regions p where p.code = '532800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '勐海县', '勐海县隶属西双版纳傣族自治州，海拔约1170米。', false from public.regions where code='532822'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Menghai', 'Menghai is in Xishuangbanna, about 1170 m elevation.', true from public.regions where code='532822'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '勐海县', 'Menghai is in Xishuangbanna, about 1170 m elevation.', true from public.regions where code='532822'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Menghai', 'Menghai is in Xishuangbanna, about 1170 m elevation.', true from public.regions where code='532822'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Menghai', 'Menghai is in Xishuangbanna, about 1170 m elevation.', true from public.regions where code='532822'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532800'
join public.region_metrics m on m.region_id=p.id
where c.code='532822'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532823', 'xishuangbanna-mengla', 'county', p.id, 21.4794, 101.5646, 640, 'published', 60, false
from public.regions p where p.code = '532800'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '勐腊县', '勐腊县隶属西双版纳傣族自治州，海拔约640米。', false from public.regions where code='532823'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Mengla', 'Mengla is in Xishuangbanna, about 640 m elevation.', true from public.regions where code='532823'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '勐腊县', 'Mengla is in Xishuangbanna, about 640 m elevation.', true from public.regions where code='532823'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Mengla', 'Mengla is in Xishuangbanna, about 640 m elevation.', true from public.regions where code='532823'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Mengla', 'Mengla is in Xishuangbanna, about 640 m elevation.', true from public.regions where code='532823'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532800'
join public.region_metrics m on m.region_id=p.id
where c.code='532823'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city dali
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532900', 'dali', 'city', p.id, 25.6065, 100.2676, 1976, 'published', 100, true
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '大理白族自治州', '大理白族自治州是云南重要地区，海拔约1976米。', '乳扇、酸辣鱼、白族三道茶', '苍山洱海、古城', '数字游民与旅居者集中，配套成熟。', false from public.regions where code='532900'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Dali', 'Dali is a key prefecture-level area in Yunnan at about 1976 m elevation.', '乳扇、酸辣鱼、白族三道茶', '苍山洱海、古城', '数字游民与旅居者集中，配套成熟。', true from public.regions where code='532900'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '大理白族自治州', 'Dali is a key prefecture-level area in Yunnan at about 1976 m elevation.', true from public.regions where code='532900'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Dali', 'Dali is a key prefecture-level area in Yunnan at about 1976 m elevation.', true from public.regions where code='532900'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Dali', 'Dali is a key prefecture-level area in Yunnan at about 1976 m elevation.', true from public.regions where code='532900'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'plateau_monsoon', 54, 8, array[3,4,5,9,10], 'seed-m1' from public.regions where code='532900'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532901', 'dali-city', 'county', p.id, 25.5916, 100.2299, 1976, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '大理市', '大理市隶属大理白族自治州，海拔约1976米。', false from public.regions where code='532901'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Dali City', 'Dali City is in Dali, about 1976 m elevation.', true from public.regions where code='532901'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '大理市', 'Dali City is in Dali, about 1976 m elevation.', true from public.regions where code='532901'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Dali City', 'Dali City is in Dali, about 1976 m elevation.', true from public.regions where code='532901'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Dali City', 'Dali City is in Dali, about 1976 m elevation.', true from public.regions where code='532901'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532901'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532922', 'dali-yangbi', 'county', p.id, 25.67, 99.958, 1560, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '漾濞彝族自治县', '漾濞彝族自治县隶属大理白族自治州，海拔约1560米。', false from public.regions where code='532922'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yangbi', 'Yangbi is in Dali, about 1560 m elevation.', true from public.regions where code='532922'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '漾濞彝族自治县', 'Yangbi is in Dali, about 1560 m elevation.', true from public.regions where code='532922'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yangbi', 'Yangbi is in Dali, about 1560 m elevation.', true from public.regions where code='532922'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yangbi', 'Yangbi is in Dali, about 1560 m elevation.', true from public.regions where code='532922'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532922'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532923', 'dali-xiangyun', 'county', p.id, 25.4838, 100.5509, 2000, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '祥云县', '祥云县隶属大理白族自治州，海拔约2000米。', false from public.regions where code='532923'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Xiangyun', 'Xiangyun is in Dali, about 2000 m elevation.', true from public.regions where code='532923'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '祥云县', 'Xiangyun is in Dali, about 2000 m elevation.', true from public.regions where code='532923'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Xiangyun', 'Xiangyun is in Dali, about 2000 m elevation.', true from public.regions where code='532923'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Xiangyun', 'Xiangyun is in Dali, about 2000 m elevation.', true from public.regions where code='532923'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532923'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532924', 'dali-binchuan', 'county', p.id, 25.8259, 100.5789, 1440, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '宾川县', '宾川县隶属大理白族自治州，海拔约1440米。', false from public.regions where code='532924'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Binchuan', 'Binchuan is in Dali, about 1440 m elevation.', true from public.regions where code='532924'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '宾川县', 'Binchuan is in Dali, about 1440 m elevation.', true from public.regions where code='532924'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Binchuan', 'Binchuan is in Dali, about 1440 m elevation.', true from public.regions where code='532924'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Binchuan', 'Binchuan is in Dali, about 1440 m elevation.', true from public.regions where code='532924'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532924'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532925', 'dali-midu', 'county', p.id, 25.3424, 100.4909, 1670, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '弥渡县', '弥渡县隶属大理白族自治州，海拔约1670米。', false from public.regions where code='532925'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Midu', 'Midu is in Dali, about 1670 m elevation.', true from public.regions where code='532925'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '弥渡县', 'Midu is in Dali, about 1670 m elevation.', true from public.regions where code='532925'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Midu', 'Midu is in Dali, about 1670 m elevation.', true from public.regions where code='532925'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Midu', 'Midu is in Dali, about 1670 m elevation.', true from public.regions where code='532925'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532925'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532926', 'dali-nanjian', 'county', p.id, 25.0434, 100.509, 1400, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '南涧彝族自治县', '南涧彝族自治县隶属大理白族自治州，海拔约1400米。', false from public.regions where code='532926'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Nanjian', 'Nanjian is in Dali, about 1400 m elevation.', true from public.regions where code='532926'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '南涧彝族自治县', 'Nanjian is in Dali, about 1400 m elevation.', true from public.regions where code='532926'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Nanjian', 'Nanjian is in Dali, about 1400 m elevation.', true from public.regions where code='532926'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Nanjian', 'Nanjian is in Dali, about 1400 m elevation.', true from public.regions where code='532926'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532926'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532927', 'dali-weishan', 'county', p.id, 25.2307, 100.3073, 1720, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '巍山彝族回族自治县', '巍山彝族回族自治县隶属大理白族自治州，海拔约1720米。', false from public.regions where code='532927'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Weishan', 'Weishan is in Dali, about 1720 m elevation.', true from public.regions where code='532927'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '巍山彝族回族自治县', 'Weishan is in Dali, about 1720 m elevation.', true from public.regions where code='532927'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Weishan', 'Weishan is in Dali, about 1720 m elevation.', true from public.regions where code='532927'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Weishan', 'Weishan is in Dali, about 1720 m elevation.', true from public.regions where code='532927'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532927'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532928', 'dali-yongping', 'county', p.id, 25.4647, 99.5412, 1620, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '永平县', '永平县隶属大理白族自治州，海拔约1620米。', false from public.regions where code='532928'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yongping', 'Yongping is in Dali, about 1620 m elevation.', true from public.regions where code='532928'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '永平县', 'Yongping is in Dali, about 1620 m elevation.', true from public.regions where code='532928'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yongping', 'Yongping is in Dali, about 1620 m elevation.', true from public.regions where code='532928'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yongping', 'Yongping is in Dali, about 1620 m elevation.', true from public.regions where code='532928'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532928'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532929', 'dali-yunlong', 'county', p.id, 25.8856, 99.3711, 1660, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '云龙县', '云龙县隶属大理白族自治州，海拔约1660米。', false from public.regions where code='532929'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yunlong', 'Yunlong is in Dali, about 1660 m elevation.', true from public.regions where code='532929'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '云龙县', 'Yunlong is in Dali, about 1660 m elevation.', true from public.regions where code='532929'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yunlong', 'Yunlong is in Dali, about 1660 m elevation.', true from public.regions where code='532929'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yunlong', 'Yunlong is in Dali, about 1660 m elevation.', true from public.regions where code='532929'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532929'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532930', 'dali-eryuan', 'county', p.id, 26.1112, 99.951, 2060, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '洱源县', '洱源县隶属大理白族自治州，海拔约2060米。', false from public.regions where code='532930'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Eryuan', 'Eryuan is in Dali, about 2060 m elevation.', true from public.regions where code='532930'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '洱源县', 'Eryuan is in Dali, about 2060 m elevation.', true from public.regions where code='532930'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Eryuan', 'Eryuan is in Dali, about 2060 m elevation.', true from public.regions where code='532930'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Eryuan', 'Eryuan is in Dali, about 2060 m elevation.', true from public.regions where code='532930'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532930'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532931', 'dali-jianchuan', 'county', p.id, 26.537, 99.9056, 2200, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '剑川县', '剑川县隶属大理白族自治州，海拔约2200米。', false from public.regions where code='532931'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Jianchuan', 'Jianchuan is in Dali, about 2200 m elevation.', true from public.regions where code='532931'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '剑川县', 'Jianchuan is in Dali, about 2200 m elevation.', true from public.regions where code='532931'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Jianchuan', 'Jianchuan is in Dali, about 2200 m elevation.', true from public.regions where code='532931'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Jianchuan', 'Jianchuan is in Dali, about 2200 m elevation.', true from public.regions where code='532931'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532931'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '532932', 'dali-heqing', 'county', p.id, 26.5602, 100.1765, 2200, 'published', 60, false
from public.regions p where p.code = '532900'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '鹤庆县', '鹤庆县隶属大理白族自治州，海拔约2200米。', false from public.regions where code='532932'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Heqing', 'Heqing is in Dali, about 2200 m elevation.', true from public.regions where code='532932'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '鹤庆县', 'Heqing is in Dali, about 2200 m elevation.', true from public.regions where code='532932'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Heqing', 'Heqing is in Dali, about 2200 m elevation.', true from public.regions where code='532932'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Heqing', 'Heqing is in Dali, about 2200 m elevation.', true from public.regions where code='532932'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='532900'
join public.region_metrics m on m.region_id=p.id
where c.code='532932'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city dehong
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533100', 'dehong', 'city', p.id, 24.4367, 98.5784, 920, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '德宏傣族景颇族自治州', '德宏傣族景颇族自治州是云南重要地区，海拔约920米。', '傣味、景颇菜', '瑞丽口岸、莫里热带雨林', '边境贸易活跃，冬季温暖。', false from public.regions where code='533100'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Dehong', 'Dehong is a key prefecture-level area in Yunnan at about 920 m elevation.', '傣味、景颇菜', '瑞丽口岸、莫里热带雨林', '边境贸易活跃，冬季温暖。', true from public.regions where code='533100'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '德宏傣族景颇族自治州', 'Dehong is a key prefecture-level area in Yunnan at about 920 m elevation.', true from public.regions where code='533100'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Dehong', 'Dehong is a key prefecture-level area in Yunnan at about 920 m elevation.', true from public.regions where code='533100'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Dehong', 'Dehong is a key prefecture-level area in Yunnan at about 920 m elevation.', true from public.regions where code='533100'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'subtropical_monsoon', 46, 6.6, array[11,12,1,2,3], 'seed-m1' from public.regions where code='533100'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533102', 'dehong-ruili', 'county', p.id, 24.0107, 97.8559, 780, 'published', 60, false
from public.regions p where p.code = '533100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '瑞丽市', '瑞丽市隶属德宏傣族景颇族自治州，海拔约780米。', false from public.regions where code='533102'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Ruili', 'Ruili is in Dehong, about 780 m elevation.', true from public.regions where code='533102'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '瑞丽市', 'Ruili is in Dehong, about 780 m elevation.', true from public.regions where code='533102'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Ruili', 'Ruili is in Dehong, about 780 m elevation.', true from public.regions where code='533102'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Ruili', 'Ruili is in Dehong, about 780 m elevation.', true from public.regions where code='533102'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533100'
join public.region_metrics m on m.region_id=p.id
where c.code='533102'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533103', 'dehong-mangshi', 'county', p.id, 24.4337, 98.5886, 920, 'published', 60, false
from public.regions p where p.code = '533100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '芒市', '芒市隶属德宏傣族景颇族自治州，海拔约920米。', false from public.regions where code='533103'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Mangshi', 'Mangshi is in Dehong, about 920 m elevation.', true from public.regions where code='533103'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '芒市', 'Mangshi is in Dehong, about 920 m elevation.', true from public.regions where code='533103'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Mangshi', 'Mangshi is in Dehong, about 920 m elevation.', true from public.regions where code='533103'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Mangshi', 'Mangshi is in Dehong, about 920 m elevation.', true from public.regions where code='533103'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533100'
join public.region_metrics m on m.region_id=p.id
where c.code='533103'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533122', 'dehong-lianghe', 'county', p.id, 24.8076, 98.2967, 1100, 'published', 60, false
from public.regions p where p.code = '533100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '梁河县', '梁河县隶属德宏傣族景颇族自治州，海拔约1100米。', false from public.regions where code='533122'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Lianghe', 'Lianghe is in Dehong, about 1100 m elevation.', true from public.regions where code='533122'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '梁河县', 'Lianghe is in Dehong, about 1100 m elevation.', true from public.regions where code='533122'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Lianghe', 'Lianghe is in Dehong, about 1100 m elevation.', true from public.regions where code='533122'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Lianghe', 'Lianghe is in Dehong, about 1100 m elevation.', true from public.regions where code='533122'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533100'
join public.region_metrics m on m.region_id=p.id
where c.code='533122'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533123', 'dehong-yingjiang', 'county', p.id, 24.7123, 97.9339, 830, 'published', 60, false
from public.regions p where p.code = '533100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '盈江县', '盈江县隶属德宏傣族景颇族自治州，海拔约830米。', false from public.regions where code='533123'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Yingjiang', 'Yingjiang is in Dehong, about 830 m elevation.', true from public.regions where code='533123'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '盈江县', 'Yingjiang is in Dehong, about 830 m elevation.', true from public.regions where code='533123'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Yingjiang', 'Yingjiang is in Dehong, about 830 m elevation.', true from public.regions where code='533123'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Yingjiang', 'Yingjiang is in Dehong, about 830 m elevation.', true from public.regions where code='533123'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533100'
join public.region_metrics m on m.region_id=p.id
where c.code='533123'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533124', 'dehong-longchuan', 'county', p.id, 24.183, 97.792, 970, 'published', 60, false
from public.regions p where p.code = '533100'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '陇川县', '陇川县隶属德宏傣族景颇族自治州，海拔约970米。', false from public.regions where code='533124'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Longchuan', 'Longchuan is in Dehong, about 970 m elevation.', true from public.regions where code='533124'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '陇川县', 'Longchuan is in Dehong, about 970 m elevation.', true from public.regions where code='533124'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Longchuan', 'Longchuan is in Dehong, about 970 m elevation.', true from public.regions where code='533124'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Longchuan', 'Longchuan is in Dehong, about 970 m elevation.', true from public.regions where code='533124'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533100'
join public.region_metrics m on m.region_id=p.id
where c.code='533124'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city nujiang
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533300', 'nujiang', 'city', p.id, 25.8176, 98.8566, 1170, 'published', 100, false
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '怒江傈僳族自治州', '怒江傈僳族自治州是云南重要地区，海拔约1170米。', '峡谷山货、漆油鸡', '怒江大峡谷、丙中洛', '高山峡谷，基础设施有限，适合深度旅行。', false from public.regions where code='533300'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Nujiang', 'Nujiang is a key prefecture-level area in Yunnan at about 1170 m elevation.', '峡谷山货、漆油鸡', '怒江大峡谷、丙中洛', '高山峡谷，基础设施有限，适合深度旅行。', true from public.regions where code='533300'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '怒江傈僳族自治州', 'Nujiang is a key prefecture-level area in Yunnan at about 1170 m elevation.', true from public.regions where code='533300'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Nujiang', 'Nujiang is a key prefecture-level area in Yunnan at about 1170 m elevation.', true from public.regions where code='533300'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Nujiang', 'Nujiang is a key prefecture-level area in Yunnan at about 1170 m elevation.', true from public.regions where code='533300'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'mountain_valley', 38, 5.5, array[10,11,3,4], 'seed-m1' from public.regions where code='533300'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533301', 'nujiang-lushui', 'county', p.id, 25.851, 98.8577, 1170, 'published', 60, false
from public.regions p where p.code = '533300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '泸水市', '泸水市隶属怒江傈僳族自治州，海拔约1170米。', false from public.regions where code='533301'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Lushui', 'Lushui is in Nujiang, about 1170 m elevation.', true from public.regions where code='533301'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '泸水市', 'Lushui is in Nujiang, about 1170 m elevation.', true from public.regions where code='533301'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Lushui', 'Lushui is in Nujiang, about 1170 m elevation.', true from public.regions where code='533301'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Lushui', 'Lushui is in Nujiang, about 1170 m elevation.', true from public.regions where code='533301'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533300'
join public.region_metrics m on m.region_id=p.id
where c.code='533301'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533323', 'nujiang-fugong', 'county', p.id, 26.9011, 98.8691, 1190, 'published', 60, false
from public.regions p where p.code = '533300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '福贡县', '福贡县隶属怒江傈僳族自治州，海拔约1190米。', false from public.regions where code='533323'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Fugong', 'Fugong is in Nujiang, about 1190 m elevation.', true from public.regions where code='533323'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '福贡县', 'Fugong is in Nujiang, about 1190 m elevation.', true from public.regions where code='533323'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Fugong', 'Fugong is in Nujiang, about 1190 m elevation.', true from public.regions where code='533323'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Fugong', 'Fugong is in Nujiang, about 1190 m elevation.', true from public.regions where code='533323'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533300'
join public.region_metrics m on m.region_id=p.id
where c.code='533323'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533324', 'nujiang-gongshan', 'county', p.id, 27.741, 98.6661, 1500, 'published', 60, false
from public.regions p where p.code = '533300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '贡山独龙族怒族自治县', '贡山独龙族怒族自治县隶属怒江傈僳族自治州，海拔约1500米。', false from public.regions where code='533324'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Gongshan', 'Gongshan is in Nujiang, about 1500 m elevation.', true from public.regions where code='533324'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '贡山独龙族怒族自治县', 'Gongshan is in Nujiang, about 1500 m elevation.', true from public.regions where code='533324'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Gongshan', 'Gongshan is in Nujiang, about 1500 m elevation.', true from public.regions where code='533324'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Gongshan', 'Gongshan is in Nujiang, about 1500 m elevation.', true from public.regions where code='533324'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533300'
join public.region_metrics m on m.region_id=p.id
where c.code='533324'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533325', 'nujiang-lanping', 'county', p.id, 26.4538, 99.4167, 2400, 'published', 60, false
from public.regions p where p.code = '533300'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '兰坪白族普米族自治县', '兰坪白族普米族自治县隶属怒江傈僳族自治州，海拔约2400米。', false from public.regions where code='533325'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Lanping', 'Lanping is in Nujiang, about 2400 m elevation.', true from public.regions where code='533325'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '兰坪白族普米族自治县', 'Lanping is in Nujiang, about 2400 m elevation.', true from public.regions where code='533325'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Lanping', 'Lanping is in Nujiang, about 2400 m elevation.', true from public.regions where code='533325'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Lanping', 'Lanping is in Nujiang, about 2400 m elevation.', true from public.regions where code='533325'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533300'
join public.region_metrics m on m.region_id=p.id
where c.code='533325'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
-- city diqing
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533400', 'diqing', 'city', p.id, 27.8269, 99.7065, 3280, 'published', 100, true
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '迪庆藏族自治州', '迪庆藏族自治州是云南重要地区，海拔约3280米。', '藏餐、牦牛肉、酥油茶', '香格里拉、梅里雪山、普达措', '高海拔需适应，旅游季节性强。', false from public.regions where code='533400'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', 'Diqing', 'Diqing is a key prefecture-level area in Yunnan at about 3280 m elevation.', '藏餐、牦牛肉、酥油茶', '香格里拉、梅里雪山、普达措', '高海拔需适应，旅游季节性强。', true from public.regions where code='533400'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '迪庆藏族自治州', 'Diqing is a key prefecture-level area in Yunnan at about 3280 m elevation.', true from public.regions where code='533400'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Diqing', 'Diqing is a key prefecture-level area in Yunnan at about 3280 m elevation.', true from public.regions where code='533400'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Diqing', 'Diqing is a key prefecture-level area in Yunnan at about 3280 m elevation.', true from public.regions where code='533400'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, 'highland_cold', 50, 6.2, array[5,6,9,10], 'seed-m1' from public.regions where code='533400'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533401', 'diqing-shangri-la', 'county', p.id, 27.8258, 99.706, 3280, 'published', 60, false
from public.regions p where p.code = '533400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '香格里拉市', '香格里拉市隶属迪庆藏族自治州，海拔约3280米。', false from public.regions where code='533401'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Shangri-La', 'Shangri-La is in Diqing, about 3280 m elevation.', true from public.regions where code='533401'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '香格里拉市', 'Shangri-La is in Diqing, about 3280 m elevation.', true from public.regions where code='533401'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Shangri-La', 'Shangri-La is in Diqing, about 3280 m elevation.', true from public.regions where code='533401'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Shangri-La', 'Shangri-La is in Diqing, about 3280 m elevation.', true from public.regions where code='533401'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533400'
join public.region_metrics m on m.region_id=p.id
where c.code='533401'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533422', 'diqing-deqin', 'county', p.id, 28.4832, 98.9115, 3400, 'published', 60, false
from public.regions p where p.code = '533400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '德钦县', '德钦县隶属迪庆藏族自治州，海拔约3400米。', false from public.regions where code='533422'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Deqin', 'Deqin is in Diqing, about 3400 m elevation.', true from public.regions where code='533422'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '德钦县', 'Deqin is in Diqing, about 3400 m elevation.', true from public.regions where code='533422'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Deqin', 'Deqin is in Diqing, about 3400 m elevation.', true from public.regions where code='533422'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Deqin', 'Deqin is in Diqing, about 3400 m elevation.', true from public.regions where code='533422'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533400'
join public.region_metrics m on m.region_id=p.id
where c.code='533422'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '533423', 'diqing-weixi', 'county', p.id, 27.1809, 99.2864, 2320, 'published', 60, false
from public.regions p where p.code = '533400'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '维西傈僳族自治县', '维西傈僳族自治县隶属迪庆藏族自治州，海拔约2320米。', false from public.regions where code='533423'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', 'Weixi', 'Weixi is in Diqing, about 2320 m elevation.', true from public.regions where code='533423'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hant', '维西傈僳族自治县', 'Weixi is in Diqing, about 2320 m elevation.', true from public.regions where code='533423'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ja', 'Weixi', 'Weixi is in Diqing, about 2320 m elevation.', true from public.regions where code='533423'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'ko', 'Weixi', 'Weixi is in Diqing, about 2320 m elevation.', true from public.regions where code='533423'
on conflict (region_id, locale) do update set name=excluded.name;
insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='533400'
join public.region_metrics m on m.region_id=p.id
where c.code='533423'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;
commit;
