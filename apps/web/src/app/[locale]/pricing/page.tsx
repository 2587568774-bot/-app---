import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pricing');
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <p className="text-2xl font-medium text-camellia">{t('price')}</p>
      <ul className="space-y-2 rounded-2xl border border-ink/10 bg-white p-6">
        <li>• {t('b1')}</li>
        <li>• {t('b2')}</li>
        <li>• {t('b3')}</li>
      </ul>
      <p className="text-sm text-ink/60">{t('note')}</p>
      <Link href={`/${locale}/account`} className="inline-flex rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white">
        {t('cta')}
      </Link>
    </div>
  );
}