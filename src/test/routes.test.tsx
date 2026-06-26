import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { useStoresStore } from "@/stores/storesStore";
import { renderRouter } from "@/test/render-router";

describe("routes", () => {
  beforeEach(() => {
    localStorage.clear();
    useStoresStore.setState({ stores: [] });
  });

  it("renders the empty stores state when there are no stores", async () => {
    const { findByText } = renderRouter("/stores");

    expect(await findByText("No Stores Registered")).toBeInTheDocument();
    expect(await findByText("Create a new store to get started.")).toBeInTheDocument();
  });

  it("navigates from stores to create store", async () => {
    const user = userEvent.setup();
    const { findByRole, router } = renderRouter("/stores");

    await user.click(await findByRole("button", { name: "Create Store" }));

    expect(router.state.location.pathname).toBe("/stores/create");
  });

  it("renders the about route", async () => {
    const { findByText } = renderRouter("/about");

    expect(await findByText("Hello from About!")).toBeInTheDocument();
  });

  it("renders the index route without crashing", async () => {
    const { findByRole } = renderRouter("/");

    expect(await findByRole("link", { name: "Stores" })).toBeInTheDocument();
  });
});
