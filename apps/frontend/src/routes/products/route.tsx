import { PackageIcon, PlusIcon } from "@phosphor-icons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useProductsStore } from "@/stores/productsStore";

export const Route = createFileRoute("/products")({
  component: Products,
});

function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const products = useProductsStore((state) => state.products);

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
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
