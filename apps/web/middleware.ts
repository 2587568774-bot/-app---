import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './src/i18n/config';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(en|zh-Hans|zh-Hant|ja|ko)/:path*', '/((?!api|auth|_next|_vercel|.*\\..*).*)'],
};
