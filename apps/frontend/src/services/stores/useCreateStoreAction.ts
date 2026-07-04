import { useCreateApiStore } from "@/services/stores/useApiStores";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStoresStore } from "@/stores/storesStore";

interface CreateStoreAction {
  createStore: (name: string) => Promise<void>;
  isPending: boolean;
}

export function useCreateStoreAction(): CreateStoreAction {
  const isApiMode = useSettingsStore((state) => state.runtimeMode === "api");
  const addStore = useStoresStore((state) => state.addStore);
  const createApiStore = useCreateApiStore();

  return {
    createStore: async (name) => {
      if (isApiMode) {
        await createApiStore.mutateAsync({ name });
        return;
      }

      addStore(name);
    },
    isPending: isApiMode && createApiStore.isPending,
  };
}
