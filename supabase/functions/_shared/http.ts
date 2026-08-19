import { json } from "./cors.ts";

export function fail(error: unknown) {
  const err = error as { message?: string; status?: number };
  const status = err.status && err.status >= 400 ? err.status : 400;
  return json({ ok: false, error: err.message ?? "Request failed" }, status);
}

export async function readJson<T>(req: Request): Promise<T> {
  return (await req.json()) as T;
}
