'use client';

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
              href={`/${locale}/login`}
              className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white"
            >
              {t('login')}
            </Link>
            <Link
              href={`/${locale}/guides/apply`}
              className="rounded-full border border-ink/15 px-4 py-2 text-sm"
            >
              {t('becomeGuide')}
            </Link>
            <Link
              href={`/${locale}/pricing`}
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
