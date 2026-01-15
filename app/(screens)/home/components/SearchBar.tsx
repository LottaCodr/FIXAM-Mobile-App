import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";

export function SearchBar() {
    const { colors, spacing, radius, typography } = useTheme();

    // Map to the allowed fontWeight value if necessary
    // Commonly "regular" maps to "400"
    const mapFontWeight = (weight: any) => {
        if (weight === "regular") return "400";
        if (
            [
                "100", "200", "300", "400", "500", "600", "700", "800", "900",
                100, 200, 300, 400, 500, 600, 700, 800, 900,
                "normal", "bold", "light", "ultralight", "thin", "medium", "semibold", "heavy", "black"
            ].includes(weight)
        ) {
            return weight;
        }
        return undefined;
    };

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
            <Ionicons size={18} name="search" color={colors.textMuted} />

            <TextInput
                placeholder="Search for a service"
                placeholderTextColor={colors.textMuted}
                style={{
                    marginLeft: spacing[3],
                    flex: 1,
                    fontSize: typography.fontSize.md,
                    fontWeight: mapFontWeight(typography.weight.regular) as any,
                    color: colors.textPrimary,
                }}
            />
        </View>
    );
}
