import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PremiumStatusPanel } from '@/components/premium-status-panel';
import { PREMIUM_PRICE_USD } from '@see-yunnan/shared';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pricing');

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="text-2xl font-medium text-camellia">
          ${PREMIUM_PRICE_USD.toFixed(2)} / month
        </p>
        <ul className="space-y-2 rounded-2xl border border-ink/10 bg-white p-6">
          <li>• {t('b1')}</li>
          <li>• {t('b2')}</li>
          <li>• {t('b3')}</li>
        </ul>
        <div className="rounded-2xl border border-dashed border-plateau/30 bg-plateau/5 p-5 text-sm text-ink/70">
          <p className="font-medium text-plateau">Early personal payment path</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Pay $19.90 via your personal channel (PayPal/transfer).</li>
            <li>Send your email + payment proof to the operator.</li>
            <li>Admin grants Premium by email in the dashboard.</li>
          </ol>
          <p className="mt-3">{t('note')}</p>
        </div>
        <Link
          href={`/${locale}/account`}
          className="inline-flex rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white"
        >
          {t('cta')}
        </Link>
      </div>
      <PremiumStatusPanel />
    </div>
  );
}