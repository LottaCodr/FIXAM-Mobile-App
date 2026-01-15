import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

export function Header() {
    const { colors, spacing, typography, radius } = useTheme();

    return (
        <View
            style={{
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[5],
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                    source={{ uri: "https://i.pravatar.cc/100" }}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        borderWidth: 2,
                        borderColor: colors.primary,
                        marginRight: spacing[3],
                    }}
                />

                <View>
                    <Text
                        style={{
                            
                            fontSize: typography.fontSize.sm,
                            lineHeight: typography.lineHeight.sm,
                            color: colors.textMuted,
                            fontWeight: typography.weight.regular,
                        }}
                    >
                        Welcome back
                    </Text>

                    <Text
                        style={{
                            fontSize: typography.fontSize.lg,
                            lineHeight: typography.lineHeight.lg,
                            color: colors.textPrimary,
                            fontWeight: typography.weight.bold,
                        }}
                    >
                        Hi, Lotanna 👋
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.full,
                    backgroundColor: colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Ionicons size={20} name="notifications-outline" color={colors.textPrimary} />
            </TouchableOpacity>
        </View>)
}
