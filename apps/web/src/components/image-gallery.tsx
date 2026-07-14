import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function ImageGallery({
  images,
  title,
  locale,
}: {
  images: string[];
  title?: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'intel' });
  const list = [...new Set(images.filter(Boolean))];
  if (list.length === 0) return null;
  const heading = title || t('gallery');

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-semibold">{heading}</h2>
        <p className="text-xs text-ink/45">{t('photosCount', { count: list.length })}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, 6).map((src, idx) => (
          <div key={`${src}-${idx}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
            <Image src={src} alt={`${heading} ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
