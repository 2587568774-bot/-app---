'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBox({
  locale,
  placeholder = 'Search cities & counties',
  initialQuery = '',
}: {
  locale: string;
  placeholder?: string;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none ring-plateau/30 focus:ring"
      />
      <button
        type="submit"
        className="rounded-full bg-plateau px-4 py-2.5 text-sm font-medium text-white"
      >
        Search
      </button>
    </form>
  );
}