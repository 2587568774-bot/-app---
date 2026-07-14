const http = require('http');
const fs = require('fs');
function get(path) {
  return new Promise((resolve) => {
    const req = http.get({ host: '127.0.0.1', port: 3000, path, timeout: 120000 }, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => resolve({ s: res.statusCode, d }));
    });
    req.on('error', (e) => resolve({ s: 0, d: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ s: 0, d: 'timeout' }); });
  });
}
(async () => {
  const lines = [];
  const a = await get('/zh-Hans');
  lines.push('zh ' + a.s);
  lines.push('citiesHref ' + a.d.includes('href="/zh-Hans/cities"'));
  lines.push('accountHref ' + a.d.includes('href="/zh-Hans/account"'));
  lines.push('explore ' + a.d.includes('探索'));
  lines.push('mine ' + a.d.includes('我的'));
  // sample anchors
  const anchors = [...a.d.matchAll(/href="(\/zh-Hans\/[^"]+)"/g)].map(m=>m[1]);
  lines.push('anchors ' + [...new Set(anchors)].slice(0,20).join(','));
  lines.push('cities ' + (await get('/zh-Hans/cities')).s);
  lines.push('account ' + (await get('/zh-Hans/account')).s);
  const e = await get('/en');
  lines.push('en ' + e.s);
  if (e.s >= 500) lines.push(e.d.slice(0, 1500));
  fs.writeFileSync('E:/无尽的/see-yunnan/smoke-result.txt', lines.join('\n'), 'utf8');
  console.log(lines.join('\n'));
})();
