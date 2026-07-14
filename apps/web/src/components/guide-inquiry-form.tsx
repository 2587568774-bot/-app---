'use client';

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
          estimated_budget_usd: fd.get('estimated_budget_usd') || undefined,
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
      <input
        name="estimated_budget_usd"
        type="number"
        min="0"
        step="1"
        placeholder={t('budgetOptional')}
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder={t('message')}
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <p className="text-xs text-ink/50">{t('commissionHint')}</p>
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
