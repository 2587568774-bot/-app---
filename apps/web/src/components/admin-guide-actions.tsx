'use client';

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
      const res = await fetch(`/api/admin/guides/${id}/review`, {
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
