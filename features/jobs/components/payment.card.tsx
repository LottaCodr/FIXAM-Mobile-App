import { useTheme } from "@/theme/ThemeProvider";
import { Text, View } from "react-native";

export function PaymentCard() {
    const theme = useTheme();

    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                padding: theme.spacing[4],
                marginTop: theme.spacing[6],
                elevation: 3,
            }}
        >
            <Row label="Service Fee" value="₦12,500" />
            <Row label="Parts & Materials" value="₦2,500" />
            <Row label="Date" value="Oct 12, 2023 • 2:45 PM" />

            <View
                style={{
                    height: 1,
                    backgroundColor: theme.colors.border,
                    marginVertical: theme.spacing[3],
                }}
            />

            <Row
                label="Total Paid"
                value="₦15,000"
                highlight
            />
        </View>
    );
}

function Row({ label, value, highlight }: any) {
    const theme = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: theme.spacing[2],
            }}
        >
            <Text style={{ color: theme.colors.textMuted }}>{label}</Text>
            <Text
                style={{
                    fontWeight: "700",
                    color: highlight ? theme.colors.primary : theme.colors.textPrimary,
                }}
            >
                {value}
            </Text>
        </View>
    );
}
