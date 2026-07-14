import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { PaymentConfig } from '@/lib/premium/payment-types';

export async function PersonalPaymentPanel({
  locale,
  payment,
  price,
}: {
  locale: string;
  payment: PaymentConfig;
  price: string;
}) {
  const t = await getTranslations({ locale, namespace: 'pricing' });
  const wechats = String(payment.operator_wechat || '')
    .split(/[\/,，\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('payTitle')}</h2>
        <p className="mt-1 text-sm text-ink/65">{t('payIntro', { price })}</p>
        <p className="mt-1 text-xs text-ink/50">{payment.currency_note}</p>
      </div>

      <div className={`grid gap-4 ${payment.methods.length >= 2 ? 'sm:grid-cols-2' : ''}`}>
        {payment.methods.map((m) => (
          <article key={m.id} className="rounded-2xl border border-ink/10 bg-paper p-4">
            <p className="text-sm font-semibold text-ink">{m.label}</p>
            <p className="mt-1 break-all text-sm text-plateau">{m.account}</p>
            {m.note ? <p className="mt-2 text-xs text-ink/55">{m.note}</p> : null}
            {m.qr_image ? (
              <div className="relative mx-auto mt-3 aspect-square w-full max-w-[240px] overflow-hidden rounded-xl bg-white">
                <Image
                  src={m.qr_image}
                  alt={m.label}
                  fill
                  className="object-contain p-2"
                  sizes="240px"
                  priority
                />
              </div>
            ) : (
              <p className="mt-3 text-[11px] text-ink/40">{t('qrLater')}</p>
            )}
          </article>
        ))}
      </div>

      <div className="rounded-xl bg-ink/[0.03] p-4 text-sm text-ink/70">
        <p className="font-medium text-ink">{t('contactOps')}</p>
        <p className="mt-1">Email: {payment.operator_email}</p>
        {wechats.length ? (
          <div className="mt-1 space-y-0.5">
            {wechats.map((w) => (
              <p key={w}>WeChat: {w}</p>
            ))}
          </div>
        ) : null}
        <p className="mt-2 text-xs text-ink/50">{t('proofNote')}</p>
      </div>
    </section>
  );
}
