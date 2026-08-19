import { fetchMyProfile } from "@/features/auth/services";
import { getSupabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";
import { useTheme } from "@/theme/useTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AuthCallback() {
    const router = useRouter();
    const { colors, typography } = useTheme();
    const params = useLocalSearchParams();
    const setSessionUser = useAuthStore((s) => s.setSessionUser);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const supabase = getSupabase();
            if (supabase) {
                const access = String(params.access_token ?? "");
                const refresh = String(params.refresh_token ?? "");
                if (access) {
                    await supabase.auth.setSession({
                        access_token: access,
                        refresh_token: refresh,
                    });
                }
                const profile = await fetchMyProfile();
                if (!cancelled && profile) setSessionUser(profile);
            }
            if (!cancelled) router.replace("/(tabs)/home");
        })();
        return () => {
            cancelled = true;
        };
    }, [params.access_token, params.refresh_token, router, setSessionUser]);

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.background,
            }}
        >
            <ActivityIndicator color={colors.primary} />
            <Text style={{ ...typography.caption, marginTop: 12, color: colors.textSecondary }}>
                Finishing sign-in…
            </Text>
        </View>
    );
}
