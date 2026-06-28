import * as v1 from "@/types/v1";
import * as v2 from "@/types/v2";

export function migrateStore(store: v1.Store): v2.Store {
  return {
    ...store,
    offices: [],
  };
}
