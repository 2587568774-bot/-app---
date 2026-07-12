'use client';

import { FormEvent, useState } from 'react';

type StatusResponse = {
  premium: boolean;
  subscription?: {
    status: string;
    current_period_end: string;
    provider: string;
    price_usd: number;
  } | null;
  offline_packs?: Array<{ region_slug: string; version: number; downloaded_at: string }>;
  error?: string;
};

export function PremiumStatusPanel() {
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
      if (!res.ok) throw new Error(json.error || 'Failed');
      setData(json);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Failed');
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
      if (!res.ok) throw new Error(json.error || 'Failed');
      // store payload in browser for offline demo
      localStorage.setItem(`see-yunnan-pack:${region}`, JSON.stringify(json.payload));
      setMsg(`Offline pack saved for ${region} (v${json.pack.version}).`);
      const statusRes = await fetch(`/api/premium/status?email=${encodeURIComponent(email)}`);
      setData(await statusRes.json());
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
      <h2 className="text-lg font-semibold">Premium status</h2>
      <form onSubmit={checkStatus} className="flex flex-wrap gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-[240px] flex-1 rounded-full border border-ink/15 px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Check
        </button>
      </form>

      {data ? (
        <div className="rounded-xl bg-paper px-4 py-3 text-sm">
          <p>
            Status:{' '}
            <span className="font-semibold">{data.premium ? 'Premium active' : 'Free'}</span>
          </p>
          {data.subscription ? (
            <p className="mt-1 text-ink/65">
              Until {new Date(data.subscription.current_period_end).toLocaleString()} ·{' '}
              {data.subscription.provider} · ${data.subscription.price_usd}
            </p>
          ) : null}
          {data.offline_packs && data.offline_packs.length > 0 ? (
            <ul className="mt-2 list-disc pl-5 text-ink/65">
              {data.offline_packs.map((p) => (
                <li key={`${p.region_slug}-${p.version}`}>
                  {p.region_slug} v{p.version}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {data?.premium ? (
        <div className="flex flex-wrap gap-2">
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="region slug"
            className="rounded-full border border-ink/15 px-4 py-2 text-sm"
          />
          <button
            type="button"
            onClick={downloadPack}
            disabled={loading}
            className="rounded-full bg-camellia px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            Save offline pack
          </button>
        </div>
      ) : null}

      {msg ? <p className="text-sm text-ink/70">{msg}</p> : null}
      <p className="text-xs text-ink/45">
        Early path: pay personally, then admin grants Premium by email. Stripe comes next.
      </p>
    </div>
  );
}