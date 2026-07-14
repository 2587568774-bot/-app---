'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type AdminTreeCity = {
  slug: string;
  code: string;
  name: string;
  completeness: number;
  is_featured?: boolean;
  counties: Array<{
    slug: string;
    code: string;
    name: string;
    completeness: number;
  }>;
};

export function AdminRegionTree({
  locale,
  cities,
  labels,
}: {
  locale: string;
  cities: AdminTreeCity[];
  labels: {
    expand: string;
    collapse: string;
    edit: string;
    upload: string;
    noCounties: string;
    cityBranch: string;
    countyBranch: string;
    score: string;
  };
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const c of cities.slice(0, 3)) init[c.slug] = true;
    return init;
  });

  const totalCounties = useMemo(
    () => cities.reduce((n, c) => n + c.counties.length, 0),
    [cities],
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/55">
        {cities.length} cities 路 {totalCounties} counties
      </p>
      <div className="space-y-3">
        {cities.map((city) => {
          const expanded = Boolean(open[city.slug]);
          return (
            <section key={city.slug} className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-plateau">{labels.cityBranch}</p>
                  <h2 className="text-lg font-semibold">{city.name}</h2>
                  <p className="text-xs text-ink/45">
                    {city.slug} 路 {city.code} 路 {labels.score} {city.completeness}
                    {city.is_featured ? ' 路 featured' : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen((s) => ({ ...s, [city.slug]: !expanded }))}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-sm"
                  >
                    {expanded ? labels.collapse : labels.expand}
                    {city.counties.length ? ` (${city.counties.length})` : ''}
                  </button>
                  <Link
                    href={`/${locale}/admin/regions/${city.slug}`}
                    className="rounded-full bg-plateau px-3 py-1.5 text-sm font-medium text-white"
                  >
                    {labels.upload}
                  </Link>
                  <Link
                    href={`/${locale}/admin/regions/${city.slug}`}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-sm"
                  >
                    {labels.edit}
                  </Link>
                </div>
              </div>

              {expanded ? (
                <div className="border-t border-ink/5 bg-paper/40 px-4 py-3">
                  {city.counties.length === 0 ? (
                    <p className="text-sm text-ink/50">{labels.noCounties}</p>
                  ) : (
                    <div className="space-y-2">
                      {city.counties.map((county) => (
                        <div
                          key={county.slug}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white px-3 py-2"
                        >
                          <div>
                            <p className="text-[11px] text-ink/45">
                              {labels.countyBranch} {city.name}
                            </p>
                            <p className="font-medium">{county.name}</p>
                            <p className="text-xs text-ink/45">
                              {county.slug} 路 {county.code} 路 {labels.score} {county.completeness}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/${locale}/admin/regions/${county.slug}`}
                              className="rounded-full bg-camellia px-3 py-1.5 text-sm font-medium text-white"
                            >
                              {labels.upload}
                            </Link>
                            <Link
                              href={`/${locale}/admin/regions/${county.slug}`}
                              className="rounded-full border border-ink/15 px-3 py-1.5 text-sm"
                            >
                              {labels.edit}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

