import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getLocale, resetLanguage, setLanguage, supportedLocales, type Locale } from "@/lib/i18n";

export function LocaleDevtoolsPanel() {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState(getLocale());

  async function selectLocale(nextLocale: Locale) {
    await setLanguage(nextLocale);
    setLocale(nextLocale);
  }

  async function resetLocale() {
    await resetLanguage();
    setLocale(getLocale());
  }

  return (
    <section
      style={{
        boxSizing: "border-box",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        fontFamily: "inherit",
        gap: 16,
        lineHeight: 1.5,
        maxWidth: 420,
        padding: 16,
      }}
    >
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, margin: 0 }}>Locale</h2>
        <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.5, margin: "4px 0 0" }}>
          Switch the active i18next language for local development.
        </p>
      </div>
      <dl
        style={{
          display: "grid",
          fontSize: 12,
          gap: "4px 12px",
          gridTemplateColumns: "max-content 1fr",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        <dt style={{ color: "#9ca3af" }}>Current</dt>
        <dd style={{ margin: 0 }}>{locale}</dd>
        <dt style={{ color: "#9ca3af" }}>Resolved</dt>
        <dd style={{ margin: 0 }}>{i18n.resolvedLanguage ?? i18n.language}</dd>
      </dl>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {supportedLocales.map((supportedLocale) => (
          <button
            key={supportedLocale}
            type="button"
            onClick={() => selectLocale(supportedLocale)}
            style={{
              background: locale === supportedLocale ? "#0284c7" : "transparent",
              border: "1px solid #475569",
              borderRadius: 6,
              color: locale === supportedLocale ? "#ffffff" : "inherit",
              cursor: "pointer",
              font: "inherit",
              fontSize: 12,
              lineHeight: 1.4,
              padding: "5px 10px",
            }}
          >
            {supportedLocale}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={resetLocale}
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: 0,
          color: "inherit",
          cursor: "pointer",
          font: "inherit",
          fontSize: 12,
          lineHeight: 1.4,
          padding: 0,
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        Reset to detected language
      </button>
    </section>
  );
}
