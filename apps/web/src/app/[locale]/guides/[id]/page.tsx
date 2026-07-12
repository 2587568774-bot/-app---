import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { GuideInquiryForm } from '@/components/guide-inquiry-form';
import { getGuide } from '@/lib/guides/store';

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const guide = getGuide(id);
  if (!guide || guide.status !== 'approved') notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-5">
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/guides`} className="hover:text-plateau">
            Guides
          </Link>
          <span> / {guide.display_name}</span>
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">{guide.display_name}</h1>
        <p className="text-lg text-ink/70">{guide.headline}</p>
        <p className="text-ink/75">{guide.bio}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Info label="Experience" value={`${guide.years_experience} years`} />
          <Info label="Languages" value={guide.languages.join(', ')} />
          <Info label="Specialties" value={guide.specialties.join(', ') || '—'} />
          <Info label="Regions" value={guide.service_region_slugs.join(', ') || '—'} />
        </div>
      </div>

      <div className="space-y-4">
        <GuideInquiryForm guideId={guide.id} regionSlug={guide.service_region_slugs[0]} />
        <p className="text-xs text-ink/50">
          Contact email is used for lead routing in Phase 1. Online booking + 15% commission comes in Phase 2.
        </p>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-ink/45">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}