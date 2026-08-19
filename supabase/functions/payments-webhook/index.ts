import { json, preflight } from "../_shared/cors.ts";
import {
  paymentSuccessful,
  verifyById,
  verifyByRef,
  verifyWebhookSignature,
} from "../_shared/flutterwave.ts";
import { serviceClient } from "../_shared/supabase.ts";

/**
 * Public endpoint. Set this URL in Flutterwave Dashboard → Settings → Webhooks:
 *   https://<project>.supabase.co/functions/v1/payments-webhook
 * Secret hash must match FLW_SECRET_HASH.
 */
Deno.serve(async (req) => {
  const done = preflight(req);
  if (done) return done;
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const raw = await req.text();
  const signatureOk = await verifyWebhookSignature(req, raw);
  if (!signatureOk) return json({ error: "Invalid signature" }, 401);

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const admin = serviceClient();
  const eventType = String(payload.event ?? payload.type ?? "unknown");
  const data = (payload.data ?? {}) as Record<string, unknown>;
  const externalId = String(data.id ?? payload.id ?? crypto.randomUUID());

  const { data: existing } = await admin
    .from("webhook_events")
    .select("id, processed")
    .eq("provider", "flutterwave")
    .eq("external_id", externalId)
    .maybeSingle();

  if (existing?.processed) return json({ ok: true, duplicate: true });

  const { data: row } = await admin
    .from("webhook_events")
    .insert({
      provider: "flutterwave",
      event_type: eventType,
      external_id: externalId,
      signature_ok: true,
      payload,
      processed: false,
    })
    .select("id")
    .single();

  try {
    if (
      eventType === "charge.completed" ||
      eventType === "charge.success" ||
      data.status
    ) {
      const txRef = String(data.tx_ref ?? data.reference ?? "");
      const txId = data.id != null ? String(data.id) : "";
      const verified = txId
        ? await verifyById(txId)
        : txRef
          ? await verifyByRef(txRef)
          : null;

      if (verified?.data) {
        const flw = verified.data;
        const ok = paymentSuccessful(flw);
        const { data: payment } = await admin
          .from("payments")
          .select("id, job_id, user_id, amount, currency")
          .eq("tx_ref", flw.tx_ref)
          .maybeSingle();

        if (payment) {
          const amountOk = Number(flw.amount) >= Number(payment.amount);
          const currencyOk = (flw.currency || "NGN") === (payment.currency || "NGN");
          const status = ok && amountOk && currencyOk ? "successful" : "failed";
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
            await admin.from("jobs").update({ payment_status: status }).eq("id", payment.job_id);
          }
        }
      }
    }

    if (row?.id) {
      await admin.from("webhook_events").update({ processed: true }).eq("id", row.id);
    }
    return json({ ok: true });
  } catch (error) {
    if (row?.id) {
      await admin
        .from("webhook_events")
        .update({ error: (error as Error).message })
        .eq("id", row.id);
    }
    // Still 200 so Flutterwave does not retry forever on app bugs after we stored the event.
    return json({ ok: false, stored: true });
  }
});
