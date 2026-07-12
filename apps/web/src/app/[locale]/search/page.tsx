import { setRequestLocale } from 'next-intl/server';
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
  const results = searchPlaces(q, locale);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">Search</h1>
        <SearchBox locale={locale} initialQuery={q} />
      </div>
      {q ? (
        <p className="text-sm text-ink/60">
          {results.length} result(s) for “{q}”
        </p>
      ) : (
        <p className="text-sm text-ink/60">Try “大理”, “Dali”, or “Shangri-La”.</p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((place) => (
          <PlaceCard key={place.code} place={place} locale={locale} />
        ))}
      </div>
    </div>
  );
}