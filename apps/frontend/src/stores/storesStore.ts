import { migrateStore, type Store, type v1 } from "@pricoteka/core";
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
        version: 2,
        migrate: (persistedState, version) => {
          if (version === 1) {
            const state = persistedState as { stores?: v1.Store[] };

            return {
              ...state,
              stores: state.stores?.map(migrateStore) ?? [],
            };
          }

          return persistedState;
        },
      },
    ),
    {
      name: "stores-store",
    },
  ),
);
