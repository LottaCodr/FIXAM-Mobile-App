import { AppButton } from "@/components/ui/buttons";
import { useTheme } from "@/theme/useTheme";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: spacing[6],
                backgroundColor: colors.background,
            }}
        >
            <Text style={{ ...typography.h2, marginBottom: spacing[2] }}>Page not found</Text>
            <Text
                style={{
                    ...typography.body,
                    color: colors.textSecondary,
                    textAlign: "center",
                    marginBottom: spacing[6],
                }}
            >
                That screen doesn’t exist. Let’s get you back home.
            </Text>
            <AppButton label="Go home" onPress={() => router.replace("/(tabs)/home")} />
        </View>
    );
}
