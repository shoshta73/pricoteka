import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: false,
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    visualizer(),
    visualizer({
      filename: "stats-sunburst.html",
      template: "sunburst",
    }),
    visualizer({
      filename: "stats.json",
      template: "raw-data",
    }),
  ],
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/build/dist/**"],
    setupFiles: "./src/test/setup.ts",
  },
});
