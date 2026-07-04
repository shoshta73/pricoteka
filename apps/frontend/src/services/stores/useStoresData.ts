import type { Store } from "@pricoteka/core";

import { useApiStores } from "@/services/stores/useApiStores";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStoresStore } from "@/stores/storesStore";

interface StoresData {
  stores: Store[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  storeExists: (name: string) => boolean;
}

export function useStoresData(): StoresData {
  const isApiMode = useSettingsStore((state) => state.runtimeMode === "api");
  const browserStores = useStoresStore((state) => state.stores);
  const apiStores = useApiStores(isApiMode);
  const stores = isApiMode ? (apiStores.data ?? []) : browserStores;

  return {
    stores,
    isLoading: isApiMode && apiStores.isLoading,
    isError: isApiMode && apiStores.isError,
    error: apiStores.error,
    storeExists: (name) => stores.some((store) => store.name === name),
  };
}
