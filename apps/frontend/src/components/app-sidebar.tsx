import type { ComponentProps } from "react";

import { Link } from "@tanstack/react-router";
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
import { useStoresStore } from "@/stores/storesStore";

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
  const { stores } = useStoresStore();

  return (
    <Sidebar {...props}>
      <SidebarHeader />
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
