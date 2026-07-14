const fs = require('fs');
const path = require('path');
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  console.log('wrote', file);
}

// types
const typesPath = 'E:/无尽的/see-yunnan/apps/web/src/lib/regions/types.ts';
let types = fs.readFileSync(typesPath, 'utf8');
if (!types.includes('cover_url')) {
  types = types
    .replace(
      'export type CountyRecord = {\n  code: string;\n  slug: string;\n  level: \'county\';\n  lat: number;\n  lng: number;\n  altitude_m: number;\n  names: NamedMap;\n  summary: NamedMap;\n};',
      `export type CountyRecord = {
  code: string;
  slug: string;
  level: 'county';
  lat: number;
  lng: number;
  altitude_m: number;
  names: NamedMap;
  summary: NamedMap;
  cover_url?: string;
  gallery?: string[];
};`,
    )
    .replace(
      '  food_blurb?: string;\n  scenery_blurb?: string;\n  migration_blurb?: string;\n  counties: CountyRecord[];\n};',
      `  food_blurb?: string;
  scenery_blurb?: string;
  migration_blurb?: string;
  cover_url?: string;
  gallery?: string[];
  counties: CountyRecord[];
};`,
    )
    .replace(
      '  is_featured?: boolean;\n  parentSlug?: string;\n  parentName?: string;\n  childCount?: number;\n};',
      `  is_featured?: boolean;
  parentSlug?: string;
  parentName?: string;
  childCount?: number;
  cover_url?: string;
  gallery?: string[];
};`,
    );
  write(typesPath, types);
}

// data.ts - enrich views with images
const dataPath = 'E:/无尽的/see-yunnan/apps/web/src/lib/regions/data.ts';
let data = fs.readFileSync(dataPath, 'utf8');
if (!data.includes('resolvePlaceImages')) {
  data = data.replace(
    "import type { CityRecord, CountyRecord, PlaceView, RegionDataset } from './types';",
    "import type { CityRecord, CountyRecord, PlaceView, RegionDataset } from './types';\nimport { resolvePlaceImages } from './visuals';",
  );
  data = data.replace(
    `export function cityToView(city: CityRecord, locale: string): PlaceView {
  return {
    code: city.code,
    slug: city.slug,
    level: 'city',
    name: pickName(city.names, locale),
    summary: pickName(city.summary, locale),
    lat: city.lat,
    lng: city.lng,
    altitude_m: city.altitude_m,
    climate_type: city.climate_type,
    cost_of_living_index: city.cost_of_living_index,
    migration_friendliness: city.migration_friendliness,
    best_months: city.best_months,
    food_blurb: city.food_blurb,
    scenery_blurb: city.scenery_blurb,
    migration_blurb: city.migration_blurb,
    is_featured: city.is_featured,
    childCount: city.counties.length,
  };
}`,
    `export function cityToView(city: CityRecord, locale: string): PlaceView {
  const images = resolvePlaceImages({
    slug: city.slug,
    cover_url: city.cover_url,
    gallery: city.gallery,
  });
  return {
    code: city.code,
    slug: city.slug,
    level: 'city',
    name: pickName(city.names, locale),
    summary: pickName(city.summary, locale),
    lat: city.lat,
    lng: city.lng,
    altitude_m: city.altitude_m,
    climate_type: city.climate_type,
    cost_of_living_index: city.cost_of_living_index,
    migration_friendliness: city.migration_friendliness,
    best_months: city.best_months,
    food_blurb: city.food_blurb,
    scenery_blurb: city.scenery_blurb,
    migration_blurb: city.migration_blurb,
    is_featured: city.is_featured,
    childCount: city.counties.length,
    cover_url: images.cover,
    gallery: images.gallery,
  };
}`,
  );
  data = data.replace(
    `export function countyToView(city: CityRecord, county: CountyRecord, locale: string): PlaceView {
  return {
    code: county.code,
    slug: county.slug,
    level: 'county',
    name: pickName(county.names, locale),
    summary: pickName(county.summary, locale),
    lat: county.lat,
    lng: county.lng,
    altitude_m: county.altitude_m,
    climate_type: city.climate_type,
    cost_of_living_index: city.cost_of_living_index
      ? Math.max(30, city.cost_of_living_index - 3)
      : undefined,
    migration_friendliness: city.migration_friendliness,
    best_months: city.best_months,
    food_blurb: city.food_blurb,
    scenery_blurb: city.scenery_blurb,
    migration_blurb: city.migration_blurb,
    parentSlug: city.slug,
    parentName: pickName(city.names, locale),
  };
}`,
    `export function countyToView(city: CityRecord, county: CountyRecord, locale: string): PlaceView {
  const images = resolvePlaceImages({
    slug: county.slug,
    parentSlug: city.slug,
    cover_url: county.cover_url || city.cover_url,
    gallery: county.gallery || city.gallery,
  });
  return {
    code: county.code,
    slug: county.slug,
    level: 'county',
    name: pickName(county.names, locale),
    summary: pickName(county.summary, locale),
    lat: county.lat,
    lng: county.lng,
    altitude_m: county.altitude_m,
    climate_type: city.climate_type,
    cost_of_living_index: city.cost_of_living_index
      ? Math.max(30, city.cost_of_living_index - 3)
      : undefined,
    migration_friendliness: city.migration_friendliness,
    best_months: city.best_months,
    food_blurb: city.food_blurb,
    scenery_blurb: city.scenery_blurb,
    migration_blurb: city.migration_blurb,
    parentSlug: city.slug,
    parentName: pickName(city.names, locale),
    cover_url: images.cover,
    gallery: images.gallery,
  };
}`,
  );
  write(dataPath, data);
}

