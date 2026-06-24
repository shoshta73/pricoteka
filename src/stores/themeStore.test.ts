import { beforeEach, describe, expect, it } from "vitest";

import { useThemeStore } from "@/stores/themeStore";

describe("themeStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ theme: "dark" });
  });

  it("defaults to dark theme", () => {
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("toggles from dark to light", () => {
    useThemeStore.getState().toggle();

    expect(useThemeStore.getState().theme).toBe("light");
  });

  it("toggles from light back to dark", () => {
    useThemeStore.getState().toggle();
    useThemeStore.getState().toggle();

    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("persists theme state under the theme-storage key", () => {
    useThemeStore.getState().toggle();

    expect(JSON.parse(localStorage.getItem("theme-storage") ?? "{}")).toMatchObject({
      state: { theme: "light" },
    });
  });
});
