import type { Store } from "@pricoteka/core";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { createBrowserStoresService } from "@/services/stores/browserStoresService";

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

const mockedUuidv4 = uuidv4 as Mock<() => string>;

describe("browserStoresService", () => {
  let stores: Store[];
  let service: ReturnType<typeof createBrowserStoresService>;

  beforeEach(() => {
    stores = [];
    service = createBrowserStoresService({
      getStores: () => stores,
      setStores: (nextStores) => {
        stores = nextStores;
      },
    });
    mockedUuidv4.mockReset();
  });

  it("lists stores from the current source", () => {
    stores = [
      {
        id: "store-1",
        name: "Konzum",
        offices: [],
      },
    ];

    expect(service.listStores()).toEqual(stores);
  });

  it("adds a store with a generated id", () => {
    mockedUuidv4.mockReturnValue("store-1");

    service.addStore("Konzum");

    expect(stores).toEqual([
      {
        id: "store-1",
        name: "Konzum",
        offices: [],
      },
    ]);
  });

  it("adds multiple stores without replacing existing stores", () => {
    mockedUuidv4.mockReturnValueOnce("store-1").mockReturnValueOnce("store-2");

    service.addStore("Konzum");
    service.addStore("Spar");

    expect(stores).toEqual([
      {
        id: "store-1",
        name: "Konzum",
        offices: [],
      },
      {
        id: "store-2",
        name: "Spar",
        offices: [],
      },
    ]);
  });

  it("checks whether a store name exists", () => {
    mockedUuidv4.mockReturnValue("store-1");

    expect(service.storeExists("Konzum")).toBe(false);

    service.addStore("Konzum");

    expect(service.storeExists("Konzum")).toBe(true);
    expect(service.storeExists("Spar")).toBe(false);
  });

  it("does not add duplicate store names", () => {
    mockedUuidv4.mockReturnValue("store-1");

    service.addStore("Konzum");
    service.addStore("Konzum");

    expect(stores).toEqual([
      {
        id: "store-1",
        name: "Konzum",
        offices: [],
      },
    ]);
    expect(mockedUuidv4).toHaveBeenCalledTimes(1);
  });

  it("adds an office to a store with a generated id", () => {
    mockedUuidv4.mockReturnValueOnce("store-1").mockReturnValueOnce("office-1");

    service.addStore("Konzum");
    service.addOffice("store-1", "Centar");

    expect(stores).toEqual([
      {
        id: "store-1",
        name: "Konzum",
        offices: [
          {
            id: "office-1",
            name: "Centar",
          },
        ],
      },
    ]);
  });

  it("adds multiple offices without replacing existing stores or offices", () => {
    mockedUuidv4
      .mockReturnValueOnce("store-1")
      .mockReturnValueOnce("store-2")
      .mockReturnValueOnce("office-1")
      .mockReturnValueOnce("office-2");

    service.addStore("Konzum");
    service.addStore("Spar");
    service.addOffice("store-1", "Centar");
    service.addOffice("store-1", "Zapad");

    expect(stores).toEqual([
      {
        id: "store-1",
        name: "Konzum",
        offices: [
          {
            id: "office-1",
            name: "Centar",
          },
          {
            id: "office-2",
            name: "Zapad",
          },
        ],
      },
      {
        id: "store-2",
        name: "Spar",
        offices: [],
      },
    ]);
  });

  it("checks whether an office name exists within a store", () => {
    mockedUuidv4.mockReturnValueOnce("store-1").mockReturnValueOnce("store-2").mockReturnValueOnce("office-1");

    service.addStore("Konzum");
    service.addStore("Spar");
    service.addOffice("store-1", "Centar");

    expect(service.officeExists("store-1", "Centar")).toBe(true);
    expect(service.officeExists("store-1", "Zapad")).toBe(false);
    expect(service.officeExists("store-2", "Centar")).toBe(false);
  });

  it("does not add duplicate office names within a store", () => {
    mockedUuidv4.mockReturnValueOnce("store-1").mockReturnValueOnce("office-1");

    service.addStore("Konzum");
    service.addOffice("store-1", "Centar");
    service.addOffice("store-1", "Centar");

    expect(stores[0]?.offices).toEqual([
      {
        id: "office-1",
        name: "Centar",
      },
    ]);
    expect(mockedUuidv4).toHaveBeenCalledTimes(2);
  });

  it("does not add an office to a missing store", () => {
    service.addOffice("missing-store", "Centar");

    expect(stores).toEqual([]);
    expect(mockedUuidv4).not.toHaveBeenCalled();
  });
});
