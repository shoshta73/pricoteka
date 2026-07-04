import type { Product } from "@pricoteka/core";

import { useApiProducts } from "@/services/products/useApiProducts";
import { useProductsStore } from "@/stores/productsStore";
import { useSettingsStore } from "@/stores/settingsStore";

interface ProductsData {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  productExists: (name: string) => boolean;
}

export function useProductsData(): ProductsData {
  const isApiMode = useSettingsStore((state) => state.runtimeMode === "api");
  const browserProducts = useProductsStore((state) => state.products);
  const apiProducts = useApiProducts(isApiMode);
  const products = isApiMode ? (apiProducts.data ?? []) : browserProducts;

  return {
    products,
    isLoading: isApiMode && apiProducts.isLoading,
    isError: isApiMode && apiProducts.isError,
    error: apiProducts.error,
    productExists: (name) => products.some((product) => product.name === name),
  };
}
