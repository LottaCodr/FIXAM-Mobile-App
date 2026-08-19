import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function SearchBar() {
    const { colors, spacing, radius, typography, shadow } = useTheme();
    const router = useRouter();

    return (
        <Pressable
            accessibilityRole="search"
            onPress={() => router.push("/search")}
            style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                paddingHorizontal: spacing[4],
                height: 52,
                marginBottom: spacing[5],
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.9 : 1,
                ...shadow.sm,
            })}
        >
            <Ionicons size={18} name="search" color={colors.textSecondary} />
            <Text
                style={{
                    marginLeft: spacing[3],
                    flex: 1,
                    ...typography.body,
                    color: colors.textMuted,
                }}
            >
                Search plumbers, AC, cleaning…
            </Text>
            <View
                style={{
                    backgroundColor: colors.neutral[100],
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    borderRadius: radius.sm,
                }}
            >
                <Ionicons name="options-outline" size={16} color={colors.textSecondary} />
            </View>
        </Pressable>
    );
}
