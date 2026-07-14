'use client';

import { useTranslations } from 'next-intl';

export function MetricChips({
  altitudeM,
  climateType,
  migrationFriendliness,
  costOfLivingIndex,
  bestMonths,
}: {
  altitudeM?: number | null;
  climateType?: string | null;
  migrationFriendliness?: number | null;
  costOfLivingIndex?: number | null;
  bestMonths?: number[] | null;
}) {
  const t = useTranslations('metrics');
  const chips: string[] = [];
  if (altitudeM != null) chips.push(t('altitude', { m: altitudeM }));
  if (climateType) chips.push(climateType);
  if (migrationFriendliness != null) chips.push(t('migration', { score: migrationFriendliness }));
  if (costOfLivingIndex != null) chips.push(t('cost', { score: costOfLivingIndex }));
  if (bestMonths && bestMonths.length > 0) {
    chips.push(
      t('best', {
        months: bestMonths.map((m) => t(`months.${m}` as any)).join(' '),
      }),
    );
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full border border-ink/10 bg-white px-3 py-1">
          {chip}
        </span>
      ))}
    </div>
  );
}
