const fs = require('fs');
const path = require('path');
function write(rel, content) {
  const p = path.join('apps/web/src', rel);
  fs.writeFileSync(p, content, 'utf8');
  console.log('wrote', rel);
}

write('components/login-form.tsx', `'use client';

import { FormEvent, useState } from 'react';
import { createClient, hasSupabasePublicEnv } from '@/lib/supabase/client';

export function LoginForm({
  labels,
}: {
  labels: {
    email: string;
    send: string;
    google: string;
    hint: string;
    magicSent: string;
    failed: string;
  };
}) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const ready = hasSupabasePublicEnv();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!ready) {
      setMessage(labels.hint);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: \`\${window.location.origin}/auth/callback\`,
        },
      });
      if (error) setMessage(error.message);
      else setMessage(labels.magicSent);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : labels.failed);
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setMessage(null);
    if (!ready) {
      setMessage(labels.hint);
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: \`\${window.location.origin}/auth/callback\` },
      });
      if (error) setMessage(error.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : labels.failed);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">{labels.email}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-ink/15 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-plateau px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {labels.send}
        </button>
      </form>
      <button
        type="button"
        onClick={onGoogle}
        className="w-full rounded-full border border-ink/15 px-4 py-2.5 text-sm font-medium"
      >
        {labels.google}
      </button>
      <p className="text-xs text-ink/50">{labels.hint}</p>
      {message ? <p className="text-sm text-ink/70">{message}</p> : null}
    </div>
  );
}
`);

write('components/guide-apply-form.tsx', `'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function GuideApplyForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('guides');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t('submitFailed'));
      setMsg(t('submitted'));
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('submitFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="display_name" label={t('displayName')} required />
        <Input name="contact_email" label={t('contactEmail')} type="email" required />
        <Input name="headline" label={t('headline')} required className="md:col-span-2" />
        <Textarea name="bio" label={t('bio')} required className="md:col-span-2" />
        <Input name="years_experience" label={t('yearsExperience')} type="number" />
        <Input name="languages" label={t('languagesComma')} placeholder="en, zh-Hans" />
        <Input
          name="service_region_slugs"
          label={t('serviceRegions')}
          placeholder="dali, dali-city"
          className="md:col-span-2"
        />
        <Input
          name="specialties"
          label={t('specialties')}
          placeholder="food, culture, hiking"
          className="md:col-span-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? t('submitting') : t('submitApplication')}
      </button>
      <p className="text-xs text-ink/50">{t('applyNote')}</p>
      {msg ? <p className="text-sm text-ink/70">{msg}</p> : null}
    </form>
  );
}

function Input({
  name,
  label,
  type = 'text',
  required,
  placeholder,
  className = '',
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={\`block text-sm \${className}\`}>
      <span className="mb-1 block font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink/15 px-3 py-2"
      />
    </label>
  );
}

function Textarea({
  name,
  label,
  required,
  className = '',
}: {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={\`block text-sm \${className}\`}>
      <span className="mb-1 block font-medium">{label}</span>
      <textarea name={name} required={required} rows={4} className="w-full rounded-xl border border-ink/15 px-3 py-2" />
    </label>
  );
}
`);

write('components/guide-inquiry-form.tsx', `'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';

export function GuideInquiryForm({
  guideId,
  regionSlug,
}: {
  guideId: string;
  regionSlug?: string;
}) {
  const t = useTranslations('guides');
  const tc = useTranslations('common');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/guides/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guide_id: guideId,
          region_slug: regionSlug,
          contact_name: fd.get('contact_name'),
          contact_email: fd.get('contact_email'),
          message: fd.get('message'),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || tc('failed'));
      setMsg(t('inquirySent'));
      e.currentTarget.reset();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : tc('failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-ink/10 bg-white p-5">
      <h3 className="font-semibold">{t('sendInquiry')}</h3>
      <input
        name="contact_name"
        required
        placeholder={t('yourName')}
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <input
        name="contact_email"
        type="email"
        required
        placeholder={t('yourEmail')}
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder={t('message')}
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? t('sending') : t('send')}
      </button>
      {msg ? <p className="text-sm text-ink/70">{msg}</p> : null}
    </form>
  );
}
`);

