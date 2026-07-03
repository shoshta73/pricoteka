import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetails,
});

function ProductDetails() {
  const { t } = useTranslation();

  return <div className="p-2">{t("products.detailPlaceholder")}</div>;
}
