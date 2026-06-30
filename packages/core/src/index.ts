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

export type Ok<T> = {
  readonly ok: true;
  readonly value: T;
};

export type Err<E> = {
  readonly ok: false;
  readonly error: E;
};

export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.ok;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }

  throw result.error;
}

export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.value : fallback;
}

export function migrateStore(store: v1.Store): v2.Store {
  return {
    ...store,
    offices: [],
  };
}
