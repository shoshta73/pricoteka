import type { ComponentProps } from "react";

import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import packageJson from "../../package.json";

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
import { useProductsStore } from "@/stores/productsStore";

const data = {
  nav: [
    {
      labelKey: "nav.stores",
      to: "/stores",
    },
    {
      labelKey: "nav.products",
      to: "/products",
    },
  ],
} as const;

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { stores } = useStoresData();
  const { products } = useProductsStore();
  const navigate = useNavigate();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => navigate({ to: "/" })}>
              <div className="flex w-full flex-row items-center space-x-1">
                <img src="/logo.svg" alt="" className="size-6" aria-hidden="true" />
                <span className="text-xl font-bold">Pricoteka</span>
                <span className="ml-auto text-xs font-medium text-muted-foreground">v{packageJson.version}</span>
              </div>
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
                  {stores.length === 0 || item.to !== "/stores" ? null : (
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
                  {products.length === 0 || item.to !== "/products" ? null : (
                    <SidebarMenuSub>
                      {products.map((product) => (
                        <SidebarMenuSubItem key={product.id}>
                          <SidebarMenuSubButton
                            render={<Link to="/products/$productId" params={{ productId: product.id }} />}
                          >
                            {product.name}
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
