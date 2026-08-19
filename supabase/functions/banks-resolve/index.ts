import { json, preflight } from "../_shared/cors.ts";
import { resolveAccount } from "../_shared/flutterwave.ts";
import { fail, readJson } from "../_shared/http.ts";
import { requireUser } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const done = preflight(req);
  if (done) return done;
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    await requireUser(req);
    const { accountNumber, bankCode } = await readJson<{
      accountNumber: string;
      bankCode: string;
    }>(req);
    if (!accountNumber || !bankCode) {
      return json({ error: "accountNumber and bankCode are required" }, 422);
    }
    const result = await resolveAccount(accountNumber, bankCode);
    return json({ ok: true, account: result.data });
  } catch (error) {
    return fail(error);
  }
});
