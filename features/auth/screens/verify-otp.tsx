import { AppButton } from "@/components/ui/buttons";
import { DEMO_OTP } from "@/constants/app.config";
import { useAuthStore } from "@/store/auth.store";
import { useTheme } from "@/theme/useTheme";
import { haptic } from "@/utils/haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VerifyOtp() {
    const router = useRouter();
    const { colors, spacing, typography, radius } = useTheme();
    const insets = useSafeAreaInsets();
    const phone = useAuthStore((s) => s.pendingPhone);
    const verifyOtp = useAuthStore((s) => s.verifyOtp);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [seconds, setSeconds] = useState(45);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(t);
    }, []);

    const [busy, setBusy] = useState(false);

    const submit = async (value = code) => {
        if (busy) return;
        setBusy(true);
        const result = await verifyOtp(value);
        setBusy(false);
        if (!result.ok) {
            setError(result.message ?? "Invalid code");
            void haptic("error");
            return;
        }
        void haptic("success");
        router.replace("/(tabs)/home");
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View
                style={{
                    flex: 1,
                    paddingTop: insets.top + 16,
                    paddingHorizontal: spacing[6],
                    paddingBottom: Math.max(insets.bottom, 20),
                }}
            >
                <Pressable onPress={() => router.back()} style={{ marginBottom: spacing[6] }}>
                    <Text style={{ color: colors.primary, fontWeight: "600" }}>← Back</Text>
                </Pressable>

                <Text style={{ ...typography.h1 }}>Enter the code</Text>
                <Text
                    style={{
                        ...typography.body,
                        color: colors.textSecondary,
                        marginTop: spacing[2],
                        marginBottom: spacing[8],
                    }}
                >
                    We sent a 6-digit code to {phone ?? "your phone"}. Demo hint: {DEMO_OTP}
                </Text>

                <Pressable onPress={() => inputRef.current?.focus()}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        {Array.from({ length: 6 }).map((_, i) => {
                            const filled = code[i];
                            const active = code.length === i;
                            return (
                                <View
                                    key={i}
                                    style={{
                                        width: 48,
                                        height: 56,
                                        borderRadius: radius.md,
                                        borderWidth: 1.5,
                                        borderColor: error
                                            ? colors.error
                                            : active
                                              ? colors.primary
                                              : colors.border,
                                        backgroundColor: colors.surface,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text style={{ ...typography.h2 }}>{filled ?? ""}</Text>
                                </View>
                            );
                        })}
                    </View>
                </Pressable>

                <TextInput
                    ref={inputRef}
                    value={code}
                    onChangeText={(t) => {
                        const next = t.replace(/\D/g, "").slice(0, 6);
                        setCode(next);
                        setError("");
                        if (next.length === 6) void submit(next);
                    }}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    autoFocus
                    style={{
                        position: "absolute",
                        opacity: 0.02,
                        height: 56,
                        width: "100%",
                    }}
                />

                {error ? (
                    <Text style={{ color: colors.error, marginTop: 12 }}>{error}</Text>
                ) : null}

                <View style={{ marginTop: spacing[8] }}>
                    <AppButton
                        label="Verify"
                        onPress={() => void submit()}
                        disabled={code.length < 6}
                        loading={busy}
                    />
                </View>

                <Pressable
                    disabled={seconds > 0}
                    onPress={() => setSeconds(45)}
                    style={{ alignItems: "center", marginTop: spacing[5] }}
                >
                    <Text style={{ color: seconds > 0 ? colors.textMuted : colors.primary }}>
                        {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}
