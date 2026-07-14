const fs = require("fs");
const path = require("path");
const root = "E:/无尽的/see-yunnan";
const d = require(path.join(root, "apps/web/src/data/yunnan-regions.json"));
const src = fs.readFileSync(path.join(root, "apps/web/src/lib/regions/visuals.ts"), "utf8");
const start = src.indexOf("export const PLACE_VISUALS");
const eq = src.indexOf("=", start);
const brace = src.indexOf("{", eq);
let depth = 0;
let end = -1;
for (let i = brace; i < src.length; i++) {
  if (src[i] === "{") depth++;
  if (src[i] === "}") {
    depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}
const objText = src.slice(brace, end);
const data = Function("return (" + objText + ")")();
const missingCities = [];
let countiesOk = 0;
let missingCounties = 0;
for (const c of d.cities) {
  const v = data[c.slug] || (c.slug === "puer" ? data["pu-er"] || data.puer : null);
  if (!v || !v.cover) missingCities.push(c.slug);
  for (const co of c.counties) {
    const base = v || Object.values(data)[0];
    const gallery = (base && base.gallery && base.gallery.length ? base.gallery : base ? [base.cover] : []);
    if (gallery.length) countiesOk++;
    else missingCounties++;
  }
}
console.log(JSON.stringify({
  cities: d.cities.length,
  visualKeys: Object.keys(data).length,
  missingCities,
  countiesOk,
  missingCounties,
}, null, 2));