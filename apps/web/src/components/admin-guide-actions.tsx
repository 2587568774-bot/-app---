'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminGuideActions({ id }: { id: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function review(decision: 'approved' | 'rejected') {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/guides/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reject_reason: decision === 'rejected' ? 'Needs more detail' : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setMsg(decision === 'approved' ? 'Approved' : 'Rejected');
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Failed');
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
        className="rounded-full bg-pine px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => review('rejected')}
        className="rounded-full bg-camellia px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
      >
        Reject
      </button>
      {msg ? <span className="text-xs text-ink/60">{msg}</span> : null}
    </div>
  );
}