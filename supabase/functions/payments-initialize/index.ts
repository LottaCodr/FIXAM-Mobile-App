import { json, preflight } from "../_shared/cors.ts";
import { initializePayment } from "../_shared/flutterwave.ts";
import { fail, readJson } from "../_shared/http.ts";
import { requireUser } from "../_shared/supabase.ts";

type Body = {
  jobId: string;
  redirectUrl?: string;
};

Deno.serve(async (req) => {
  const done = preflight(req);
  if (done) return done;
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { user, admin } = await requireUser(req);
    const body = await readJson<Body>(req);
    if (!body.jobId) return json({ error: "jobId is required" }, 422);

    const { data: job, error: jobErr } = await admin
      .from("jobs")
      .select("id, public_ref, customer_id, amount, parts_amount, payment_status, service")
      .eq("id", body.jobId)
      .single();
    if (jobErr || !job) return json({ error: "Job not found" }, 404);
    if (job.customer_id !== user.id) return json({ error: "Forbidden" }, 403);
    if (job.payment_status === "successful") {
      return json({ ok: true, alreadyPaid: true, jobId: job.id });
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", user.id)
      .single();

    const amount = Number(job.amount) + Number(job.parts_amount ?? 0);
    const txRef = `FIXAM-${job.public_ref}-${Date.now()}`;
    const redirect =
      body.redirectUrl ||
      Deno.env.get("EXPO_PUBLIC_PAYMENT_REDIRECT") ||
      "fixam://payment/callback";

    const { data: payment, error: payErr } = await admin
      .from("payments")
      .insert({
        user_id: user.id,
        job_id: job.id,
        kind: "charge",
        tx_ref: txRef,
        amount,
        currency: "NGN",
        status: "initialized",
      })
      .select("id, tx_ref")
      .single();
    if (payErr || !payment) throw payErr ?? new Error("Could not create payment");

    const flw = await initializePayment({
      tx_ref: txRef,
      amount,
      currency: "NGN",
      redirect_url: redirect,
      customer: {
        email: profile?.email || user.email || "billing@fixam.ng",
        phonenumber: profile?.phone ?? undefined,
        name: profile?.full_name ?? undefined,
      },
      customizations: {
        title: "FixAm",
        description: `Payment for ${job.service} (${job.public_ref})`,
        logo: "https://fixam.ng/logo.png",
      },
      meta: {
        job_id: job.id,
        payment_id: payment.id,
        user_id: user.id,
        public_ref: job.public_ref,
      },
    });

    await admin
      .from("payments")
      .update({ checkout_url: flw.data?.link, status: "pending" })
      .eq("id", payment.id);

    await admin.from("jobs").update({ payment_status: "pending" }).eq("id", job.id);

    return json({
      ok: true,
      paymentId: payment.id,
      txRef,
      checkoutUrl: flw.data?.link,
      amount,
      currency: "NGN",
    });
  } catch (error) {
    return fail(error);
  }
});
