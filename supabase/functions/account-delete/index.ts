import { json, preflight } from "../_shared/cors.ts";
import { fail } from "../_shared/http.ts";
import { requireUser } from "../_shared/supabase.ts";

/**
 * Apple 5.1.1(v) and Google Play account deletion.
 * Soft-deletes customer data, then removes the Auth user.
 */
Deno.serve(async (req) => {
    const done = preflight(req);
    if (done) return done;
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    try {
        const { user, admin } = await requireUser(req);
        const userId = user.id;

        await admin.from("notifications").delete().eq("user_id", userId);
        await admin.from("saved_artisans").delete().eq("user_id", userId);
        await admin.from("saved_payment_methods").delete().eq("user_id", userId);
        await admin.from("addresses").delete().eq("user_id", userId);
        await admin.from("wallet_ledger").delete().eq("user_id", userId);
        await admin.from("wallets").delete().eq("user_id", userId);
        await admin.from("referrals").delete().or(`referrer_id.eq.${userId},referee_id.eq.${userId}`);

        const { data: convos } = await admin
            .from("conversations")
            .select("id")
            .eq("customer_id", userId);
        const convoIds = (convos ?? []).map((c) => c.id);
        if (convoIds.length) {
            await admin.from("messages").delete().in("conversation_id", convoIds);
            await admin.from("conversations").delete().in("id", convoIds);
        }

        await admin
            .from("jobs")
            .update({
                description: "[deleted account]",
                address: "[redacted]",
            })
            .eq("customer_id", userId);

        await admin.from("profiles").delete().eq("id", userId);

        const { error } = await admin.auth.admin.deleteUser(userId);
        if (error) throw error;

        return json({ ok: true });
    } catch (error) {
        return fail(error);
    }
});
