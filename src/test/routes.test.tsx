import { describe, expect, it } from "vitest";

import { renderRouter } from "@/test/render-router";

describe("routes", () => {
  it("renders the stores route", async () => {
    const { findAllByText } = renderRouter("/stores");

    expect(await findAllByText("Stores")).toHaveLength(2);
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
