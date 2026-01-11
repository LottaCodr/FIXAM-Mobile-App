import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { PrimaryButton } from "@/components/ui/buttons";

export default function Onboarding() {
    const router = useRouter();
    const { spacing } = useTheme();

    return (
        <View style={{ flex: 1, padding: spacing.xl }}>
            <Text style={{ fontSize: 24, fontWeight: "700" }}>
                Trusted artisans, when you need them.
            </Text>

            <Text style={{ marginTop: spacing.md, fontSize: 16 }}>
                Find verified plumbers, electricians, and more near you.
            </Text>

            <View style={{ marginTop: "auto" }}>
                <PrimaryButton
                    label="Get Started"
                    onPress={() => router.push("/(auth)/login")}
                />
            </View>
        </View>
    );
}
