import { DatabaseIcon, InfoIcon, PackageIcon, StorefrontIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import packageJson from "../../package.json";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsStore } from "@/stores/settingsStore";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const { t } = useTranslation();
  const isApiMode = useSettingsStore((state) => state.runtimeMode === "api");
  const storageDescription = isApiMode ? t("pages.about.storageApi") : t("pages.about.storageBrowser");

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4 md:p-6">
      <section className="overflow-hidden rounded-xl border bg-card text-card-foreground">
        <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <img src="/logo.svg" alt="" className="size-8" aria-hidden="true" />
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">{t("pages.about.title")}</h1>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {t("pages.about.versionLabel", { version: packageJson.version })}
                </span>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{t("pages.about.subtitle")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <AboutCard
          icon={<InfoIcon className="size-5" />}
          title={t("pages.about.purposeTitle")}
          description={t("pages.about.purposeDescription")}
        />
        <AboutCard
          icon={<StorefrontIcon className="size-5" />}
          title={t("pages.about.dataTitle")}
          description={t("pages.about.dataDescription")}
        />
        <AboutCard
          icon={<DatabaseIcon className="size-5" />}
          title={t("pages.about.storageTitle")}
          description={storageDescription}
        />
        <AboutCard
          icon={<PackageIcon className="size-5" />}
          title={t("pages.about.releaseTitle")}
          description={t("pages.about.releaseDescription")}
        />
      </section>
    </main>
  );
}

function AboutCard({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <Card className="min-h-40">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">{icon}</div>
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
