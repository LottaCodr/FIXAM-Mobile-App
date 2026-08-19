import { json, preflight } from "../_shared/cors.ts";
import { fail, readJson } from "../_shared/http.ts";
import { requireUser } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const done = preflight(req);
  if (done) return done;
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { user, admin } = await requireUser(req);
    const { code } = await readJson<{ code: string }>(req);
    const normalized = (code ?? "").trim().toUpperCase();
    if (!normalized) return json({ error: "code is required" }, 422);

    const { data: me } = await admin
      .from("profiles")
      .select("id, referred_by, referral_code")
      .eq("id", user.id)
      .single();
    if (!me) return json({ error: "Profile missing" }, 404);
    if (me.referred_by) return json({ error: "Referral already applied" }, 409);
    if (me.referral_code === normalized) return json({ error: "You cannot use your own code" }, 409);

    const { data: referrer } = await admin
      .from("profiles")
      .select("id")
      .eq("referral_code", normalized)
      .maybeSingle();
    if (!referrer) return json({ error: "Unknown code" }, 404);

    await admin.from("profiles").update({ referred_by: referrer.id }).eq("id", user.id);
    await admin.from("referrals").insert({
      referrer_id: referrer.id,
      referee_id: user.id,
      code: normalized,
      status: "pending",
      credit_amount: 2000,
    });

    return json({ ok: true });
  } catch (error) {
    return fail(error);
  }
});
