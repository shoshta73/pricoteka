import { describe, expect, it, vi } from "vitest";
import * as z from "zod";

import { ApiError } from "@/services/api/apiError";
import { createApiStoresClient } from "@/services/stores/apiStoresClient";

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });
}

describe("apiStoresClient", () => {
  it("lists stores from the API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          id: "7de2da19-7e33-496b-80f4-1358b4b43125",
          name: "Konzum",
          offices: [],
        },
      ]),
    );
    const client = createApiStoresClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(client.listStores()).resolves.toEqual([
      {
        id: "7de2da19-7e33-496b-80f4-1358b4b43125",
        name: "Konzum",
        offices: [],
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/stores");
  });

  it("rejects invalid list responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([{ id: "store-1", name: "Konzum" }]));
    const client = createApiStoresClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(client.listStores()).rejects.toBeInstanceOf(z.ZodError);
  });

  it("creates a store through the API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          id: "7de2da19-7e33-496b-80f4-1358b4b43125",
          name: "Konzum",
          offices: [],
        },
        { status: 201 },
      ),
    );
    const client = createApiStoresClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(client.createStore({ name: "Konzum" })).resolves.toEqual({
      id: "7de2da19-7e33-496b-80f4-1358b4b43125",
      name: "Konzum",
      offices: [],
    });
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/store", {
      body: JSON.stringify({ name: "Konzum" }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  });

  it("throws an API error for non-success responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ error: "Store name is required." }, { status: 400 }));
    const client = createApiStoresClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(client.createStore({ name: "" })).rejects.toEqual(new ApiError("Store name is required.", 400));
  });

  it("creates an office through the API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          id: "75b018d8-c84b-4051-89d8-e5641ff6a6cb",
          name: "Office",
        },
        { status: 201 },
      ),
    );
    const client = createApiStoresClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(
      client.createOffice({ storeId: "7de2da19-7e33-496b-80f4-1358b4b43125", name: "Office" }),
    ).resolves.toEqual({
      id: "75b018d8-c84b-4051-89d8-e5641ff6a6cb",
      name: "Office",
    });
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/store/7de2da19-7e33-496b-80f4-1358b4b43125/office", {
      body: JSON.stringify({ name: "Office" }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  });

  it("throws an API error when office creation fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ error: "Store not found." }, { status: 404 }));
    const client = createApiStoresClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(
      client.createOffice({ storeId: "7de2da19-7e33-496b-80f4-1358b4b43125", name: "Office" }),
    ).rejects.toEqual(new ApiError("Store not found.", 404));
  });

  it("rejects invalid create office responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: "office-1", name: "Office" }, { status: 201 }));
    const client = createApiStoresClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(
      client.createOffice({ storeId: "7de2da19-7e33-496b-80f4-1358b4b43125", name: "Office" }),
    ).rejects.toBeInstanceOf(z.ZodError);
  });

  it("uses a fallback error when the API error body is invalid", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("not json", { status: 500 }));
    const client = createApiStoresClient({ apiUrl: "http://localhost:3000", fetch: fetchMock });

    await expect(client.listStores()).rejects.toEqual(new ApiError("Failed to load stores.", 500));
  });
});
