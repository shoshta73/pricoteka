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
      },
      {
        id: "store-2",
        name: "Spar",
      },
    ]);
  });

  it("does not add duplicate store names", () => {
    mockedUuidv4.mockReturnValue("store-1");

    useStoresStore.getState().addStore("Konzum");
    useStoresStore.getState().addStore("Konzum");

    expect(useStoresStore.getState().stores).toEqual([
      {
        id: "store-1",
        name: "Konzum",
      },
    ]);
    expect(mockedUuidv4).toHaveBeenCalledTimes(1);
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
          },
        ],
      },
    });
  });
});
