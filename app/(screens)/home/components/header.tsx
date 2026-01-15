import { View, Image, TouchableOpacity, Text } from "react-native";
import {  Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";

export function Header() {
    const { colors, spacing, typography } = useTheme();

    return (
        <View
            style={{
                padding: spacing[5],
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
                        borderRadius: 22,
                        borderWidth: 2,
                        borderColor: colors.primary,
                        marginRight: spacing[5],
                    }}
                />

                <View>
                    <Text
                        style={{
                            fontFamily: typography.fontFamily.regular,
                            fontSize: typography.fontSize.sm,
                            lineHeight: typography.lineHeight.sm,
                            color: colors.primary,
                        }}
                    >
                        Welcome back
                    </Text>

                    <Text
                        style={{
                            fontFamily: typography.fontFamily.bold,
                            fontSize: typography.fontSize.lg,
                            lineHeight: typography.lineHeight.lg,
                            color: colors.primary,
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
                    borderRadius: 20,
                    backgroundColor: colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
}
