/**
 * Build Yunnan SVG geometry from Aliyun DataV admin boundaries.
 * Source: https://geo.datav.aliyun.com/areas_v3/bound/530000.json (+ _full)
 * Re-run: node scripts/build-yunnan-map-geometry.js
 */
const fs = require('fs');

const boundary = JSON.parse(fs.readFileSync('apps/web/src/data/yunnan-boundary.json', 'utf8'));
const prefs = JSON.parse(fs.readFileSync('apps/web/src/data/yunnan-prefectures.json', 'utf8'));

const ADCODE_TO_SLUG = {
  530100: 'kunming',
  530300: 'qujing',
  530400: 'yuxi',
  530500: 'baoshan',
  530600: 'zhaotong',
  530700: 'lijiang',
  530800: 'puer',
  530900: 'lincang',
  532300: 'chuxiong',
  532500: 'honghe',
  532600: 'wenshan',
  532800: 'xishuangbanna',
  532900: 'dali',
  533100: 'dehong',
  533300: 'nujiang',
  533400: 'diqing',
};

const SHORT = {
  kunming: { zh: '昆明', en: 'Kunming' },
  qujing: { zh: '曲靖', en: 'Qujing' },
  yuxi: { zh: '玉溪', en: 'Yuxi' },
  baoshan: { zh: '保山', en: 'Baoshan' },
  zhaotong: { zh: '昭通', en: 'Zhaotong' },
  lijiang: { zh: '丽江', en: 'Lijiang' },
  puer: { zh: '普洱', en: "Pu'er" },
  lincang: { zh: '临沧', en: 'Lincang' },
  chuxiong: { zh: '楚雄', en: 'Chuxiong' },
  honghe: { zh: '红河', en: 'Honghe' },
  wenshan: { zh: '文山', en: 'Wenshan' },
  xishuangbanna: { zh: '版纳', en: 'Banna' },
  dali: { zh: '大理', en: 'Dali' },
  dehong: { zh: '德宏', en: 'Dehong' },
  nujiang: { zh: '怒江', en: 'Nujiang' },
  diqing: { zh: '迪庆', en: 'Diqing' },
};

const CITY_GEO = {
  kunming: [25.0389, 102.7183],
  qujing: [25.5016, 103.7979],
  yuxi: [24.3505, 102.5439],
  baoshan: [25.112, 99.1618],
  zhaotong: [27.3383, 103.7172],
  lijiang: [26.855, 100.227],
  puer: [22.7773, 100.9726],
  lincang: [23.8866, 100.0869],
  chuxiong: [25.0419, 101.546],
  honghe: [23.3631, 103.3756],
  wenshan: [23.3695, 104.244],
  xishuangbanna: [22.0017, 100.7979],
  dali: [25.6065, 100.2676],
  dehong: [24.4367, 98.5784],
  nujiang: [25.8176, 98.8566],
  diqing: [27.8269, 99.7065],
};

function allLngLats(coordinates, out = []) {
  if (!Array.isArray(coordinates)) return out;
  if (typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
    out.push([coordinates[0], coordinates[1]]);
    return out;
  }
  for (const child of coordinates) allLngLats(child, out);
  return out;
}

const borderPts = allLngLats(boundary.features[0].geometry.coordinates);
let minLng = Infinity,
  maxLng = -Infinity,
  minLat = Infinity,
  maxLat = -Infinity;
for (const [lng, lat] of borderPts) {
  minLng = Math.min(minLng, lng);
  maxLng = Math.max(maxLng, lng);
  minLat = Math.min(minLat, lat);
  maxLat = Math.max(maxLat, lat);
}
const padLng = (maxLng - minLng) * 0.045;
const padLat = (maxLat - minLat) * 0.045;
minLng -= padLng;
maxLng += padLng;
minLat -= padLat;
maxLat += padLat;

const VB = { w: 420, h: 520 };

function project(lng, lat) {
  const x = ((lng - minLng) / (maxLng - minLng)) * VB.w;
  const y = ((maxLat - lat) / (maxLat - minLat)) * VB.h;
  return [x, y];
}

function distPointSeg(p, a, b) {
  const [x0, y0] = p;
  const [x1, y1] = a;
  const [x2, y2] = b;
  const num = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
  const den = Math.hypot(y2 - y1, x2 - x1) || 1;
  return num / den;
}

function rdPOpen(points, epsilon) {
  if (points.length < 3) return points;
  const first = points[0];
  const last = points[points.length - 1];
  let maxDist = 0;
  let idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = distPointSeg(points[i], first, last);
    if (d > maxDist) {
      maxDist = d;
      idx = i;
    }
  }
  if (maxDist > epsilon) {
    const left = rdPOpen(points.slice(0, idx + 1), epsilon);
    const right = rdPOpen(points.slice(idx), epsilon);
    return left.slice(0, -1).concat(right);
  }
  return [first, last];
}

