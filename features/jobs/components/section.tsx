import { useTheme } from "@/theme/ThemeProvider";
import { Text, View } from "react-native";

type SectionProps = {
    title: string;
    children: string;
};

export function Section({ title, children }: SectionProps) {
    const theme = useTheme();

    return (
        <View style={{ marginBottom: theme.spacing[6] }}>
            <Text
                style={{
                    fontSize: theme.typography.h3?.fontSize ?? 18,
                    fontWeight: theme.typography.h3?.fontWeight ?? "bold",
                    marginBottom: theme.spacing[2],
                }}
            >
                {title}
            </Text>

            <Text
                style={{
                    fontSize: theme.typography.body?.fontSize ?? 15,
                    color: theme.colors.textSecondary,
                    lineHeight: 22,
                }}
            >
                {children}
            </Text>
        </View>
    );
}
