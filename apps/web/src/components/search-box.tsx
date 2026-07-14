'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';

export function SearchBox({
  locale = 'en',
  placeholder,
  initialQuery = '',
}: {
  locale?: string;
  placeholder?: string;
  initialQuery?: string;
}) {
  const t = useTranslations('common');
  const [q, setQ] = useState(initialQuery);
  const resolvedPlaceholder = placeholder || t('searchPlaceholder');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    window.location.assign(`/${locale}/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={resolvedPlaceholder}
        className="w-full rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none ring-plateau/30 focus:ring"
      />
      <button
        type="submit"
        className="rounded-full bg-plateau px-4 py-2.5 text-sm font-medium text-white"
      >
        {t('search')}
      </button>
    </form>
  );
}
