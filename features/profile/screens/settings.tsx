import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { PAYMENT_METHODS } from "@/data/mock";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function SettingsScreen() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <Screen padded={false}>
            <AppHeader title="Settings" />
            <View style={{ padding: theme.spacing[4], gap: theme.spacing[5] }}>
                <Text style={{ ...theme.typography.overline, color: theme.colors.textMuted }}>
                    Payments
                </Text>
                {PAYMENT_METHODS.map((pm) => (
                    <View
                        key={pm.id}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: theme.colors.surface,
                            padding: theme.spacing[4],
                            borderRadius: theme.radius.md,
                            borderWidth: 1,
                            borderColor: pm.isDefault ? theme.colors.primary : theme.colors.border,
                        }}
                    >
                        <Ionicons name="card-outline" size={22} color={theme.colors.primary} />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={{ ...theme.typography.bodyMedium }}>
                                {pm.brand.toUpperCase()} ···· {pm.last4}
                            </Text>
                            <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                                Expires {pm.expiry}
                                {pm.isDefault ? " · Default" : ""}
                            </Text>
                        </View>
                    </View>
                ))}

                <Pressable
                    onPress={() => router.push({ pathname: "/job/pay", params: { jobId: "FX-4790" } })}
                    style={{
                        padding: theme.spacing[4],
                        borderRadius: theme.radius.md,
                        borderWidth: 1,
                        borderStyle: "dashed",
                        borderColor: theme.colors.border,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                        Pay outstanding job (Flutterwave)
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push("/payout-account")}
                    style={{
                        padding: theme.spacing[4],
                        borderRadius: theme.radius.md,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: theme.colors.textPrimary, fontWeight: "600" }}>
                        Artisan payout account
                    </Text>
                </Pressable>

                <Text style={{ ...theme.typography.overline, color: theme.colors.textMuted }}>
                    Preferences
                </Text>
                <Row icon="notifications-outline" label="Push notifications" value="On" />
                <Row icon="moon-outline" label="Appearance" value="Light" />
                <Row icon="language-outline" label="Language" value="English" />
            </View>
        </Screen>
    );
}

function Row({
    icon,
    label,
    value,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
}) {
    const theme = useTheme();
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: theme.colors.surface,
                padding: theme.spacing[4],
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            <Ionicons name={icon} size={18} color={theme.colors.textSecondary} />
            <Text style={{ flex: 1, marginLeft: 12, ...theme.typography.bodyMedium }}>{label}</Text>
            <Text style={{ color: theme.colors.textMuted }}>{value}</Text>
        </View>
    );
}
