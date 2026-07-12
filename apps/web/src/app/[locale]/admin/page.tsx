import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <p className="rounded-2xl border border-ink/10 bg-white p-6 text-ink/70">{t('locked')}</p>
    </div>
  );
}