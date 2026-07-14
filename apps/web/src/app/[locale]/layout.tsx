import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { locales, type AppLocale } from '@/i18n/config';
import { getSiteUrl, SITE_NAME } from '@/lib/site';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const site = getSiteUrl();
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(site),
    title: {
      default: title,
      template: `%s · ${SITE_NAME}`,
    },
    description,
    applicationName: SITE_NAME,
    keywords: [
      'Yunnan',
      '看见云南',
      'See Yunnan',
      'Kunming',
      'Dali',
      'Lijiang',
      'Shangri-La',
      'travel',
      'migration',
      'local guides',
    ],
    alternates: {
      canonical: `${site}/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${site}/${l}`])),
    },
    openGraph: {
      type: 'website',
      locale,
      url: `${site}/${locale}`,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <AppShell>{children}</AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
