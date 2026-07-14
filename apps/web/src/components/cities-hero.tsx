import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { PlaceView } from '@/lib/regions/types';
import { resolvePlaceImages } from '@/lib/regions/visuals';

export async function CitiesHero({
  locale,
  featured,
  statsLine,
}: {
  locale: string;
  featured: PlaceView[];
  statsLine: string;
}) {
  const t = await getTranslations({ locale, namespace: 'cities' });
  const shots = featured.slice(0, 4).map((place) => {
    const images = resolvePlaceImages({
      slug: place.slug,
      parentSlug: place.parentSlug,
      cover_url: place.cover_url,
      gallery: place.gallery,
    });
    return { place, cover: images.cover, mood: images.mood };
  });

  // Ensure at least 4 frames even if featured is short
  while (shots.length < 4 && featured.length > 0) {
    shots.push(shots[shots.length % featured.length]);
  }

  const main = shots[0];
  const side = shots.slice(1, 4);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-ink/10 bg-ink text-white shadow-lg">
      <div className="grid min-h-[360px] md:min-h-[440px] md:grid-cols-[1.4fr_0.9fr]">
        <div className="relative min-h-[260px]">
          {main ? (
            <Image
              src={main.cover}
              alt={main.place.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              {t('heroEyebrow')}
            </p>
            <h1 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight md:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/85 md:text-base">{t('heroSubtitle')}</p>
            <p className="mt-4 text-xs text-white/65">{statsLine}</p>
            {main ? (
              <p className="mt-3 text-sm text-camellia/95">
                {main.place.name}
                {main.mood ? ` · ${main.mood}` : ''}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-rows-3 gap-1 border-t border-white/10 md:border-l md:border-t-0">
          {side.map((shot, idx) => (
            <div key={`${shot.place.slug}-${idx}`} className="relative min-h-[88px] overflow-hidden">
              <Image
                src={shot.cover}
                alt={shot.place.name}
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-sm font-semibold text-white">{shot.place.name}</p>
                <p className="text-[11px] text-white/75 line-clamp-1">{shot.mood}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
