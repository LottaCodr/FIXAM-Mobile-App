import { View, Text } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export function ReferCard() {
    const { colors, spacing, radius, typography } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.primary,
                borderRadius: radius.lg,
                padding: spacing[6],
                marginTop: spacing[6],
            }}
        >
            <Text
                style={{
                    ...typography.h2,
                    color: "#fff",
                    marginBottom: spacing[2],
                }}
            >
                Refer a Friend
            </Text>

            <Text
                style={{
                    ...typography.body,
                    color: "#fff",
                    lineHeight: typography.body.lineHeight ? typography.body.lineHeight * 1.2 : 22 * 1.2,
                }}
            >
                Get ₦2,000 off your next repair when you refer someone.
            </Text>
        </View>
    );
}
