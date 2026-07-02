import type { Store, v1 } from "@pricoteka/core";
import { storeOfficeSchema, storeSchema } from "@pricoteka/core/schema";
import * as z from "zod";

import { appConfig } from "@/lib/appConfig";
import { ApiError } from "@/services/api/apiError";

const storesSchema = z.array(storeSchema);
const officesSchema = z.array(storeOfficeSchema);

interface ApiStoresClientOptions {
  apiUrl: string;
  fetch: typeof fetch;
}

export interface ApiStoresClient {
  listStores: () => Promise<Store[]>;
  listOffices: (storeId: string) => Promise<v1.StoreOffice[]>;
  createStore: (input: { name: string }) => Promise<Store>;
  createOffice: (input: { storeId: string; name: string }) => Promise<v1.StoreOffice>;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null && "error" in body && typeof body.error === "string") {
    return body.error;
  }

  return fallback;
}

export function createApiStoresClient({ apiUrl, fetch }: ApiStoresClientOptions): ApiStoresClient {
  return {
    listStores: async () => {
      const response = await fetch(`${apiUrl}/stores`);
      const body = await readJson(response);

      if (!response.ok) {
        throw new ApiError(getErrorMessage(body, "Failed to load stores."), response.status);
      }

      return storesSchema.parse(body);
    },
    listOffices: async (storeId) => {
      const response = await fetch(`${apiUrl}/store/${storeId}/offices`);
      const body = await readJson(response);

      if (!response.ok) {
        throw new ApiError(getErrorMessage(body, "Failed to load offices."), response.status);
      }

      return officesSchema.parse(body);
    },
    createStore: async ({ name }) => {
      const response = await fetch(`${apiUrl}/store`, {
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const body = await readJson(response);

      if (!response.ok) {
        throw new ApiError(getErrorMessage(body, "Failed to create store."), response.status);
      }

      return storeSchema.parse(body);
    },
    createOffice: async ({ storeId, name }) => {
      const response = await fetch(`${apiUrl}/store/${storeId}/office`, {
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const body = await readJson(response);

      if (!response.ok) {
        throw new ApiError(getErrorMessage(body, "Failed to create office."), response.status);
      }

      return storeOfficeSchema.parse(body);
    },
  };
}

export const apiStoresClient = createApiStoresClient({
  apiUrl: appConfig.apiUrl,
  fetch,
});
