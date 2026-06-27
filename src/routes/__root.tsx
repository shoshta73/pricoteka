import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useThemeStore } from "@/stores/themeStore";

export const Route = createRootRoute({
  component: RootComponent,
});

const devtoolsPlugins = [formDevtoolsPlugin()];
const showDevtools = import.meta.env.DEV && import.meta.env.MODE !== "test";

function RootComponent() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggle);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger className="size-8 [&_svg]:size-5!" />
          </div>
          <div id="header-spacer" className="grow"></div>
          <Button
            variant="ghost"
            type="button"
            onClick={toggleTheme}
            className="mr-3 h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
          </Button>
        </header>
        <Outlet />
        <Toaster theme={theme} position="bottom-right" />
        {showDevtools && <TanStackDevtools plugins={devtoolsPlugins} />}
        {showDevtools && <TanStackRouterDevtools />}
      </SidebarInset>
    </SidebarProvider>
  );
}
