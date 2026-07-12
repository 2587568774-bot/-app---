import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
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

  const guides = listApprovedGuides({
    q: q || undefined,
    region: region || undefined,
    language: language || undefined,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Guides</h1>
          <p className="mt-2 text-ink/60">
            Local guides for Yunnan travel and relocation. Phase 1 uses inquiry leads (no online checkout yet).
          </p>
        </div>
        <Link
          href={`/${locale}/guides/apply`}
          className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white"
        >
          Become a guide
        </Link>
      </div>

      <form className="grid gap-2 rounded-2xl border border-ink/10 bg-white p-4 md:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name / specialty"
          className="rounded-full border border-ink/15 px-3 py-2 text-sm md:col-span-2"
        />
        <input
          name="region"
          defaultValue={region}
          placeholder="Region slug (dali)"
          className="rounded-full border border-ink/15 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            name="language"
            defaultValue={language}
            placeholder="Lang (en)"
            className="w-full rounded-full border border-ink/15 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm text-white">
            Filter
          </button>
        </div>
      </form>

      {guides.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-6 text-ink/60">
          No approved guides match your filters.
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