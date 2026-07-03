import type { v1 } from "@pricoteka/core";
import { productSchema } from "@pricoteka/core/schema";

import { appConfig } from "@/lib/appConfig";
import { ApiError } from "@/services/api/apiError";
import type { ProductLocation } from "@/services/products/types";

interface ApiProductsClientOptions {
  apiUrl: string;
  fetch: typeof fetch;
}

export interface ApiProductsClient {
  createProduct: (input: {
    name: string;
    description: string;
    price: number;
    found_in?: ProductLocation[];
  }) => Promise<v1.Product>;
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

export function createApiProductsClient({ apiUrl, fetch }: ApiProductsClientOptions): ApiProductsClient {
  return {
    createProduct: async (input) => {
      const response = await fetch(`${apiUrl}/product`, {
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const body = await readJson(response);

      if (!response.ok) {
        throw new ApiError(getErrorMessage(body, "Failed to create product."), response.status);
      }

      return productSchema.parse(body);
    },
  };
}

export const apiProductsClient = createApiProductsClient({
  apiUrl: appConfig.apiUrl,
  fetch,
});
