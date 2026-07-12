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
        <p className="mt-2 text-ink/60">
          Local CMS shell for regions + guides. Supabase role lock / production writes come later.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Cities" value={String(s.cities)} />
        <Stat label="Counties" value={String(s.counties)} />
        <Stat label="Low completeness" value={String(low)} />
        <Stat label="Region drafts" value={String(draftCount)} />
        <Stat label="Pending guides" value={String(pendingGuides)} />
        <Stat label="New inquiries" value={String(newInquiries)} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminLink
          href={`/${locale}/admin/regions`}
          title="Region CMS"
          desc="Edit place content, track completeness, save local drafts."
        />
        <AdminLink
          href={`/${locale}/admin/guides`}
          title="Guide review"
          desc="Approve or reject open guide applications."
        />
        <AdminLink
          href={`/${locale}/admin/premium`}
          title="Premium grants"
          desc="Manually activate members after personal payment."
        />
        <AdminLink
          href={`/${locale}/admin/inquiries`}
          title="Inquiry inbox"
          desc="Track traveler leads sent to guides."
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