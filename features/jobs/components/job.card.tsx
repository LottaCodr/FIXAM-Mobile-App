import { Avatar } from "@/components/ui/avatar";
import { getArtisan } from "@/data/mock";
import StatusPills from "@/features/jobs/components/status.pills";
import type { Job } from "@/features/jobs/types";
import { isActiveJob } from "@/store/job.store";
import { useTheme } from "@/theme/useTheme";
import { formatNaira } from "@/utils/format.currency";
import { formatDate } from "@/utils/format.date";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function JobCard({ job }: { job: Job }) {
    const theme = useTheme();
    const artisan = getArtisan(job.artisanId);
    const router = useRouter();
    const active = isActiveJob(job);

    return (
        <Pressable
            onPress={() => router.push(`/job/${job.id}`)}
            style={({ pressed }) => ({
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                padding: theme.spacing[4],
                marginBottom: theme.spacing[3],
                borderWidth: 1,
                borderColor: theme.colors.border,
                opacity: pressed ? 0.94 : 1,
                ...theme.shadow.sm,
            })}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar uri={artisan?.avatar} name={artisan?.name} size={48} />

                <View style={{ flex: 1, marginLeft: theme.spacing[3] }}>
                    <Text
                        numberOfLines={1}
                        style={{ ...theme.typography.bodyMedium, color: theme.colors.textPrimary }}
                    >
                        {artisan?.name ?? "Artisan"}
                    </Text>
                    <Text style={{ color: theme.colors.primary, marginTop: 1 }}>
                        {job.service}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <Ionicons name="calendar-outline" size={13} color={theme.colors.textMuted} />
                        <Text
                            style={{
                                marginLeft: 6,
                                color: theme.colors.textMuted,
                                fontSize: 12,
                            }}
                        >
                            {formatDate(job.createdAt)}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: "flex-end", gap: 8 }}>
                    <Text style={{ ...theme.typography.h4, color: theme.colors.textPrimary }}>
                        {formatNaira(job.amount)}
                    </Text>
                    <StatusPills status={job.status} />
                </View>
            </View>

            <View
                style={{
                    marginTop: theme.spacing[4],
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {job.rating ? (
                    <Text style={{ color: theme.colors.warning, fontWeight: "600" }}>
                        ★ {job.rating.toFixed(1)}
                    </Text>
                ) : (
                    <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                        {job.scheduledLabel}
                    </Text>
                )}

                <Pressable
                    onPress={(event) => {
                        event.stopPropagation();
                        if (active) {
                            router.push(`/job/${job.id}`);
                            return;
                        }
                        router.push({
                            pathname: "/job/request",
                            params: { artisanId: job.artisanId },
                        });
                    }}
                    style={{
                        backgroundColor: active ? theme.colors.accent : theme.colors.primary,
                        paddingHorizontal: theme.spacing[5],
                        paddingVertical: 8,
                        borderRadius: theme.radius.sm,
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                        {active ? "Track" : "Rebook"}
                    </Text>
                </Pressable>
            </View>
        </Pressable>
    );
}
