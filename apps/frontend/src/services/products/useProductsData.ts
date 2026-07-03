import type { Product } from "@pricoteka/core";

import { appConfig } from "@/lib/appConfig";
import { useApiProducts } from "@/services/products/useApiProducts";
import { useProductsStore } from "@/stores/productsStore";

interface ProductsData {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  productExists: (name: string) => boolean;
}

export function useProductsData(): ProductsData {
  const browserProducts = useProductsStore((state) => state.products);
  const apiProducts = useApiProducts(appConfig.isApiMode);
  const products = appConfig.isApiMode ? (apiProducts.data ?? []) : browserProducts;

  return {
    products,
    isLoading: appConfig.isApiMode && apiProducts.isLoading,
    isError: appConfig.isApiMode && apiProducts.isError,
    error: apiProducts.error,
    productExists: (name) => products.some((product) => product.name === name),
  };
}
