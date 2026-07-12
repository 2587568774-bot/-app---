import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { AdminGuideActions } from '@/components/admin-guide-actions';
import { listAllGuides } from '@/lib/guides/store';

export default async function AdminGuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const guides = listAllGuides();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/admin`} className="hover:text-plateau">
            Admin
          </Link>
          <span> / Guides</span>
        </p>
        <h1 className="text-3xl font-semibold">Guide review</h1>
        <p className="mt-1 text-sm text-ink/60">{guides.length} applications/profiles</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper/80 text-ink/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Regions</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((g) => (
              <tr key={g.id} className="border-t border-ink/5 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{g.display_name}</div>
                  <div className="text-xs text-ink/50">{g.headline}</div>
                  <div className="text-xs text-ink/40">{g.contact_email}</div>
                </td>
                <td className="px-4 py-3 capitalize">{g.status}</td>
                <td className="px-4 py-3 text-xs text-ink/60">
                  {g.service_region_slugs.join(', ') || '—'}
                </td>
                <td className="px-4 py-3">
                  {g.status === 'pending' ? <AdminGuideActions id={g.id} /> : (
                    <Link href={`/${locale}/guides/${g.id}`} className="text-xs text-plateau hover:underline">
                      View public
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}