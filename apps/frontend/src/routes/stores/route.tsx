import { CaretDownIcon, PlusIcon, StorefrontIcon } from "@phosphor-icons/react";
import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useStoresData } from "@/services/stores/useStoresData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";

export const Route = createFileRoute("/stores")({
  component: Stores,
});

function Stores() {
  const { t } = useTranslation();
  const { stores, isError, isLoading } = useStoresData();
  const navigate = useNavigate();
  const isChildRoute = useRouterState({ select: (state) => state.location.pathname !== "/stores" });

  if (isChildRoute) {
    return <Outlet />;
  }

  if (isLoading) {
    return <div className="p-2">{t("stores.loading")}</div>;
  }

  if (isError) {
    return <div className="p-2">{t("stores.loadFailure")}</div>;
  }

  if (stores.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <StorefrontIcon />
          </EmptyMedia>
          <EmptyTitle>{t("stores.emptyTitle")}</EmptyTitle>
          <EmptyDescription>{t("stores.emptyDescription")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => void navigate({ to: "/stores/create" })}>
            <PlusIcon data-icon="inline-start" />
            {t("stores.createAction")}
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
              <span>Stores</span>
              <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-foreground">
                {stores.length}
              </span>
            </div>
            <div className="grow" />
            <Button onClick={() => void navigate({ to: "/stores/create" })}>
              <PlusIcon data-icon="inline-start" />
              {t("stores.createAction")}
            </Button>
          </div>
        </CardContent>
      </Card>
      {stores.map((store) => (
        <Card key={store.id} className="max-w-sm">
          <CardHeader>
            <CardTitle>{store.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <div className="space-y-2">
                {store.offices.map((office) => (
                  <Card className="mx-auto w-full max-w-sm" key={office.id}>
                    <CardContent>
                      <Collapsible>
                        <CollapsibleTrigger
                          render={
                            <Button variant="ghost">
                              {office.name}
                              <CaretDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
                            </Button>
                          }
                        ></CollapsibleTrigger>
                      </Collapsible>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
