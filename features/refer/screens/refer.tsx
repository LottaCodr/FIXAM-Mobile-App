import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { AppButton } from "@/components/ui/buttons";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Text, View } from "react-native";

export default function ReferScreen() {
    const theme = useTheme();
    const code = useAuthStore((s) => s.user?.referralCode ?? "FIXAM20");
    const showToast = useUIStore((s) => s.showToast);

    const share = async () => {
        const message = `Use my FixAm code ${code} and we both get ₦2,000 off a repair.`;
        try {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(`${code} — ${message}`);
                showToast("Invite copied", "success");
                return;
            }
        } catch {
            // fall through
        }
        await Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
    };

    return (
        <Screen padded={false}>
            <AppHeader title="Refer a friend" />
            <View style={{ padding: theme.spacing[5] }}>
                <View
                    style={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: theme.radius.xl,
                        padding: theme.spacing[6],
                        alignItems: "center",
                    }}
                >
                    <Ionicons name="gift" size={36} color={theme.colors.accent} />
                    <Text
                        style={{
                            ...theme.typography.h2,
                            color: "#fff",
                            marginTop: 12,
                            textAlign: "center",
                        }}
                    >
                        Give ₦2,000, get ₦2,000
                    </Text>
                    <Text
                        style={{
                            color: "rgba(255,255,255,0.8)",
                            textAlign: "center",
                            marginTop: 8,
                        }}
                    >
                        Your friend saves on their first completed job. You get the same credit.
                    </Text>
                    <View
                        style={{
                            marginTop: theme.spacing[5],
                            backgroundColor: "rgba(255,255,255,0.12)",
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            borderRadius: theme.radius.md,
                        }}
                    >
                        <Text style={{ color: "#fff", letterSpacing: 2, fontWeight: "800", fontSize: 20 }}>
                            {code}
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: theme.spacing[6], gap: 14 }}>
                    {[
                        "Share your code",
                        "They book a verified artisan",
                        "You both get ₦2,000 credit",
                    ].map((step, i) => (
                        <View key={step} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                            <View
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 14,
                                    backgroundColor: theme.colors.primaryLight,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>{i + 1}</Text>
                            </View>
                            <Text style={{ ...theme.typography.body }}>{step}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ marginTop: theme.spacing[8] }}>
                    <AppButton label="Share invite" variant="accent" onPress={() => void share()} />
                </View>
            </View>
        </Screen>
    );
}
