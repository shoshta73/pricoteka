import { PlusIcon, StorefrontIcon } from "@phosphor-icons/react";
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { appConfig } from "@/lib/appConfig";
import { useStoresData } from "@/services/stores/useStoresData";

export const Route = createFileRoute("/stores/$storeId")({
  component: StoreDetail,
});

function StoreDetail() {
  const { t } = useTranslation();
  const { storeId } = Route.useParams();
  const { isError, isLoading, stores } = useStoresData();
  const store = stores.find((item) => item.id === storeId);
  const navigate = useNavigate();
  const isChildRoute = useRouterState({ select: (state) => state.location.pathname !== `/stores/${store?.id}` });

  if (isLoading) {
    return <div className="p-2">{t("stores.loading")}</div>;
  }

  if (isError) {
    return <div className="p-2">{t("stores.loadFailure")}</div>;
  }

  if (!store) {
    return <div className="p-2">{t("stores.detailNotFound")}</div>;
  }

  if (isChildRoute) {
    return <Outlet />;
  }

  if (store.offices.length === 0) {
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
          {appConfig.isApiMode ? (
            <p className="text-sm text-muted-foreground">{t("stores.apiOfficesUnavailable")}</p>
          ) : (
            <Button onClick={() => void navigate({ to: "/stores/$storeId/offices/create", params: { storeId } })}>
              <PlusIcon data-icon="inline-start" />
              {t("stores.createOfficeAction")}
            </Button>
          )}
        </EmptyContent>
      </Empty>
    );
  }

  return <div className="p-2 text-3xl font-bold underline">{store.name}</div>;
}
