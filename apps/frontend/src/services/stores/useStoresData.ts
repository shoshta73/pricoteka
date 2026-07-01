import type { Store } from "@pricoteka/core";

import { appConfig } from "@/lib/appConfig";
import { useApiStores } from "@/services/stores/useApiStores";
import { useStoresStore } from "@/stores/storesStore";

interface StoresData {
  stores: Store[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  storeExists: (name: string) => boolean;
}

export function useStoresData(): StoresData {
  const browserStores = useStoresStore((state) => state.stores);
  const apiStores = useApiStores(appConfig.isApiMode);
  const stores = appConfig.isApiMode ? (apiStores.data ?? []) : browserStores;

  return {
    stores,
    isLoading: appConfig.isApiMode && apiStores.isLoading,
    isError: appConfig.isApiMode && apiStores.isError,
    error: apiStores.error,
    storeExists: (name) => stores.some((store) => store.name === name),
  };
}
