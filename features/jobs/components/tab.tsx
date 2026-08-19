import { useTheme } from "@/theme/useTheme";
import { Pressable, Text } from "react-native";

export default function Tab({
    label,
    active,
    onPress,
    count,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
    count?: number;
}) {
    const theme = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: theme.spacing[3],
                borderBottomWidth: 2,
                borderBottomColor: active ? theme.colors.primary : "transparent",
            }}
        >
            <Text
                style={{
                    color: active ? theme.colors.primary : theme.colors.textMuted,
                    fontWeight: "700",
                    fontSize: 15,
                }}
            >
                {label}
                {typeof count === "number" ? ` (${count})` : ""}
            </Text>
        </Pressable>
    );
}
