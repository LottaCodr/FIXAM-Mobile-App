import { json, preflight } from "../_shared/cors.ts";
import { verifyWebhookSignature } from "../_shared/flutterwave.ts";
import { serviceClient } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const done = preflight(req);
  if (done) return done;
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const raw = await req.text();
  if (!(await verifyWebhookSignature(req, raw))) {
    return json({ error: "Invalid signature" }, 401);
  }

  const payload = JSON.parse(raw) as Record<string, unknown>;
  const eventType = String(payload.event ?? payload.type ?? "");
  const data = (payload.data ?? {}) as Record<string, unknown>;
  const reference = String(data.reference ?? "");
  const statusRaw = String(data.status ?? "").toLowerCase();

  const admin = serviceClient();
  await admin.from("webhook_events").insert({
    provider: "flutterwave",
    event_type: eventType,
    external_id: String(data.id ?? reference),
    signature_ok: true,
    payload,
    processed: true,
  });

  if (reference && (eventType.includes("transfer") || data.status)) {
    const status =
      statusRaw === "successful" || statusRaw === "success"
        ? "successful"
        : statusRaw === "failed"
          ? "failed"
          : "queued";
    await admin.from("payouts").update({ status, raw: data }).eq("reference", reference);
  }

  return json({ ok: true });
});
