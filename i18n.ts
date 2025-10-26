import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'de'] as const;

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`./messages/${locale || 'en'}.json`)).default,
    locale: locale || 'en'
  };
});

