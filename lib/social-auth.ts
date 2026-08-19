import { isBackendConfigured } from "@/lib/env";
import { getSupabase } from "@/lib/supabase";
import type { Provider } from "@supabase/supabase-js";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export type SocialProvider = Extract<Provider, "google" | "apple" | "facebook">;

function redirectUri() {
    return AuthSession.makeRedirectUri({
        scheme: "fixam",
        path: "auth/callback",
    });
}

function tokensFromUrl(url: string) {
    const parsed = Linking.parse(url);
    const query = parsed.queryParams ?? {};
    let access = typeof query.access_token === "string" ? query.access_token : "";
    let refresh = typeof query.refresh_token === "string" ? query.refresh_token : "";

    const hashIndex = url.indexOf("#");
    if ((!access || !refresh) && hashIndex >= 0) {
        const hash = new URLSearchParams(url.slice(hashIndex + 1));
        access = access || hash.get("access_token") || "";
        refresh = refresh || hash.get("refresh_token") || "";
    }
    return { access_token: access, refresh_token: refresh };
}

export async function signInWithSocial(provider: SocialProvider) {
    if (!isBackendConfigured()) {
        return { error: new Error("Connect Supabase to enable social login.") };
    }
    const supabase = getSupabase();
    if (!supabase) return { error: new Error("Supabase client missing") };

    const redirectTo = redirectUri();

    if (Platform.OS === "web") {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo,
                queryParams:
                    provider === "google"
                        ? { prompt: "select_account", access_type: "offline" }
                        : undefined,
            },
        });
        return { error };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo,
            skipBrowserRedirect: true,
            queryParams:
                provider === "google"
                    ? { prompt: "select_account", access_type: "offline" }
                    : undefined,
        },
    });
    if (error || !data.url) return { error: error ?? new Error("No OAuth URL") };

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== "success") {
        return { error: result.type === "cancel" ? null : new Error("Sign-in was not completed") };
    }

    const tokens = tokensFromUrl(result.url);
    if (!tokens.access_token) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(result.url);
        return { error: exchangeError };
    }

    const { error: sessionError } = await supabase.auth.setSession({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
    });
    return { error: sessionError };
}
