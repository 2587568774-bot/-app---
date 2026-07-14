import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PremiumStatusPanel } from '@/components/premium-status-panel';
import { PersonalPaymentPanel } from '@/components/personal-payment-panel';
import { PREMIUM_PRICE_USD, PLATFORM_COMMISSION_RATE } from '@see-yunnan/shared';
import { readPaymentConfig } from '@/lib/premium/payment-config';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pricing');
  const price = PREMIUM_PRICE_USD.toFixed(2);
  const commissionPct = (PLATFORM_COMMISSION_RATE * 100).toFixed(0);
  const payment = readPaymentConfig();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-camellia">{t('badge')}</p>
          <h1 className="mt-2 text-3xl font-semibold">{t('title')}</h1>
          <p className="mt-3 text-3xl font-medium text-camellia">{t('price', { price })}</p>
        </div>

        <ul className="space-y-2 rounded-2xl border border-ink/10 bg-white p-6">
          <li>- {t('b1')}</li>
          <li>- {t('b2')}</li>
          <li>- {t('b3')}</li>
        </ul>

        <PersonalPaymentPanel locale={locale} payment={payment} price={price} />

        <div className="rounded-2xl border border-dashed border-plateau/30 bg-plateau/5 p-5 text-sm text-ink/70">
          <p className="font-medium text-plateau">{t('personalPath')}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>{t('step1', { price })}</li>
            <li>{t('step2')}</li>
            <li>{t('step3')}</li>
            <li>{t('step4')}</li>
          </ol>
          <p className="mt-3">{t('note')}</p>
          <p className="mt-2 text-xs text-ink/50">{t('commissionNote', { pct: commissionPct })}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/account`}
            className="inline-flex rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white"
          >
            {t('cta')}
          </Link>
          <Link
            href={`/${locale}/admin/premium`}
            className="inline-flex rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-medium"
          >
            {t('adminGrant')}
          </Link>
        </div>
      </div>
      <PremiumStatusPanel />
    </div>
  );
}
