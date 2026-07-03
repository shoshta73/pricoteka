import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { useStoresStore } from "@/stores/storesStore";

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

const mockedUuidv4 = uuidv4 as Mock<() => string>;

describe("storesStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useStoresStore.setState({ stores: [] });
    mockedUuidv4.mockReset();
  });

  it("defaults to an empty stores list", () => {
    expect(useStoresStore.getState().stores).toEqual([]);
  });

  it("adds a store with a generated id", () => {
    mockedUuidv4.mockReturnValue("store-1");

    useStoresStore.getState().addStore("Konzum");

    expect(useStoresStore.getState().stores).toEqual([
      {
        id: "store-1",
        name: "Konzum",
        offices: [],
      },
    ]);
  });

  it("adds multiple stores without replacing existing stores", () => {
    mockedUuidv4.mockReturnValueOnce("store-1").mockReturnValueOnce("store-2");

    useStoresStore.getState().addStore("Konzum");
    useStoresStore.getState().addStore("Spar");

    expect(useStoresStore.getState().stores).toEqual([
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

    expect(useStoresStore.getState().storeExists("Konzum")).toBe(false);

    useStoresStore.getState().addStore("Konzum");

    expect(useStoresStore.getState().storeExists("Konzum")).toBe(true);
    expect(useStoresStore.getState().storeExists("Spar")).toBe(false);
  });

  it("does not add duplicate store names", () => {
    mockedUuidv4.mockReturnValue("store-1");

    useStoresStore.getState().addStore("Konzum");
    useStoresStore.getState().addStore("Konzum");

    expect(useStoresStore.getState().stores).toEqual([
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

    useStoresStore.getState().addStore("Konzum");
    useStoresStore.getState().addOffice("store-1", "Centar");

    expect(useStoresStore.getState().stores).toEqual([
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

    useStoresStore.getState().addStore("Konzum");
    useStoresStore.getState().addStore("Spar");
    useStoresStore.getState().addOffice("store-1", "Centar");
    useStoresStore.getState().addOffice("store-1", "Zapad");

    expect(useStoresStore.getState().stores).toEqual([
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

    useStoresStore.getState().addStore("Konzum");
    useStoresStore.getState().addStore("Spar");
    useStoresStore.getState().addOffice("store-1", "Centar");

    expect(useStoresStore.getState().officeExists("store-1", "Centar")).toBe(true);
    expect(useStoresStore.getState().officeExists("store-1", "Zapad")).toBe(false);
    expect(useStoresStore.getState().officeExists("store-2", "Centar")).toBe(false);
  });

  it("does not add duplicate office names within a store", () => {
    mockedUuidv4.mockReturnValueOnce("store-1").mockReturnValueOnce("office-1");

    useStoresStore.getState().addStore("Konzum");
    useStoresStore.getState().addOffice("store-1", "Centar");
    useStoresStore.getState().addOffice("store-1", "Centar");

    expect(useStoresStore.getState().stores[0]?.offices).toEqual([
      {
        id: "office-1",
        name: "Centar",
      },
    ]);
    expect(mockedUuidv4).toHaveBeenCalledTimes(2);
  });

  it("persists stores state under the stores-storage key", () => {
    mockedUuidv4.mockReturnValue("store-1");

    useStoresStore.getState().addStore("Konzum");

    expect(JSON.parse(localStorage.getItem("stores-storage") ?? "{}")).toMatchObject({
      state: {
        stores: [
          {
            id: "store-1",
            name: "Konzum",
            offices: [],
          },
        ],
      },
      version: 1,
    });
  });
});
