import { defineConfig } from "rolldown";

export default defineConfig({
  input: {
    index: "src/index.ts",
    schema: "src/schema.ts",
  },
  output: {
    dir: "dist",
    format: "esm",
  },
});
