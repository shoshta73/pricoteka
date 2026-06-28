import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { Store } from "@/types";
import type * as v1 from "@/types/v1";

import { migrateStore } from "@/types/migrate-to-v2";

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
      (set, get) => ({
        stores: [],
        storeExists: (name) => {
          const { stores } = get();
          for (const store of stores) {
            if (store.name === name) {
              return true;
            }
          }

          return false;
        },
        addStore: (name) => {
          const { stores, storeExists } = get();
          if (storeExists(name)) {
            return;
          }

          const newStore: Store = {
            id: uuidv4(),
            name,
            offices: [],
          };
          const newStores = [...stores, newStore];
          set({ stores: newStores });
        },
        officeExists: (storeId, name) => {
          const { stores } = get();
          const store = stores.find((item) => item.id === storeId);

          return store?.offices.some((office: v1.StoreOffice) => office.name === name) ?? false;
        },
        addOffice: (storeId, name) => {
          const { stores, officeExists } = get();
          if (officeExists(storeId, name)) {
            return;
          }

          const newStores = stores.map((store) => {
            if (store.id !== storeId) {
              return store;
            }

            return {
              ...store,
              offices: [
                ...store.offices,
                {
                  id: uuidv4(),
                  name,
                },
              ],
            };
          });
          set({ stores: newStores });
        },
      }),
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
