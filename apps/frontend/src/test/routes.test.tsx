import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { i18n } from "@/lib/i18n";
import { useStoresStore } from "@/stores/storesStore";
import { renderRouter } from "@/test/render-router";

describe("routes", () => {
  beforeEach(() => {
    localStorage.clear();
    useStoresStore.setState({ stores: [] });
  });

  it("renders the empty stores state when there are no stores", async () => {
    const { findByText } = renderRouter("/stores");

    expect(await findByText(i18n.t("stores.emptyTitle"))).toBeInTheDocument();
    expect(await findByText(i18n.t("stores.emptyDescription"))).toBeInTheDocument();
  });

  it("navigates from stores to create store", async () => {
    const user = userEvent.setup();
    const { findByRole, findByText, router } = renderRouter("/stores");

    await user.click(await findByRole("button", { name: i18n.t("stores.createAction") }));

    expect(router.state.location.pathname).toBe("/stores/create");
    expect(await findByText(i18n.t("stores.createTitle"))).toBeInTheDocument();
  });

  it("renders the create store route", async () => {
    const { findByText } = renderRouter("/stores/create");

    expect(await findByText(i18n.t("stores.createTitle"))).toBeInTheDocument();
  });

  it("sets localized document titles", async () => {
    const { findByText } = renderRouter("/stores/create");

    await findByText(i18n.t("stores.createTitle"));

    expect(document.title).toBe(i18n.t("title.page", { page: i18n.t("stores.createTitle") }));

    await i18n.changeLanguage("hr");

    expect(document.title).toBe(i18n.t("title.page", { page: i18n.t("stores.createTitle") }));
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
