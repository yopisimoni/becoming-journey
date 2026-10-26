import { Locale } from '@/types';
import { TranslationDictionary } from './types';
import { en } from './en';
import { ar } from './ar';
import { fr } from './fr';
import { es } from './es';
import { it } from './it';

export const locales: Record<Locale, TranslationDictionary> = {
  en,
  ar,
  fr,
  es,
  it,
};

export const defaultLocale: Locale = 'en';

export const supportedLocales: { code: Locale; name: string; isRtl: boolean }[] = [
  { code: 'en', name: 'English', isRtl: false },
  { code: 'ar', name: 'العربية', isRtl: true },
  { code: 'fr', name: 'Français', isRtl: false },
  { code: 'es', name: 'Español', isRtl: false },
  { code: 'it', name: 'Italiano', isRtl: false },
];

export function getDictionary(locale: Locale): TranslationDictionary {
  return locales[locale] || locales[defaultLocale];
}

export * from './types';
