import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiProductsClient } from "@/services/products/apiProductsClient";
import { productsQueryKeys } from "@/services/products/productsQueryKeys";

export function useApiProducts(enabled: boolean) {
  return useQuery({
    enabled,
    queryFn: apiProductsClient.listProducts,
    queryKey: productsQueryKeys.all,
  });
}

export function useCreateApiProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiProductsClient.createProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
    },
  });
}
