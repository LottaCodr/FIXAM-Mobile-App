import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { AppButton } from "@/components/ui/buttons";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Text, View } from "react-native";

export default function DeleteAccountScreen() {
    const theme = useTheme();
    const router = useRouter();
    const deleteAccount = useAuthStore((s) => s.deleteAccount);
    const showToast = useUIStore((s) => s.showToast);
    const [loading, setLoading] = useState(false);

    const run = async () => {
        setLoading(true);
        try {
            const result = await deleteAccount();
            if (!result.ok) {
                showToast(result.message ?? "Could not delete the account", "error");
                return;
            }
            showToast("Your account has been deleted", "success");
            router.replace("/(auth)/login");
        } finally {
            setLoading(false);
        }
    };

    const confirm = () => {
        if (Platform.OS === "web") {
            const ok =
                typeof window !== "undefined" &&
                window.confirm(
                    "Permanently delete your FixAm account? This cannot be undone.",
                );
            if (ok) void run();
            return;
        }
        Alert.alert(
            "Delete account?",
            "This permanently removes your login, profile, saved artisans and chat. Job and payment records required by law may be kept in redacted form.",
            [
                { text: "Keep account", style: "cancel" },
                { text: "Delete forever", style: "destructive", onPress: () => void run() },
            ],
        );
    };

    return (
        <Screen padded={false}>
            <AppHeader title="Delete account" />
            <View style={{ padding: theme.spacing[4], flex: 1 }}>
                <Text style={{ ...theme.typography.h3, marginBottom: 8 }}>
                    This cannot be undone
                </Text>
                <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary, marginBottom: 16 }}>
                    Apple and Google require a way to delete an account created in the app. Deleting
                    FixAm will:
                </Text>
                {[
                    "Sign you out on this device",
                    "Remove your profile, addresses and saved artisans",
                    "Delete your chats",
                    "Redact personal details on past jobs",
                ].map((line) => (
                    <Text
                        key={line}
                        style={{
                            ...theme.typography.body,
                            color: theme.colors.textPrimary,
                            marginBottom: 8,
                        }}
                    >
                        • {line}
                    </Text>
                ))}
                <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 8 }}>
                    Flutterwave settlement records may be retained where Nigerian tax or anti-fraud
                    rules require it. Email hello@fixam.ng if you need an export first.
                </Text>
                <View style={{ marginTop: "auto", gap: 10 }}>
                    <AppButton
                        label="Delete my account"
                        variant="danger"
                        loading={loading}
                        onPress={confirm}
                    />
                    <AppButton label="Go back" variant="outline" onPress={() => router.back()} />
                </View>
            </View>
        </Screen>
    );
}
