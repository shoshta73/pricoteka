import { useCreateApiOffice } from "@/services/stores/useApiStores";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStoresStore } from "@/stores/storesStore";

interface CreateOfficeAction {
  createOffice: (storeId: string, name: string) => Promise<void>;
  isPending: boolean;
}

export function useCreateOfficeAction(): CreateOfficeAction {
  const isApiMode = useSettingsStore((state) => state.runtimeMode === "api");
  const addOffice = useStoresStore((state) => state.addOffice);
  const createApiOffice = useCreateApiOffice();

  return {
    createOffice: async (storeId, name) => {
      if (isApiMode) {
        await createApiOffice.mutateAsync({ storeId, name });
        return;
      }

      addOffice(storeId, name);
    },
    isPending: isApiMode && createApiOffice.isPending,
  };
}
