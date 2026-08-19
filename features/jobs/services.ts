import { INITIAL_JOBS } from "@/data/mock";
import { isBackendConfigured } from "@/lib/env";
import { getSupabase, invokeFunction } from "@/lib/supabase";
import { sleep } from "@/utils/debounce";

export async function listJobs() {
    if (!isBackendConfigured()) {
        await sleep(200);
        return INITIAL_JOBS;
    }
    const supabase = getSupabase()!;
    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function fetchJob(id: string) {
    if (!isBackendConfigured()) {
        await sleep(150);
        return INITIAL_JOBS.find((j) => j.id === id) ?? null;
    }
    const supabase = getSupabase()!;
    const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
}

export async function transitionJob(jobId: string, status: string, note?: string) {
    return invokeFunction("jobs-transition", { jobId, status, note });
}
