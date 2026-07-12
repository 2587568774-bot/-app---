'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { localeLabels, locales, type AppLocale } from '@/i18n/config';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const locale = useLocale() as AppLocale;

  const links = [
    { href: `/${locale}`, label: t('discover') },
    { href: `/${locale}/guides`, label: t('guides') },
    { href: `/${locale}/pricing`, label: t('pricing') },
    { href: `/${locale}/account`, label: t('account') },
  ];

  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href={`/${locale}`} className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-ink">{tc('brand')}</span>
          <span className="text-xs text-ink/60">{tc('tagline')}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-ink/80 md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-plateau">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor="locale-switcher">
            Language
          </label>
          <select
            id="locale-switcher"
            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm"
            defaultValue={locale}
            onChange={(e) => {
              const next = e.target.value;
              const path = window.location.pathname.replace(/^\/[^/]+/, `/${next}`);
              window.location.href = path + window.location.search;
            }}
          >
            {locales.map((code) => (
              <option key={code} value={code}>
                {localeLabels[code]}
              </option>
            ))}
          </select>
          <Link
            href={`/${locale}/login`}
            className="rounded-full bg-camellia px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            {t('login')}
          </Link>
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-ink/5 px-4 py-2 text-sm md:hidden">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap text-ink/80">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

