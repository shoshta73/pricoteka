import { appConfig } from "@/lib/appConfig";
import type { ProductLocation } from "@/services/products/types";
import { useCreateApiProduct } from "@/services/products/useApiProducts";
import { useProductsStore } from "@/stores/productsStore";

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
  const addProduct = useProductsStore((state) => state.addProduct);
  const createApiProduct = useCreateApiProduct();

  return {
    createProduct: async (input) => {
      if (appConfig.isApiMode) {
        await createApiProduct.mutateAsync(input);
        return;
      }

      addProduct(input);
    },
    isPending: appConfig.isApiMode && createApiProduct.isPending,
  };
}