/** Closed-ring RDP: split by diameter endpoints */
function simplifyClosed(points, epsilon) {
  let pts = points.slice();
  // drop closing duplicate
  if (pts.length > 2) {
    const a = pts[0];
    const b = pts[pts.length - 1];
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.01) pts = pts.slice(0, -1);
  }
  if (pts.length < 4) return pts.concat([pts[0]]);

  // farthest from first
  let i1 = 0;
  let d1 = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]);
    if (d > d1) {
      d1 = d;
      i1 = i;
    }
  }
  // farthest from i1
  let i2 = 0;
  let d2 = -1;
  for (let i = 0; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i1][0], pts[i][1] - pts[i1][1]);
    if (d > d2) {
      d2 = d;
      i2 = i;
    }
  }

  const lo = Math.min(i1, i2);
  const hi = Math.max(i1, i2);
  const chainA = pts.slice(lo, hi + 1);
  const chainB = pts.slice(hi).concat(pts.slice(0, lo + 1));
  const simpA = rdPOpen(chainA, epsilon);
  const simpB = rdPOpen(chainB, epsilon);
  const merged = simpA.slice(0, -1).concat(simpB.slice(0, -1));
  if (merged.length < 3) {
    // fallback stride
    const step = Math.max(1, Math.floor(pts.length / 180));
    const out = [];
    for (let i = 0; i < pts.length; i += step) out.push(pts[i]);
    out.push(out[0]);
    return out;
  }
  merged.push(merged[0]);
  return merged;
}

function ringToPath(ring, epsilon) {
  const projected = ring.map(([lng, lat]) => project(lng, lat));
  const simplified = simplifyClosed(projected, epsilon);
  if (simplified.length < 4) return '';
  const [fx, fy] = simplified[0];
  let d = `M${fx.toFixed(1)} ${fy.toFixed(1)}`;
  for (let i = 1; i < simplified.length; i++) {
    d += `L${simplified[i][0].toFixed(1)} ${simplified[i][1].toFixed(1)}`;
  }
  d += 'Z';
  return d;
}

function geometryToPath(geometry, epsilon) {
  const polys =
    geometry.type === 'Polygon'
      ? [geometry.coordinates]
      : geometry.type === 'MultiPolygon'
        ? geometry.coordinates
        : [];
  return polys
    .map((poly) => ringToPath(poly[0], epsilon))
    .filter(Boolean)
    .join('');
}

const outlinePath = geometryToPath(boundary.features[0].geometry, 1.35);
const prefecturePaths = {};
const pins = [];

for (const feature of prefs.features) {
  const adcode = feature.properties.adcode;
  const slug = ADCODE_TO_SLUG[adcode];
  if (!slug) continue;
  prefecturePaths[slug] = geometryToPath(feature.geometry, 1.15);
  const [lat, lng] = CITY_GEO[slug];
  const [x, y] = project(lng, lat);
  pins.push({
    slug,
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1)),
    shortZh: SHORT[slug].zh,
    shortEn: SHORT[slug].en,
  });
}

if (!outlinePath || outlinePath.length < 50) {
  console.error('Outline path generation failed', outlinePath.length);
  process.exit(1);
}

const outTs = `/**
 * Auto-generated from Aliyun DataV Yunnan admin boundaries.
 * Source: geo.datav.aliyun.com/areas_v3/bound/530000.json (+ _full)
 * Rebuild: node scripts/build-yunnan-map-geometry.js
 */
export type MapPin = {
  slug: string;
  x: number;
  y: number;
  shortZh: string;
  shortEn: string;
};

export const MAP_VB = { w: ${VB.w}, h: ${VB.h} } as const;

export const YUNNAN_BOUNDS = {
  minLng: ${minLng},
  maxLng: ${maxLng},
  minLat: ${minLat},
  maxLat: ${maxLat},
} as const;

/** Province outline from real admin boundary GeoJSON */
export const YUNNAN_OUTLINE_PATH = ${JSON.stringify(outlinePath)};

/** Prefecture polygons from real admin boundary GeoJSON */
export const YUNNAN_PREFECTURE_PATHS: Record<string, string> = ${JSON.stringify(
  prefecturePaths,
  null,
  2,
)};

/** City pins projected from product lat/lng into the same map space */
export const YUNNAN_MAP_PINS: MapPin[] = ${JSON.stringify(pins, null, 2)};

export function projectYunnan(lat: number, lng: number): { x: number; y: number } {
  const { minLng, maxLng, minLat, maxLat } = YUNNAN_BOUNDS;
  const x = ((lng - minLng) / (maxLng - minLng)) * MAP_VB.w;
  const y = ((maxLat - lat) / (maxLat - minLat)) * MAP_VB.h;
  return { x, y };
}
`;

fs.writeFileSync('apps/web/src/lib/maps/map-points.ts', outTs, 'utf8');
console.log('outline chars', outlinePath.length);
console.log('prefectures', Object.keys(prefecturePaths).length);
console.log(
  'pref path lens',
  Object.values(prefecturePaths)
    .map((p) => p.length)
    .join(','),
);
console.log('pins', pins.length);
