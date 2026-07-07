import { defineConfig } from "rolldown";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  input: "src/index.ts",
  external: ["@libsql/client"],
  platform: "node",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
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
});
