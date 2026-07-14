const fs = require('fs');
const d = JSON.parse(fs.readFileSync('apps/web/src/data/yunnan-regions.json','utf8'));
const v = fs.readFileSync('apps/web/src/lib/regions/visuals.ts', 'utf8');
const keys = [...v.matchAll(/"([a-z0-9-]+)":\s*\{/g)].map((m) => m[1]);
const unique = [...new Set(keys)];
console.log('visual keys', unique.length);
console.log(unique.join(', '));
console.log('cities', d.cities.map((c) => c.slug).join(', '));
console.log('counties', d.cities.reduce((n, c) => n + c.counties.length, 0));
for (const c of d.cities) {
  console.log(c.slug, 'food=', c.food_blurb || '-', 'featured=', !!c.is_featured);
}
