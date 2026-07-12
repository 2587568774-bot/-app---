import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { AdminPremiumGrantForm } from '@/components/admin-premium-grant-form';
import { listSubscriptions } from '@/lib/premium/store';

export default async function AdminPremiumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const subscriptions = listSubscriptions();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/admin`} className="hover:text-plateau">
            Admin
          </Link>
          <span> / Premium</span>
        </p>
        <h1 className="text-3xl font-semibold">Premium grants</h1>
        <p className="mt-1 text-sm text-ink/60">
          For personal collection / manual activation before Stripe webhooks.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <AdminPremiumGrantForm />
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">Recent subscriptions</h2>
          <div className="mt-4 space-y-3">
            {subscriptions.length === 0 ? (
              <p className="text-sm text-ink/55">No grants yet.</p>
            ) : (
              subscriptions.map((s) => (
                <div key={s.id} className="rounded-xl border border-ink/5 bg-paper px-3 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{s.email}</span>
                    <span className="capitalize text-ink/60">{s.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink/55">
                    until {new Date(s.current_period_end).toLocaleString()} · {s.provider}
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