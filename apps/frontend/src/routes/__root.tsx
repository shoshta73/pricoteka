import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useThemeStore } from "@/stores/themeStore";

export const Route = createRootRoute({
  component: RootComponent,
});

const showDevtools = import.meta.env.DEV && import.meta.env.MODE !== "test";
const AppDevtools = showDevtools
  ? lazy(() => import("@/components/devtools/app-devtools").then((module) => ({ default: module.AppDevtools })))
  : null;

function RootComponent() {
  const { t, i18n } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const pageTitle = t(getPageTitleKey(pathname));
    document.title = pageTitle === t("title.app") ? pageTitle : t("title.page", { page: pageTitle });
  }, [i18n.language, pathname, t]);

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
            {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </Button>
        </header>
        <Outlet />
        <Toaster theme={theme} position="bottom-right" />
        {AppDevtools && (
          <Suspense>
            <AppDevtools />
          </Suspense>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}

function getPageTitleKey(pathname: string) {
  if (pathname === "/") {
    return "title.app";
  }

  if (pathname === "/about") {
    return "pages.about.title";
  }

  if (pathname === "/stores") {
    return "stores.title";
  }

  if (pathname === "/stores/create") {
    return "stores.createTitle";
  }

  if (/^\/stores\/[^/]+\/offices\/create$/.test(pathname)) {
    return "stores.createOfficeTitle";
  }

  if (/^\/stores\/[^/]+$/.test(pathname)) {
    return "stores.detailTitle";
  }

  return "title.app";
}
