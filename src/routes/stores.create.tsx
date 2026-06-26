import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/stores/create")({
  component: CreateStore,
});

function CreateStore() {
  const { t } = useTranslation();

  return <div className="p-2 text-3xl font-bold underline">{t("stores.createTitle")}</div>;
}
