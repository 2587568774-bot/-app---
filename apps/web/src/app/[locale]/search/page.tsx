import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { SearchBox } from '@/components/search-box';
import { searchPlaces } from '@/lib/regions/data-server';

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q = '' } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('search');
  const results = await searchPlaces(q, locale);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <SearchBox locale={locale} initialQuery={q} />
      </div>
      {q ? (
        <p className="text-sm text-ink/60">{t('resultsFor', { count: results.length, q })}</p>
      ) : (
        <p className="text-sm text-ink/60">{t('emptyHint')}</p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((place) => (
          <PlaceCard key={place.code} place={place} locale={locale} />
        ))}
      </div>
    </div>
  );
}
