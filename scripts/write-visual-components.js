const fs = require('fs');
const path = require('path');
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  console.log('wrote', file);
}

write('E:/无尽的/see-yunnan/apps/web/src/components/place-hero.tsx', `import Image from 'next/image';
import type { PlaceVisual } from '@/lib/regions/visuals';

export function PlaceHero({
  title,
  subtitle,
  visual,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  visual: PlaceVisual;
  eyebrow?: string;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-ink/10 bg-ink text-white shadow-sm">
      <div className="relative min-h-[320px] md:min-h-[420px]">
        <Image
          src={visual.cover}
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
          <p className="mt-4 text-sm text-white/70">{visual.mood}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {visual.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/components/culture-panel.tsx', `import type { PlaceVisual } from '@/lib/regions/visuals';
import { pickLocalized } from '@/lib/regions/visuals';

export function CulturePanel({
  visual,
  locale,
}: {
  visual: PlaceVisual;
  locale: string;
}) {
  const culture = pickLocalized(visual.culture, locale);
  const lifestyle = pickLocalized(visual.lifestyle, locale);

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-camellia">People and culture</p>
        <h2 className="mt-2 text-xl font-semibold">How it feels on the ground</h2>
        <p className="mt-4 text-sm leading-7 text-ink/75">{culture}</p>
      </article>
      <article className="rounded-3xl border border-ink/10 bg-gradient-to-br from-plateau/10 via-white to-camellia/10 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-plateau">Daily life</p>
        <h2 className="mt-2 text-xl font-semibold">Who thrives here</h2>
        <p className="mt-4 text-sm leading-7 text-ink/75">{lifestyle}</p>
        <p className="mt-6 text-xs text-ink/45">
          Photo mood via {visual.credit}. Replace later with your own licensed field photos.
        </p>
      </article>
    </section>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/components/place-card.tsx', `import Image from 'next/image';
import Link from 'next/link';
import type { PlaceView } from '@/lib/regions/types';
import { getPlaceVisual } from '@/lib/regions/visuals';

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
  const visual = getPlaceVisual(place.parentSlug || place.slug);

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-plateau/40 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden">
        <Image
          src={visual.cover}
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
        <p className="line-clamp-1 text-xs text-plateau">{visual.mood}</p>
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

write('E:/无尽的/see-yunnan/apps/web/next.config.ts', `import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['@see-yunnan/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
`);

write('E:/无尽的/see-yunnan/apps/web/src/app/globals.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #f4f0e8;
  --foreground: #1a1a1a;
}

body {
  color: var(--foreground);
  background:
    radial-gradient(circle at top left, rgba(31, 111, 139, 0.08), transparent 28%),
    radial-gradient(circle at top right, rgba(196, 92, 38, 0.08), transparent 24%),
    var(--background);
  min-height: 100vh;
}

::selection {
  background: rgba(31, 111, 139, 0.18);
}
`);

console.log('components done');