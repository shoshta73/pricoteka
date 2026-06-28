export namespace v1 {
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

export type Store = v2.Store;

export function migrateStore(store: v1.Store): v2.Store {
  return {
    ...store,
    offices: [],
  };
}
