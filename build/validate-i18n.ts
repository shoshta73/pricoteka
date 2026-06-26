import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { validateLocales } from "./i18n-utils.js";

const localesPath = resolve("src/locales");
const localeDirectories = await readdir(localesPath, { withFileTypes: true });
const messages: Record<string, unknown> = {};

for (const localeDirectory of localeDirectories) {
  if (!localeDirectory.isDirectory()) {
    continue;
  }

  const locale = localeDirectory.name;
  const translationPath = resolve(localesPath, locale, "translation.json");
  const source = await readFile(translationPath, "utf8");

  messages[locale] = JSON.parse(source);
}

validateLocales(messages);
