'use client';

import { FormEvent, useState } from 'react';

export function GuideInquiryForm({
  guideId,
  regionSlug,
}: {
  guideId: string;
  regionSlug?: string;
}) {
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
      if (!res.ok) throw new Error(json.error || 'Failed');
      setMsg('Inquiry sent. The guide/admin can follow up by email.');
      e.currentTarget.reset();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-ink/10 bg-white p-5">
      <h3 className="font-semibold">Send inquiry</h3>
      <input
        name="contact_name"
        placeholder="Your name"
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <input
        name="contact_email"
        type="email"
        required
        placeholder="Email"
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="What do you need help with?"
        className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-camellia px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? 'Sending…' : 'Submit inquiry'}
      </button>
      {msg ? <p className="text-sm text-ink/70">{msg}</p> : null}
    </form>
  );
}