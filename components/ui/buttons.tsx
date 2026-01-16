import { useTheme } from "@/theme/useTheme";
import { Pressable, Text } from "react-native";

interface ButtonType {
    label: string,
    onPress: () => void
}

export const PrimaryButton = ({ label, onPress }: ButtonType) => {
    const { colors, spacing, radius, typography } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={{
                height: 48,
                backgroundColor: colors.primary,
                borderRadius: radius.md,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: spacing[10],
            }}
        >
            <Text
                style={{
                    color: "#FFF",
                    fontSize: typography.button.fontSize,
                    fontWeight: typography.button.fontWeight as any,
                    lineHeight: typography.button.lineHeight,
                }}
            >
                {label}
            </Text>
        </Pressable>
    );
}