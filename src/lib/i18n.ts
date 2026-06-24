const defaultLocale = "en";

const messages = {
  en: {
    nav: {
      stores: "Stores",
    },
    stores: {
      title: "Stores",
    },
  },
  hr: {
    nav: {
      stores: "Trgovine",
    },
    stores: {
      title: "Trgovine",
    },
  },
} as const;

type Locale = keyof typeof messages;
type MessageTree = (typeof messages)[typeof defaultLocale];
type MessageKey<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${MessageKey<T[K]>}`;
}[keyof T & string];

export type TranslationKey = MessageKey<MessageTree>;

const supportedLocales = Object.keys(messages) as Locale[];

function isSupportedLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
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

export function t(key: TranslationKey, locale = getPreferredLocale()) {
  const localizedMessage = getMessage(locale, key);

  if (typeof localizedMessage === "string") {
    return localizedMessage;
  }

  const fallbackMessage = getMessage(defaultLocale, key);

  return typeof fallbackMessage === "string" ? fallbackMessage : key;
}
