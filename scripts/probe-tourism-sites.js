const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const candidates = {
  kunming: [
    'https://whhlyj.km.gov.cn/',
    'https://www.km.gov.cn/',
  ],
  qujing: [
    'https://whhlyj.qj.gov.cn/',
    'https://wglj.qj.gov.cn/',
    'https://www.qj.gov.cn/',
  ],
  yuxi: [
    'https://whhlyj.yuxi.gov.cn/',
    'https://wglj.yuxi.gov.cn/',
    'https://www.yuxi.gov.cn/',
  ],
  baoshan: [
    'https://whhlyj.baoshan.gov.cn/',
    'https://wglj.baoshan.gov.cn/',
    'https://www.baoshan.gov.cn/',
  ],
  zhaotong: [
    'https://whhlyj.zt.gov.cn/',
    'https://wglj.zt.gov.cn/',
    'https://www.zt.gov.cn/',
  ],
  lijiang: [
    'https://www.lijiang.cn/',
    'https://whhlyj.lijiang.gov.cn/',
    'https://www.lijiang.gov.cn/',
  ],
  puer: [
    'https://whhlyj.puer.gov.cn/',
    'https://wglj.puer.gov.cn/',
    'https://www.puershi.gov.cn/',
    'https://www.puer.gov.cn/',
    'http://www.puer.gov.cn/',
  ],
  lincang: [
    'https://whhlyj.lincang.gov.cn/',
    'https://wglj.lincang.gov.cn/',
    'https://www.lincang.gov.cn/',
  ],
  chuxiong: [
    'https://whhlyj.cxz.gov.cn/',
    'https://wglj.cxz.gov.cn/',
    'https://www.cxz.gov.cn/',
  ],
  honghe: [
    'https://whhlyj.hh.gov.cn/',
    'https://wglj.hh.gov.cn/',
    'https://www.hh.gov.cn/',
  ],
  wenshan: [
    'https://whhlyj.ynws.gov.cn/',
    'https://wglj.ynws.gov.cn/',
    'https://www.ynws.gov.cn/',
  ],
  xishuangbanna: [
    'https://whhlyj.xsbn.gov.cn/',
    'http://www.xsbnly.com/',
    'https://www.xsbn.gov.cn/',
  ],
  dali: [
    'https://www.dalitravel.cn/',
    'https://whhlyj.dali.gov.cn/',
    'https://www.dali.gov.cn/',
  ],
  dehong: [
    'https://whhlyj.dh.gov.cn/',
    'https://wglj.dh.gov.cn/',
    'https://www.dh.gov.cn/',
  ],
  nujiang: [
    'https://whhlyj.nujiang.gov.cn/',
    'https://wglj.nujiang.gov.cn/',
    'https://www.nujiang.gov.cn/',
  ],
  diqing: [
    'https://whhlyj.diqing.gov.cn/',
    'https://wglj.diqing.gov.cn/',
    'https://www.diqing.gov.cn/',
  ],
};

function fetchOnce(url, redirects = 0) {
  return new Promise((resolve) => {
    let u;
    try { u = new URL(url); } catch {
      return resolve({ ok: false, status: 0, url, title: 'BAD URL', finalUrl: url });
    }
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.request({
      protocol: u.protocol,
      hostname: u.hostname,
      port: u.port || undefined,
      path: u.pathname + u.search,
      method: 'GET',
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      rejectUnauthorized: false,
    }, (res) => {
      const status = res.statusCode || 0;
      const loc = res.headers.location;
      if ([301,302,303,307,308].includes(status) && loc && redirects < 5) {
        const next = new URL(loc, url).toString();
        res.resume();
        return resolve(fetchOnce(next, redirects + 1));
      }
      const chunks = [];
      res.on('data', (c) => {
        if (Buffer.concat(chunks).length < 200000) chunks.push(c);
      });
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        let text = buf.toString('utf8');
        const m = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = m ? m[1].replace(/\s+/g, ' ').trim() : '';
        resolve({ ok: status >= 200 && status < 400, status, url, title, finalUrl: url });
      });
    });
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 0, url, title: 'TIMEOUT', finalUrl: url }); });
    req.on('error', (e) => resolve({ ok: false, status: 0, url, title: String(e.message || e), finalUrl: url }));
    req.end();
  });
}

(async () => {
  const results = [];
  for (const [slug, urls] of Object.entries(candidates)) {
    let best = null;
    const tried = [];
    for (const url of urls) {
      const r = await fetchOnce(url);
      tried.push({ url, status: r.status, title: r.title, finalUrl: r.finalUrl });
      console.log(slug, url, r.status, r.title.slice(0, 60));
      if (!best && r.ok) best = r;
      if (r.ok && /文化|旅游|文旅|travel|lijiang|大理旅游/i.test(r.title || url)) {
        best = r;
        break;
      }
    }
    results.push({
      slug,
      status: best ? best.status : 0,
      url: best ? best.finalUrl || best.url : null,
      title: best ? best.title : 'NOT FOUND',
      candidates: tried,
    });
  }
  const out = path.join('E:/无尽的/see-yunnan/apps/web/src/data/tourism-sites.json');
  fs.writeFileSync(out, JSON.stringify(results, null, 2) + '\n', 'utf8');
  console.log('wrote', out);
  console.log(results.map(r => r.slug + '\t' + r.status + '\t' + (r.url||'') + '\t' + (r.title||'')).join('\n'));
})();
