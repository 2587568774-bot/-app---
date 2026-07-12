import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { listAdminRegions } from '@/lib/regions/admin';

export default async function AdminRegionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; level?: string }>;
}) {
  const { locale } = await params;
  const { q = '', level = 'all' } = await searchParams;
  setRequestLocale(locale);

  let items = listAdminRegions('zh-Hans');
  if (level === 'city' || level === 'county') {
    items = items.filter((i) => i.level === level);
  }
  if (q.trim()) {
    const needle = q.trim().toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(needle) ||
        i.slug.includes(needle) ||
        i.code.includes(needle) ||
        i.parentName?.toLowerCase().includes(needle),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-ink/50">
            <Link href={`/${locale}/admin`} className="hover:text-plateau">
              Admin
            </Link>
            <span> / Regions</span>
          </p>
          <h1 className="text-3xl font-semibold">Region CMS</h1>
          <p className="mt-1 text-sm text-ink/60">{items.length} rows · sorted by lowest completeness first</p>
        </div>
      </div>

      <form className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name / slug / code"
          className="min-w-[220px] flex-1 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm"
        />
        <select
          name="level"
          defaultValue={level}
          className="rounded-full border border-ink/15 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All levels</option>
          <option value="city">Cities</option>
          <option value="county">Counties</option>
        </select>
        <button type="submit" className="rounded-full bg-plateau px-4 py-2 text-sm font-medium text-white">
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper/80 text-ink/60">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Parent</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug} className="border-t border-ink/5">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-ink/45">{item.slug}</div>
                </td>
                <td className="px-4 py-3 capitalize">{item.level}</td>
                <td className="px-4 py-3">{item.parentName || '—'}</td>
                <td className="px-4 py-3">
                  <ScorePill score={item.completeness} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/${locale}/admin/regions/${item.slug}`}
                    className="text-plateau hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-pine/10 text-pine' : score >= 55 ? 'bg-plateau/10 text-plateau' : 'bg-camellia/10 text-camellia';
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>{score}</span>;
}