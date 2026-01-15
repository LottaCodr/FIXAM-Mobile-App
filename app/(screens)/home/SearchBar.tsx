import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";

export function SearchBar() {
    const { colors, spacing, radius, typography } = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                paddingHorizontal: spacing[5],
                height: 52,
                marginBottom: spacing[3],
            }}
        >
            <Ionicons size={18} name="search" color={colors.primary} />

            <TextInput
                placeholder="Search for a service"
                placeholderTextColor={colors.textMuted}
                style={{
                    marginLeft: spacing[2],
                    flex: 1,
                    fontFamily: typography.fontFamily.regular,
                    fontSize: typography.fontSize.md,
                    color: colors.textMuted,
                }}
            />
        </View>
    );
}
