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
import { GuideCard } from '@/components/guide-card';
import { getCityBySlug, listCountiesForCity, pickName } from '@/lib/regions/data-server';
import { listApprovedGuides } from '@/lib/guides/store';
import { getPlaceVisual } from '@/lib/regions/visuals';

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
          visual={visual}
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
import { GuideCard } from '@/components/guide-card';
import { getCountyBySlug, pickName } from '@/lib/regions/data-server';
import { listApprovedGuides } from '@/lib/guides/store';
import { getPlaceVisual } from '@/lib/regions/visuals';

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
  const visual = getPlaceVisual(city.slug);

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
          visual={visual}
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

write('E:/无尽的/see-yunnan/apps/web/src/app/[locale]/cities/page.tsx', `import { setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { SearchBox } from '@/components/search-box';
import { listCities, stats } from '@/lib/regions/data-server';

export default async function CitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cities = await listCities(locale);
  const s = await stats();

  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-[2rem] border border-ink/10 bg-gradient-to-br from-plateau/10 via-white to-camellia/10 p-6 md:p-8">
        <h1 className="text-3xl font-semibold">Cities of Yunnan</h1>
        <p className="max-w-2xl text-ink/65">
          Browse all prefecture-level cities with weather, cost, migration feel, and local mood photos.
          {' '}
          {s.cities} cities / prefectures · {s.counties} counties · source: {s.source}
        </p>
        <SearchBox locale={locale} placeholder="Search Dali, Lijiang, Shangri-La..." />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cities.map((city) => (
          <PlaceCard key={city.code} place={city} locale={locale} />
        ))}
      </div>
    </div>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/app/[locale]/page.tsx', `import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { SearchBox } from '@/components/search-box';
import { AdSlot } from '@/components/ad-slot';
import { getFeaturedCities, stats } from '@/lib/regions/data-server';
import { getPlaceVisual } from '@/lib/regions/visuals';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const features = [t('f1'), t('f2'), t('f3'), t('f4')];
  const featured = await getFeaturedCities(locale, 6);
  const s = await stats();
  const heroVisual = getPlaceVisual(featured[0]?.slug || 'dali');

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-ink/10 bg-ink text-white shadow-sm">
        <div className="grid md:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[360px]">
            <Image
              src={heroVisual.cover}
              alt="See Yunnan"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <p className="mb-3 inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {t('badge')}
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
                {t('title')}
              </h1>
              <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">{t('subtitle')}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 bg-gradient-to-br from-[#173f4f] via-[#1f6f8b] to-[#c45c26] p-6 md:p-8">
            <div>
              <p className="text-sm text-white/75">Start with a city, then zoom into counties.</p>
              <div className="mt-4">
                <SearchBox locale={locale} placeholder="Dali / Lijiang / Shangri-La" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <Link
                  href={\`/\${locale}/cities\`}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink"
                >
                  {t('ctaExplore')}
                </Link>
                <Link
                  href={\`/\${locale}/pricing\`}
                  className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white"
                >
                  {t('ctaPremium')}
                </Link>
              </div>
              <p className="text-sm text-white/70">
                {s.cities} cities · {s.counties} counties · source: {s.source}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Landscape first',
            body: 'From tropical Banna to snow-line Shangri-La, every place starts with altitude, climate, and light.',
          },
          {
            title: 'Human texture',
            body: 'Food, migration feel, and local rhythm — not just a list of attractions.',
          },
          {
            title: 'Guide bridge',
            body: 'When information is not enough, connect with local guides for travel or relocation.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">{item.body}</p>
          </div>
        ))}
      </section>

      <AdSlot show />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Featured places</h2>
            <p className="mt-1 text-sm text-ink/55">Mood images + practical intel for first-time visitors.</p>
          </div>
          <Link href={\`/\${locale}/cities\`} className="text-sm text-plateau hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((place) => (
            <PlaceCard key={place.code} place={place} locale={locale} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t('featuresTitle')}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {features.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-ink/10 bg-white p-5 text-ink/80 shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
`);

console.log('pages done');