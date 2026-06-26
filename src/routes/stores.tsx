import { PlusIcon, StorefrontIcon } from "@phosphor-icons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { t } from "@/lib/i18n";
import { useStoresStore } from "@/stores/storesStore";

export const Route = createFileRoute("/stores")({
  component: Stores,
});

function Stores() {
  const { stores } = useStoresStore();
  const navigate = useNavigate();

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

  return <div className="p-2 text-3xl font-bold underline">{t("stores.title")}</div>;
}
