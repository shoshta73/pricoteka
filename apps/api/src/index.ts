import type { Product, Store, StoreOffice } from "@pricoteka/core";

import { serve } from "@hono/node-server";
import { eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { v4 as uuidv4 } from "uuid";

import { closeCache, deleteCache, getJsonCache, setJsonCache } from "./cache/index";
import { db, migrateDatabase } from "./db/index";
import { offices, productOffices, products, stores } from "./db/schema";
import { params as productParams, result as productResult } from "./schema/product/index";
import { result as productsResult } from "./schema/products/index";
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
const productsCacheKey = "products:list";
const storesCacheKey = "stores:list";
const listCacheTtlSeconds = 60;

function getStoreOfficesCacheKey(storeId: string): string {
  return `store:${storeId}:offices`;
}

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
  const officesByStoreId = new Map<string, StoreOffice[]>();

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

  await setJsonCache(storesCacheKey, output.data, listCacheTtlSeconds);

  return c.json(output.data);
});

app.get("/products", async (c) => {
  const cachedProducts = await getJsonCache(productsCacheKey);

  if (cachedProducts) {
    const cachedOutput = productsResult.safeParse(cachedProducts);

    if (cachedOutput.success) {
      return c.json(cachedOutput.data);
    }

    await deleteCache(productsCacheKey);
  }

  const storedProducts = await db.select().from(products);
  const storedProductOffices = await db.select().from(productOffices);
  const storedOffices = await db.select().from(offices);
  const officesById = new Map(storedOffices.map((office) => [office.id, office]));
  const foundInByProductId = new Map<string, Product["found_in"]>();

  for (const productOffice of storedProductOffices) {
    const office = officesById.get(productOffice.officeId);

    if (!office) {
      continue;
    }

    const foundIn = foundInByProductId.get(productOffice.productId) ?? [];

    foundIn.push({
      store_id: office.storeId,
      office_id: office.id,
    });

    foundInByProductId.set(productOffice.productId, foundIn);
  }

  const productsResponse: Product[] = storedProducts.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    found_in: foundInByProductId.get(product.id) ?? [],
  }));

  const output = productsResult.safeParse(productsResponse);

  if (!output.success) {
    return c.json({ error: "Products result is invalid." }, 500);
  }

  await setJsonCache(productsCacheKey, output.data, listCacheTtlSeconds);

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

app.post("/product", async (c) => {
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Request body must be valid JSON." }, 400);
  }

  const input = productParams.safeParse(body);

  if (!input.success) {
    return c.json({ error: "Product name, description, and price are required." }, 400);
  }

  const foundIn = input.data.found_in ?? [];
  const officeIds = [...new Set(foundIn.map((location) => location.office_id))];
  const storedOffices =
    officeIds.length > 0 ? await db.select().from(offices).where(inArray(offices.id, officeIds)) : [];

  if (storedOffices.length !== officeIds.length) {
    return c.json({ error: "Product office must reference an existing office." }, 400);
  }

  const storedOfficesById = new Map(storedOffices.map((office) => [office.id, office]));

  if (
    foundIn.some(
      (location) => location.store_id && storedOfficesById.get(location.office_id)?.storeId !== location.store_id,
    )
  ) {
    return c.json({ error: "Product office must belong to the provided store." }, 400);
  }

  const [storedProduct] = await db
    .insert(products)
    .values({
      id: uuidv4(),
      name: input.data.name,
      description: input.data.description,
      price: input.data.price,
    })
    .returning();

  if (storedOffices.length > 0) {
    await db.insert(productOffices).values(
      storedOffices.map((office) => ({
        productId: storedProduct.id,
        officeId: office.id,
      })),
    );
  }

  const product: Product = {
    id: storedProduct.id,
    name: storedProduct.name,
    description: storedProduct.description,
    price: storedProduct.price,
    found_in: storedOffices.map((office) => ({
      store_id: office.storeId,
      office_id: office.id,
    })),
  };

  const output = productResult.safeParse(product);

  if (!output.success) {
    return c.json({ error: "Created product result is invalid." }, 500);
  }

  await deleteCache(productsCacheKey);

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

  const office: StoreOffice = {
    id: storedOffice.id,
    name: storedOffice.name,
  };

  const output = officeResult.safeParse(office);

  if (!output.success) {
    return c.json({ error: "Created office result is invalid." }, 500);
  }

  await deleteCache(storesCacheKey);
  await deleteCache(getStoreOfficesCacheKey(storedStore.id));

  return c.json(output.data, 201);
});

app.get("/store/:id/offices", async (c) => {
  const pathParams = officePathParams.safeParse(c.req.param());

  if (!pathParams.success) {
    return c.json({ error: "Store id must be a valid UUID." }, 400);
  }

  const officesCacheKey = getStoreOfficesCacheKey(pathParams.data.id);
  const cachedOffices = await getJsonCache(officesCacheKey);

  if (cachedOffices) {
    const cachedOutput = officesResult.safeParse(cachedOffices);

    if (cachedOutput.success) {
      return c.json(cachedOutput.data);
    }

    await deleteCache(officesCacheKey);
  }

  const [storedStore] = await db.select().from(stores).where(eq(stores.id, pathParams.data.id)).limit(1);

  if (!storedStore) {
    return c.json({ error: "Store not found." }, 404);
  }

  const storedOffices = await db.select().from(offices).where(eq(offices.storeId, storedStore.id));

  const storeOffices: StoreOffice[] = storedOffices.map((office) => ({
    id: office.id,
    name: office.name,
  }));

  const output = officesResult.safeParse(storeOffices);

  if (!output.success) {
    return c.json({ error: "Store offices result is invalid." }, 500);
  }

  await setJsonCache(officesCacheKey, output.data, listCacheTtlSeconds);

  return c.json(output.data);
});

await migrateDatabase();

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
