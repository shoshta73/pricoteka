import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { Store } from "@/types";

interface StoresStore {
  stores: Store[];
  storeExists: (name: string) => boolean;
  addStore: (name: string) => void;
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
          };
          const newStores = [...stores, newStore];
          set({ stores: newStores });
        },
      }),
      {
        name: "stores-storage",
      },
    ),
    {
      name: "stores-store",
    },
  ),
);
