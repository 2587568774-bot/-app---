import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { listAdminRegions, readDrafts } from '@/lib/regions/admin';
import { stats } from '@/lib/regions/data-server';
import { listAllGuides, listInquiries } from '@/lib/guides/store';

export default async function AdminHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const s = await stats();
  const regions = listAdminRegions('zh-Hans');
  const low = regions.filter((r) => r.completeness < 55).length;
  const drafts = readDrafts();
  const draftCount = Object.keys(drafts.cities).length + Object.keys(drafts.counties).length;
  const guides = listAllGuides();
  const pendingGuides = guides.filter((g) => g.status === 'pending').length;
  const inquiries = listInquiries();
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-ink/60">{t('intro')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Stat label={t('cities')} value={String(s.cities)} />
        <Stat label={t('counties')} value={String(s.counties)} />
        <Stat label={t('lowCompleteness')} value={String(low)} />
        <Stat label={t('regionDrafts')} value={String(draftCount)} />
        <Stat label={t('pendingGuides')} value={String(pendingGuides)} />
        <Stat label={t('newInquiries')} value={String(newInquiries)} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminLink
          href={`/${locale}/admin/regions`}
          title={t('regionCms')}
          desc={t('regionCmsDesc')}
        />
        <AdminLink
          href={`/${locale}/admin/guides`}
          title={t('guideReview')}
          desc={t('guideReviewDesc')}
        />
        <AdminLink
          href={`/${locale}/admin/premium`}
          title={t('premiumGrants')}
          desc={t('premiumGrantsDesc')}
        />
        <AdminLink
          href={`/${locale}/admin/inquiries`}
          title={t('inquiryInbox')}
          desc={t('inquiryInboxDesc')}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="text-sm text-ink/50">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function AdminLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm hover:border-plateau/40">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-ink/65">{desc}</p>
    </Link>
  );
}
