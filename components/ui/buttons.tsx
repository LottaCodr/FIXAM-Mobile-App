import { useTheme } from "@/theme/useTheme";
import { haptic } from "@/utils/haptics";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "accent" | "danger";
type Size = "md" | "lg" | "sm";

export type AppButtonProps = {
    label: string;
    onPress?: () => void;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: ReactNode;
    style?: ViewStyle;
};

export function AppButton({
    label,
    onPress,
    variant = "primary",
    size = "lg",
    disabled,
    loading,
    fullWidth = true,
    icon,
    style,
}: AppButtonProps) {
    const { colors, spacing, radius, typography } = useTheme();
    const isDisabled = disabled || loading;

    const palette: Record<Variant, { bg: string; fg: string; border: string }> = {
        primary: { bg: colors.primary, fg: "#fff", border: colors.primary },
        secondary: { bg: colors.primaryLight, fg: colors.primaryDark, border: colors.primaryLight },
        outline: { bg: "transparent", fg: colors.textPrimary, border: colors.border },
        ghost: { bg: "transparent", fg: colors.primary, border: "transparent" },
        accent: { bg: colors.accent, fg: "#fff", border: colors.accent },
        danger: { bg: colors.errorSoft, fg: colors.error, border: colors.errorSoft },
    };

    const heights: Record<Size, number> = { sm: 40, md: 46, lg: 54 };
    const { bg, fg, border } = palette[variant];

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            disabled={isDisabled}
            onPress={() => {
                void haptic(variant === "accent" || variant === "primary" ? "medium" : "light");
                onPress?.();
            }}
            style={({ pressed }) => [
                {
                    height: heights[size],
                    backgroundColor: bg,
                    borderRadius: radius.md,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: spacing[2],
                    paddingHorizontal: spacing[5],
                    borderWidth: 1,
                    borderColor: border,
                    opacity: isDisabled ? 0.55 : pressed ? 0.88 : 1,
                    alignSelf: fullWidth ? "stretch" : "auto",
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={fg} />
            ) : (
                <>
                    {icon}
                    <Text
                        style={{
                            ...typography.button,
                            color: fg,
                            fontSize: size === "sm" ? 14 : typography.button.fontSize,
                        }}
                    >
                        {label}
                    </Text>
                </>
            )}
        </Pressable>
    );
}

export const PrimaryButton = ({
    label,
    onPress,
    disabled,
    loading,
}: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
}) => (
    <AppButton
        label={label}
        onPress={onPress}
        disabled={disabled}
        loading={loading}
    />
);
