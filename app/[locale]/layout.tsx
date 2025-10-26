import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales } from '@/i18n';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  const validLocale = (locales as readonly string[]).includes(locale) ? locale : 'en';
  
  const messages = await getMessages({ locale: validLocale });

  return (
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

