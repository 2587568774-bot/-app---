const fs = require('fs');
const path = require('path');

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  console.log('wrote', file);
}

write('E:/无尽的/see-yunnan/apps/web/src/components/place-intel-grid.tsx', `type Props = {
  food?: string;
  scenery?: string;
  migration?: string;
};

export function PlaceIntelGrid({ food, scenery, migration }: Props) {
  const fallback = 'Filling in / 完善中';
  const cards = [
    { title: 'Food', body: food || fallback },
    { title: 'Scenery', body: scenery || fallback },
    { title: 'Migration', body: migration || fallback },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.title} className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">{card.title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">{card.body}</p>
        </div>
      ))}
    </section>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/components/metric-chips.tsx', `const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function MetricChips({
  altitudeM,
  climateType,
  migrationFriendliness,
  costOfLivingIndex,
  bestMonths,
}: {
  altitudeM?: number | null;
  climateType?: string | null;
  migrationFriendliness?: number | null;
  costOfLivingIndex?: number | null;
  bestMonths?: number[] | null;
}) {
  const chips: string[] = [];
  if (altitudeM != null) chips.push(\`\${altitudeM} m\`);
  if (climateType) chips.push(climateType);
  if (migrationFriendliness != null) chips.push(\`Migration \${migrationFriendliness}/10\`);
  if (costOfLivingIndex != null) chips.push(\`Cost index \${costOfLivingIndex}\`);
  if (bestMonths && bestMonths.length > 0) {
    chips.push(\`Best: \${bestMonths.map((m) => MONTHS[m - 1] || m).join(' ')}\`);
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full border border-ink/10 bg-white px-3 py-1">
          {chip}
        </span>
      ))}
    </div>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/components/account-session-card.tsx', `'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient, hasSupabasePublicEnv } from '@/lib/supabase/client';

type SessionUser = {
  email?: string;
  id: string;
};

export function AccountSessionCard({ locale }: { locale: string }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const ready = hasSupabasePublicEnv();

  useEffect(() => {
    let active = true;
    async function load() {
      if (!ready) {
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || undefined });
        } else {
          setUser(null);
        }
      } catch (err) {
        if (active) setMessage(err instanceof Error ? err.message : 'Failed to load session');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [ready]);

  async function signOut() {
    setMessage(null);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setMessage('Signed out.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Sign out failed');
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-6 text-sm text-ink/60">
        Loading account…
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <p className="font-medium">Supabase not configured</p>
        <p className="mt-2 text-sm text-ink/60">
          Add URL + anon key in apps/web/.env.local to enable login.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <p className="font-medium">You are not signed in.</p>
        <p className="mt-2 text-sm text-ink/60">
          Use email magic link login. Premium can also be checked by email below for the early personal-payment path.
        </p>
        <Link
          href={\`/\${locale}/login\`}
          className="mt-6 inline-flex rounded-full bg-camellia px-4 py-2 text-sm font-medium text-white"
        >
          Login
        </Link>
        {message ? <p className="mt-3 text-sm text-ink/70">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <p className="text-sm text-ink/50">Signed in</p>
      <p className="mt-1 text-lg font-semibold">{user.email || user.id}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={\`/\${locale}/pricing\`}
          className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white"
        >
          Premium
        </Link>
        <Link
          href={\`/\${locale}/guides/apply\`}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium"
        >
          Become a guide
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium"
        >
          Sign out
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-ink/70">{message}</p> : null}
    </div>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/app/[locale]/account/page.tsx', `import { getTranslations, setRequestLocale } from 'next-intl/server';
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
        <p className="mt-2 text-ink/60">
          Manage login, language preference later, and Premium access for the overseas edition.
        </p>
      </div>

      <AccountSessionCard locale={locale} />
      <PremiumStatusPanel />
    </div>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/app/[locale]/cities/[slug]/page.tsx', `import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { PlaceCard } from '@/components/place-card';
import { AdSlot } from '@/components/ad-slot';
import { WeatherStrip } from '@/components/weather-strip';
import { PlaceIntelGrid } from '@/components/place-intel-grid';
import { MetricChips } from '@/components/metric-chips';
import { getCityBySlug, listCountiesForCity, pickName } from '@/lib/regions/data-server';
import { listApprovedGuides } from '@/lib/guides/store';
import { GuideCard } from '@/components/guide-card';

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  const name = pickName(city.names, locale);
  const summary = pickName(city.summary, locale);
  const counties = await listCountiesForCity(slug, locale);
  const guides = listApprovedGuides({ region: slug }).slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-ink/50">
          <Link href={\`/\${locale}/cities\`} className="hover:text-plateau">
            Cities
          </Link>
          <span> / {name}</span>
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">{name}</h1>
        <p className="max-w-3xl text-ink/70">{summary || 'Filling in / 完善中'}</p>
        <MetricChips
          altitudeM={city.altitude_m}
          climateType={city.climate_type}
          migrationFriendliness={city.migration_friendliness}
          costOfLivingIndex={city.cost_of_living_index}
          bestMonths={city.best_months}
        />
      </div>

      <WeatherStrip lat={city.lat} lng={city.lng} />

      <AdSlot show />

      <PlaceIntelGrid
        food={city.food_blurb}
        scenery={city.scenery_blurb}
        migration={city.migration_blurb}
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Counties ({counties.length})</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {counties.map((county) => (
            <PlaceCard key={county.code} place={county} locale={locale} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Local guides</h2>
          <Link href={\`/\${locale}/guides?region=\${slug}\`} className="text-sm text-plateau hover:underline">
            View all
          </Link>
        </div>
        {guides.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-5 text-sm text-ink/60">
            No approved guides for this city yet. Guides can apply anytime.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/app/[locale]/places/[slug]/page.tsx', `import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { WeatherStrip } from '@/components/weather-strip';
import { PlaceIntelGrid } from '@/components/place-intel-grid';
import { MetricChips } from '@/components/metric-chips';
import { getCountyBySlug, pickName } from '@/lib/regions/data-server';
import { listApprovedGuides } from '@/lib/guides/store';
import { GuideCard } from '@/components/guide-card';

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const found = await getCountyBySlug(slug);
  if (!found) notFound();

  const { city, county } = found;
  const name = pickName(county.names, locale);
  const summary = pickName(county.summary, locale);
  const cityName = pickName(city.names, locale);
  const guides = listApprovedGuides({ region: city.slug }).slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-ink/50">
          <Link href={\`/\${locale}/cities\`} className="hover:text-plateau">
            Cities
          </Link>
          <span> / </span>
          <Link href={\`/\${locale}/cities/\${city.slug}\`} className="hover:text-plateau">
            {cityName}
          </Link>
          <span> / {name}</span>
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">{name}</h1>
        <p className="max-w-3xl text-ink/70">{summary || 'Filling in / 完善中'}</p>
        <MetricChips
          altitudeM={county.altitude_m}
          climateType={city.climate_type}
          migrationFriendliness={city.migration_friendliness}
          costOfLivingIndex={
            city.cost_of_living_index != null
              ? Math.max(30, city.cost_of_living_index - 3)
              : null
          }
          bestMonths={city.best_months}
        />
      </div>

      <WeatherStrip lat={county.lat} lng={county.lng} />

      <PlaceIntelGrid
        food={city.food_blurb}
        scenery={city.scenery_blurb}
        migration={city.migration_blurb}
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Guides near {cityName}</h2>
          <Link href={\`/\${locale}/guides?region=\${city.slug}\`} className="text-sm text-plateau hover:underline">
            Browse guides
          </Link>
        </div>
        {guides.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-5 text-sm text-ink/60">
            No local guide listed yet for this area.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
`);

write('E:/无尽的/see-yunnan/apps/web/src/app/[locale]/pricing/page.tsx', `import Link from 'next/link';
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

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-camellia">Premium</p>
          <h1 className="mt-2 text-3xl font-semibold">{t('title')}</h1>
          <p className="mt-3 text-3xl font-medium text-camellia">
            \$\${PREMIUM_PRICE_USD.toFixed(2)} / month
          </p>
        </div>

        <ul className="space-y-2 rounded-2xl border border-ink/10 bg-white p-6">
          <li>• {t('b1')}</li>
          <li>• {t('b2')}</li>
          <li>• {t('b3')}</li>
        </ul>

        <div className="rounded-2xl border border-dashed border-plateau/30 bg-plateau/5 p-5 text-sm text-ink/70">
          <p className="font-medium text-plateau">Personal payment path (current)</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Pay \$\${PREMIUM_PRICE_USD.toFixed(2)} via personal PayPal / transfer.</li>
            <li>Send your login email + payment proof to the operator.</li>
            <li>Admin opens /admin/premium and grants 1 month by email.</li>
            <li>Check Premium status on Account with the same email.</li>
          </ol>
          <p className="mt-3">{t('note')}</p>
          <p className="mt-2 text-xs text-ink/50">
            Guide marketplace commission target: {(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}% later.
            Phase 1 only does inquiry leads.
          </p>
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
            Admin grant page
          </Link>
        </div>
      </div>
      <PremiumStatusPanel />
    </div>
  );
}
`);

// fix accidental double $$ from template - rewrite clean pricing file
write('E:/无尽的/see-yunnan/apps/web/src/app/[locale]/pricing/page.tsx', `import Link from 'next/link';
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
          <p className="text-sm font-medium uppercase tracking-wide text-camellia">Premium</p>
          <h1 className="mt-2 text-3xl font-semibold">{t('title')}</h1>
          <p className="mt-3 text-3xl font-medium text-camellia">\${price} / month</p>
        </div>

        <ul className="space-y-2 rounded-2xl border border-ink/10 bg-white p-6">
          <li>• {t('b1')}</li>
          <li>• {t('b2')}</li>
          <li>• {t('b3')}</li>
        </ul>

        <div className="rounded-2xl border border-dashed border-plateau/30 bg-plateau/5 p-5 text-sm text-ink/70">
          <p className="font-medium text-plateau">Personal payment path (current)</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Pay \${price} via personal PayPal / transfer.</li>
            <li>Send your login email + payment proof to the operator.</li>
            <li>Admin opens /admin/premium and grants 1 month by email.</li>
            <li>Check Premium status on Account with the same email.</li>
          </ol>
          <p className="mt-3">{t('note')}</p>
          <p className="mt-2 text-xs text-ink/50">
            Guide marketplace commission target: {commissionPct}% later. Phase 1 only does inquiry leads.
          </p>
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
            Admin grant page
          </Link>
        </div>
      </div>
      <PremiumStatusPanel />
    </div>
  );
}
`);

console.log('done');
