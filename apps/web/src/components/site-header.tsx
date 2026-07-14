'use client';

import { useLocale, useTranslations } from 'next-intl';
import { localeLabels, locales, type AppLocale } from '@/i18n/config';

function go(href: string) {
  if (typeof window !== 'undefined') {
    window.location.assign(href);
  }
}

export function SiteHeader() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const locale = useLocale() as AppLocale;

  const links = [
    { href: `/${locale}/cities`, label: t('discover') },
    { href: `/${locale}/guides`, label: t('guides') },
    { href: `/${locale}/pricing`, label: t('pricing') },
    { href: `/${locale}/account`, label: t('account') },
    { href: `/${locale}/admin`, label: t('admin') },
  ];

  return (
    <header className="sticky top-0 z-[200] isolate border-b border-ink/10 bg-paper/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a
          href={`/${locale}`}
          onClick={(e) => {
            e.preventDefault();
            go(`/${locale}`);
          }}
          className="relative z-[201] flex cursor-pointer flex-col"
        >
          <span className="text-lg font-semibold tracking-tight text-ink">{tc('brand')}</span>
          <span className="text-xs text-ink/60">{tc('tagline')}</span>
        </a>

        <nav className="relative z-[201] hidden items-center gap-1 text-sm font-medium md:flex">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                go(item.href);
              }}
              className="cursor-pointer rounded-full px-3 py-2 text-ink/80 transition hover:bg-ink/5 hover:text-plateau"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="relative z-[201] flex items-center gap-2">
          <label className="sr-only" htmlFor="locale-switcher">
            {tc('language')}
          </label>
          <select
            id="locale-switcher"
            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm"
            value={locale}
            onChange={(e) => {
              const next = e.target.value;
              const path = window.location.pathname.replace(/^\/[^/]+/, `/${next}`);
              window.location.assign(path + window.location.search);
            }}
          >
            {locales.map((code) => (
              <option key={code} value={code}>
                {localeLabels[code]}
              </option>
            ))}
          </select>
          <a
            href={`/${locale}/login`}
            onClick={(e) => {
              e.preventDefault();
              go(`/${locale}/login`);
            }}
            className="cursor-pointer rounded-full bg-camellia px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            {t('login')}
          </a>
        </div>
      </div>

      <nav className="relative z-[201] flex gap-1 overflow-x-auto border-t border-ink/5 px-3 py-2 text-sm md:hidden">
        {links.map((item) => (
          <a
            key={`m-${item.href}`}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              go(item.href);
            }}
            className="cursor-pointer whitespace-nowrap rounded-full px-3 py-2 text-ink/80 hover:bg-ink/5 hover:text-plateau"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
