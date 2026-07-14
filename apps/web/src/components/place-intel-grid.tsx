import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getPlaceCulturePack, pickBi } from '@/lib/regions/culture-pack';

type Props = {
  food?: string;
  scenery?: string;
  migration?: string;
  locale: string;
  slug: string;
  parentSlug?: string;
};

export async function PlaceIntelGrid({
  food,
  scenery,
  migration,
  locale,
  slug,
  parentSlug,
}: Props) {
  const t = await getTranslations({ locale, namespace: 'intel' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const fallback = tc('fillingIn');
  const pack = getPlaceCulturePack(slug, parentSlug);

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">{t('food')}</h2>
          <p className="text-xs text-ink/45">{t('foodHint')}</p>
        </div>
        {food ? <p className="text-sm leading-6 text-ink/70">{food}</p> : null}
        <div className="grid gap-4 md:grid-cols-3">
          {pack.foodItems.map((item, idx) => {
            const name = pickBi(item.name, locale);
            const note = pickBi(item.note, locale);
            return (
              <article
                key={`${name}-${idx}`}
                className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{name}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/70">{note}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">{t('scenery')}</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">{scenery || fallback}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">{t('migration')}</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">{migration || fallback}</p>
        </div>
      </div>
    </section>
  );
}
