import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/constants/app.config";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const FAQS = [
    {
        q: "How do I book an artisan?",
        a: "Pick a category, choose someone nearby, describe the issue and send a request. You’ll get status updates in My Jobs.",
    },
    {
        q: "When do I pay?",
        a: "After the work is done. You’ll see a breakdown of the service fee and any parts before you confirm.",
    },
    {
        q: "Can I cancel?",
        a: "Yes — as long as the artisan hasn’t started travelling. Open the job and tap Cancel.",
    },
];

export default function HelpScreen() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <Screen padded={false}>
            <AppHeader title="Help & support" />
            <View style={{ padding: theme.spacing[4], gap: theme.spacing[3] }}>
                <Pressable
                    onPress={() => Linking.openURL(`tel:${SUPPORT_PHONE}`)}
                    style={card(theme)}
                >
                    <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ ...theme.typography.bodyMedium }}>Call support</Text>
                        <Text style={{ color: theme.colors.textMuted }}>{SUPPORT_PHONE}</Text>
                    </View>
                </Pressable>
                <Pressable
                    onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
                    style={card(theme)}
                >
                    <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ ...theme.typography.bodyMedium }}>Email us</Text>
                        <Text style={{ color: theme.colors.textMuted }}>{SUPPORT_EMAIL}</Text>
                    </View>
                </Pressable>

                <Text
                    style={{
                        ...theme.typography.overline,
                        color: theme.colors.textMuted,
                        marginTop: theme.spacing[4],
                    }}
                >
                    FAQs
                </Text>
                <Pressable onPress={() => router.push("/privacy")} style={card(theme)}>
                    <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ ...theme.typography.bodyMedium }}>Privacy policy</Text>
                        <Text style={{ color: theme.colors.textMuted }}>How we handle your data</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => router.push("/terms")} style={card(theme)}>
                    <Ionicons name="reader-outline" size={20} color={theme.colors.primary} />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ ...theme.typography.bodyMedium }}>Terms of use</Text>
                        <Text style={{ color: theme.colors.textMuted }}>Bookings, payments, cancellations</Text>
                    </View>
                </Pressable>

                {FAQS.map((f) => (
                    <View key={f.q} style={{ ...card(theme), flexDirection: "column", alignItems: "flex-start" }}>
                        <Text style={{ ...theme.typography.bodyMedium }}>{f.q}</Text>
                        <Text style={{ color: theme.colors.textSecondary, marginTop: 6, lineHeight: 20 }}>
                            {f.a}
                        </Text>
                    </View>
                ))}
            </View>
        </Screen>
    );
}

function card(theme: ReturnType<typeof useTheme>) {
    return {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing[4],
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    };
}
