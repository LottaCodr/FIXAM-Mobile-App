import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

export function CategoryCard({ title, icon, color }: any) {
    const { spacing, radius, typography, colors } = useTheme();

    return (
        <TouchableOpacity
            style={{
                width: "48%",
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                padding: spacing[5],
                marginBottom: spacing[4],
                borderWidth: 1,
                borderColor: colors.border,
            }}
        >
            <View
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.md,
                    backgroundColor: colors.background,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing[3],
                }}
            >
                <Ionicons
                    name={icon}
                    size={18}
                    color={colors.textPrimary}
                />
            </View>

            <Text
                style={{
                    ...typography.body,
                    color: colors.textPrimary,
                }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}
