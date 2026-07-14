'use client';

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
      const res = await fetch(`/api/premium/status?email=${encodeURIComponent(email)}`);
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
      const statusRes = await fetch(`/api/premium/status?email=${encodeURIComponent(email)}`);
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
                  <li key={`${p.region_slug}-${p.version}`}>
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
