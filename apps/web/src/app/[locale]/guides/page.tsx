import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideCard } from '@/components/guide-card';
import { listApprovedGuides } from '@/lib/guides/store';

export default async function GuidesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; region?: string; language?: string }>;
}) {
  const { locale } = await params;
  const { q = '', region = '', language = '' } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('guides');

  const guides = listApprovedGuides({
    q: q || undefined,
    region: region || undefined,
    language: language || undefined,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{t('title')}</h1>
          <p className="mt-2 text-ink/60">{t('intro')}</p>
        </div>
        <Link
          href={`/${locale}/guides/apply`}
          className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white"
        >
          {t('apply')}
        </Link>
      </div>

      <form className="grid gap-2 rounded-2xl border border-ink/10 bg-white p-4 md:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder={t('searchName')}
          className="rounded-full border border-ink/15 px-3 py-2 text-sm md:col-span-2"
        />
        <input
          name="region"
          defaultValue={region}
          placeholder={t('regionSlug')}
          className="rounded-full border border-ink/15 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            name="language"
            defaultValue={language}
            placeholder={t('language')}
            className="w-full rounded-full border border-ink/15 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm text-white">
            {t('filter')}
          </button>
        </div>
      </form>

      {guides.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-6 text-ink/60">
          {t('noMatch')}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
