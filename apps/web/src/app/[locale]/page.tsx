import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { SearchBox } from '@/components/search-box';
import { AdSlot } from '@/components/ad-slot';
import { getFeaturedCities, stats } from '@/lib/regions/data-server';
import { resolvePlaceImages } from '@/lib/regions/visuals';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('common');
  const featured = await getFeaturedCities(locale, 6);
  const s = await stats();
  const heroSlug = featured[0]?.slug || 'dali';
  const heroImages = resolvePlaceImages({
    slug: heroSlug,
    cover_url: featured[0]?.cover_url,
    gallery: featured[0]?.gallery,
  });

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-ink/10 bg-ink text-white shadow-sm">
        <div className="grid md:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[360px]">
            <Image
              src={heroImages.cover}
              alt={tc('brand')}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6 md:p-10">
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
              <p className="text-sm text-white/75">{t('startHint')}</p>
              <div className="mt-4">
                <SearchBox locale={locale} placeholder={tc('searchPlaceholder')} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <a
                  href={`/${locale}/cities`}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink"
                >
                  {t('ctaExplore')}
                </a>
                <a
                  href={`/${locale}/pricing`}
                  className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white"
                >
                  {t('ctaPremium')}
                </a>
              </div>
              <p className="text-sm text-white/70">
                {t('statsLine', { cities: s.cities, counties: s.counties, source: s.source })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: t('cardLandscape'), body: t('cardLandscapeBody') },
          { title: t('cardHuman'), body: t('cardHumanBody') },
          { title: t('cardGuide'), body: t('cardGuideBody') },
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
            <h2 className="text-xl font-semibold">{t('featuredTitle')}</h2>
            <p className="mt-1 text-sm text-ink/55">{t('featuredHint')}</p>
          </div>
          <a href={`/${locale}/cities`} className="text-sm text-plateau hover:underline">
            {tc('viewAll')}
          </a>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((place) => (
            <PlaceCard key={place.code} place={place} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
