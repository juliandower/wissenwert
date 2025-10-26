"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    // Replace the locale in the current pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    window.location.href = newPath; // Force full page reload
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('en')}
        className="text-xs"
      >
        EN
      </Button>
      <Button
        variant={locale === 'de' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('de')}
        className="text-xs"
      >
        DE
      </Button>
    </div>
  );
}

