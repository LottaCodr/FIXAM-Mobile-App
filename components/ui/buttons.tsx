import { useTheme } from "@/theme/useTheme";
import { Pressable, Text } from "react-native";


interface ButtonType {
    label: string,
    onPress: () => void
}

export const PrimaryButton = ({ label, onPress }: ButtonType) => {
    const { colors, spacing, radius, typography } = useTheme()

    return (
        <Pressable onPress={onPress}
            style={{
                height: 48,
                backgroundColor: colors.primary,
                borderRadius: radius.md,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: spacing.lg,
            }}
        >
            <Text
                style={{
                    color: "#FFF",
                    fontSize: typography.fontSize.md,
                    fontWeight: typeof typography.weight.medium === "number" ? typography.weight.medium : (
                        // Map known string weights to acceptable values for React Native
                        typography.weight.medium === "normal" ||
                            typography.weight.medium === "bold" ||
                            typography.weight.medium === "100" ||
                            typography.weight.medium === "200" ||
                            typography.weight.medium === "300" ||
                            typography.weight.medium === "400" ||
                            typography.weight.medium === "500" ||
                            typography.weight.medium === "600" ||
                            typography.weight.medium === "700" ||
                            typography.weight.medium === "800" ||
                            typography.weight.medium === "900"
                            ? typography.weight.medium
                            : "500" // fallback to "500" (medium) if not valid
                    ),
                }}
            >
                {label}
            </Text>
        </Pressable>
    )
}