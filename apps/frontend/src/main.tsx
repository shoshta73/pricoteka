import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, createHashHistory, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { queryClient } from "@/lib/queryClient";

import { routeTree } from "./routeTree.gen";
import "./lib/i18n";
import "./index.css";

const hashHistory = createHashHistory();

export const router = createRouter({
  routeTree,
  history: hashHistory,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const storedTheme = localStorage.getItem("theme-storage");
let theme = "dark";

if (storedTheme) {
  try {
    theme = JSON.parse(storedTheme).state?.theme ?? theme;
  } catch {
    localStorage.removeItem("theme-storage");
  }
}

document.documentElement.classList.toggle("dark", theme === "dark");

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
