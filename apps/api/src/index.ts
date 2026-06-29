import type { Store } from "@pricoteka/core";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";

const app = new Hono();

app.post("/store", async (c) => {
  const body = (await c.req.json()) as {
    name: string;
  };
  const store: Store = {
    name: body.name,
    id: uuidv4(),
    offices: [],
  };
  return c.json(store);
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
