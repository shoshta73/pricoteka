import type { Store } from "@pricoteka/core";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

const app = new Hono();

const createStoreSchema = z.object({
  name: z.string().trim().min(1),
});

app.post("/store", async (c) => {
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Request body must be valid JSON." }, 400);
  }

  const result = createStoreSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: "Store name is required." }, 400);
  }

  const store: Store = {
    name: result.data.name,
    id: uuidv4(),
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
