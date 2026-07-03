import { useMutation } from "@tanstack/react-query";

import { apiProductsClient } from "@/services/products/apiProductsClient";

export function useCreateApiProduct() {
  return useMutation({
    mutationFn: apiProductsClient.createProduct,
  });
}
