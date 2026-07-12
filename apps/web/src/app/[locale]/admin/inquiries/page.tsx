import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { AdminInquiryStatus } from '@/components/admin-inquiry-status';
import { getGuide, listInquiries } from '@/lib/guides/store';

export default async function AdminInquiriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const inquiries = listInquiries();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/admin`} className="hover:text-plateau">
            Admin
          </Link>
          <span> / Inquiries</span>
        </p>
        <h1 className="text-3xl font-semibold">Guide inquiries</h1>
        <p className="mt-1 text-sm text-ink/60">{inquiries.length} leads</p>
      </div>

      <div className="space-y-3">
        {inquiries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-6 text-ink/60">
            No inquiries yet.
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
                      {item.contact_name || 'Guest'} · {item.contact_email}
                      {item.region_slug ? ` · ${item.region_slug}` : ''}
                    </p>
                  </div>
                  <AdminInquiryStatus id={item.id} status={item.status} />
                </div>
                <p className="mt-3 text-sm text-ink/75">{item.message}</p>
                <p className="mt-2 text-xs text-ink/40">{new Date(item.created_at).toLocaleString()}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}