import type { ComponentProps } from "react";

import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useStoresData } from "@/services/stores/useStoresData";

const data = {
  nav: [
    {
      labelKey: "nav.stores",
      to: "/stores",
    },
  ],
} as const;

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { stores } = useStoresData();
  const navigate = useNavigate();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="text-xl font-bold" onClick={() => navigate({ to: "/" })}>
              <img src="/logo.svg" alt="" className="size-6" aria-hidden="true" />
              Pricoteka
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.nav.map((item) => {
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    render={
                      <Link
                        to={item.to}
                        activeProps={{
                          "data-active": true,
                        }}
                      />
                    }
                    className="font-medium"
                  >
                    {t(item.labelKey)}
                  </SidebarMenuButton>
                  {stores.length === 0 ? null : (
                    <SidebarMenuSub>
                      {stores.map((store) => (
                        <SidebarMenuSubItem key={store.id}>
                          <SidebarMenuSubButton render={<Link to="/stores/$storeId" params={{ storeId: store.id }} />}>
                            {store.name}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
