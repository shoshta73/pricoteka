import { appConfig } from "@/lib/appConfig";
import { useCreateApiOffice } from "@/services/stores/useApiStores";
import { useStoresStore } from "@/stores/storesStore";

interface CreateOfficeAction {
  createOffice: (storeId: string, name: string) => Promise<void>;
  isPending: boolean;
}

export function useCreateOfficeAction(): CreateOfficeAction {
  const addOffice = useStoresStore((state) => state.addOffice);
  const createApiOffice = useCreateApiOffice();

  return {
    createOffice: async (storeId, name) => {
      if (appConfig.isApiMode) {
        await createApiOffice.mutateAsync({ storeId, name });
        return;
      }

      addOffice(storeId, name);
    },
    isPending: appConfig.isApiMode && createApiOffice.isPending,
  };
}
