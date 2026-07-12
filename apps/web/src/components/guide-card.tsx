import Link from 'next/link';
import type { Guide } from '@/lib/guides/types';

export function GuideCard({ guide, locale }: { guide: Guide; locale: string }) {
  return (
    <Link
      href={`/${locale}/guides/${guide.id}`}
      className="block rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition hover:border-plateau/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{guide.display_name}</h3>
          <p className="mt-1 text-sm text-ink/65">{guide.headline}</p>
        </div>
        <span className="rounded-full bg-plateau/10 px-2 py-1 text-xs font-medium text-plateau">
          {guide.years_experience}y
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-ink/70">{guide.bio}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink/60">
        {guide.languages.map((l) => (
          <span key={l} className="rounded-full bg-paper px-2 py-1">
            {l}
          </span>
        ))}
        {guide.specialties.slice(0, 3).map((s) => (
          <span key={s} className="rounded-full bg-paper px-2 py-1">
            {s}
          </span>
        ))}
      </div>
    </Link>
  );
}