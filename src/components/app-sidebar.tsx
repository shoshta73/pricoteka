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
  SidebarRail,
} from "@/components/ui/sidebar";

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
