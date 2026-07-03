import type { v1 } from "@pricoteka/core";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createBrowserProductsService } from "@/services/products/browserProductsService";
import type { ProductLocation } from "@/services/products/types";

interface ProductsStore {
  products: v1.Product[];
  productExists: (name: string) => boolean;
  addProduct: (product: {
    name: string;
    description: string;
    price: number;
    found_in?: ProductLocation[];
  }) => void;
}

export const useProductsStore = create<ProductsStore>()(
  devtools(
    persist(
      (set, get) => {
        const productsService = createBrowserProductsService({
          getProducts: () => get().products,
          setProducts: (products) => set({ products }),
        });

        return {
          products: [],
          productExists: productsService.productExists,
          addProduct: productsService.addProduct,
        };
      },
      {
        name: "products-storage",
        version: 1,
      },
    ),
    {
      name: "products-store",
    },
  ),
);
