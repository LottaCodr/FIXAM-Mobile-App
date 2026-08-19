import type { User } from "@/types/user";
import type { User as AuthUser } from "@supabase/supabase-js";

export type ProfileRow = {
    id: string;
    full_name: string | null;
    first_name: string | null;
    phone: string | null;
    email: string | null;
    avatar_url: string | null;
    location: string | null;
    address: string | null;
    referral_code: string;
    created_at: string;
};

export function userFromProfile(profile: ProfileRow, authUser?: AuthUser | null): User {
    const name = profile.full_name || authUser?.user_metadata?.full_name || "FixAm user";
    return {
        id: profile.id,
        name,
        firstName: profile.first_name || name.split(" ")[0] || "there",
        phone: profile.phone || authUser?.phone || "",
        email: profile.email || authUser?.email || "",
        avatar: profile.avatar_url || authUser?.user_metadata?.avatar_url || "",
        location: profile.location || "Lagos",
        address: profile.address || "",
        referralCode: profile.referral_code,
        memberSince: profile.created_at,
    };
}
