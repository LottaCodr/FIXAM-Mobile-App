import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";

export function ActiveJobCard() {
    const { colors, spacing, radius, typography } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.primaryLight,
                borderRadius: radius.lg,
                padding: spacing[5],
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing[6],
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        backgroundColor: colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: spacing[4],
                    }}
                >
                    <Ionicons name="notifications-outline" size={20} color="#fff" />
                </View>

                <View>
                    <Text
                        style={{
                            fontSize: typography.fontSize.md,
                            fontWeight: typography.weight.medium,
                            color: colors.textPrimary,
                        }}
                    >
                        Plumber is on the way
                    </Text>

                    <Text
                        style={{
                            marginTop: spacing[1],
                            fontSize: typography.fontSize.sm,
                            color: colors.textSecondary,
                        }}
                    >
                        Arriving in approx. 12 mins
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: spacing[4],
                    paddingVertical: spacing[2],
                    borderRadius: radius.full,
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.weight.medium,
                    }}
                >
                    Track
                </Text>
            </TouchableOpacity>
        </View>
    );
}
