import { JOB_STATUS_META } from "@/features/jobs/status";
import type { JobStatus } from "@/features/jobs/types";
import { useTheme } from "@/theme/useTheme";
import { Text, View } from "react-native";

export default function StatusPills({ status }: { status: JobStatus }) {
    const theme = useTheme();
    const meta = JOB_STATUS_META[status];

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: meta.soft,
                paddingHorizontal: theme.spacing[3],
                paddingVertical: 4,
                borderRadius: theme.radius.full,
            }}
        >
            <Text style={{ color: meta.color, fontWeight: "700", fontSize: 11 }}>
                {meta.label.toUpperCase()}
            </Text>
        </View>
    );
}
