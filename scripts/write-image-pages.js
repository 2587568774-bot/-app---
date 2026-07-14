const fs = require('fs');
const path = require('path');
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  console.log('wrote', file);
}

write('E:/无尽的/see-yunnan/apps/web/src/app/[locale]/cities/[slug]/page.tsx', `import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { AdSlot } from '@/components/ad-slot';
import { WeatherStrip } from '@/components/weather-strip';
import { PlaceIntelGrid } from '@/components/place-intel-grid';
import { MetricChips } from '@/components/metric-chips';
import { PlaceHero } from '@/components/place-hero';
import { CulturePanel } from '@/components/culture-panel';
import { ImageGallery } from '@/components/image-gallery';
import { GuideCard } from '@/components/guide-card';
import { getCityBySlug, listCountiesForCity, pickName } from '@/lib/regions/data-server';
import { listApprovedGuides } from '@/lib/guides/store';
import { getPlaceVisual, resolvePlaceImages } from '@/lib/regions/visuals';

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  const name = pickName(city.names, locale);
  const summary = pickName(city.summary, locale);
  const counties = await listCountiesForCity(slug, locale);
  const guides = listApprovedGuides({ region: slug }).slice(0, 3);
  const visual = getPlaceVisual(slug);
  const images = resolvePlaceImages({
    slug,
    cover_url: city.cover_url,
    gallery: city.gallery,
  });

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-ink/50">
          <Link href={\`/\${locale}/cities\`} className="hover:text-plateau">
            Cities
          </Link>
          <span> / {name}</span>
        </p>
        <PlaceHero
          title={name}
          subtitle={summary || 'Filling in / 完善中'}
          cover={images.cover}
          mood={visual.mood}
          tags={visual.tags}
          eyebrow="Yunnan city guide"
        />
        <MetricChips
          altitudeM={city.altitude_m}
          climateType={city.climate_type}
          migrationFriendliness={city.migration_friendliness}
          costOfLivingIndex={city.cost_of_living_index}
          bestMonths={city.best_months}
        />
      </div>

      <WeatherStrip lat={city.lat} lng={city.lng} />
      <CulturePanel visual={visual} locale={locale} />
      <ImageGallery images={images.gallery} title={\`\${name} gallery\`} />
      <AdSlot show />
      <PlaceIntelGrid
        food={city.food_blurb}
        scenery={city.scenery_blurb}
        migration={city.migration_blurb}
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Counties ({counties.length})</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {counties.map((county) => (
            <PlaceCard key={county.code} place={county} locale={locale} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Local guides</h2>
          <Link href={\`/\${locale}/guides?region=\${slug}\`} className="text-sm text-plateau hover:underline">
            View all
          </Link>
        </div>
        {guides.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-5 text-sm text-ink/60">
            No approved guides for this city yet. Guides can apply anytime.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/app/[locale]/places/[slug]/page.tsx', `import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { WeatherStrip } from '@/components/weather-strip';
import { PlaceIntelGrid } from '@/components/place-intel-grid';
import { MetricChips } from '@/components/metric-chips';
import { PlaceHero } from '@/components/place-hero';
import { CulturePanel } from '@/components/culture-panel';
import { ImageGallery } from '@/components/image-gallery';
import { GuideCard } from '@/components/guide-card';
import { getCountyBySlug, pickName } from '@/lib/regions/data-server';
import { listApprovedGuides } from '@/lib/guides/store';
import { getPlaceVisual, resolvePlaceImages } from '@/lib/regions/visuals';

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const found = await getCountyBySlug(slug);
  if (!found) notFound();

  const { city, county } = found;
  const name = pickName(county.names, locale);
  const summary = pickName(county.summary, locale);
  const cityName = pickName(city.names, locale);
  const guides = listApprovedGuides({ region: city.slug }).slice(0, 2);
  const visual = getPlaceVisual(slug, city.slug);
  const images = resolvePlaceImages({
    slug,
    parentSlug: city.slug,
    cover_url: county.cover_url || city.cover_url,
    gallery: county.gallery || city.gallery,
  });

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-ink/50">
          <Link href={\`/\${locale}/cities\`} className="hover:text-plateau">
            Cities
          </Link>
          <span> / </span>
          <Link href={\`/\${locale}/cities/\${city.slug}\`} className="hover:text-plateau">
            {cityName}
          </Link>
          <span> / {name}</span>
        </p>
        <PlaceHero
          title={name}
          subtitle={summary || 'Filling in / 完善中'}
          cover={images.cover}
          mood={visual.mood}
          tags={visual.tags}
          eyebrow={\`County in \${cityName}\`}
        />
        <MetricChips
          altitudeM={county.altitude_m}
          climateType={city.climate_type}
          migrationFriendliness={city.migration_friendliness}
          costOfLivingIndex={
            city.cost_of_living_index != null
              ? Math.max(30, city.cost_of_living_index - 3)
              : null
          }
          bestMonths={city.best_months}
        />
      </div>

      <WeatherStrip lat={county.lat} lng={county.lng} />
      <CulturePanel visual={visual} locale={locale} />
      <ImageGallery images={images.gallery} title={\`\${name} gallery\`} />
      <PlaceIntelGrid
        food={city.food_blurb}
        scenery={city.scenery_blurb}
        migration={city.migration_blurb}
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Guides near {cityName}</h2>
          <Link href={\`/\${locale}/guides?region=\${city.slug}\`} className="text-sm text-plateau hover:underline">
            Browse guides
          </Link>
        </div>
        {guides.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-5 text-sm text-ink/60">
            No local guide listed yet for this area.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
`);

// home hero uses resolvePlaceImages
const homePath = 'E:/无尽的/see-yunnan/apps/web/src/app/[locale]/page.tsx';
let home = fs.readFileSync(homePath, 'utf8');
if (!home.includes('resolvePlaceImages')) {
  home = home.replace(
    "import { getPlaceVisual } from '@/lib/regions/visuals';",
    "import { getPlaceVisual, resolvePlaceImages } from '@/lib/regions/visuals';",
  );
  home = home.replace(
    'const heroVisual = getPlaceVisual(featured[0]?.slug || \'dali\');',
    `const heroSlug = featured[0]?.slug || 'dali';
  const heroVisual = getPlaceVisual(heroSlug);
  const heroImages = resolvePlaceImages({
    slug: heroSlug,
    cover_url: featured[0]?.cover_url,
    gallery: featured[0]?.gallery,
  });`,
  );
  home = home.replace('src={heroVisual.cover}', 'src={heroImages.cover}');
  write(homePath, home);
}

console.log('pages updated');