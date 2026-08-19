import { PAYMENT_METHODS } from "@/data/mock";
import { isBackendConfigured } from "@/lib/env";
import { invokeFunction } from "@/lib/supabase";
import type { Bank, CheckoutSession, PaymentMethod } from "@/features/payment/types";
import { sleep } from "@/utils/debounce";

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
    if (!isBackendConfigured()) {
        await sleep(150);
        return PAYMENT_METHODS;
    }
    const { getSupabase } = await import("@/lib/supabase");
    const supabase = getSupabase()!;
    const { data, error } = await supabase
        .from("saved_payment_methods")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({
        id: row.id,
        brand: row.brand,
        last4: row.last4,
        expiry: row.expiry ?? "",
        isDefault: row.is_default,
    }));
}

export async function initializeCheckout(jobId: string): Promise<CheckoutSession> {
    return invokeFunction<CheckoutSession>("payments-initialize", { jobId });
}

export async function verifyCheckout(input: { transactionId?: string; txRef?: string }) {
    return invokeFunction<{
        ok: boolean;
        status: string;
        txRef: string;
        amount: number;
        currency: string;
        paymentMethod?: string;
    }>("payments-verify", input);
}

export async function listBanks(): Promise<Bank[]> {
    const res = await invokeFunction<{ ok: boolean; banks: Bank[] }>("banks-list");
    return res.banks;
}

export async function resolveBankAccount(accountNumber: string, bankCode: string) {
    return invokeFunction<{
        ok: boolean;
        account: { account_number: string; account_name: string };
    }>("banks-resolve", { accountNumber, bankCode });
}

export async function requestPayout(jobId: string) {
    return invokeFunction<{ ok: boolean; payoutId: string }>("payouts-create", { jobId });
}
