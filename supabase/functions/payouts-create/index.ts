import { json, preflight } from "../_shared/cors.ts";
import { createTransfer } from "../_shared/flutterwave.ts";
import { fail, readJson } from "../_shared/http.ts";
import { requireUser } from "../_shared/supabase.ts";

type Body = { jobId: string };

Deno.serve(async (req) => {
  const done = preflight(req);
  if (done) return done;
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { user, admin } = await requireUser(req);
    const { jobId } = await readJson<Body>(req);

    const { data: actor } = await admin.from("profiles").select("role").eq("id", user.id).single();
    const { data: job } = await admin
      .from("jobs")
      .select("id, public_ref, status, payment_status, artisan_payout, artisan_id, customer_id")
      .eq("id", jobId)
      .single();
    if (!job) return json({ error: "Job not found" }, 404);

    const isAdmin = actor?.role === "admin";
    const isCustomer = job.customer_id === user.id;
    if (!isAdmin && !isCustomer) return json({ error: "Forbidden" }, 403);
    if (job.status !== "completed") return json({ error: "Job is not completed" }, 409);
    if (job.payment_status !== "successful") return json({ error: "Customer has not paid" }, 409);

    const { data: existing } = await admin
      .from("payouts")
      .select("id, status")
      .eq("job_id", job.id)
      .in("status", ["pending", "queued", "successful"])
      .maybeSingle();
    if (existing) return json({ ok: true, payoutId: existing.id, status: existing.status });

    const { data: artisan } = await admin
      .from("artisans")
      .select("id, name, bank_code, account_number, account_name")
      .eq("id", job.artisan_id)
      .single();
    if (!artisan?.bank_code || !artisan.account_number) {
      return json({ error: "Artisan has no payout bank account" }, 422);
    }

    const reference = `PAYOUT-${job.public_ref}-${Date.now()}`;
    const { data: payout, error } = await admin
      .from("payouts")
      .insert({
        artisan_id: artisan.id,
        job_id: job.id,
        amount: job.artisan_payout,
        bank_code: artisan.bank_code,
        account_number: artisan.account_number,
        account_name: artisan.account_name,
        reference,
        status: "queued",
      })
      .select("id")
      .single();
    if (error || !payout) throw error ?? new Error("Could not create payout");

    const flw = await createTransfer({
      account_bank: artisan.bank_code,
      account_number: artisan.account_number,
      amount: Number(job.artisan_payout),
      narration: `FixAm payout ${job.public_ref} — ${artisan.name}`,
      reference,
    });

    await admin
      .from("payouts")
      .update({
        flw_transfer_id: String(flw.data?.id ?? ""),
        status: flw.data?.status === "SUCCESSFUL" ? "successful" : "queued",
        raw: flw,
      })
      .eq("id", payout.id);

    return json({ ok: true, payoutId: payout.id, transfer: flw.data });
  } catch (error) {
    return fail(error);
  }
});
