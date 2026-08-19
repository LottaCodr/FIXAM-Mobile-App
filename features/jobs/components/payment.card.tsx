import { useTheme } from "@/theme/useTheme";
import { formatNaira } from "@/utils/format.currency";
import { formatDateTime } from "@/utils/format.date";
import { Text, View } from "react-native";

export function PaymentCard({
    serviceFee,
    partsAmount,
    date,
}: {
    serviceFee: number;
    partsAmount: number;
    date: string;
}) {
    const theme = useTheme();
    const total = serviceFee + partsAmount;

    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                padding: theme.spacing[4],
                marginTop: theme.spacing[4],
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            <Text style={{ ...theme.typography.h4, marginBottom: theme.spacing[3] }}>
                Payment
            </Text>
            <Row label="Service fee" value={formatNaira(serviceFee)} />
            <Row label="Parts & materials" value={formatNaira(partsAmount)} />
            <Row label="Date" value={formatDateTime(date)} />

            <View
                style={{
                    height: 1,
                    backgroundColor: theme.colors.border,
                    marginVertical: theme.spacing[3],
                }}
            />

            <Row label="Total" value={formatNaira(total)} highlight />
        </View>
    );
}

function Row({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
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
