export type OkResult<D> = { ok: true; data: D; error: null };
export type ErrorResult<E> = { ok: false; data: null; error: E };
export type Result<D, E = unknown> = OkResult<D> | ErrorResult<E>;

export const ok = <T>(data: T): OkResult<T> => ({
  ok: true,
  data,
  error: null,
});

export const error = <T>(error: T): ErrorResult<T> => ({
  ok: false,
  data: null,
  error,
});

export const Result = { ok, error };
