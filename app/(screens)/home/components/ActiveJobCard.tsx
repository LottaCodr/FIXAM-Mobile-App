import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export function ActiveJobCard() {
    const { colors, spacing, radius, typography } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.primaryLight,
                borderRadius: radius.lg,
                padding: spacing[5],
                marginBottom: spacing[6],
                minWidth: 0,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", minWidth: 0 }}>
                <View
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        backgroundColor: colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: spacing[4],
                        flexShrink: 0,
                    }}
                >
                    <Ionicons name="notifications-outline" size={20} color="#fff" />
                </View>

                <View style={{ minWidth: 0, flex: 1 }}>
                    <Text
                        style={{
                            ...typography.h3,
                            color: colors.textPrimary,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Plumber is on the way
                    </Text>

                    <Text
                        style={{
                            marginTop: spacing[1],
                            ...typography.caption,
                            color: colors.textSecondary,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Arriving in approx. 12 mins
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.primary,
                        paddingHorizontal: spacing[4],
                        paddingVertical: spacing[2],
                        borderRadius: radius.full,
                        marginLeft: spacing[3],
                        flexShrink: 1,
                    }}
                >
                    <Text
                        style={{
                            ...typography.button,
                            color: "#fff",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Track
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
