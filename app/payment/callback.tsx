import { verifyCheckout } from "@/features/payment/services";
import { useJobStore } from "@/store/job.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function PaymentCallback() {
    const { colors, typography } = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams<{
        transaction_id?: string;
        tx_ref?: string;
        status?: string;
        job?: string;
    }>();
    const markPaid = useJobStore((s) => s.markPaid);
    const showToast = useUIStore((s) => s.showToast);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                if (params.transaction_id || params.tx_ref) {
                    const res = await verifyCheckout({
                        transactionId: params.transaction_id,
                        txRef: params.tx_ref,
                    });
                    if (res.ok) {
                        const jobs = useJobStore.getState().jobs;
                        const match = jobs.find((j) => params.tx_ref?.includes(j.id) || params.job === j.id);
                        if (match) markPaid(match.id);
                        showToast("Payment confirmed", "success");
                    } else {
                        showToast("Payment not confirmed", "error");
                    }
                }
            } catch (e) {
                showToast((e as Error).message, "error");
            } finally {
                if (!cancelled) router.replace("/(tabs)/jobs");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [markPaid, params.job, params.transaction_id, params.tx_ref, router, showToast]);

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
                Confirming Flutterwave payment…
            </Text>
        </View>
    );
}
