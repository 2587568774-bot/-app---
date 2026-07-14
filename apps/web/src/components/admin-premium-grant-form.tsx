'use client';

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
