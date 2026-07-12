import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { SearchBox } from '@/components/search-box';
import { getFeaturedCities, stats } from '@/lib/regions/data';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const features = [t('f1'), t('f2'), t('f3'), t('f4')];
  const featured = getFeaturedCities(locale);
  const s = stats();

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-plateau/10 via-paper to-camellia/10 px-6 py-12 md:px-10">
        <p className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-plateau">
          {t('badge')}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/70">{t('subtitle')}</p>
        <div className="mt-6 max-w-xl">
          <SearchBox locale={locale} placeholder="Dali / 丽江 / Shangri-La" />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/cities`}
            className="rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white"
          >
            {t('ctaExplore')}
          </Link>
          <Link
            href={`/${locale}/pricing`}
            className="rounded-full border border-camellia/30 bg-white px-5 py-2.5 text-sm font-medium text-camellia"
          >
            {t('ctaPremium')}
          </Link>
        </div>
        <p className="mt-4 text-sm text-ink/50">
          {s.cities} cities · {s.counties} counties loaded
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Featured places</h2>
          <Link href={`/${locale}/cities`} className="text-sm text-plateau hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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

      <p className="rounded-2xl border border-dashed border-plateau/30 bg-white/60 px-4 py-3 text-sm text-ink/60">
        {t('status')}
      </p>
    </div>
  );
}