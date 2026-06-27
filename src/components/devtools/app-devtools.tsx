import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { LocaleDevtoolsPanel } from "@/components/devtools/locale-devtools";

const devtoolsPlugins = [
  formDevtoolsPlugin(),
  {
    id: "tanstack-router",
    name: "TanStack Router",
    render: <TanStackRouterDevtoolsPanel />,
  },
  {
    id: "pricoteka-locale",
    name: "Locale",
    render: <LocaleDevtoolsPanel />,
  },
];

export function AppDevtools() {
  return <TanStackDevtools plugins={devtoolsPlugins} />;
}
