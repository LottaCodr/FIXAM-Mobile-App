import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { AppButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { listBanks, resolveBankAccount } from "@/features/payment/services";
import type { Bank } from "@/features/payment/types";
import { isBackendConfigured } from "@/lib/env";
import { getSupabase } from "@/lib/supabase";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function PayoutAccountScreen() {
    const theme = useTheme();
    const showToast = useUIStore((s) => s.showToast);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [bankCode, setBankCode] = useState("044");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isBackendConfigured()) return;
        void listBanks()
            .then(setBanks)
            .catch((e) => showToast((e as Error).message, "error"));
    }, [showToast]);

    const lookup = async () => {
        if (accountNumber.length < 10) {
            showToast("Enter a 10-digit NUBAN", "error");
            return;
        }
        setLoading(true);
        try {
            if (!isBackendConfigured()) {
                setAccountName("DEMO ACCOUNT NAME");
                showToast("Resolved in demo mode", "success");
                return;
            }
            const res = await resolveBankAccount(accountNumber, bankCode);
            setAccountName(res.account.account_name);
        } catch (e) {
            showToast((e as Error).message, "error");
        } finally {
            setLoading(false);
        }
    };

    const save = async () => {
        if (!accountName) {
            showToast("Resolve the account first", "error");
            return;
        }
        if (isBackendConfigured()) {
            const supabase = getSupabase()!;
            const { data: session } = await supabase.auth.getUser();
            if (!session.user) {
                showToast("Sign in as an artisan first", "error");
                return;
            }
            const { error } = await supabase
                .from("artisans")
                .update({
                    bank_code: bankCode,
                    account_number: accountNumber,
                    account_name: accountName,
                    bank_name: banks.find((b) => b.code === bankCode)?.name ?? null,
                })
                .eq("user_id", session.user.id);
            if (error) {
                showToast(error.message, "error");
                return;
            }
        }
        showToast("Payout account saved", "success");
    };

    return (
        <Screen padded={false}>
            <AppHeader title="Payout account" subtitle="Flutterwave name enquiry" />
            <ScrollView contentContainerStyle={{ padding: theme.spacing[4] }}>
                <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary, marginBottom: 16 }}>
                    Artisans get paid here after a completed, paid job. We resolve the NUBAN with Flutterwave
                    before saving.
                </Text>
                <Input
                    label="Bank code (e.g. 044 Access)"
                    value={bankCode}
                    onChangeText={setBankCode}
                    leftIcon="business-outline"
                />
                <Input
                    label="Account number"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    keyboardType="number-pad"
                    maxLength={10}
                    leftIcon="card-outline"
                />
                {accountName ? (
                    <View
                        style={{
                            padding: 14,
                            borderRadius: theme.radius.md,
                            backgroundColor: theme.colors.primaryLight,
                            marginBottom: 16,
                        }}
                    >
                        <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>Account name</Text>
                        <Text style={{ ...theme.typography.h4, color: theme.colors.primaryDark }}>
                            {accountName}
                        </Text>
                    </View>
                ) : null}
                <AppButton label="Resolve account" variant="secondary" loading={loading} onPress={() => void lookup()} />
                <View style={{ height: 12 }} />
                <AppButton label="Save payout account" onPress={() => void save()} />
            </ScrollView>
        </Screen>
    );
}
