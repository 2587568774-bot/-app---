import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminPremiumGrantForm } from '@/components/admin-premium-grant-form';
import { listSubscriptions } from '@/lib/premium/store';
import { readPaymentConfig } from '@/lib/premium/payment-config';

export default async function AdminPremiumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const tp = await getTranslations('pricing');
  const subscriptions = listSubscriptions();
  const payment = readPaymentConfig();
  const wechats = String(payment.operator_wechat || '')
    .split(/[\/,，\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/admin`} className="hover:text-plateau">
            {t('title')}
          </Link>
          <span> / {t('premiumTitle')}</span>
        </p>
        <h1 className="text-3xl font-semibold">{t('premiumTitle')}</h1>
        <p className="mt-1 text-sm text-ink/60">{t('premiumIntro')}</p>
      </div>

      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="font-semibold">{tp('payTitle')}</h2>
        <p className="mt-1 text-sm text-ink/60">{payment.currency_note}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {payment.methods.map((m) => (
            <div key={m.id} className="rounded-xl border border-ink/10 bg-paper p-4 text-sm">
              <p className="font-medium">{m.label}</p>
              <p className="mt-1 break-all text-plateau">{m.account}</p>
              {m.note ? <p className="mt-1 text-xs text-ink/55">{m.note}</p> : null}
              {m.qr_image ? (
                <div className="relative mx-auto mt-3 aspect-square w-full max-w-[200px] overflow-hidden rounded-xl bg-white">
                  <Image src={m.qr_image} alt={m.label} fill className="object-contain p-2" sizes="200px" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-ink/50">
          <p>Operator email: {payment.operator_email}</p>
          {wechats.map((w) => (
            <p key={w}>Operator WeChat: {w}</p>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <AdminPremiumGrantForm />
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">{t('recentSubs')}</h2>
          <div className="mt-4 space-y-3">
            {subscriptions.length === 0 ? (
              <p className="text-sm text-ink/55">{t('noGrants')}</p>
            ) : (
              subscriptions.map((s) => (
                <div key={s.id} className="rounded-xl border border-ink/5 bg-paper px-3 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{s.email}</span>
                    <span className="capitalize text-ink/60">{s.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink/55">
                    {t('until', {
                      date: new Date(s.current_period_end).toLocaleString(),
                      provider: s.provider,
                    })}
                    {s.note ? ` · ${s.note}` : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
