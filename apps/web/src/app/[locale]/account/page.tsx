import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PremiumStatusPanel } from '@/components/premium-status-panel';
import { hasSupabasePublicEnv } from '@/lib/env';

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('account');
  const ready = hasSupabasePublicEnv();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-ink/60">{ready ? t('loginHint') : t('unknown')}</p>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <p>{t('signedOut')}</p>
        <p className="mt-2 text-sm text-ink/60">
          Until Supabase auth is connected, check Premium by email below (manual grant flow).
        </p>
        <Link
          href={`/${locale}/login`}
          className="mt-6 inline-flex rounded-full bg-camellia px-4 py-2 text-sm font-medium text-white"
        >
          Login
        </Link>
      </div>

      <PremiumStatusPanel />
    </div>
  );
}