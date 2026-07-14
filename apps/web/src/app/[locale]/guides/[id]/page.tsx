import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideInquiryForm } from '@/components/guide-inquiry-form';
import { getGuide } from '@/lib/guides/store';
import { PLATFORM_COMMISSION_RATE } from '@see-yunnan/shared';

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('guides');
  const tc = await getTranslations('common');
  const guide = getGuide(id);
  if (!guide || guide.status !== 'approved') notFound();
  const commissionPct = Math.round(PLATFORM_COMMISSION_RATE * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-5">
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/guides`} className="hover:text-plateau">
            {t('title')}
          </Link>
          <span> / {guide.display_name}</span>
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">{guide.display_name}</h1>
        <p className="text-lg text-ink/70">{guide.headline}</p>
        <p className="text-ink/75">{guide.bio}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Info label={t('experience')} value={tc('years', { count: guide.years_experience })} />
          <Info label={t('languages')} value={guide.languages.join(', ')} />
          <Info label={t('specialtiesLabel')} value={guide.specialties.join(', ') || '-'} />
          <Info label={t('regions')} value={guide.service_region_slugs.join(', ') || '-'} />
        </div>
        <p className="text-xs text-ink/50">{t('commissionHint')} ({commissionPct}%)</p>
      </div>

      <div className="space-y-4">
        <GuideInquiryForm guideId={guide.id} regionSlug={guide.service_region_slugs[0]} />
        <p className="text-xs text-ink/50">{t('inquiryNote')}</p>
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
