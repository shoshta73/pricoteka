import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "../../public/locales/en/translation.json";
import hr from "../../public/locales/hr/translation.json";

const localeStorageKey = "pricoteka-locale";

export const defaultLocale = "en";
export const supportedLocales = ["en", "hr"] as const;

export type Locale = (typeof supportedLocales)[number];

function isSupportedLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}

export function getLocale(): Locale {
  const locale = i18n.resolvedLanguage ?? i18n.language;

  return isSupportedLocale(locale) ? locale : defaultLocale;
}

function setStoredLocale(locale: Locale) {
  localStorage.setItem(localeStorageKey, locale);
}

export async function setLanguage(locale: string) {
  if (!isSupportedLocale(locale)) {
    throw new Error(`Unsupported language "${locale}". Supported languages: ${supportedLocales.join(", ")}`);
  }

  setStoredLocale(locale);
  await i18n.changeLanguage(locale);
}

export async function resetLanguage() {
  localStorage.removeItem(localeStorageKey);
  await i18n.changeLanguage(undefined);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS: "translation",
    detection: {
      caches: ["localStorage"],
      lookupLocalStorage: localeStorageKey,
      order: ["localStorage", "navigator"],
    },
    fallbackLng: defaultLocale,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: en },
      hr: { translation: hr },
    },
    supportedLngs: supportedLocales,
  });

declare global {
  interface Window {
    pricoteka?: {
      getLanguage: () => Locale;
      resetLanguage: () => Promise<void>;
      setLanguage: (locale: string) => Promise<void>;
      supportedLanguages: Locale[];
    };
  }
}

export function installPricotekaBrowserTools() {
  if (!import.meta.env.DEV || typeof window === "undefined") {
    return;
  }

  window.pricoteka = {
    getLanguage: getLocale,
    resetLanguage,
    setLanguage,
    supportedLanguages: [...supportedLocales],
  };
}

export { i18n };
