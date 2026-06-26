import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { Store } from "@/types";

interface StoresStore {
  stores: Store[];
  addStore: (name: string) => void;
}

export const useStoresStore = create<StoresStore>()(
  devtools(
    persist(
      (set) => ({
        stores: [],
        addStore: (name) =>
          set((state) => {
            for (const store of state.stores) {
              if (store.name === name) {
                return state;
              }
            }

            const newStore: Store = {
              id: uuidv4(),
              name,
            };
            return { stores: [...state.stores, newStore] };
          }),
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
