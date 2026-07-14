import Image from 'next/image';

export function PlaceHero({
  title,
  subtitle,
  cover,
  mood,
  tags = [],
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  cover: string;
  mood?: string;
  tags?: string[];
  eyebrow?: string;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-ink/10 bg-ink text-white shadow-sm">
      <div className="relative min-h-[320px] md:min-h-[420px]">
        <Image
          src={cover}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          {eyebrow ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-2xl text-sm text-white/85 md:text-base">{subtitle}</p> : null}
          {mood ? <p className="mt-4 text-sm text-white/70">{mood}</p> : null}
          {tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
