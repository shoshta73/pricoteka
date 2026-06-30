import { describe, expect, it } from "vitest";

import {
  ResultError,
  err,
  isErr,
  isOk,
  migrateStore,
  ok,
  toResultError,
  unwrap,
  unwrapOr,
} from "./index.ts";

describe("Result", () => {
  it("creates ok results", () => {
    const result = ok(42);

    expect(result).toEqual({ ok: true, value: 42 });
    expect(isOk(result)).toBe(true);
    expect(isErr(result)).toBe(false);
  });

  it("creates err results", () => {
    const result = err("not found");

    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(ResultError);
    expect(result.error.message).toBe("not found");
    expect(isOk(result)).toBe(false);
    expect(isErr(result)).toBe(true);
  });

  it("creates errors from native errors", () => {
    const cause = new Error("db failed");
    const error = toResultError(cause);

    expect(error).toBeInstanceOf(ResultError);
    expect(error.message).toBe("db failed");
    expect(error.cause).toBe(cause);
  });

  it("adds context while preserving the cause chain", () => {
    const root = err("connection refused").error;
    const error = root.context("failed to load stores");

    expect(error.message).toBe("failed to load stores");
    expect(error.cause).toBe(root);
  });

  it("unwraps ok results", () => {
    expect(unwrap(ok("value"))).toBe("value");
  });

  it("throws err values when unwrapping err results", () => {
    expect(() => unwrap(err(new Error("boom")))).toThrow(ResultError);
    expect(() => unwrap(err(new Error("boom")))).toThrow("boom");
  });

  it("returns a fallback for err results", () => {
    expect(unwrapOr(err("missing"), "fallback")).toBe("fallback");
    expect(unwrapOr(ok("value"), "fallback")).toBe("value");
  });
});

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
