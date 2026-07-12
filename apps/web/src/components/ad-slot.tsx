export function AdSlot({
  show,
  label = 'Sponsored',
}: {
  show: boolean;
  label?: string;
}) {
  if (!show) return null;
  return (
    <div className="rounded-2xl border border-dashed border-camellia/30 bg-camellia/5 px-4 py-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-camellia">{label}</p>
      <p className="mt-2 text-sm text-ink/65">
        Premium removes ads · Offline packs · Priority guide matching
      </p>
    </div>
  );
}