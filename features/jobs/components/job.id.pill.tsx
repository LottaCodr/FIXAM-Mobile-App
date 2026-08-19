import { useTheme } from "@/theme/useTheme";
import { Text, View } from "react-native";

export default function JobIdPill({ id }: { id: string }) {
    const theme = useTheme();

    return (
        <View
            style={{
                backgroundColor: theme.colors.neutral[100],
                paddingHorizontal: theme.spacing[3],
                paddingVertical: theme.spacing[1],
                borderRadius: theme.radius.full,
            }}
        >
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12, fontWeight: "600" }}>
                {id}
            </Text>
        </View>
    );
}
