import type { Store } from "@pricoteka/core";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";

import { db } from "./db/index";
import { stores } from "./db/schema";
import { params } from "./schema/store/index";

const app = new Hono();

app.get("/stores", async (c) => {
  const storedStores = await db.select().from(stores);

  const storesResponse: Store[] = storedStores.map((store) => ({
    id: store.id,
    name: store.name,
    offices: [],
  }));

  return c.json(storesResponse);
});

app.post("/store", async (c) => {
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Request body must be valid JSON." }, 400);
  }

  const result = params.safeParse(body);

  if (!result.success) {
    return c.json({ error: "Store name is required." }, 400);
  }

  const [storedStore] = await db
    .insert(stores)
    .values({
      id: uuidv4(),
      name: result.data.name,
    })
    .returning();

  const store: Store = {
    id: storedStore.id,
    name: storedStore.name,
    offices: [],
  };

  return c.json(store, 201);
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