// place card uses cover_url first
write('E:/无尽的/see-yunnan/apps/web/src/components/place-card.tsx', `import Image from 'next/image';
import Link from 'next/link';
import type { PlaceView } from '@/lib/regions/types';
import { resolvePlaceImages } from '@/lib/regions/visuals';

export function PlaceCard({
  place,
  locale,
}: {
  place: PlaceView;
  locale: string;
}) {
  const href =
    place.level === 'county'
      ? \`/\${locale}/places/\${place.slug}\`
      : \`/\${locale}/cities/\${place.slug}\`;
  const images = resolvePlaceImages({
    slug: place.slug,
    parentSlug: place.parentSlug,
    cover_url: place.cover_url,
    gallery: place.gallery,
  });

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-plateau/40 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden">
        <Image
          src={images.cover}
          alt={place.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{place.name}</h3>
            <p className="text-xs text-white/80">
              {place.altitude_m} m
              {place.childCount != null ? \` · \${place.childCount} counties\` : ''}
              {place.parentName ? \` · \${place.parentName}\` : ''}
            </p>
          </div>
          {place.is_featured ? (
            <span className="rounded-full bg-camellia px-2 py-1 text-[11px] font-medium text-white">
              Featured
            </span>
          ) : null}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <p className="line-clamp-2 text-sm leading-6 text-ink/70">{place.summary}</p>
        <p className="line-clamp-1 text-xs text-plateau">{images.mood}</p>
        <div className="flex flex-wrap gap-2 text-xs text-ink/60">
          {place.climate_type ? (
            <span className="rounded-full bg-paper px-2 py-1">{place.climate_type}</span>
          ) : null}
          {place.migration_friendliness != null ? (
            <span className="rounded-full bg-paper px-2 py-1">Mig {place.migration_friendliness}</span>
          ) : null}
          {place.cost_of_living_index != null ? (
            <span className="rounded-full bg-paper px-2 py-1">COL {place.cost_of_living_index}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/components/place-hero.tsx', `import Image from 'next/image';

export function PlaceHero({
  title,
  subtitle,
  cover,
  mood,
  tags = [],
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  cover: string;
  mood?: string;
  tags?: string[];
  eyebrow?: string;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-ink/10 bg-ink text-white shadow-sm">
      <div className="relative min-h-[320px] md:min-h-[420px]">
        <Image
          src={cover}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          {eyebrow ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-2xl text-sm text-white/85 md:text-base">{subtitle}</p> : null}
          {mood ? <p className="mt-4 text-sm text-white/70">{mood}</p> : null}
          {tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/components/image-gallery.tsx', `import Image from 'next/image';

export function ImageGallery({
  images,
  title = 'Photo gallery',
}: {
  images: string[];
  title?: string;
}) {
  const list = [...new Set(images.filter(Boolean))];
  if (list.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-xs text-ink/45">{list.length} photos</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, 6).map((src, idx) => (
          <div key={\`\${src}-\${idx}\`} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
            <Image src={src} alt={\`Gallery \${idx + 1}\`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
`);

console.log('core components updated');