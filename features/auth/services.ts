import { isBackendConfigured } from "@/lib/env";
import { userFromProfile, type ProfileRow } from "@/lib/profile-map";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@/types/user";
import { DEMO_OTP } from "@/constants/app.config";
import { sleep } from "@/utils/debounce";

export function toE164Ng(phone: string) {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("234")) return `+${digits}`;
    if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
    return `+234${digits}`;
}

export async function requestOtp(phone: string) {
    if (!isBackendConfigured()) {
        await sleep(400);
        return { phone, expiresIn: 60, demoCode: DEMO_OTP };
    }
    const supabase = getSupabase()!;
    const e164 = toE164Ng(phone);
    const { error } = await supabase.auth.signInWithOtp({
        phone: e164,
        options: { channel: "sms" },
    });
    if (error) throw error;
    return { phone: e164, expiresIn: 60 };
}

export async function confirmOtp(phone: string, code: string): Promise<User> {
    if (!isBackendConfigured()) {
        await sleep(350);
        if (!/^\d{6}$/.test(code)) throw new Error("Invalid code");
        throw new Error("DEMO_FALLBACK");
    }
    const supabase = getSupabase()!;
    const e164 = phone.startsWith("+") ? phone : toE164Ng(phone);
    const { data, error } = await supabase.auth.verifyOtp({
        phone: e164,
        token: code,
        type: "sms",
    });
    if (error || !data.user) throw error ?? new Error("Verification failed");
    const profile = await fetchMyProfile();
    if (!profile) throw new Error("Profile was not created");
    return profile;
}

export async function fetchMyProfile(): Promise<User | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data: session } = await supabase.auth.getUser();
    if (!session.user) return null;
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return userFromProfile(data as ProfileRow, session.user);
}

export async function updateMyProfile(patch: Partial<{
    full_name: string;
    first_name: string;
    email: string;
    address: string;
    location: string;
    avatar_url: string;
}>) {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: session } = await supabase.auth.getUser();
    if (!session.user) throw new Error("Not signed in");
    const { error } = await supabase.from("profiles").update(patch).eq("id", session.user.id);
    if (error) throw error;
}

export async function signOutRemote() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
}

export async function deleteRemoteAccount() {
    const { invokeFunction } = await import("@/lib/supabase");
    await invokeFunction<{ ok: boolean }>("account-delete");
}
