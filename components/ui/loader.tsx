import { useTheme } from "@/theme/useTheme";
import { ActivityIndicator, Text, View } from "react-native";

export function Loader({ label }: { label?: string }) {
    const { colors, spacing, typography } = useTheme();
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: spacing[8],
            }}
        >
            <ActivityIndicator color={colors.primary} size="large" />
            {label ? (
                <Text
                    style={{
                        ...typography.caption,
                        color: colors.textSecondary,
                        marginTop: spacing[3],
                    }}
                >
                    {label}
                </Text>
            ) : null}
        </View>
    );
}

export function Skeleton({
    width,
    height,
    radius = 10,
}: {
    width: number | string;
    height: number;
    radius?: number;
}) {
    const { colors } = useTheme();
    return (
        <View
            style={{
                width: width as number,
                height,
                borderRadius: radius,
                backgroundColor: colors.neutral[200],
            }}
        />
    );
}
