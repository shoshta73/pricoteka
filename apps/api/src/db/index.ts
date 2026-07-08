import "dotenv/config";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const databaseUrl = process.env.DB_FILE_NAME ?? "file:local.db";

if (databaseUrl.startsWith("file:") && databaseUrl !== "file::memory:") {
  const databasePath = databaseUrl.startsWith("file://")
    ? fileURLToPath(databaseUrl)
    : databaseUrl.slice("file:".length);
  const databaseDirectory = dirname(databasePath);

  if (databaseDirectory !== ".") {
    mkdirSync(databaseDirectory, { recursive: true });
  }
}

export const db = drizzle({
  connection: {
    url: databaseUrl,
  },
  schema,
});
