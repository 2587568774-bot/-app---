const fs = require('fs');
const path = require('path');

function write(rel, content) {
  const p = path.join('apps/web/src', rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
  console.log('wrote', rel);
}

write('app/[locale]/guides/page.tsx', `import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideCard } from '@/components/guide-card';
import { listApprovedGuides } from '@/lib/guides/store';

export default async function GuidesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; region?: string; language?: string }>;
}) {
  const { locale } = await params;
  const { q = '', region = '', language = '' } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('guides');
  const tc = await getTranslations('common');

  const guides = listApprovedGuides({
    q: q || undefined,
    region: region || undefined,
    language: language || undefined,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{t('title')}</h1>
          <p className="mt-2 text-ink/60">{t('intro')}</p>
        </div>
        <Link
          href={\`/\${locale}/guides/apply\`}
          className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white"
        >
          {t('apply')}
        </Link>
      </div>

      <form className="grid gap-2 rounded-2xl border border-ink/10 bg-white p-4 md:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder={t('searchName')}
          className="rounded-full border border-ink/15 px-3 py-2 text-sm md:col-span-2"
        />
        <input
          name="region"
          defaultValue={region}
          placeholder={t('regionSlug')}
          className="rounded-full border border-ink/15 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            name="language"
            defaultValue={language}
            placeholder={t('language')}
            className="w-full rounded-full border border-ink/15 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm text-white">
            {t('filter')}
          </button>
        </div>
      </form>

      {guides.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-6 text-ink/60">
          {t('noMatch')}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
`);

write('app/[locale]/guides/apply/page.tsx', `import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideApplyForm } from '@/components/guide-apply-form';

export default async function GuideApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('guides');

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={\`/\${locale}/guides\`} className="hover:text-plateau">
            {t('title')}
          </Link>
          <span> / {t('applyBreadcrumb')}</span>
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{t('applyTitle')}</h1>
        <p className="mt-2 text-ink/65">{t('applyIntro')}</p>
      </div>
      <GuideApplyForm locale={locale} />
    </div>
  );
}
`);

write('app/[locale]/guides/[id]/page.tsx', `import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideInquiryForm } from '@/components/guide-inquiry-form';
import { getGuide } from '@/lib/guides/store';

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('guides');
  const tc = await getTranslations('common');
  const guide = getGuide(id);
  if (!guide || guide.status !== 'approved') notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-5">
        <p className="text-sm text-ink/50">
          <Link href={\`/\${locale}/guides\`} className="hover:text-plateau">
            {t('title')}
          </Link>
          <span> / {guide.display_name}</span>
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">{guide.display_name}</h1>
        <p className="text-lg text-ink/70">{guide.headline}</p>
        <p className="text-ink/75">{guide.bio}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Info label={t('experience')} value={tc('years', { count: guide.years_experience })} />
          <Info label={t('languages')} value={guide.languages.join(', ')} />
          <Info label={t('specialtiesLabel')} value={guide.specialties.join(', ') || '—'} />
          <Info label={t('regions')} value={guide.service_region_slugs.join(', ') || '—'} />
        </div>
      </div>

      <div className="space-y-4">
        <GuideInquiryForm guideId={guide.id} regionSlug={guide.service_region_slugs[0]} />
        <p className="text-xs text-ink/50">{t('inquiryNote')}</p>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-ink/45">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
`);

write('app/[locale]/pricing/page.tsx', `import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PremiumStatusPanel } from '@/components/premium-status-panel';
import { PREMIUM_PRICE_USD, PLATFORM_COMMISSION_RATE } from '@see-yunnan/shared';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pricing');
  const price = PREMIUM_PRICE_USD.toFixed(2);
  const commissionPct = (PLATFORM_COMMISSION_RATE * 100).toFixed(0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-camellia">{t('badge')}</p>
          <h1 className="mt-2 text-3xl font-semibold">{t('title')}</h1>
          <p className="mt-3 text-3xl font-medium text-camellia">{t('price', { price })}</p>
        </div>

        <ul className="space-y-2 rounded-2xl border border-ink/10 bg-white p-6">
          <li>- {t('b1')}</li>
          <li>- {t('b2')}</li>
          <li>- {t('b3')}</li>
        </ul>

        <div className="rounded-2xl border border-dashed border-plateau/30 bg-plateau/5 p-5 text-sm text-ink/70">
          <p className="font-medium text-plateau">{t('personalPath')}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>{t('step1', { price })}</li>
            <li>{t('step2')}</li>
            <li>{t('step3')}</li>
            <li>{t('step4')}</li>
          </ol>
          <p className="mt-3">{t('note')}</p>
          <p className="mt-2 text-xs text-ink/50">{t('commissionNote', { pct: commissionPct })}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={\`/\${locale}/account\`}
            className="inline-flex rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white"
          >
            {t('cta')}
          </Link>
          <Link
            href={\`/\${locale}/admin/premium\`}
            className="inline-flex rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-medium"
          >
            {t('adminGrant')}
          </Link>
        </div>
      </div>
      <PremiumStatusPanel />
    </div>
  );
}
`);

write('app/[locale]/login/page.tsx', `import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LoginForm } from '@/components/login-form';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('login');
  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-semibold">{t('title')}</h1>
      <LoginForm
        labels={{
          email: t('email'),
          send: t('send'),
          google: t('google'),
          hint: t('hint'),
          magicSent: t('magicSent'),
          failed: t('failed'),
        }}
      />
    </div>
  );
}
`);

write('app/[locale]/account/page.tsx', `import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AccountSessionCard } from '@/components/account-session-card';
import { PremiumStatusPanel } from '@/components/premium-status-panel';

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('account');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-ink/60">{t('subtitle')}</p>
      </div>

      <AccountSessionCard locale={locale} />
      <PremiumStatusPanel />
    </div>
  );
}
`);

write('app/[locale]/search/page.tsx', `import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { SearchBox } from '@/components/search-box';
import { searchPlaces } from '@/lib/regions/data-server';

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q = '' } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('search');
  const results = await searchPlaces(q, locale);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <SearchBox locale={locale} initialQuery={q} />
      </div>
      {q ? (
        <p className="text-sm text-ink/60">{t('resultsFor', { count: results.length, q })}</p>
      ) : (
        <p className="text-sm text-ink/60">{t('emptyHint')}</p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((place) => (
          <PlaceCard key={place.code} place={place} locale={locale} />
        ))}
      </div>
    </div>
  );
}
`);

write('app/[locale]/admin/page.tsx', `import Link from 'next/link';
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
          href={\`/\${locale}/admin/regions\`}
          title={t('regionCms')}
          desc={t('regionCmsDesc')}
        />
        <AdminLink
          href={\`/\${locale}/admin/guides\`}
          title={t('guideReview')}
          desc={t('guideReviewDesc')}
        />
        <AdminLink
          href={\`/\${locale}/admin/premium\`}
          title={t('premiumGrants')}
          desc={t('premiumGrantsDesc')}
        />
        <AdminLink
          href={\`/\${locale}/admin/inquiries\`}
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
`);

write('app/[locale]/admin/guides/page.tsx', `import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminGuideActions } from '@/components/admin-guide-actions';
import { listAllGuides } from '@/lib/guides/store';

export default async function AdminGuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const guides = listAllGuides();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={\`/\${locale}/admin\`} className="hover:text-plateau">
            {t('title')}
          </Link>
          <span> / {t('guideReview')}</span>
        </p>
        <h1 className="text-3xl font-semibold">{t('guideReview')}</h1>
        <p className="mt-1 text-sm text-ink/60">{t('applications', { count: guides.length })}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper/80 text-ink/60">
            <tr>
              <th className="px-4 py-3">{t('name')}</th>
              <th className="px-4 py-3">{t('status')}</th>
              <th className="px-4 py-3">{t('regionsCol')}</th>
              <th className="px-4 py-3">{t('actions')}</th>
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
                  {g.status === 'pending' ? (
                    <AdminGuideActions id={g.id} />
                  ) : (
                    <Link href={\`/\${locale}/guides/\${g.id}\`} className="text-xs text-plateau hover:underline">
                      {t('viewPublic')}
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
`);

write('app/[locale]/admin/inquiries/page.tsx', `import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminInquiryStatus } from '@/components/admin-inquiry-status';
import { getGuide, listInquiries } from '@/lib/guides/store';

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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={\`/\${locale}/admin\`} className="hover:text-plateau">
            {t('title')}
          </Link>
          <span> / {t('inquiryInbox')}</span>
        </p>
        <h1 className="text-3xl font-semibold">{t('inquiriesTitle')}</h1>
        <p className="mt-1 text-sm text-ink/60">{t('leadsCount', { count: inquiries.length })}</p>
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
                      {item.region_slug ? \` · \${item.region_slug}\` : ''}
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
`);

write('app/[locale]/admin/premium/page.tsx', `import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminPremiumGrantForm } from '@/components/admin-premium-grant-form';
import { listSubscriptions } from '@/lib/premium/store';

export default async function AdminPremiumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const subscriptions = listSubscriptions();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={\`/\${locale}/admin\`} className="hover:text-plateau">
            {t('title')}
          </Link>
          <span> / {t('premiumTitle')}</span>
        </p>
        <h1 className="text-3xl font-semibold">{t('premiumTitle')}</h1>
        <p className="mt-1 text-sm text-ink/60">{t('premiumIntro')}</p>
      </div>

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
                    {s.note ? \` · \${s.note}\` : ''}
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
`);

write('app/[locale]/admin/regions/[slug]/page.tsx', `import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminRegionEditor } from '@/components/admin-region-editor';
import { getAdminPlace } from '@/lib/regions/admin';

export default async function AdminRegionEditPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const place = getAdminPlace(slug);
  if (!place) notFound();

  const initial =
    place.kind === 'city'
      ? {
          nameZh: place.city.names['zh-Hans'] || '',
          nameEn: place.city.names.en || '',
          summaryZh: place.city.summary['zh-Hans'] || '',
          summaryEn: place.city.summary.en || '',
          climate_type: place.city.climate_type,
          cost_of_living_index: place.city.cost_of_living_index,
          migration_friendliness: place.city.migration_friendliness,
          food_blurb: place.city.food_blurb,
          scenery_blurb: place.city.scenery_blurb,
          migration_blurb: place.city.migration_blurb,
          altitude_m: place.city.altitude_m,
          is_featured: place.city.is_featured,
          completeness: place.completeness,
          cover_url: place.city.cover_url,
          gallery: place.city.gallery,
        }
      : {
          nameZh: place.county.names['zh-Hans'] || '',
          nameEn: place.county.names.en || '',
          summaryZh: place.county.summary['zh-Hans'] || '',
          summaryEn: place.county.summary.en || '',
          altitude_m: place.county.altitude_m,
          completeness: place.completeness,
          cover_url: place.county.cover_url,
          gallery: place.county.gallery,
        };

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink/50">
        <Link href={\`/\${locale}/admin\`} className="hover:text-plateau">
          {t('title')}
        </Link>
        <span> / </span>
        <Link href={\`/\${locale}/admin/regions\`} className="hover:text-plateau">
          {t('regions')}
        </Link>
        <span> / {slug}</span>
      </p>
      <AdminRegionEditor
        slug={slug}
        kind={place.kind}
        locale={locale}
        initial={initial}
      />
    </div>
  );
}
`);

console.log('pages done');
