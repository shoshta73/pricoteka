import { describe, expect, it } from "vitest";

import { validateLocales } from "./i18n-utils.js";

const validMessages = {
  en: {
    nav: {
      stores: "Stores",
    },
  },
  hr: {
    nav: {
      stores: "Trgovine",
    },
  },
};

describe("i18n utilities", () => {
  it("validates matching locale message trees", () => {
    expect(validateLocales(validMessages)).toEqual(validMessages);
  });

  it("rejects invalid locale identifiers", () => {
    expect(() =>
      validateLocales({
        en: { title: "Title" },
        "HR-hr": { title: "Naslov" },
      }),
    ).toThrow('Invalid locale "HR-hr"');
  });

  it("rejects messages without the default locale", () => {
    expect(() => validateLocales({ hr: { title: "Naslov" } })).toThrow('locales must contain the default "en" locale.');
  });

  it("rejects missing translated keys", () => {
    expect(() =>
      validateLocales({
        en: { nav: { stores: "Stores" }, stores: { title: "Stores" } },
        hr: { nav: { stores: "Trgovine" } },
      }),
    ).toThrow("hr missing key: stores.title");
  });

  it("rejects extra translated keys", () => {
    expect(() =>
      validateLocales({
        en: { nav: { stores: "Stores" } },
        hr: { nav: { stores: "Trgovine" }, stores: { title: "Trgovine" } },
      }),
    ).toThrow("hr has extra key: stores.title");
  });
});
