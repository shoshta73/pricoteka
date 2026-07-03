import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { useProductsStore } from "@/stores/productsStore";

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

const mockedUuidv4 = uuidv4 as Mock<() => string>;

describe("productsStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useProductsStore.setState({ products: [] });
    mockedUuidv4.mockReset();
  });

  it("defaults to an empty products list", () => {
    expect(useProductsStore.getState().products).toEqual([]);
  });

  it("adds a product with a generated id", () => {
    mockedUuidv4.mockReturnValue("product-1");

    useProductsStore.getState().addProduct({
      name: "Milk",
      description: "Fresh milk",
      price: 1.5,
    });

    expect(useProductsStore.getState().products).toEqual([
      {
        id: "product-1",
        name: "Milk",
        description: "Fresh milk",
        price: 1.5,
        found_in: [],
      },
    ]);
  });

  it("adds product store and office locations", () => {
    mockedUuidv4.mockReturnValue("product-1");

    useProductsStore.getState().addProduct({
      name: "Milk",
      description: "Fresh milk",
      price: 1.5,
      found_in: [{ store_id: "store-1", office_id: "office-1" }],
    });

    expect(useProductsStore.getState().products[0]?.found_in).toEqual([{ store_id: "store-1", office_id: "office-1" }]);
  });

  it("checks whether a product name exists", () => {
    mockedUuidv4.mockReturnValue("product-1");

    expect(useProductsStore.getState().productExists("Milk")).toBe(false);

    useProductsStore.getState().addProduct({
      name: "Milk",
      description: "Fresh milk",
      price: 1.5,
    });

    expect(useProductsStore.getState().productExists("Milk")).toBe(true);
    expect(useProductsStore.getState().productExists("Bread")).toBe(false);
  });

  it("does not add duplicate product names", () => {
    mockedUuidv4.mockReturnValue("product-1");

    useProductsStore.getState().addProduct({
      name: "Milk",
      description: "Fresh milk",
      price: 1.5,
    });
    useProductsStore.getState().addProduct({
      name: "Milk",
      description: "Other milk",
      price: 2,
    });

    expect(useProductsStore.getState().products).toEqual([
      {
        id: "product-1",
        name: "Milk",
        description: "Fresh milk",
        price: 1.5,
        found_in: [],
      },
    ]);
    expect(mockedUuidv4).toHaveBeenCalledTimes(1);
  });

  it("persists products state under the products-storage key", () => {
    mockedUuidv4.mockReturnValue("product-1");

    useProductsStore.getState().addProduct({
      name: "Milk",
      description: "Fresh milk",
      price: 1.5,
    });

    expect(JSON.parse(localStorage.getItem("products-storage") ?? "{}")).toMatchObject({
      state: {
        products: [
          {
            id: "product-1",
            name: "Milk",
            description: "Fresh milk",
            price: 1.5,
            found_in: [],
          },
        ],
      },
      version: 1,
    });
  });
});
