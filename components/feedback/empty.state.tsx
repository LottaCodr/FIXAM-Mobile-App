import { AppButton } from "@/components/ui/buttons";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
};

export function EmptyState({
    icon = "file-tray-outline",
    title,
    subtitle,
    actionLabel,
    onAction,
}: Props) {
    const { colors, spacing, typography, radius } = useTheme();

    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: spacing[12],
                paddingHorizontal: spacing[6],
            }}
        >
            <View
                style={{
                    width: 72,
                    height: 72,
                    borderRadius: radius.full,
                    backgroundColor: colors.primaryLight,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing[4],
                }}
            >
                <Ionicons name={icon} size={30} color={colors.primary} />
            </View>
            <Text
                style={{
                    ...typography.h3,
                    color: colors.textPrimary,
                    textAlign: "center",
                }}
            >
                {title}
            </Text>
            {subtitle ? (
                <Text
                    style={{
                        ...typography.body,
                        color: colors.textSecondary,
                        textAlign: "center",
                        marginTop: spacing[2],
                    }}
                >
                    {subtitle}
                </Text>
            ) : null}
            {actionLabel && onAction ? (
                <View style={{ marginTop: spacing[5], width: 200 }}>
                    <AppButton label={actionLabel} onPress={onAction} size="md" />
                </View>
            ) : null}
        </View>
    );
}
