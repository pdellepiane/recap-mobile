import en from './locales/en.json';
import es from './locales/es.json';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const SUPPORTED_LOCALES = ['en', 'es'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

function resolveInitialLocale(): AppLocale {
  const code = Localization.getLocales()[0]?.languageCode?.toLowerCase() ?? 'en';
  if (code.startsWith('es')) {
    return 'es';
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: resolveInitialLocale(),
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false,
  },
});

export default i18n;