write('components/account-session-card.tsx', `'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient, hasSupabasePublicEnv } from '@/lib/supabase/client';

type SessionUser = {
  email?: string;
  id: string;
};

export function AccountSessionCard({ locale }: { locale: string }) {
  const t = useTranslations('account');
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
        if (active) setMessage(err instanceof Error ? err.message : t('sessionFailed'));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [ready, t]);

  async function signOut() {
    setMessage(null);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setMessage(t('signedOutMsg'));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : t('signOutFailed'));
    }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      {!ready ? (
        <div className="space-y-2">
          <p className="font-medium">{t('notConfigured')}</p>
          <p className="text-sm text-ink/60">{t('notConfiguredHint')}</p>
        </div>
      ) : loading ? (
        <p className="text-sm text-ink/60">{t('loadingSession')}</p>
      ) : user ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-ink/50">{t('signedIn')}</p>
            <p className="font-medium">{user.email || user.id}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm"
          >
            {t('signOut')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="font-medium">{t('signedOut')}</p>
          <p className="text-sm text-ink/60">{t('notSignedHint')}</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={\`/\${locale}/login\`}
              className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white"
            >
              {t('login')}
            </Link>
            <Link
              href={\`/\${locale}/guides/apply\`}
              className="rounded-full border border-ink/15 px-4 py-2 text-sm"
            >
              {t('becomeGuide')}
            </Link>
            <Link
              href={\`/\${locale}/pricing\`}
              className="rounded-full border border-ink/15 px-4 py-2 text-sm"
            >
              {t('premiumLink')}
            </Link>
          </div>
        </div>
      )}
      {message ? <p className="mt-3 text-sm text-ink/70">{message}</p> : null}
    </div>
  );
}
`);

write('components/premium-status-panel.tsx', `'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';

type StatusResponse = {
  active: boolean;
  subscription?: {
    current_period_end: string;
    provider: string;
    price_usd: number;
  } | null;
  offline_packs?: Array<{ region_slug: string; version: number; downloaded_at: string }>;
  error?: string;
};

export function PremiumStatusPanel() {
  const t = useTranslations('premiumPanel');
  const tc = useTranslations('common');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('dali');
  const [data, setData] = useState<StatusResponse | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkStatus(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(\`/api/premium/status?email=\${encodeURIComponent(email)}\`);
      const json = (await res.json()) as StatusResponse;
      if (!res.ok) throw new Error(json.error || t('checkFailed'));
      setData(json);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('checkFailed'));
    } finally {
      setLoading(false);
    }
  }

  async function downloadPack() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/premium/offline-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, region_slug: region }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t('packFailed'));
      setMsg(t('packSaved', { region }));
      const statusRes = await fetch(\`/api/premium/status?email=\${encodeURIComponent(email)}\`);
      const statusJson = (await statusRes.json()) as StatusResponse;
      if (statusRes.ok) setData(statusJson);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('packFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
      <h2 className="text-lg font-semibold">{t('title')}</h2>
      <form onSubmit={checkStatus} className="flex flex-wrap gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="min-w-[220px] flex-1 rounded-full border border-ink/15 px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-ink px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {t('check')}
        </button>
      </form>

      {data ? (
        <div className="space-y-2 text-sm">
          <p>
            {t('status')}:{' '}
            <span className="font-medium">{data.active ? t('active') : t('free')}</span>
          </p>
          {data.subscription ? (
            <p className="text-ink/65">
              {t('until', {
                date: new Date(data.subscription.current_period_end).toLocaleString(),
                provider: data.subscription.provider,
                price: data.subscription.price_usd,
              })}
            </p>
          ) : null}
          {data.active ? (
            <div className="flex flex-wrap gap-2 pt-2">
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder={t('regionSlug')}
                className="rounded-full border border-ink/15 px-3 py-1.5 text-sm"
              />
              <button
                type="button"
                onClick={downloadPack}
                disabled={loading}
                className="rounded-full border border-ink/15 px-3 py-1.5 text-sm disabled:opacity-60"
              >
                {t('savePack')}
              </button>
            </div>
          ) : null}
          {data.offline_packs && data.offline_packs.length > 0 ? (
            <div className="pt-2">
              <p className="font-medium">{t('packsTitle')}</p>
              <ul className="mt-1 space-y-1 text-ink/60">
                {data.offline_packs.map((p) => (
                  <li key={\`\${p.region_slug}-\${p.version}\`}>
                    {p.region_slug} · v{p.version} · {new Date(p.downloaded_at).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-ink/55">{t('earlyPath')}</p>
      )}
      {msg ? <p className="text-sm text-ink/70">{msg}</p> : null}
      {!data && loading ? <p className="text-sm text-ink/50">{tc('loading')}</p> : null}
    </div>
  );
}
`);

