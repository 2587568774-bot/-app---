const fs = require('fs');
const visuals = fs.readFileSync('apps/web/src/lib/regions/visuals.ts', 'utf8');
const cityOrder = [
  'kunming','dali','lijiang','xishuangbanna','diqing','honghe','baoshan','dehong',
  'nujiang','yuxi','qujing','puer','chuxiong','wenshan','lincang','zhaotong'
];
const blocks = {};
for (const slug of cityOrder) {
  const re = new RegExp('"' + slug + '"\\s*:\\s*\\{([\\s\\S]*?)\\n  \\},');
  const m = visuals.match(re);
  if (!m) {
    console.log('no block', slug);
    continue;
  }
  const body = m[1];
  const coverMatch = body.match(/"cover"\s*:\s*"(https:[^"]+)"/);
  const cover = coverMatch ? coverMatch[1] : null;
  const gallery = [...body.matchAll(/"(https:[^"]+)"/g)].map((x) => x[1]);
  const uniq = [...new Set([cover, ...gallery].filter(Boolean))];
  blocks[slug] = {
    cover: uniq[0] || null,
    gallery: uniq.slice(0, 6),
    credit: '宣传临图（可替换为各州市文旅官网图）',
    replace_with: '各地文旅局/宣传部官方图',
  };
  console.log(slug, uniq.length);
}
const out = {
  generated_at: new Date().toISOString(),
  note: '宣传用临时图包。后期替换 apps/web/src/data/promo-images.json 或后台上传即可。',
  source: 'promo-pack-v1',
  cities: blocks,
};
fs.writeFileSync('apps/web/src/data/promo-images.json', JSON.stringify(out, null, 2) + '\n');
console.log('wrote', Object.keys(blocks).length);
