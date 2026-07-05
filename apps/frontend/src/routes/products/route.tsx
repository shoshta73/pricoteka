import { ArrowRightIcon, PackageIcon, PlusIcon } from "@phosphor-icons/react";
import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button, buttonVariants } from "@pricoteka/ui-core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@pricoteka/ui-core/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@pricoteka/ui-core/empty";
import { useProductsData } from "@/services/products/useProductsData";
import { useStoresData } from "@/services/stores/useStoresData";

export const Route = createFileRoute("/products")({
  component: Products,
});

function Products() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { products, isError, isLoading } = useProductsData();
  const { stores } = useStoresData();
  const isChildRoute = useRouterState({ select: (state) => state.location.pathname !== "/products" });
  const currencyFormatter = new Intl.NumberFormat(i18n.language, { currency: "EUR", style: "currency" });
  const storeNamesById = new Map(stores.map((store) => [store.id, store.name]));
  const officeNamesById = new Map(stores.flatMap((store) => store.offices.map((office) => [office.id, office.name])));

  if (isChildRoute) {
    return <Outlet />;
  }

  if (isLoading) {
    return <div className="p-2">{t("products.loading")}</div>;
  }

  if (isError) {
    return <div className="p-2">{t("products.loadFailure")}</div>;
  }

  if (products.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageIcon />
          </EmptyMedia>
          <EmptyTitle>{t("products.emptyTitle")}</EmptyTitle>
          <EmptyDescription>{t("products.emptyDescription")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => void navigate({ to: "/products/create" })}>
            <PlusIcon data-icon="inline-start" />
            {t("products.createAction")}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col justify-center space-y-4 p-2">
      <Card>
        <CardContent>
          <div className="flex items-center space-x-2 py-2">
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
              <PackageIcon className="size-4" />
              <span>{t("products.title")}</span>
              <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-foreground">
                {products.length}
              </span>
            </div>
            <div className="grow" />
            <Button onClick={() => void navigate({ to: "/products/create" })}>
              <PlusIcon data-icon="inline-start" />
              {t("products.createAction")}
            </Button>
          </div>
        </CardContent>
      </Card>
      {products.map((product) => (
        <Card key={product.id} className="max-w-xl">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="min-w-0 grow">
                <CardTitle>{product.name}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">{currencyFormatter.format(product.price)}</p>
              </div>
              <Link
                to="/products/$productId"
                params={{ productId: product.id }}
                className={buttonVariants({ variant: "outline" })}
              >
                {t("products.viewAction")}
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{product.description || t("products.noDescription")}</p>
              <div className="flex flex-wrap gap-2">
                {product.found_in.length === 0 ? (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {t("products.noLocations")}
                  </span>
                ) : (
                  product.found_in.map((location) => {
                    const storeName = location.store_id ? storeNamesById.get(location.store_id) : null;
                    const officeName = officeNamesById.get(location.office_id);
                    return (
                      <span
                        key={`${location.store_id ?? "unknown"}-${location.office_id}`}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {storeName && officeName ? `${storeName} / ${officeName}` : t("products.unknownLocation")}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
