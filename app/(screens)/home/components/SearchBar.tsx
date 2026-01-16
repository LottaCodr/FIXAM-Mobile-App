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
                paddingHorizontal: spacing[4],
                height: 52,
                marginBottom: spacing[5],
                borderWidth: 1,
                borderColor: colors.border,
            }}
        >
            <Ionicons size={18} name="search" color={colors.textSecondary} />

            <TextInput
                placeholder="Search for a service"
                placeholderTextColor={colors.textMuted}
                style={{
                    marginLeft: spacing[3],
                    flex: 1,
                    fontSize: typography.body.fontSize,
                    fontWeight: typography.body.fontWeight as any,
                    color: colors.textPrimary,
                }}
            />
        </View>
    );
}
