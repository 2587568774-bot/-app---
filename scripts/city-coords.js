const fs = require('fs');
const d = JSON.parse(fs.readFileSync('apps/web/src/data/yunnan-regions.json', 'utf8'));
for (const c of d.cities) console.log(c.slug, c.lat, c.lng, c.names['zh-Hans']);
const lats = d.cities.map((c) => c.lat);
const lngs = d.cities.map((c) => c.lng);
console.log('lat', Math.min(...lats), Math.max(...lats));
console.log('lng', Math.min(...lngs), Math.max(...lngs));
