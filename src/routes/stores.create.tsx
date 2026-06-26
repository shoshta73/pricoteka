import { createFileRoute } from "@tanstack/react-router";

import { t } from "@/lib/i18n";

export const Route = createFileRoute("/stores/create")({
  component: CreateStore,
});

function CreateStore() {
  return <div className="p-2 text-3xl font-bold underline">{t("stores.createTitle")}</div>;
}
