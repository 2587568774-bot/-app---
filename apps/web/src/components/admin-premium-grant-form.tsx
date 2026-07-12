'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminPremiumGrantForm() {
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
          months: fd.get('months'),
          note: fd.get('note'),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Grant failed');
      setMsg(`Granted Premium to ${json.subscription.email}`);
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Grant failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-ink/10 bg-white p-5">
      <h2 className="font-semibold">Manual Premium grant</h2>
      <input
        name="email"
        type="email"
        required
        placeholder="member@email.com"
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <input
        name="months"
        type="number"
        min={1}
        defaultValue={1}
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <input
        name="note"
        placeholder="Payment note (PayPal / transfer ref)"
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? 'Saving…' : 'Grant / extend'}
      </button>
      {msg ? <p className="text-sm text-ink/70">{msg}</p> : null}
    </form>
  );
}