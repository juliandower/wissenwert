import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|en)/:path*'],
  // Skip all static files, API routes, and Next.js internals
  ignore: [
    '/api/:path*',
    '/_next/:path*',
    '/favicon.ico',
    '/:path*\\.(jpg|jpeg|png|gif|svg|ico|webp|woff|woff2|ttf|eot)$'
  ]
};

