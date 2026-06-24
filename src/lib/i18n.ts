import { defaultLocale, messages } from "@/lib/i18n.generated";

const localeStorageKey = "pricoteka-locale";

export type Locale = keyof typeof messages;
type MessageTree = (typeof messages)[typeof defaultLocale];
type MessageKey<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${MessageKey<T[K]>}`;
}[keyof T & string];

export type TranslationKey = MessageKey<MessageTree>;

const supportedLocales = Object.keys(messages) as Locale[];

function isSupportedLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}

function getStoredLocale(): Locale | undefined {
  if (typeof localStorage === "undefined") {
    return undefined;
  }

  const storedLocale = localStorage.getItem(localeStorageKey);

  return storedLocale && isSupportedLocale(storedLocale) ? storedLocale : undefined;
}

export function getLocale(): Locale {
  return getStoredLocale() ?? getPreferredLocale();
}

export function getPreferredLocale(): Locale {
  if (typeof navigator === "undefined") {
    return defaultLocale;
  }

  for (const language of navigator.languages) {
    const normalizedLanguage = language.toLowerCase();
    const baseLanguage = normalizedLanguage.split("-")[0];

    if (isSupportedLocale(normalizedLanguage)) {
      return normalizedLanguage;
    }

    if (baseLanguage && isSupportedLocale(baseLanguage)) {
      return baseLanguage;
    }
  }

  return defaultLocale;
}

function getMessage(locale: Locale, key: TranslationKey) {
  return key.split(".").reduce<unknown>((message, segment) => {
    if (message && typeof message === "object" && segment in message) {
      return (message as Record<string, unknown>)[segment];
    }

    return undefined;
  }, messages[locale]);
}

export function t(key: TranslationKey, locale = getLocale()) {
  const localizedMessage = getMessage(locale, key);

  if (typeof localizedMessage === "string") {
    return localizedMessage;
  }

  const fallbackMessage = getMessage(defaultLocale, key);

  return typeof fallbackMessage === "string" ? fallbackMessage : key;
}

function setLanguage(locale: string) {
  if (!isSupportedLocale(locale)) {
    throw new Error(`Unsupported language "${locale}". Supported languages: ${supportedLocales.join(", ")}`);
  }

  localStorage.setItem(localeStorageKey, locale);
  window.location.reload();
}

function resetLanguage() {
  localStorage.removeItem(localeStorageKey);
  window.location.reload();
}

declare global {
  interface Window {
    pricoteka?: {
      getLanguage: () => Locale;
      resetLanguage: () => void;
      setLanguage: (locale: string) => void;
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
    supportedLanguages: supportedLocales,
  };
}
