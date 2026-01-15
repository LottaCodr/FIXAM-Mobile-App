import { View, Text } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export function ReferCard() {
    const { colors, spacing, radius, typography } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.primary,
                borderRadius: radius.lg,
                padding: spacing[8],
                marginTop: spacing[8],
            }}
        >
            <Text
                style={{
                    fontFamily: typography.fontFamily.bold,
                    fontSize: typography.fontSize.lg,
                    lineHeight: typography.lineHeight.lg,
                    color: "#fff",
                }}
            >
                Refer a Friend
            </Text>

            <Text
                style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: typography.fontSize.md,
                    lineHeight: typography.lineHeight.md,
                    color: "#fff",
                    marginTop: spacing[3],
                }}
            >
                Get ₦2,000 off your next repair when you refer someone.
            </Text>
        </View>
    );
}
