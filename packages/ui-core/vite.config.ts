import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const componentEntries = {
  "components/ui/breadcrumb": fileURLToPath(new URL("./src/components/ui/breadcrumb.tsx", import.meta.url)),
  "components/ui/button": fileURLToPath(new URL("./src/components/ui/button.tsx", import.meta.url)),
  "components/ui/card": fileURLToPath(new URL("./src/components/ui/card.tsx", import.meta.url)),
  "components/ui/collapsible": fileURLToPath(new URL("./src/components/ui/collapsible.tsx", import.meta.url)),
  "components/ui/dropdown-menu": fileURLToPath(new URL("./src/components/ui/dropdown-menu.tsx", import.meta.url)),
  "components/ui/empty": fileURLToPath(new URL("./src/components/ui/empty.tsx", import.meta.url)),
  "components/ui/field": fileURLToPath(new URL("./src/components/ui/field.tsx", import.meta.url)),
  "components/ui/input": fileURLToPath(new URL("./src/components/ui/input.tsx", import.meta.url)),
  "components/ui/label": fileURLToPath(new URL("./src/components/ui/label.tsx", import.meta.url)),
  "components/ui/navigation-menu": fileURLToPath(new URL("./src/components/ui/navigation-menu.tsx", import.meta.url)),
  "components/ui/scroll-area": fileURLToPath(new URL("./src/components/ui/scroll-area.tsx", import.meta.url)),
  "components/ui/separator": fileURLToPath(new URL("./src/components/ui/separator.tsx", import.meta.url)),
  "components/ui/sheet": fileURLToPath(new URL("./src/components/ui/sheet.tsx", import.meta.url)),
  "components/ui/sidebar": fileURLToPath(new URL("./src/components/ui/sidebar.tsx", import.meta.url)),
  "components/ui/skeleton": fileURLToPath(new URL("./src/components/ui/skeleton.tsx", import.meta.url)),
  "components/ui/sonner": fileURLToPath(new URL("./src/components/ui/sonner.tsx", import.meta.url)),
  "components/ui/tooltip": fileURLToPath(new URL("./src/components/ui/tooltip.tsx", import.meta.url)),
};

function isExternalDependency(id: string) {
  return (
    id === "react" ||
    id === "react-dom" ||
    id === "react/jsx-runtime" ||
    id === "class-variance-authority" ||
    id === "clsx" ||
    id === "next-themes" ||
    id === "sonner" ||
    id === "tailwind-merge" ||
    id.startsWith("@base-ui/react") ||
    id.startsWith("@phosphor-icons/react")
  );
}

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [react()],
  build: {
    lib: {
      entry: componentEntries,
      formats: ["es"],
    },
    rollupOptions: {
      external: isExternalDependency,
    },
  },
});
