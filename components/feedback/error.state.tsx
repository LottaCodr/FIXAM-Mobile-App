import { AppButton } from "@/components/ui/buttons";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
    title?: string;
    subtitle?: string;
    onRetry?: () => void;
};

export function ErrorState({
    title = "Something went wrong",
    subtitle = "Please try again in a moment.",
    onRetry,
}: Props) {
    const { colors, spacing, typography } = useTheme();
    return (
        <View
            style={{
                alignItems: "center",
                padding: spacing[8],
            }}
        >
            <Ionicons name="alert-circle-outline" size={36} color={colors.error} />
            <Text
                style={{
                    ...typography.h3,
                    color: colors.textPrimary,
                    marginTop: spacing[3],
                    textAlign: "center",
                }}
            >
                {title}
            </Text>
            <Text
                style={{
                    ...typography.body,
                    color: colors.textSecondary,
                    marginTop: spacing[2],
                    textAlign: "center",
                }}
            >
                {subtitle}
            </Text>
            {onRetry ? (
                <View style={{ marginTop: spacing[5], width: 160 }}>
                    <AppButton label="Try again" onPress={onRetry} size="md" />
                </View>
            ) : null}
        </View>
    );
}
