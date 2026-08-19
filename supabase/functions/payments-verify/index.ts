import { json, preflight } from "../_shared/cors.ts";
import { paymentSuccessful, verifyById, verifyByRef } from "../_shared/flutterwave.ts";
import { fail, readJson } from "../_shared/http.ts";
import { requireUser } from "../_shared/supabase.ts";

type Body = {
  transactionId?: string | number;
  txRef?: string;
};

Deno.serve(async (req) => {
  const done = preflight(req);
  if (done) return done;
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { user, admin } = await requireUser(req);
    const body = await readJson<Body>(req);
    if (!body.transactionId && !body.txRef) {
      return json({ error: "transactionId or txRef is required" }, 422);
    }

    const verified = body.transactionId
      ? await verifyById(body.transactionId)
      : await verifyByRef(body.txRef!);

    const flw = verified.data;
    if (!flw) return json({ ok: false, error: "Empty Flutterwave response" }, 502);

    const { data: payment } = await admin
      .from("payments")
      .select("*")
      .eq("tx_ref", flw.tx_ref)
      .maybeSingle();

    if (!payment) return json({ error: "Unknown tx_ref" }, 404);
    if (payment.user_id !== user.id) return json({ error: "Forbidden" }, 403);

    const amountOk = Number(flw.amount) >= Number(payment.amount);
    const currencyOk = (flw.currency || "NGN") === (payment.currency || "NGN");
    const ok = paymentSuccessful(flw) && amountOk && currencyOk;

    const status = ok ? "successful" : flw.status === "cancelled" ? "cancelled" : "failed";

    await admin
      .from("payments")
      .update({
        status,
        flw_tx_id: String(flw.id),
        flw_ref: flw.flw_ref,
        fee: flw.app_fee ?? 0,
        payment_method: flw.payment_type,
        raw: flw,
        verified_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (payment.job_id) {
      await admin
        .from("jobs")
        .update({ payment_status: status })
        .eq("id", payment.job_id);
    }

    if (ok) {
      await admin.from("notifications").insert({
        user_id: user.id,
        title: "Payment received",
        body: `₦${Number(payment.amount).toLocaleString("en-NG")} for your job is confirmed.`,
        type: "payment",
        href: payment.job_id ? `/job/${payment.job_id}` : "/settings",
      });
    }

    return json({
      ok,
      status,
      txRef: flw.tx_ref,
      amount: flw.amount,
      currency: flw.currency,
      paymentMethod: flw.payment_type,
    });
  } catch (error) {
    return fail(error);
  }
});
