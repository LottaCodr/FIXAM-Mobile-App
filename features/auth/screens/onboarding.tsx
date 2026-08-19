import { AppButton } from "@/components/ui/buttons";
import { useAuthStore } from "@/store/auth.store";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SLIDES = [
    {
        icon: "shield-checkmark" as const,
        title: "Trusted artisans, when you need them",
        body: "Verified plumbers, electricians and more — rated by neighbours in Lagos.",
        color: "#1F7A5B",
        soft: "#E6F3EE",
    },
    {
        icon: "navigate" as const,
        title: "Track every job in real time",
        body: "See when they’re on the way, chat in-app, and never wonder who’s at the gate.",
        color: "#F7931E",
        soft: "#FFF1DE",
    },
    {
        icon: "pricetag" as const,
        title: "Fair prices. No surprises.",
        body: "Get a clear estimate before you book. Pay after the work is done.",
        color: "#145A42",
        soft: "#E6F3EE",
    },
];

export default function Onboarding() {
    const router = useRouter();
    const { spacing, typography, colors, radius } = useTheme();
    const insets = useSafeAreaInsets();
    const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
    const [index, setIndex] = useState(0);
    const slide = SLIDES[index];
    const last = index === SLIDES.length - 1;

    const next = () => {
        if (last) {
            completeOnboarding();
            router.replace("/(auth)/login");
            return;
        }
        setIndex((i) => i + 1);
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
                paddingTop: insets.top + 12,
                paddingBottom: Math.max(insets.bottom, 20),
                paddingHorizontal: spacing[6],
            }}
        >
            <Pressable
                onPress={() => {
                    completeOnboarding();
                    router.replace("/(auth)/login");
                }}
                style={{ alignSelf: "flex-end", padding: 8 }}
            >
                <Text style={{ ...typography.captionMedium, color: colors.textSecondary }}>Skip</Text>
            </Pressable>

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <View
                    style={{
                        width: 132,
                        height: 132,
                        borderRadius: 40,
                        backgroundColor: slide.soft,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: spacing[8],
                    }}
                >
                    <Ionicons name={slide.icon} size={56} color={slide.color} />
                </View>
                <Text style={{ ...typography.h1, textAlign: "center", color: colors.textPrimary }}>
                    {slide.title}
                </Text>
                <Text
                    style={{
                        ...typography.body,
                        textAlign: "center",
                        color: colors.textSecondary,
                        marginTop: spacing[4],
                    }}
                >
                    {slide.body}
                </Text>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                    marginBottom: spacing[6],
                }}
            >
                {SLIDES.map((s, i) => (
                    <View
                        key={s.title}
                        style={{
                            width: i === index ? 22 : 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: i === index ? colors.primary : colors.neutral[300],
                        }}
                    />
                ))}
            </View>

            <AppButton label={last ? "Get started" : "Continue"} onPress={next} />
            <Text
                style={{
                    textAlign: "center",
                    marginTop: spacing[4],
                    color: colors.textMuted,
                    fontSize: 12,
                }}
            >
                By continuing you agree to FixAm’s Terms & Privacy Policy.
            </Text>
        </View>
    );
}
