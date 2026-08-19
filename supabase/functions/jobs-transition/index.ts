import { json, preflight } from "../_shared/cors.ts";
import { fail, readJson } from "../_shared/http.ts";
import { requireUser } from "../_shared/supabase.ts";

const FLOW: Record<string, string[]> = {
  requested: ["accepted", "cancelled"],
  accepted: ["en_route", "cancelled"],
  en_route: ["arrived", "cancelled"],
  arrived: ["in_progress"],
  in_progress: ["completed"],
  completed: [],
  cancelled: [],
};

type Body = { jobId: string; status: string; note?: string; cancelReason?: string };

Deno.serve(async (req) => {
  const done = preflight(req);
  if (done) return done;
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { user, admin } = await requireUser(req);
    const body = await readJson<Body>(req);
    const { data: job } = await admin
      .from("jobs")
      .select("*, artisans!inner(user_id)")
      .eq("id", body.jobId)
      .single();
    if (!job) return json({ error: "Job not found" }, 404);

    const { data: actor } = await admin.from("profiles").select("role").eq("id", user.id).single();
    const artisanUser = (job as { artisans?: { user_id?: string } }).artisans?.user_id;
    const allowed =
      actor?.role === "admin" || job.customer_id === user.id || artisanUser === user.id;
    if (!allowed) return json({ error: "Forbidden" }, 403);

    const next = body.status;
    if (!(FLOW[job.status] ?? []).includes(next)) {
      return json({ error: `Cannot move from ${job.status} to ${next}` }, 409);
    }
    if (next === "cancelled" && job.customer_id !== user.id && actor?.role !== "admin") {
      return json({ error: "Only the customer can cancel" }, 403);
    }

    const patch: Record<string, unknown> = { status: next };
    if (next === "completed") patch.completed_at = new Date().toISOString();
    if (next === "cancelled") {
      patch.cancelled_at = new Date().toISOString();
      patch.cancel_reason = body.cancelReason ?? null;
    }

    await admin.from("jobs").update(patch).eq("id", job.id);
    await admin.from("job_events").insert({
      job_id: job.id,
      status: next,
      actor_id: user.id,
      note: body.note ?? null,
    });

    return json({ ok: true, status: next });
  } catch (error) {
    return fail(error);
  }
});
