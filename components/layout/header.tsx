import { useTheme } from "@/theme/useTheme";
import { haptic } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    right?: ReactNode;
    transparent?: boolean;
};

export function AppHeader({
    title,
    subtitle,
    showBack = true,
    onBack,
    right,
    transparent,
}: Props) {
    const { colors, spacing, typography } = useTheme();
    const router = useRouter();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
                backgroundColor: transparent ? "transparent" : colors.surface,
                borderBottomWidth: transparent ? 0 : 1,
                borderBottomColor: colors.border,
                minHeight: 56,
            }}
        >
            {showBack ? (
                <Pressable
                    accessibilityLabel="Go back"
                    hitSlop={12}
                    onPress={() => {
                        void haptic("light");
                        if (onBack) onBack();
                        else if (router.canGoBack()) router.back();
                    }}
                    style={({ pressed }) => ({
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.neutral[100],
                        marginRight: spacing[2],
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
                </Pressable>
            ) : (
                <View style={{ width: 8 }} />
            )}

            <View style={{ flex: 1 }}>
                <Text
                    numberOfLines={1}
                    style={{ ...typography.h3, color: colors.textPrimary }}
                >
                    {title}
                </Text>
                {subtitle ? (
                    <Text
                        numberOfLines={1}
                        style={{ ...typography.caption, color: colors.textSecondary }}
                    >
                        {subtitle}
                    </Text>
                ) : null}
            </View>

            {right ?? <View style={{ width: 40 }} />}
        </View>
    );
}
