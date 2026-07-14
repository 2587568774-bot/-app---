'use client';

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
      await fetch(`/api/admin/inquiries/${id}`, {
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
