const fs = require('fs');
const path = require('path');

function patch(file, fn) {
  const p = path.join('E:/无尽的/see-yunnan', file);
  let t = fs.readFileSync(p, 'utf8');
  const next = fn(t);
  if (next !== t) {
    fs.writeFileSync(p, next);
    console.log('patched', file);
  } else {
    console.log('nochange', file);
  }
}

patch('apps/web/src/app/[locale]/page.tsx', (t) => {
  if (!t.includes("from '@/components/ad-slot'")) {
    t = t.replace(
      "import { getFeaturedCities, stats } from '@/lib/regions/data-server';",
      "import { AdSlot } from '@/components/ad-slot';\nimport { getFeaturedCities, stats } from '@/lib/regions/data-server';",
    );
  }
  if (!t.includes('<AdSlot')) {
    t = t.replace(
      '<section className="space-y-4">',
      '<AdSlot show />\n\n      <section className="space-y-4">',
    );
  }
  return t;
});

patch('apps/web/src/app/[locale]/cities/[slug]/page.tsx', (t) => {
  if (!t.includes("from '@/components/ad-slot'")) {
    t = t.replace(
      "import { WeatherStrip } from '@/components/weather-strip';",
      "import { AdSlot } from '@/components/ad-slot';\nimport { WeatherStrip } from '@/components/weather-strip';",
    );
  }
  if (!t.includes('<AdSlot')) {
    t = t.replace(
      '<WeatherStrip lat={city.lat} lng={city.lng} />',
      '<WeatherStrip lat={city.lat} lng={city.lng} />\n\n      <AdSlot show />',
    );
  }
  return t;
});

patch('apps/web/src/app/[locale]/admin/page.tsx', (t) => {
  if (t.includes('/admin/premium')) return t;
  const card = `        <AdminLink
          href={\`/\${locale}/admin/premium\`}
          title="Premium grants"
          desc="Manually activate members after personal payment."
        />
`;
  // insert before inquiry card if present, else before closing grid
  if (t.includes('admin/inquiries')) {
    t = t.replace(
      '        <AdminLink\n          href={`/${locale}/admin/inquiries`}',
      card + '        <AdminLink\n          href={`/${locale}/admin/inquiries`}',
    );
  } else {
    t = t.replace('      </div>\n    </div>\n  );\n}', card + '      </div>\n    </div>\n  );\n}');
  }
  return t;
});

console.log('done');