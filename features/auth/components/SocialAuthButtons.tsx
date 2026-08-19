import { isBackendConfigured } from "@/lib/env";
import { signInWithSocial, type SocialProvider } from "@/lib/social-auth";
import { fetchMyProfile } from "@/features/auth/services";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const PROVIDERS: {
    id: SocialProvider;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}[] = [
    { id: "google", label: "Google", icon: "logo-google" },
    { id: "apple", label: "Apple", icon: "logo-apple" },
    { id: "facebook", label: "Facebook", icon: "logo-facebook" },
];

export function SocialAuthButtons() {
    const { colors, spacing, radius, typography } = useTheme();
    const showToast = useUIStore((s) => s.showToast);
    const setSessionUser = useAuthStore((s) => s.setSessionUser);
    const router = useRouter();
    const [busy, setBusy] = useState<SocialProvider | null>(null);

    const onPress = async (provider: SocialProvider) => {
        if (!isBackendConfigured()) {
            showToast("Add Supabase keys to enable social login", "info");
            return;
        }
        setBusy(provider);
        try {
            const { error } = await signInWithSocial(provider);
            if (error) {
                showToast(error.message, "error");
                return;
            }
            const profile = await fetchMyProfile();
            if (profile) {
                setSessionUser(profile);
                router.replace("/(tabs)/home");
            }
        } catch (e) {
            showToast((e as Error).message, "error");
        } finally {
            setBusy(null);
        }
    };

    return (
        <View style={{ marginTop: spacing[6] }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: spacing[4],
                }}
            >
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <Text style={{ ...typography.caption, color: colors.textMuted }}>
                    or continue with
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
                {PROVIDERS.map((p) => (
                    <Pressable
                        key={p.id}
                        onPress={() => void onPress(p.id)}
                        disabled={busy !== null}
                        style={({ pressed }) => ({
                            flex: 1,
                            height: 48,
                            borderRadius: radius.md,
                            borderWidth: 1,
                            borderColor: colors.border,
                            backgroundColor: colors.surface,
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: pressed || busy === p.id ? 0.7 : 1,
                        })}
                    >
                        <Ionicons name={p.icon} size={20} color={colors.textPrimary} />
                        <Text
                            style={{
                                ...typography.tiny,
                                color: colors.textSecondary,
                                marginTop: 2,
                            }}
                        >
                            {p.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}
