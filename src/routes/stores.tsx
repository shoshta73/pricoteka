import { createFileRoute } from "@tanstack/react-router";

import { t } from "@/lib/i18n";

export const Route = createFileRoute("/stores")({
  component: Stores,
});

function Stores() {
  return <div className="p-2 text-3xl font-bold underline">{t("stores.title")}</div>;
}
