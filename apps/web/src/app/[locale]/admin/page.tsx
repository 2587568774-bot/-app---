import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { listAdminRegions, readDrafts } from '@/lib/regions/admin';
import { stats } from '@/lib/regions/data-server';

export default async function AdminHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const s = stats();
  const regions = listAdminRegions('zh-Hans');
  const low = regions.filter((r) => r.completeness < 55).length;
  const drafts = readDrafts();
  const draftCount = Object.keys(drafts.cities).length + Object.keys(drafts.counties).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-ink/60">
          Local CMS shell for region content. Production auth/RLS will use Supabase admin role later.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Cities" value={String(s.cities)} />
        <Stat label="Counties" value={String(s.counties)} />
        <Stat label="Low completeness" value={String(low)} />
        <Stat label="Local drafts" value={String(draftCount)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={`/${locale}/admin/regions`}
          className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm hover:border-plateau/40"
        >
          <h2 className="text-lg font-semibold">Region CMS</h2>
          <p className="mt-2 text-sm text-ink/65">
            Browse province tree, edit names/blurbs/metrics, track completeness, save local drafts.
          </p>
        </Link>
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">Next admin modules</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/65">
            <li>Guide review queue (M3)</li>
            <li>Manual Premium grant (M4)</li>
            <li>Media upload to Supabase Storage</li>
          </ul>
        </div>
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