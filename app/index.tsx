import { useAuthStore } from "@/store/auth.store";
import { useTheme } from "@/theme/useTheme";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Splash() {
    const router = useRouter();
    const { colors, typography } = useTheme();
    const hydrated = useAuthStore((s) => s.hydrated);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const hasOnboarded = useAuthStore((s) => s.hasOnboarded);

    useEffect(() => {
        const fallback = setTimeout(() => {
            if (!useAuthStore.getState().hydrated) {
                useAuthStore.getState().setHydrated(true);
            }
        }, 1600);
        return () => clearTimeout(fallback);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        const timer = setTimeout(() => {
            if (!hasOnboarded) {
                router.replace("/(auth)/onboarding");
            } else if (!isAuthenticated) {
                router.replace("/(auth)/login");
            } else {
                router.replace("/(tabs)/home");
            }
        }, 900);
        return () => clearTimeout(timer);
    }, [hydrated, hasOnboarded, isAuthenticated, router]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <StatusBar style="light" />
            <View
                style={{
                    width: 76,
                    height: 76,
                    borderRadius: 22,
                    backgroundColor: "rgba(255,255,255,0.14)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                }}
            >
                <Text style={{ color: "#fff", fontSize: 34, fontWeight: "800" }}>F</Text>
            </View>
            <Text style={{ color: "#FFF", fontSize: 32, fontWeight: "800", letterSpacing: -0.6 }}>
                FixAm
            </Text>
            <Text
                style={{
                    ...typography.caption,
                    color: "rgba(255,255,255,0.78)",
                    marginTop: 8,
                }}
            >
                Trusted artisans, when you need them
            </Text>
            <ActivityIndicator color="#FFF" style={{ marginTop: 28 }} />
        </View>
    );
}
