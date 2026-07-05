import { PackageIcon, PlusIcon, StorefrontIcon } from "@phosphor-icons/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { buttonVariants } from "@pricoteka/ui-core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@pricoteka/ui-core/card";
import { useProductsData } from "@/services/products/useProductsData";
import { useStoresData } from "@/services/stores/useStoresData";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const { stores, isLoading: storesLoading, isError: storesError } = useStoresData();
  const { products, isLoading: productsLoading, isError: productsError } = useProductsData();
  const officeCount = stores.reduce((count, store) => count + store.offices.length, 0);

  if (storesLoading || productsLoading) {
    return <div className="p-2">{t("dashboard.loading")}</div>;
  }

  if (storesError || productsError) {
    return <div className="p-2">{t("dashboard.loadFailure")}</div>;
  }

  return (
    <main className="flex flex-col gap-4 p-2 md:p-4">
      <section className="rounded-xl border bg-card p-5 text-card-foreground md:p-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{t("dashboard.title")}</h1>
          <p className="text-sm text-muted-foreground md:text-base">{t("dashboard.subtitle")}</p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard label={t("dashboard.storesMetric")} value={stores.length} icon={<StorefrontIcon className="size-5" />} />
        <MetricCard label={t("dashboard.officesMetric")} value={officeCount} icon={<StorefrontIcon className="size-5" />} />
        <MetricCard label={t("dashboard.productsMetric")} value={products.length} icon={<PackageIcon className="size-5" />} />
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.createTitle")}</CardTitle>
            <CardDescription>{t("dashboard.createDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link to="/stores/create" className={buttonVariants()}>
                <PlusIcon data-icon="inline-start" />
                {t("stores.createAction")}
              </Link>
              <Link to="/products/create" className={buttonVariants({ variant: "outline" })}>
                <PlusIcon data-icon="inline-start" />
                {t("products.createAction")}
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.browseTitle")}</CardTitle>
            <CardDescription>{t("dashboard.browseDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link to="/stores" className={buttonVariants({ variant: "outline" })}>
                {t("dashboard.viewStoresAction")}
              </Link>
              <Link to="/products" className={buttonVariants({ variant: "outline" })}>
                {t("dashboard.viewProductsAction")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardDescription>{label}</CardDescription>
          <div className="rounded-full bg-muted p-2 text-muted-foreground">{icon}</div>
        </div>
        <CardTitle className="text-3xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
