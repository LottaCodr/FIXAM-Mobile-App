import { useTheme } from "@/theme/useTheme";
import { Pressable, View, ViewProps } from "react-native";

type CardProps = ViewProps & {
    padded?: boolean;
    onPress?: () => void;
};

export function Card({ padded = true, onPress, style, children, ...rest }: CardProps) {
    const { colors, spacing, radius, shadow } = useTheme();
    const base = {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: padded ? spacing[4] : 0,
        ...shadow.sm,
    };

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [base, { opacity: pressed ? 0.92 : 1 }, style]}
                {...rest}
            >
                {children}
            </Pressable>
        );
    }

    return (
        <View style={[base, style]} {...rest}>
            {children}
        </View>
    );
}
