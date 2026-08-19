import { getCategory } from "@/constants/service.categories";
import { getArtisan } from "@/data/mock";
import type { Job } from "@/features/jobs/types";
import { JOB_STATUS_META } from "@/features/jobs/status";
import { useTheme } from "@/theme/useTheme";
import { haptic } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function ActiveJobCard({ job }: { job: Job }) {
    const { colors, spacing, radius, typography, shadow } = useTheme();
    const router = useRouter();
    const artisan = getArtisan(job.artisanId);
    const category = getCategory(job.categoryId);
    const meta = JOB_STATUS_META[job.status];

    const headline =
        job.status === "en_route"
            ? `${artisan?.skill ?? "Artisan"} is on the way`
            : job.status === "accepted"
              ? `${job.service} is confirmed`
              : job.status === "arrived"
                ? `${artisan?.name.split(" ")[0]} has arrived`
                : job.status === "in_progress"
                  ? `Work in progress`
                  : `Request sent to ${artisan?.name.split(" ")[0] ?? "artisan"}`;

    const subtitle =
        job.status === "en_route" && job.etaMins
            ? `Arriving in about ${job.etaMins} mins`
            : job.scheduledLabel === "ASAP"
              ? artisan?.name ?? job.service
              : job.scheduledLabel;

    return (
        <Pressable
            onPress={() => {
                void haptic("light");
                router.push(`/job/${job.id}`);
            }}
            style={({ pressed }) => ({
                backgroundColor: colors.primary,
                borderRadius: radius.xl,
                padding: spacing[4],
                marginBottom: spacing[2],
                opacity: pressed ? 0.94 : 1,
                ...shadow.md,
            })}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: spacing[3],
                }}
            >
                <View
                    style={{
                        backgroundColor: "rgba(255,255,255,0.16)",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 999,
                    }}
                >
                    <Text style={{ ...typography.overline, color: "#fff", letterSpacing: 0.6 }}>
                        Active job
                    </Text>
                </View>
                <Text style={{ ...typography.captionMedium, color: "rgba(255,255,255,0.8)" }}>
                    {meta.label}
                </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: radius.full,
                        backgroundColor: "rgba(255,255,255,0.16)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: spacing[3],
                    }}
                >
                    <Ionicons
                        name={category?.icon ?? "construct-outline"}
                        size={20}
                        color="#fff"
                    />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                        numberOfLines={1}
                        style={{ ...typography.h4, color: "#fff" }}
                    >
                        {headline}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{
                            ...typography.caption,
                            color: "rgba(255,255,255,0.78)",
                            marginTop: 2,
                        }}
                    >
                        {subtitle}
                    </Text>
                </View>
                <View
                    style={{
                        backgroundColor: colors.accent,
                        paddingHorizontal: spacing[4],
                        paddingVertical: spacing[2],
                        borderRadius: radius.full,
                        marginLeft: spacing[2],
                    }}
                >
                    <Text style={{ ...typography.captionMedium, color: "#fff" }}>Track</Text>
                </View>
            </View>
        </Pressable>
    );
}
