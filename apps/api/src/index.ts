import type { Store } from "@pricoteka/core";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";

import { db } from "./db/index";
import { stores } from "./db/schema";
import {
  params,
  result as storeResult,
} from "./schema/store/index";
import { result as storesResult } from "./schema/stores/index";

const app = new Hono();

app.get("/stores", async (c) => {
  const storedStores = await db.select().from(stores);

  const storesResponse: Store[] = storedStores.map((store) => ({
    id: store.id,
    name: store.name,
    offices: [],
  }));

  const output = storesResult.safeParse(storesResponse);

  if (!output.success) {
    return c.json({ error: "Stores result is invalid." }, 500);
  }

  return c.json(output.data);
});

app.post("/store", async (c) => {
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Request body must be valid JSON." }, 400);
  }

  const input = params.safeParse(body);

  if (!input.success) {
    return c.json({ error: "Store name is required." }, 400);
  }

  const [storedStore] = await db
    .insert(stores)
    .values({
      id: uuidv4(),
      name: input.data.name,
    })
    .returning();

  const store: Store = {
    id: storedStore.id,
    name: storedStore.name,
    offices: [],
  };

  const output = storeResult.safeParse(store);

  if (!output.success) {
    return c.json({ error: "Created store result is invalid." }, 500);
  }

  return c.json(output.data, 201);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
