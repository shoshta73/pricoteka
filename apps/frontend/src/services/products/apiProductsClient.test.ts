import { describe, expect, it, vi } from "vitest";
import * as z from "zod";

import { ApiError } from "@/services/api/apiError";
import { createApiProductsClient } from "@/services/products/apiProductsClient";

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });
}

describe("apiProductsClient", () => {
  it("creates a product through the API", async () => {
    const product = {
      id: "c159a388-e26d-45af-8680-f930720c7539",
      name: "Milk",
      description: "",
      price: 1.5,
      found_in: [
        {
          store_id: "7de2da19-7e33-496b-80f4-1358b4b43125",
          office_id: "75b018d8-c84b-4051-89d8-e5641ff6a6cb",
        },
      ],
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(product, { status: 201 }));
    const client = createApiProductsClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(
      client.createProduct({
        name: "Milk",
        description: "",
        price: 1.5,
        found_in: [
          {
            store_id: "7de2da19-7e33-496b-80f4-1358b4b43125",
            office_id: "75b018d8-c84b-4051-89d8-e5641ff6a6cb",
          },
        ],
      }),
    ).resolves.toEqual(product);
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/product", {
      body: JSON.stringify({
        name: "Milk",
        description: "",
        price: 1.5,
        found_in: [
          {
            store_id: "7de2da19-7e33-496b-80f4-1358b4b43125",
            office_id: "75b018d8-c84b-4051-89d8-e5641ff6a6cb",
          },
        ],
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  });

  it("throws an API error for non-success responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ error: "Product office must reference an existing office." }, { status: 400 }));
    const client = createApiProductsClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(
      client.createProduct({
        name: "Milk",
        description: "",
        price: 1.5,
        found_in: [{ office_id: "75b018d8-c84b-4051-89d8-e5641ff6a6cb" }],
      }),
    ).rejects.toEqual(new ApiError("Product office must reference an existing office.", 400));
  });

  it("rejects invalid create product responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          id: "product-1",
          name: "Milk",
          description: "",
          price: 1.5,
          found_in: [],
        },
        { status: 201 },
      ),
    );
    const client = createApiProductsClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(client.createProduct({ name: "Milk", description: "", price: 1.5 })).rejects.toBeInstanceOf(
      z.ZodError,
    );
  });
});
