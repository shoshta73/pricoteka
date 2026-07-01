import "dotenv/config";
import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | undefined;
let connectPromise: Promise<RedisClientType | null> | undefined;
let hasLoggedConnectionError = false;

async function getClient(): Promise<RedisClientType | null> {
  if (client?.isOpen) {
    return client;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    const nextClient = createClient({
      url: process.env.VALKEY_URL ?? "redis://localhost:6379",
    });

    nextClient.on("error", (error) => {
      if (!hasLoggedConnectionError) {
        console.warn("Valkey cache is unavailable; continuing without cache.", error);
        hasLoggedConnectionError = true;
      }
    });

    try {
      await nextClient.connect();
      client = nextClient;
      hasLoggedConnectionError = false;
      return nextClient;
    } catch (error) {
      if (!hasLoggedConnectionError) {
        console.warn("Valkey cache is unavailable; continuing without cache.", error);
        hasLoggedConnectionError = true;
      }

      await nextClient.destroy();
      return null;
    } finally {
      connectPromise = undefined;
    }
  })();

  return connectPromise;
}

export async function getJsonCache(key: string): Promise<unknown | null> {
  const cacheClient = await getClient();

  if (!cacheClient) {
    return null;
  }

  try {
    const cachedValue = await cacheClient.get(key);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue) as unknown;
  } catch (error) {
    console.warn("Failed to read from Valkey cache; continuing without cached value.", error);
    return null;
  }
}

export async function setJsonCache(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const cacheClient = await getClient();

  if (!cacheClient) {
    return;
  }

  try {
    await cacheClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    console.warn("Failed to write to Valkey cache; continuing without cache.", error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  const cacheClient = await getClient();

  if (!cacheClient) {
    return;
  }

  try {
    await cacheClient.del(key);
  } catch (error) {
    console.warn("Failed to delete from Valkey cache; continuing without cache invalidation.", error);
  }
}

export async function closeCache(): Promise<void> {
  if (!client?.isOpen) {
    return;
  }

  await client.close();
}
