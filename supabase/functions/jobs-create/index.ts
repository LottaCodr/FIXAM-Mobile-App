import { json, preflight } from "../_shared/cors.ts";
import { fail, readJson } from "../_shared/http.ts";
import { requireUser } from "../_shared/supabase.ts";

type Body = {
  artisanId: string;
  description: string;
  schedule?: "asap" | "today" | "schedule";
  address: string;
  scheduledAt?: string;
};

Deno.serve(async (req) => {
  const done = preflight(req);
  if (done) return done;
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { user, admin } = await requireUser(req);
    const body = await readJson<Body>(req);
    if (!body.artisanId || !body.description || !body.address) {
      return json({ error: "artisanId, description and address are required" }, 422);
    }
    if (body.description.trim().length < 8) {
      return json({ error: "Describe the issue in a bit more detail." }, 422);
    }

    const { data: artisan } = await admin
      .from("artisans")
      .select("id, category_id, skill, price_min, name")
      .eq("id", body.artisanId)
      .single();
    if (!artisan) return json({ error: "Artisan not found" }, 404);

    const { data: settings } = await admin.from("platform_settings").select("*").eq("id", 1).single();
    const amount = Number(artisan.price_min);
    if (amount < Number(settings?.min_job_amount ?? 0)) {
      return json({ error: "Amount is below the platform minimum" }, 422);
    }

    const feeBps = settings?.platform_fee_bps ?? 1000;
    const platformFee = Math.round((amount * feeBps) / 100) / 100;
    const artisanPayout = Math.round((amount - platformFee) * 100) / 100;
    const publicRef = `FX-${4000 + Math.floor(Math.random() * 5000)}`;
    const schedule = body.schedule ?? "asap";
    const scheduledLabel =
      schedule === "asap" ? "ASAP" : schedule === "today" ? "Today" : "Scheduled";

    const { data: job, error } = await admin
      .from("jobs")
      .insert({
        public_ref: publicRef,
        customer_id: user.id,
        artisan_id: artisan.id,
        category_id: artisan.category_id,
        service: artisan.skill,
        description: body.description.trim(),
        status: "requested",
        address: body.address,
        schedule,
        scheduled_at: body.scheduledAt ?? null,
        scheduled_label: scheduledLabel,
        amount,
        parts_amount: 0,
        platform_fee: platformFee,
        artisan_payout: artisanPayout,
        payment_status: "initialized",
        eta_mins: schedule === "asap" ? 18 : null,
      })
      .select("*")
      .single();
    if (error || !job) throw error ?? new Error("Could not create job");

    await admin.from("job_events").insert({
      job_id: job.id,
      status: "requested",
      actor_id: user.id,
      note: "Customer requested the job",
    });

    await admin.from("notifications").insert({
      user_id: user.id,
      title: "Request sent",
      body: `Your request was sent to ${artisan.name}. Pay to confirm the booking.`,
      type: "job",
      href: `/job/${job.id}`,
    });

    return json({ ok: true, job });
  } catch (error) {
    return fail(error);
  }
});
