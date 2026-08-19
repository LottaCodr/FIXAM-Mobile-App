import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";
import { AppButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { useTheme } from "@/theme/useTheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function normalizePhone(value: string) {
    return value.replace(/[^\d]/g, "");
}

export default function Login() {
    const router = useRouter();
    const { colors, spacing, typography, radius } = useTheme();
    const insets = useSafeAreaInsets();
    const requestPhoneOtp = useAuthStore((s) => s.requestPhoneOtp);
    const [phone, setPhone] = useState("08034412290");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);

    const submit = async () => {
        const digits = normalizePhone(phone);
        if (digits.length < 10) {
            setError("Enter a valid Nigerian phone number.");
            return;
        }
        const formatted = digits.startsWith("0") ? digits : `0${digits}`;
        setSending(true);
        const result = await requestPhoneOtp(formatted);
        setSending(false);
        if (!result.ok) {
            setError(result.message ?? "Could not send the code.");
            return;
        }
        router.push("/(auth)/verify-otp");
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View
                style={{
                    flex: 1,
                    paddingTop: insets.top + 24,
                    paddingHorizontal: spacing[6],
                    paddingBottom: Math.max(insets.bottom, 20),
                }}
            >
                <View
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: radius.md,
                        backgroundColor: colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "800", fontSize: 22 }}>F</Text>
                </View>
                <Text style={{ ...typography.h1, marginTop: spacing[6] }}>Welcome to FixAm</Text>
                <Text
                    style={{
                        ...typography.body,
                        color: colors.textSecondary,
                        marginTop: spacing[2],
                        marginBottom: spacing[8],
                    }}
                >
                    Enter your phone number. We’ll send a one-time code — no password needed.
                </Text>

                <Input
                    label="Phone number"
                    placeholder="0801 234 5678"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={(t) => {
                        setPhone(t);
                        if (error) setError("");
                    }}
                    leftIcon="call-outline"
                    error={error}
                    autoFocus
                />

                <AppButton label="Continue" onPress={() => void submit()} loading={sending} />

                <SocialAuthButtons />

                <Pressable
                    onPress={() => {
                        useAuthStore.getState().loginDemo();
                        router.replace("/(tabs)/home");
                    }}
                    style={{ alignItems: "center", marginTop: spacing[5] }}
                >
                    <Text style={{ color: colors.primary, fontWeight: "600" }}>
                        Continue with demo account
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push("/(auth)/onboarding")}
                    style={{ alignItems: "center", marginTop: spacing[3] }}
                >
                    <Text style={{ color: colors.textSecondary }}>New here? See how it works</Text>
                </Pressable>

                <Text
                    style={{
                        marginTop: "auto",
                        textAlign: "center",
                        color: colors.textMuted,
                        fontSize: 12,
                        lineHeight: 18,
                    }}
                >
                    We’ll never share your number. Standard SMS rates may apply.
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}
