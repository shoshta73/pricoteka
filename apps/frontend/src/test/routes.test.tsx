import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { i18n } from "@/lib/i18n";
import { useProductsStore } from "@/stores/productsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStoresStore } from "@/stores/storesStore";
import { renderRouter } from "@/test/render-router";

describe("routes", () => {
  beforeEach(() => {
    localStorage.clear();
    useProductsStore.setState({ products: [] });
    useSettingsStore.setState({ apiUrl: "", runtimeMode: "browser" });
    useStoresStore.setState({ stores: [] });
  });

  it("renders the empty stores state when there are no stores", async () => {
    const { findByText } = renderRouter("/stores");

    expect(await findByText(i18n.t("stores.emptyTitle"))).toBeInTheDocument();
    expect(await findByText(i18n.t("stores.emptyDescription"))).toBeInTheDocument();
  });

  it("renders store dashboard detail links", async () => {
    useStoresStore.setState({
      stores: [
        {
          id: "store-1",
          name: "Store 1",
          offices: [],
        },
      ],
    });
    const { findAllByText, findByRole } = renderRouter("/stores");

    expect(await findAllByText("Store 1")).toHaveLength(2);
    expect(await findByRole("link", { name: i18n.t("stores.viewAction") })).toHaveAttribute("href", "/stores/store-1");
  });

  it("renders the empty products state", async () => {
    const { findByText } = renderRouter("/products");

    expect(await findByText(i18n.t("products.emptyTitle"))).toBeInTheDocument();
    expect(await findByText(i18n.t("products.emptyDescription"))).toBeInTheDocument();
  });

  it("renders the products dashboard", async () => {
    useStoresStore.setState({
      stores: [
        {
          id: "store-1",
          name: "Store 1",
          offices: [{ id: "office-1", name: "Office 1" }],
        },
      ],
    });
    useProductsStore.setState({
      products: [
        {
          id: "product-1",
          name: "Milk",
          description: "Fresh milk",
          price: 1.5,
          found_in: [{ store_id: "store-1", office_id: "office-1" }],
        },
      ],
    });
    const { findAllByText, findByRole, findByText } = renderRouter("/products");

    expect(await findAllByText("Milk")).toHaveLength(2);
    expect(
      await findByText(new Intl.NumberFormat(i18n.language, { currency: "EUR", style: "currency" }).format(1.5)),
    ).toBeInTheDocument();
    expect(await findByText("Fresh milk")).toBeInTheDocument();
    expect(await findByText("Store 1 / Office 1")).toBeInTheDocument();
    expect(await findByRole("link", { name: i18n.t("products.viewAction") })).toHaveAttribute(
      "href",
      "/products/product-1",
    );
  });

  it("renders product fallbacks in the products dashboard", async () => {
    useProductsStore.setState({
      products: [
        {
          id: "product-1",
          name: "Milk",
          description: "",
          price: 1.5,
          found_in: [],
        },
      ],
    });
    const { findByText } = renderRouter("/products");

    expect(await findByText(i18n.t("products.noDescription"))).toBeInTheDocument();
    expect(await findByText(i18n.t("products.noLocations"))).toBeInTheDocument();
  });

  it("renders a create product action when there are no products", async () => {
    const { findByRole } = renderRouter("/products");

    expect(await findByRole("button", { name: i18n.t("products.createAction") })).toBeInTheDocument();
  });

  it("navigates from products to create product", async () => {
    const user = userEvent.setup();
    const { findByRole, findByText, router } = renderRouter("/products");

    await user.click(await findByRole("button", { name: i18n.t("products.createAction") }));

    expect(router.state.location.pathname).toBe("/products/create");
    expect(await findByText(i18n.t("products.createTitle"))).toBeInTheDocument();
  });

  it("renders the create product form", async () => {
    const { findByLabelText, findByRole, findByText } = renderRouter("/products/create");

    expect(await findByText(i18n.t("products.createTitle"))).toBeInTheDocument();
    expect(await findByLabelText(i18n.t("products.nameLabel"))).toBeInTheDocument();
    expect(await findByLabelText(i18n.t("products.descriptionLabel"))).toBeInTheDocument();
    expect(await findByLabelText(i18n.t("products.priceLabel"))).toBeInTheDocument();
    expect(await findByRole("button", { name: i18n.t("products.storeLabel") })).toBeInTheDocument();
    expect(await findByRole("button", { name: i18n.t("products.officeLabel") })).toBeInTheDocument();
  });

  it("creates a product from the create product form", async () => {
    const user = userEvent.setup();
    useStoresStore.setState({
      stores: [
        {
          id: "store-1",
          name: "Store 1",
          offices: [{ id: "office-1", name: "Office 1" }],
        },
      ],
    });
    const { findByLabelText, findByRole, router } = renderRouter("/products/create");

    await user.type(await findByLabelText(i18n.t("products.nameLabel")), "Milk");
    await user.type(await findByLabelText(i18n.t("products.priceLabel")), "1.50");
    await user.click(await findByRole("button", { name: i18n.t("products.storeLabel") }));
    await user.click(await findByRole("menuitem", { name: "Store 1" }));
    await user.click(await findByRole("button", { name: i18n.t("products.officeLabel") }));
    await user.click(await findByRole("menuitem", { name: "Office 1" }));
    await user.click(await findByRole("button", { name: i18n.t("products.createSubmitAction") }));

    expect(router.state.location.pathname).toBe("/products");
    expect(useProductsStore.getState().products).toMatchObject([
      {
        name: "Milk",
        description: "",
        price: 1.5,
        found_in: [{ store_id: "store-1", office_id: "office-1" }],
      },
    ]);
  });

  it("does not create duplicate product names", async () => {
    const user = userEvent.setup();
    useProductsStore.getState().addProduct({
      name: "Milk",
      description: "Existing product",
      price: 1,
    });
    const { findByLabelText, findByRole, router } = renderRouter("/products/create");

    await user.type(await findByLabelText(i18n.t("products.nameLabel")), "Milk");
    await user.type(await findByLabelText(i18n.t("products.priceLabel")), "1.50");
    await user.click(await findByRole("button", { name: i18n.t("products.createSubmitAction") }));

    expect(router.state.location.pathname).toBe("/products/create");
    expect(useProductsStore.getState().products).toHaveLength(1);
  });

  it("renders the product detail placeholder route", async () => {
    const { findByText } = renderRouter("/products/product-1");

    expect(await findByText(i18n.t("products.detailPlaceholder"))).toBeInTheDocument();
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
    const { findByRole, findByText } = renderRouter("/about");

    expect(await findByRole("heading", { name: i18n.t("pages.about.title") })).toBeInTheDocument();
    expect(await findByText(i18n.t("pages.about.subtitle"))).toBeInTheDocument();
    expect(await findByText(i18n.t("pages.about.storageTitle"))).toBeInTheDocument();
  });

  it("switches runtime mode from settings", async () => {
    const user = userEvent.setup();
    const { findByLabelText, findByRole, findByText } = renderRouter("/settings");

    expect(await findByRole("heading", { name: i18n.t("pages.settings.title") })).toBeInTheDocument();
    expect(await findByText(i18n.t("pages.settings.apiUrlMissing"))).toBeInTheDocument();

    await user.type(await findByLabelText(i18n.t("pages.settings.apiUrlLabel")), "http://localhost:3000/");

    await user.click(await findByRole("button", { name: i18n.t("pages.settings.apiModeAction") }));

    expect(useSettingsStore.getState().apiUrl).toBe("http://localhost:3000/");
    expect(useSettingsStore.getState().runtimeMode).toBe("api");
    expect(await findByRole("button", { name: i18n.t("pages.settings.browserModeAction") })).toBeInTheDocument();
  });

  it("renders the index route without crashing", async () => {
    const { findByRole } = renderRouter("/");

    expect(await findByRole("link", { name: "Stores" })).toBeInTheDocument();
  });
});
