import type { Store } from "@pricoteka/core";

export interface StoresService {
  listStores: () => Store[];
  storeExists: (name: string) => boolean;
  addStore: (name: string) => void;
  officeExists: (storeId: string, name: string) => boolean;
  addOffice: (storeId: string, name: string) => void;
}
