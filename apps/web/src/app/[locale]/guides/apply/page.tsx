import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideApplyForm } from '@/components/guide-apply-form';

export default async function GuideApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('guides');

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/guides`} className="hover:text-plateau">
            {t('title')}
          </Link>
          <span> / {t('applyBreadcrumb')}</span>
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{t('applyTitle')}</h1>
        <p className="mt-2 text-ink/65">{t('applyIntro')}</p>
      </div>
      <GuideApplyForm locale={locale} />
    </div>
  );
}