write('components/admin-premium-grant-form.tsx', `'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function AdminPremiumGrantForm() {
  const t = useTranslations('admin');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/admin/premium/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fd.get('email'),
          months: Number(fd.get('months') || 1),
          note: fd.get('note') || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t('grantFailed'));
      setMsg(
        t('grantSuccess', {
          date: new Date(json.subscription.current_period_end).toLocaleString(),
        }),
      );
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('grantFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-ink/10 bg-white p-5">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{t('grantEmail')}</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-ink/15 px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{t('grantMonths')}</span>
        <input
          name="months"
          type="number"
          min={1}
          defaultValue={1}
          className="w-full rounded-xl border border-ink/15 px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{t('grantNote')}</span>
        <input
          name="note"
          placeholder={t('grantNotePlaceholder')}
          className="w-full rounded-xl border border-ink/15 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? t('granting') : t('grantSubmit')}
      </button>
      {msg ? <p className="text-sm text-ink/70">{msg}</p> : null}
    </form>
  );
}
`);

write('components/admin-guide-actions.tsx', `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function AdminGuideActions({ id }: { id: string }) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function review(status: 'approved' | 'rejected') {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(\`/api/admin/guides/\${id}/review\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t('actionFailed'));
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('actionFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => review('approved')}
        className="rounded-full bg-plateau px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
      >
        {t('approve')}
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => review('rejected')}
        className="rounded-full bg-camellia px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
      >
        {t('reject')}
      </button>
      {msg ? <span className="text-xs text-ink/60">{msg}</span> : null}
    </div>
  );
}
`);

write('components/admin-inquiry-status.tsx', `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function AdminInquiryStatus({
  id,
  status,
}: {
  id: string;
  status: 'new' | 'contacted' | 'closed';
}) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(next: 'new' | 'contacted' | 'closed') {
    setLoading(true);
    try {
      await fetch(\`/api/admin/inquiries/\${id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      disabled={loading}
      defaultValue={status}
      onChange={(e) => setStatus(e.target.value as 'new' | 'contacted' | 'closed')}
      className="rounded-full border border-ink/15 bg-white px-2 py-1 text-xs"
    >
      <option value="new">{t('statusNew')}</option>
      <option value="contacted">{t('statusContacted')}</option>
      <option value="closed">{t('statusClosed')}</option>
    </select>
  );
}
`);

write('components/app-shell.tsx', `import { getTranslations } from 'next-intl/server';
import { SiteHeader } from '@/components/site-header';

export async function AppShell({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('common');
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-ink/10 py-8 text-center text-sm text-ink/50">
        {t('footer')}
      </footer>
    </div>
  );
}
`);

write('components/site-header.tsx', `'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { localeLabels, locales, type AppLocale } from '@/i18n/config';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const locale = useLocale() as AppLocale;

  const links = [
    { href: \`/\${locale}/cities\`, label: t('discover') },
    { href: \`/\${locale}/guides\`, label: t('guides') },
    { href: \`/\${locale}/pricing\`, label: t('pricing') },
    { href: \`/\${locale}/account\`, label: t('account') },
    { href: \`/\${locale}/admin\`, label: t('admin') },
  ];

  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href={\`/\${locale}\`} className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-ink">{tc('brand')}</span>
          <span className="text-xs text-ink/60">{tc('tagline')}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-ink/80 md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-plateau">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor="locale-switcher">
            {tc('language')}
          </label>
          <select
            id="locale-switcher"
            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm"
            defaultValue={locale}
            onChange={(e) => {
              const next = e.target.value;
              const path = window.location.pathname.replace(/^\\/[^/]+/, \`/\${next}\`);
              window.location.href = path + window.location.search;
            }}
          >
            {locales.map((code) => (
              <option key={code} value={code}>
                {localeLabels[code]}
              </option>
            ))}
          </select>
          <Link
            href={\`/\${locale}/login\`}
            className="rounded-full bg-camellia px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            {t('login')}
          </Link>
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-ink/5 px-4 py-2 text-sm md:hidden">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap text-ink/80">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
`);

console.log('components done');
