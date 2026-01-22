import { View, Pressable } from "react-native";
import { Text } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

const filters = ["Distance", "Rating", "Price"];

export function FilterPills() {
    const theme = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                gap: theme.spacing[2],
                marginBottom: theme.spacing[4],
            }}
        >
            {filters.map((filter) => (
                <Pressable
                    key={filter}
                    style={{
                        paddingVertical: theme.spacing[2],
                        paddingHorizontal: theme.spacing[4],
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.full,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}
                >
                    <Text
                        style={{
                            fontSize: typeof theme.typography.button === "number" ? theme.typography.button : 16,
                            color: theme.colors.textPrimary,
                            fontWeight: typeof theme.typography.button === "string" ? theme.typography.button : "500",
                        }}
                    >
                        {filter}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
