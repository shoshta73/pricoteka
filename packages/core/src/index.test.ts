import { describe, expect, it } from "vitest";

import { migrateStore } from "./index.ts";

describe("migrateStore", () => {
  it("keeps the v1 store fields", () => {
    expect(migrateStore({ id: "store-1", name: "Konzum" })).toMatchObject({
      id: "store-1",
      name: "Konzum",
    });
  });

  it("adds an empty offices list", () => {
    expect(migrateStore({ id: "store-1", name: "Konzum" }).offices).toEqual([]);
  });
});
