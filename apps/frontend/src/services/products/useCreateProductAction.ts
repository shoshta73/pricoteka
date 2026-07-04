import type { ProductLocation } from "@pricoteka/core";

import { useCreateApiProduct } from "@/services/products/useApiProducts";
import { useProductsStore } from "@/stores/productsStore";
import { useSettingsStore } from "@/stores/settingsStore";

interface CreateProductActionInput {
  name: string;
  description: string;
  price: number;
  found_in?: ProductLocation[];
}

interface CreateProductAction {
  createProduct: (input: CreateProductActionInput) => Promise<void>;
  isPending: boolean;
}

export function useCreateProductAction(): CreateProductAction {
  const isApiMode = useSettingsStore((state) => state.runtimeMode === "api");
  const addProduct = useProductsStore((state) => state.addProduct);
  const createApiProduct = useCreateApiProduct();

  return {
    createProduct: async (input) => {
      if (isApiMode) {
        await createApiProduct.mutateAsync(input);
        return;
      }

      addProduct(input);
    },
    isPending: isApiMode && createApiProduct.isPending,
  };
}
