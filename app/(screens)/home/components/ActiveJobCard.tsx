import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";

export function ActiveJobCard() {
    const { colors, spacing, radius, typography } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.success,
                borderRadius: radius.lg,
                padding: spacing[5],
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing[5],
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: spacing[3],
                    }}
                >
                    <Ionicons name="notifications-outline" size={20} color="#fff" />
                </View>

                <View>
                    <Text
                        style={{
                            fontFamily: typography.fontFamily.medium,
                            fontSize: typography.fontSize.md,
                            lineHeight: typography.lineHeight.md,
                            color: colors.textPrimary,
                        }}
                    >
                        Plumber is on the way
                    </Text>

                    <Text
                        style={{
                            fontFamily: typography.fontFamily.regular,
                            fontSize: typography.fontSize.sm,
                            lineHeight: typography.lineHeight.sm,
                            color: colors.textMuted,
                        }}
                    >
                        Arriving in approx. 12 mins
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: spacing[8],
                    paddingVertical: spacing[8],
                    borderRadius: radius.full,
                }}
            >
                <Text
                    style={{
                        fontFamily: typography.fontFamily.medium,
                        fontSize: typography.fontSize.sm,
                        color: "#fff",
                    }}
                >
                    Track
                </Text>
            </TouchableOpacity>
        </View>
    );
}
