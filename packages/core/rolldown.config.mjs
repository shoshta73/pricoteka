import { defineConfig } from "rolldown";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  input: {
    index: "src/index.ts",
    schema: "src/schema.ts",
  },
  output: {
    dir: "dist",
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
