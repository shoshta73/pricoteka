export namespace v1 {
  export type Theme = "dark" | "light";

  /**
   * @deprecated Use `Store` from `v2` instead.
   */
  export type Store = {
    id: string;
    name: string;
  };

  export type StoreOffice = {
    id: string;
    name: string;
  };
}

export namespace v2 {
  export type Store = {
    id: string;
    name: string;
    offices: v1.StoreOffice[];
  };
}

export type Theme = v1.Theme;
export type Store = v2.Store;

export function migrateStore(store: v1.Store): v2.Store {
  return {
    ...store,
    offices: [],
  };
}
