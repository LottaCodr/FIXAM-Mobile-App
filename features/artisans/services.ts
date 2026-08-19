import { ARTISANS, getArtisan } from "@/data/mock";
import type { Artisan } from "@/features/artisans/types";
import { isBackendConfigured } from "@/lib/env";
import { getSupabase } from "@/lib/supabase";
import { sleep } from "@/utils/debounce";

function mapRow(row: Record<string, unknown>): Artisan {
    return {
        id: String(row.id),
        name: String(row.name),
        categoryId: row.category_id as Artisan["categoryId"],
        skill: String(row.skill),
        rating: Number(row.rating ?? 0),
        reviewCount: Number(row.review_count ?? 0),
        distance: Number(row.distance_km ?? 0),
        price: Number(row.price_min ?? 0),
        priceMax: Number(row.price_max ?? 0),
        avatar: String(row.avatar_url ?? ""),
        cover: String(row.cover_url ?? ""),
        verified: Boolean(row.verified),
        yearsExp: Number(row.years_exp ?? 0),
        jobsDone: Number(row.jobs_done ?? 0),
        about: String(row.about ?? ""),
        location: String(row.location_label ?? ""),
        responseMins: Number(row.response_mins ?? 20),
        online: Boolean(row.online),
        portfolio: [],
        reviews: [],
    };
}

export async function listArtisans(categoryId?: string) {
    if (!isBackendConfigured()) {
        await sleep(200);
        return categoryId ? ARTISANS.filter((a) => a.categoryId === categoryId) : ARTISANS;
    }
    const supabase = getSupabase()!;
    let query = supabase.from("artisans").select("*").order("rating", { ascending: false });
    if (categoryId) query = query.eq("category_id", categoryId);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}

export async function fetchArtisan(id: string) {
    if (!isBackendConfigured()) {
        await sleep(150);
        return getArtisan(id) ?? null;
    }
    const supabase = getSupabase()!;
    const { data, error } = await supabase.from("artisans").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapRow(data as Record<string, unknown>) : null;
}
