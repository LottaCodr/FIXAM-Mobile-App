import Constants from "expo-constants";

function extra(key: string): string {
    const fromEnv = process.env[key];
    if (fromEnv) return fromEnv;
    const extras = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;
    return extras[key] ?? "";
}

export const env = {
    supabaseUrl: extra("EXPO_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: extra("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
    flwPublicKey: extra("EXPO_PUBLIC_FLW_PUBLIC_KEY"),
    paymentRedirect: extra("EXPO_PUBLIC_PAYMENT_REDIRECT") || "fixam://payment/callback",
};

export function isBackendConfigured() {
    return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
