import { PackageIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export const Route = createFileRoute("/products")({
  component: Products,
});

function Products() {
  const { t } = useTranslation();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageIcon />
        </EmptyMedia>
        <EmptyTitle>{t("products.placeholderTitle")}</EmptyTitle>
        <EmptyDescription>{t("products.placeholderDescription")}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
