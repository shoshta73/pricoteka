import type { Store } from "@pricoteka/core";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createBrowserStoresService } from "@/services/stores/browserStoresService";

interface StoresStore {
  stores: Store[];
  storeExists: (name: string) => boolean;
  addStore: (name: string) => void;
  officeExists: (storeId: string, name: string) => boolean;
  addOffice: (storeId: string, name: string) => void;
}

export const useStoresStore = create<StoresStore>()(
  devtools(
    persist(
      (set, get) => {
        const storesService = createBrowserStoresService({
          getStores: () => get().stores,
          setStores: (stores) => set({ stores }),
        });

        return {
          stores: [],
          storeExists: storesService.storeExists,
          addStore: storesService.addStore,
          officeExists: storesService.officeExists,
          addOffice: storesService.addOffice,
        };
      },
      {
        name: "stores-storage",
        version: 1,
      },
    ),
    {
      name: "stores-store",
    },
  ),
);
