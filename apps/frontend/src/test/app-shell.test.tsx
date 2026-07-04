import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { useSettingsStore } from "@/stores/settingsStore";
import { useThemeStore } from "@/stores/themeStore";
import { renderRouter } from "@/test/render-router";

describe("app shell", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
    useSettingsStore.setState({ apiUrl: "", runtimeMode: "browser" });
    useThemeStore.setState({ theme: "dark" });
  });

  it("renders the app navigation", async () => {
    const { findByRole } = renderRouter("/");

    expect(await findByRole("link", { name: "Stores" })).toHaveAttribute("href", "/stores");
  });

  it("toggles the document theme class from the header button", async () => {
    const user = userEvent.setup();
    const { findByRole } = renderRouter("/");

    const button = await findByRole("button", { name: "Switch to light theme" });
    expect(document.documentElement).toHaveClass("dark");

    await user.click(button);

    expect(document.documentElement).not.toHaveClass("dark");
    expect(button).toHaveAccessibleName("Switch to dark theme");
  });
});
