import { Outlet, createRootRoute } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger className="size-8 [&_svg]:size-5!" />
          </div>
        </header>

        <div>Hello "__root"!</div>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
