import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import {
  getPlaceCulturePack,
  pickBi,
  type PlaceCulturePack,
} from '@/lib/regions/culture-pack';
import type { PlaceVisual } from '@/lib/regions/visuals';
import { pickLocalized } from '@/lib/regions/visuals';

export async function CulturePanel({
  visual,
  locale,
  slug,
  parentSlug,
}: {
  visual: PlaceVisual;
  locale: string;
  slug: string;
  parentSlug?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'culture' });
  const culture = pickLocalized(visual.culture, locale);
  const lifestyle = pickLocalized(visual.lifestyle, locale);
  const pack = getPlaceCulturePack(slug, parentSlug);
  const ethnicNote = pickBi(pack.ethnicNote, locale);

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-camellia">
            {t('peopleTitle')}
          </p>
          <h2 className="mt-2 text-xl font-semibold">{t('peopleHeading')}</h2>
          <p className="mt-4 text-sm leading-7 text-ink/75">{culture}</p>
        </article>
        <article className="rounded-3xl border border-ink/10 bg-gradient-to-br from-plateau/10 via-white to-camellia/10 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-plateau">
            {t('dailyTitle')}
          </p>
          <h2 className="mt-2 text-xl font-semibold">{t('dailyHeading')}</h2>
          <p className="mt-4 text-sm leading-7 text-ink/75">{lifestyle}</p>
          <p className="mt-6 text-xs text-ink/45">{t('photoNote', { credit: visual.credit })}</p>
        </article>
      </div>

      <CultureImageStrip images={pack.cultureImages} title={t('cultureGallery')} locale={locale} />
      <EthnicDistribution pack={pack} locale={locale} note={ethnicNote} />
    </section>
  );
}

async function CultureImageStrip({
  images,
  title,
  locale,
}: {
  images: string[];
  title: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'intel' });
  const list = [...new Set(images.filter(Boolean))].slice(0, 4);
  if (!list.length) return null;

  return (
    <section className="space-y-3 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xs text-ink/45">{t('photosCount', { count: list.length })}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink/10 bg-paper"
          >
            <Image
              src={src}
              alt={`${title} ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function parseShare(share: string): number {
  const m = share.match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 20;
}

async function EthnicDistribution({
  pack,
  locale,
  note,
}: {
  pack: PlaceCulturePack;
  locale: string;
  note: string;
}) {
  const t = await getTranslations({ locale, namespace: 'culture' });
  const groups = pack.ethnicGroups || [];

  return (
    <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-camellia">
        {t('ethnicTitle')}
      </p>
      <h3 className="mt-2 text-xl font-semibold">{t('ethnicHeading')}</h3>
      <p className="mt-2 text-sm text-ink/65">{note}</p>
      <p className="mt-1 text-xs text-ink/45">{t('ethnicDisclaimer')}</p>

      <div className="mt-5 space-y-3">
        {groups.map((g) => {
          const label = pickBi(g.name, locale);
          const width = Math.max(8, Math.min(100, parseShare(g.share)));
          return (
            <div key={`${label}-${g.share}`}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-ink/55">{g.share}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-paper">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-plateau to-camellia"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
