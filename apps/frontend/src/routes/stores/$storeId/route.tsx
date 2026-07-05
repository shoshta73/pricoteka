import { PlusIcon, StorefrontIcon } from "@phosphor-icons/react";
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@pricoteka/ui-core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@pricoteka/ui-core/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@pricoteka/ui-core/empty";
import { ScrollArea } from "@pricoteka/ui-core/scroll-area";
import { useApiOffices } from "@/services/stores/useApiStores";
import { useStoresData } from "@/services/stores/useStoresData";
import { useSettingsStore } from "@/stores/settingsStore";

export const Route = createFileRoute("/stores/$storeId")({
  component: StoreDetail,
});

function StoreDetail() {
  const { t } = useTranslation();
  const { storeId } = Route.useParams();
  const isApiMode = useSettingsStore((state) => state.runtimeMode === "api");
  const { isError, isLoading, stores } = useStoresData();
  const store = stores.find((item) => item.id === storeId);
  const navigate = useNavigate();
  const isChildRoute = useRouterState({ select: (state) => state.location.pathname !== `/stores/${store?.id}` });
  const officesQuery = useApiOffices(storeId, isApiMode && Boolean(store) && !isChildRoute);
  const offices = isApiMode ? (officesQuery.data ?? []) : (store?.offices ?? []);

  if (isLoading || officesQuery.isLoading) {
    return <div className="p-2">{t("stores.loading")}</div>;
  }

  if (isError || officesQuery.isError) {
    return <div className="p-2">{t("stores.loadFailure")}</div>;
  }

  if (!store) {
    return <div className="p-2">{t("stores.detailNotFound")}</div>;
  }

  if (isChildRoute) {
    return <Outlet />;
  }

  if (offices.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <StorefrontIcon />
          </EmptyMedia>
          <EmptyTitle>{t("stores.detailNoOfficesTitle", { name: store.name })}</EmptyTitle>
          <EmptyDescription>{t("stores.detailNoOfficesDescription")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => void navigate({ to: "/stores/$storeId/offices/create", params: { storeId } })}>
            <PlusIcon data-icon="inline-start" />
            {t("stores.createOfficeAction")}
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
              <StorefrontIcon className="size-4" />
              <span>{store.name}</span>
              <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-foreground">
                {offices.length}
              </span>
            </div>
            <div className="grow" />
            <Button onClick={() => void navigate({ to: "/stores/$storeId/offices/create", params: { storeId } })}>
              <PlusIcon data-icon="inline-start" />
              {t("stores.createOfficeAction")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <ScrollArea>
        <div className="space-y-2">
          {offices.map((office) => (
            <Card className="w-full max-w-sm" key={office.id}>
              <CardHeader>
                <CardTitle>{office.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
