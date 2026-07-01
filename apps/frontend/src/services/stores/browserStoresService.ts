import type { Store, v1 } from "@pricoteka/core";
import { v4 as uuidv4 } from "uuid";

import type { StoresService } from "@/services/stores/types";

interface BrowserStoresServiceOptions {
  getStores: () => Store[];
  setStores: (stores: Store[]) => void;
}

export function createBrowserStoresService({ getStores, setStores }: BrowserStoresServiceOptions): StoresService {
  const service: StoresService = {
    listStores: () => getStores(),
    storeExists: (name) => {
      const stores = getStores();
      for (const store of stores) {
        if (store.name === name) {
          return true;
        }
      }

      return false;
    },
    addStore: (name) => {
      const stores = getStores();
      if (service.storeExists(name)) {
        return;
      }

      const newStore: Store = {
        id: uuidv4(),
        name,
        offices: [],
      };
      setStores([...stores, newStore]);
    },
    officeExists: (storeId, name) => {
      const stores = getStores();
      const store = stores.find((item) => item.id === storeId);

      return store?.offices.some((office: v1.StoreOffice) => office.name === name) ?? false;
    },
    addOffice: (storeId, name) => {
      const stores = getStores();
      if (!stores.some((store) => store.id === storeId)) {
        return;
      }

      if (service.officeExists(storeId, name)) {
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
      setStores(newStores);
    },
  };

  return service;
}
