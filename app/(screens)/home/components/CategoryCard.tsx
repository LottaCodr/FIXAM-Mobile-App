import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export function CategoryCard({ title, icon: Icon, color }: any) {
    const { spacing, radius, typography, colors } = useTheme();

    return (
        <TouchableOpacity
            style={{
                width: "48%",
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                padding: spacing[5],
                marginBottom: spacing[5],
                marginRight: "4%",
            }}
        >
            <View
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: color,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing[3],
                }}
            >
                <Icon size={18} color={colors.textPrimary} />
            </View>

            <Text
                style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: typography.fontSize.md,
                    lineHeight: typography.lineHeight.md,
                    color: colors.textPrimary,
                }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}
