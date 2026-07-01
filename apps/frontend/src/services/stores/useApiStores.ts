import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiStoresClient } from "@/services/stores/apiStoresClient";
import { storesQueryKeys } from "@/services/stores/storesQueryKeys";

export function useApiStores(enabled: boolean) {
  return useQuery({
    enabled,
    queryFn: apiStoresClient.listStores,
    queryKey: storesQueryKeys.all,
  });
}

export function useCreateApiStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiStoresClient.createStore,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: storesQueryKeys.all });
    },
  });
}
