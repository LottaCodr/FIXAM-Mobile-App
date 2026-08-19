import { json, preflight } from "../_shared/cors.ts";
import { listBanks } from "../_shared/flutterwave.ts";
import { fail } from "../_shared/http.ts";
import { requireUser } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const done = preflight(req);
  if (done) return done;
  try {
    await requireUser(req);
    const country = new URL(req.url).searchParams.get("country") ?? "NG";
    const result = await listBanks(country);
    return json({ ok: true, banks: result.data ?? [] });
  } catch (error) {
    return fail(error);
  }
});
