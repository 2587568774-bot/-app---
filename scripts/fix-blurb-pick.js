const fs = require("fs");
const p = "E:/无尽的/see-yunnan/apps/web/src/lib/regions/supabase-regions.ts";
let s = fs.readFileSync(p, "utf8");
const old = `function namesFromI18n(rows: I18nRow[]) {
  const names: Record<string, string> = {};
  const summary: Record<string, string> = {};
  let food = '';
  let scenery = '';
  let migration = '';
  for (const row of rows) {
    names[row.locale] = row.name;
    if (row.summary) summary[row.locale] = row.summary;
    if (!food && row.food_blurb) food = row.food_blurb;
    if (!scenery && row.scenery_blurb) scenery = row.scenery_blurb;
    if (!migration && row.migration_blurb) migration = row.migration_blurb;
  }
  return { names, summary, food, scenery, migration };
}`;
const neu = `function namesFromI18n(rows: I18nRow[]) {
  const names: Record<string, string> = {};
  const summary: Record<string, string> = {};
  const foodBy: Record<string, string> = {};
  const sceneryBy: Record<string, string> = {};
  const migrationBy: Record<string, string> = {};
  for (const row of rows) {
    names[row.locale] = row.name;
    if (row.summary) summary[row.locale] = row.summary;
    if (row.food_blurb) foodBy[row.locale] = row.food_blurb;
    if (row.scenery_blurb) sceneryBy[row.locale] = row.scenery_blurb;
    if (row.migration_blurb) migrationBy[row.locale] = row.migration_blurb;
  }
  const pickBlurb = (map: Record<string, string>) =>
    map.en || map['zh-Hans'] || map['zh-Hant'] || map.ja || map.ko || Object.values(map)[0] || '';
  return {
    names,
    summary,
    food: pickBlurb(foodBy),
    scenery: pickBlurb(sceneryBy),
    migration: pickBlurb(migrationBy),
  };
}`;
if (!s.includes(old)) {
  console.error("pattern not found");
  process.exit(1);
}
fs.writeFileSync(p, s.replace(old, neu));
console.log("supabase-regions fixed");