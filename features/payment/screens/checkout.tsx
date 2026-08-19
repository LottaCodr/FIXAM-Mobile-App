import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { AppButton } from "@/components/ui/buttons";
import { getArtisan } from "@/data/mock";
import { initializeCheckout, verifyCheckout } from "@/features/payment/services";
import { isBackendConfigured } from "@/lib/env";
import { env } from "@/lib/env";
import { useJobStore } from "@/store/job.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { formatNaira } from "@/utils/format.currency";
import { haptic } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Text, View } from "react-native";

export default function CheckoutScreen() {
    const { jobId } = useLocalSearchParams<{ jobId?: string }>();
    const id = Array.isArray(jobId) ? jobId[0] : jobId;
    const job = useJobStore((s) => s.jobs.find((j) => j.id === id));
    const markPaid = useJobStore((s) => s.markPaid);
    const theme = useTheme();
    const router = useRouter();
    const showToast = useUIStore((s) => s.showToast);
    const [loading, setLoading] = useState(false);
    const artisan = job ? getArtisan(job.artisanId) : undefined;

    if (!job) {
        return (
            <Screen padded={false}>
                <AppHeader title="Pay with Flutterwave" />
                <View style={{ padding: 24 }}>
                    <Text>Job not found.</Text>
                </View>
            </Screen>
        );
    }

    const total = job.amount + job.partsAmount;
    const fee = job.platformFee ?? Math.round(job.amount * 0.1);

    const pay = async () => {
        setLoading(true);
        try {
            if (!isBackendConfigured()) {
                await new Promise((r) => setTimeout(r, 700));
                markPaid(job.id);
                void haptic("success");
                showToast("Demo payment recorded. Connect Flutterwave to charge live.", "success");
                router.replace(`/job/${job.id}`);
                return;
            }

            const session = await initializeCheckout(job.id);
            const result = await WebBrowser.openAuthSessionAsync(
                session.checkoutUrl,
                env.paymentRedirect,
            );

            if (result.type !== "success") {
                showToast("Payment window closed", "info");
                return;
            }

            const parsed = Linking.parse(result.url);
            const transactionId =
                (parsed.queryParams?.transaction_id as string | undefined) ??
                (parsed.queryParams?.transactionId as string | undefined);
            const txRef =
                (parsed.queryParams?.tx_ref as string | undefined) ?? session.txRef;

            const verified = await verifyCheckout({ transactionId, txRef });
            if (verified.ok) {
                markPaid(job.id);
                void haptic("success");
                showToast("Payment confirmed", "success");
                router.replace(`/job/${job.id}`);
            } else {
                showToast("Flutterwave could not confirm that payment", "error");
            }
        } catch (error) {
            showToast((error as Error).message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen padded={false}>
            <AppHeader title="Checkout" subtitle="Secured by Flutterwave" />
            <View style={{ padding: theme.spacing[4], flex: 1 }}>
                <View
                    style={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.lg,
                        padding: theme.spacing[4],
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}
                >
                    <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                        Paying {artisan?.name ?? "artisan"}
                    </Text>
                    <Text style={{ ...theme.typography.h3, marginTop: 4 }}>{job.service}</Text>
                    <Text style={{ color: theme.colors.textSecondary, marginTop: 6 }}>
                        {job.id}
                    </Text>

                    <Row label="Service" value={formatNaira(job.amount)} />
                    <Row label="Parts" value={formatNaira(job.partsAmount)} />
                    <Row label="Platform fee (info)" value={formatNaira(fee)} muted />
                    <View
                        style={{
                            height: 1,
                            backgroundColor: theme.colors.border,
                            marginVertical: 12,
                        }}
                    />
                    <Row label="You pay" value={formatNaira(total)} highlight />
                </View>

                <View
                    style={{
                        marginTop: theme.spacing[5],
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                    }}
                >
                    {["Card", "USSD", "Bank transfer", "NQR"].map((m) => (
                        <View
                            key={m}
                            style={{
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 999,
                                backgroundColor: theme.colors.primaryLight,
                            }}
                        >
                            <Text style={{ color: theme.colors.primaryDark, fontSize: 12, fontWeight: "600" }}>
                                {m}
                            </Text>
                        </View>
                    ))}
                </View>

                <View
                    style={{
                        marginTop: theme.spacing[5],
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                    }}
                >
                    <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary} />
                    <Text style={{ ...theme.typography.caption, color: theme.colors.textSecondary, flex: 1 }}>
                        Money is held in escrow and released to the artisan when the job is completed.
                    </Text>
                </View>

                <View style={{ marginTop: "auto" }}>
                    <AppButton
                        label={`Pay ${formatNaira(total)} with Flutterwave`}
                        variant="accent"
                        loading={loading}
                        onPress={() => void pay()}
                    />
                </View>
            </View>
        </Screen>
    );
}

function Row({
    label,
    value,
    highlight,
    muted,
}: {
    label: string;
    value: string;
    highlight?: boolean;
    muted?: boolean;
}) {
    const theme = useTheme();
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 12,
            }}
        >
            <Text style={{ color: theme.colors.textMuted }}>{label}</Text>
            <Text
                style={{
                    fontWeight: "700",
                    color: highlight
                        ? theme.colors.primary
                        : muted
                          ? theme.colors.textMuted
                          : theme.colors.textPrimary,
                }}
            >
                {value}
            </Text>
        </View>
    );
}
