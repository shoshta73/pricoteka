import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStoresData } from "@/services/stores/useStoresData";

const breadcrumbItems = [
  { labelKey: "title.app", to: "/" },
  { labelKey: "stores.title", to: "/stores" },
  { labelKey: "products.title", to: "/products" },
  { labelKey: "pages.about.title", to: "/about" },
] as const;

export function Breadcrumbs() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const { stores } = useStoresData();
  const activeBreadcrumbLabelKey = breadcrumbItems.find((item) => item.to === pathname)?.labelKey ?? "title.app";
  const storeId = getStoreDetailId(pathname);
  const storeBreadcrumbLabel = storeId ? stores.find((store) => store.id === storeId)?.name : null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost">
                  {t(activeBreadcrumbLabelKey)}
                  <CaretDownIcon className="ml-auto transition-transform group-aria-expanded/button:rotate-180" />
                </Button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                {breadcrumbItems.map((item) => (
                  <DropdownMenuItem key={item.to} onClick={() => navigate({ to: item.to })}>
                    {t(item.labelKey)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        {pathname.startsWith("/stores") && (
          <BreadcrumbSeparator>
            <CaretRightIcon />
          </BreadcrumbSeparator>
        )}
        {(pathname === "/stores" || storeBreadcrumbLabel) && (
          <BreadcrumbItem className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost">
                    {pathname === "/stores" ? t("stores.dashboard") : storeBreadcrumbLabel}
                    <CaretDownIcon className="ml-auto transition-transform group-aria-expanded/button:rotate-180" />
                  </Button>
                }
              ></DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate({ to: "/stores" })}>{t("stores.dashboard")}</DropdownMenuItem>
                  {stores.map((store) => (
                    <DropdownMenuItem
                      key={store.id}
                      onClick={() => navigate({ to: "/stores/$storeId", params: { storeId: store.id } })}
                    >
                      {store.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function getStoreDetailId(pathname: string) {
  return /^\/stores\/([^/]+)$/.exec(pathname)?.[1] ?? null;
}
