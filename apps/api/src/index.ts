import type { Store, v1 } from "@pricoteka/core";

import { serve } from "@hono/node-server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { v4 as uuidv4 } from "uuid";

import { closeCache, deleteCache, getJsonCache, setJsonCache } from "./cache/index";
import { db } from "./db/index";
import { offices, stores } from "./db/schema";
import {
  officeParams,
  officePathParams,
  officeResult,
  officesResult,
  params,
  result as storeResult,
} from "./schema/store/index";
import { result as storesResult } from "./schema/stores/index";

const app = new Hono();
const storesCacheKey = "stores:list:v1";
const storesCacheTtlSeconds = 60;

app.use("*", cors());

app.get("/stores", async (c) => {
  const cachedStores = await getJsonCache(storesCacheKey);

  if (cachedStores) {
    const cachedOutput = storesResult.safeParse(cachedStores);

    if (cachedOutput.success) {
      return c.json(cachedOutput.data);
    }

    await deleteCache(storesCacheKey);
  }

  const storedStores = await db.select().from(stores);
  const storedOffices = await db.select().from(offices);
  const officesByStoreId = new Map<string, v1.StoreOffice[]>();

  for (const office of storedOffices) {
    const storeOffices = officesByStoreId.get(office.storeId) ?? [];

    storeOffices.push({
      id: office.id,
      name: office.name,
    });

    officesByStoreId.set(office.storeId, storeOffices);
  }

  const storesResponse: Store[] = storedStores.map((store) => ({
    id: store.id,
    name: store.name,
    offices: officesByStoreId.get(store.id) ?? [],
  }));

  const output = storesResult.safeParse(storesResponse);

  if (!output.success) {
    return c.json({ error: "Stores result is invalid." }, 500);
  }

  await setJsonCache(storesCacheKey, output.data, storesCacheTtlSeconds);

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

  await deleteCache(storesCacheKey);

  return c.json(output.data, 201);
});

app.post("/store/:id/office", async (c) => {
  const pathParams = officePathParams.safeParse(c.req.param());

  if (!pathParams.success) {
    return c.json({ error: "Store id must be a valid UUID." }, 400);
  }

  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Request body must be valid JSON." }, 400);
  }

  const input = officeParams.safeParse(body);

  if (!input.success) {
    return c.json({ error: "Office name is required." }, 400);
  }

  const [storedStore] = await db.select().from(stores).where(eq(stores.id, pathParams.data.id)).limit(1);

  if (!storedStore) {
    return c.json({ error: "Store not found." }, 404);
  }

  const [storedOffice] = await db
    .insert(offices)
    .values({
      id: uuidv4(),
      storeId: storedStore.id,
      name: input.data.name,
    })
    .returning();

  const office: v1.StoreOffice = {
    id: storedOffice.id,
    name: storedOffice.name,
  };

  const output = officeResult.safeParse(office);

  if (!output.success) {
    return c.json({ error: "Created office result is invalid." }, 500);
  }

  await deleteCache(storesCacheKey);

  return c.json(output.data, 201);
});

app.get("/store/:id/offices", async (c) => {
  const pathParams = officePathParams.safeParse(c.req.param());

  if (!pathParams.success) {
    return c.json({ error: "Store id must be a valid UUID." }, 400);
  }

  const [storedStore] = await db.select().from(stores).where(eq(stores.id, pathParams.data.id)).limit(1);

  if (!storedStore) {
    return c.json({ error: "Store not found." }, 404);
  }

  const storedOffices = await db.select().from(offices).where(eq(offices.storeId, storedStore.id));

  const storeOffices: v1.StoreOffice[] = storedOffices.map((office) => ({
    id: office.id,
    name: office.name,
  }));

  const output = officesResult.safeParse(storeOffices);

  if (!output.success) {
    return c.json({ error: "Store offices result is invalid." }, 500);
  }

  return c.json(output.data);
});

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

async function shutdown(): Promise<void> {
  await closeCache();
  server.close();
}

process.on("SIGINT", () => {
  void shutdown().finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
  void shutdown().finally(() => process.exit(0));
});
