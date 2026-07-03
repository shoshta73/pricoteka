import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/products/create")({
  component: CreateProduct,
});

function CreateProduct() {
  const { t } = useTranslation();

  return <div className="p-2">{t("products.createTitle")}</div>;
}
