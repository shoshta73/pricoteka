export type StoreOffice = {
  id: string;
  name: string;
};

export type ProductLocation = {
  store_id?: string;
  office_id: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  found_in: ProductLocation[];
};

export type Store = {
  id: string;
  name: string;
  offices: StoreOffice[];
};

export type Ok<T> = {
  readonly ok: true;
  readonly value: T;
};

export class ResultError extends Error {
  override readonly cause?: unknown;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "ResultError";
    this.cause = options?.cause;
  }

  context(message: string): ResultError {
    return new ResultError(message, { cause: this });
  }
}

export type Err<E = ResultError> = {
  readonly ok: false;
  readonly error: E;
};

export type Result<T, E = ResultError> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function toResultError(error: unknown): ResultError {
  if (error instanceof ResultError) {
    return error;
  }

  if (error instanceof Error) {
    return new ResultError(error.message, { cause: error });
  }

  if (typeof error === "string") {
    return new ResultError(error);
  }

  return new ResultError("Unknown error", { cause: error });
}

export function err(error: unknown): Err {
  return { ok: false, error: toResultError(error) };
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
