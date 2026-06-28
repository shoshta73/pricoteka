import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/stores/$storeId/offices/create")({
  component: CreateStoreOffice,
});

function CreateStoreOffice() {
  const { t } = useTranslation();

  return (
    <Card className="m-auto w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{t("stores.createOfficeTitle")}</CardTitle>
        <CardDescription>{t("stores.createOfficeDescription")}</CardDescription>
      </CardHeader>
    </Card>
  );
}
