import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AccountSessionCard } from '@/components/account-session-card';
import { PremiumStatusPanel } from '@/components/premium-status-panel';

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('account');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-ink/60">{t('subtitle')}</p>
      </div>

      <AccountSessionCard locale={locale} />
      <PremiumStatusPanel />
    </div>
  );
}
