import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminInquiryStatus } from '@/components/admin-inquiry-status';
import { getGuide, guideCommissionSummary, listInquiries } from '@/lib/guides/store';

export default async function AdminInquiriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const tc = await getTranslations('common');
  const inquiries = listInquiries();
  const commission = guideCommissionSummary();
  const ratePct = Math.round(commission.rate * 100);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/admin`} className="hover:text-plateau">
            {t('title')}
          </Link>
          <span> / {t('inquiryInbox')}</span>
        </p>
        <h1 className="text-3xl font-semibold">{t('inquiriesTitle')}</h1>
        <p className="mt-1 text-sm text-ink/60">{t('leadsCount', { count: inquiries.length })}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-ink/45">{t('commissionRate')}</p>
          <p className="mt-1 text-2xl font-semibold">{ratePct}%</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-ink/45">{t('budgetTotal')}</p>
          <p className="mt-1 text-2xl font-semibold">${commission.total_budget_usd}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-ink/45">{t('platformFeeTotal')}</p>
          <p className="mt-1 text-2xl font-semibold">${commission.total_platform_fee_usd}</p>
        </div>
      </div>

      <div className="space-y-3">
        {inquiries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-6 text-ink/60">
            {t('noInquiries')}
          </p>
        ) : (
          inquiries.map((item) => {
            const guide = getGuide(item.guide_id);
            return (
              <div key={item.id} className="rounded-2xl border border-ink/10 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{guide?.display_name || item.guide_id}</p>
                    <p className="text-xs text-ink/50">
                      {item.contact_name || tc('guest')} · {item.contact_email}
                      {item.region_slug ? ` · ${item.region_slug}` : ''}
                    </p>
                  </div>
                  <AdminInquiryStatus id={item.id} status={item.status} />
                </div>
                <p className="mt-3 text-sm text-ink/75">{item.message}</p>
                {item.estimated_budget_usd != null ? (
                  <p className="mt-2 text-xs text-plateau">
                    {t('inquiryBudgetLine', {
                      budget: item.estimated_budget_usd,
                      fee: item.platform_fee_usd ?? 0,
                      net: item.guide_net_usd ?? 0,
                      pct: Math.round((item.platform_commission_rate || commission.rate) * 100),
                    })}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-ink/40">{new Date(item.created_at).toLocaleString()}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
