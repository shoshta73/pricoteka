import * as v1 from "@/types/v1";

export type Store = {
  id: string;
  name: string;
  offices: v1.StoreOffice[];
};
