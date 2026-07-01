/// <reference types="node" />

import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import process from "node:process";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_FILE_NAME ?? "file:local.db",
  },
});
