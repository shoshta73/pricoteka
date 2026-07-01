import { appConfig } from "@/lib/appConfig";
import { useCreateApiStore } from "@/services/stores/useApiStores";
import { useStoresStore } from "@/stores/storesStore";

interface CreateStoreAction {
  createStore: (name: string) => Promise<void>;
  isPending: boolean;
}

export function useCreateStoreAction(): CreateStoreAction {
  const addStore = useStoresStore((state) => state.addStore);
  const createApiStore = useCreateApiStore();

  return {
    createStore: async (name) => {
      if (appConfig.isApiMode) {
        await createApiStore.mutateAsync({ name });
        return;
      }

      addStore(name);
    },
    isPending: appConfig.isApiMode && createApiStore.isPending,
  };
}
