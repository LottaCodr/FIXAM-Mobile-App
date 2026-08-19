import { env, isBackendConfigured } from "@/lib/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";
import "react-native-url-polyfill/auto";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
    if (!isBackendConfigured()) return null;
    if (client) return client;

    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
        auth: {
            ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: Platform.OS === "web",
        },
    });

    if (Platform.OS !== "web") {
        AppState.addEventListener("change", (state) => {
            if (state === "active") client?.auth.startAutoRefresh();
            else client?.auth.stopAutoRefresh();
        });
    }

    return client;
}

export async function invokeFunction<T>(
    name: string,
    body?: Record<string, unknown>,
): Promise<T> {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.functions.invoke(name, { body: body ?? {} });
    if (error) throw error;
    if (data && typeof data === "object" && "error" in data && (data as { error?: string }).error) {
        throw new Error((data as { error: string }).error);
    }
    return data as T;
}
