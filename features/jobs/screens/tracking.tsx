import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { AppButton } from "@/components/ui/buttons";
import { Avatar } from "@/components/ui/avatar";
import { getArtisan } from "@/data/mock";
import { PaymentCard } from "@/features/jobs/components/payment.card";
import StatusPills from "@/features/jobs/components/status.pills";
import { statusIndex, TRACK_STEPS } from "@/features/jobs/status";
import { isActiveJob, useJobStore } from "@/store/job.store";
import { useMessageStore } from "@/store/message.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";

export default function JobDetailScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const jobId = Array.isArray(id) ? id[0] : id;
    const job = useJobStore((s) => s.jobs.find((j) => j.id === jobId));
    const updateStatus = useJobStore((s) => s.updateStatus);
    const theme = useTheme();
    const router = useRouter();
    const artisan = job ? getArtisan(job.artisanId) : undefined;
    const ensureConversation = useMessageStore((s) => s.ensureConversation);
    const showToast = useUIStore((s) => s.showToast);
    const active = job ? isActiveJob(job) : false;
    const idx = job ? statusIndex(job.status) : -1;

    if (!job || !artisan) {
        return (
            <Screen padded={false}>
                <AppHeader title="Job" />
                <View style={{ padding: 24 }}>
                    <Text>We couldn’t find that job.</Text>
                </View>
            </Screen>
        );
    }

    const advance = () => {
        const order = TRACK_STEPS.map((s) => s.key);
        const next = order[Math.min(idx + 1, order.length - 1)];
        if (next === "completed") {
            router.push({ pathname: "/job/review", params: { jobId: job.id } });
            return;
        }
        updateStatus(job.id, next, next === "en_route" ? { etaMins: 8 } : undefined);
        showToast("Status updated", "success");
    };

    const cancel = () => {
        const run = () => {
            updateStatus(job.id, "cancelled");
            showToast("Job cancelled", "info");
            router.replace("/(tabs)/jobs");
        };
        if (Platform.OS === "web") {
            const confirmed =
                typeof window !== "undefined"
                    ? window.confirm("Cancel this job? The artisan will be notified.")
                    : true;
            if (confirmed) run();
            return;
        }
        Alert.alert("Cancel this job?", "The artisan will be notified.", [
            { text: "Keep job", style: "cancel" },
            { text: "Cancel job", style: "destructive", onPress: run },
        ]);
    };

    return (
        <Screen padded={false}>
            <AppHeader title={job.service} subtitle={job.id} />
            <ScrollView
                contentContainerStyle={{
                    padding: theme.spacing[4],
                    paddingBottom: 40,
                }}
            >
                {active ? (
                    <View
                        style={{
                            height: 168,
                            borderRadius: theme.radius.xl,
                            backgroundColor: theme.colors.primaryDark,
                            overflow: "hidden",
                            marginBottom: theme.spacing[4],
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                position: "absolute",
                                width: 180,
                                height: 180,
                                borderRadius: 90,
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.12)",
                            }}
                        />
                        <View
                            style={{
                                position: "absolute",
                                width: 90,
                                height: 90,
                                borderRadius: 45,
                                backgroundColor: "rgba(247,147,30,0.2)",
                            }}
                        />
                        <Ionicons name="navigate" size={28} color={theme.colors.accent} />
                        <Text
                            style={{
                                color: "#fff",
                                fontWeight: "700",
                                marginTop: 8,
                                fontSize: 18,
                            }}
                        >
                            {job.status === "en_route" && job.etaMins
                                ? `Arriving in ${job.etaMins} mins`
                                : job.status === "requested"
                                  ? "Waiting for acceptance"
                                  : "Live tracking"}
                        </Text>
                        <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                            {job.address}
                        </Text>
                    </View>
                ) : null}

                <View
                    style={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.lg,
                        padding: theme.spacing[4],
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Avatar uri={artisan.avatar} name={artisan.name} size={52} online={artisan.online} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={{ ...theme.typography.bodyMedium }}>{artisan.name}</Text>
                            <Text style={{ color: theme.colors.textSecondary }}>{artisan.skill}</Text>
                        </View>
                        <StatusPills status={job.status} />
                    </View>
                    <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
                        <AppButton
                            label="Chat"
                            variant="secondary"
                            size="md"
                            fullWidth
                            onPress={() => router.push(`/chat/${ensureConversation(artisan.id)}`)}
                        />
                        <AppButton
                            label="Profile"
                            variant="outline"
                            size="md"
                            fullWidth
                            onPress={() => router.push(`/artisan/${artisan.id}`)}
                        />
                    </View>
                </View>

                {active ? (
                    <View style={{ marginTop: theme.spacing[6] }}>
                        <Text style={{ ...theme.typography.h3, marginBottom: theme.spacing[3] }}>
                            Progress
                        </Text>
                        {TRACK_STEPS.map((step, i) => {
                            const done = i <= idx;
                            const current = i === idx;
                            return (
                                <View key={step.key} style={{ flexDirection: "row", gap: 12 }}>
                                    <View style={{ alignItems: "center" }}>
                                        <View
                                            style={{
                                                width: 18,
                                                height: 18,
                                                borderRadius: 9,
                                                backgroundColor: done
                                                    ? theme.colors.primary
                                                    : theme.colors.neutral[200],
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {done ? (
                                                <Ionicons name="checkmark" size={11} color="#fff" />
                                            ) : null}
                                        </View>
                                        {i < TRACK_STEPS.length - 1 ? (
                                            <View
                                                style={{
                                                    width: 2,
                                                    height: 28,
                                                    backgroundColor: i < idx
                                                        ? theme.colors.primary
                                                        : theme.colors.neutral[200],
                                                }}
                                            />
                                        ) : null}
                                    </View>
                                    <Text
                                        style={{
                                            ...theme.typography.body,
                                            fontWeight: current ? "700" : "400",
                                            color: done
                                                ? theme.colors.textPrimary
                                                : theme.colors.textMuted,
                                            paddingTop: 0,
                                        }}
                                    >
                                        {step.label}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                ) : null}

                <View
                    style={{
                        marginTop: theme.spacing[5],
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.lg,
                        padding: theme.spacing[4],
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}
                >
                    <Text style={{ ...theme.typography.h4, marginBottom: 8 }}>Details</Text>
                    <Text style={{ color: theme.colors.textSecondary, lineHeight: 22 }}>
                        {job.description}
                    </Text>
                    <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
                        <Ionicons name="location-outline" size={16} color={theme.colors.textMuted} />
                        <Text style={{ color: theme.colors.textMuted, flex: 1 }}>{job.address}</Text>
                    </View>
                </View>

                {!active && job.status === "completed" ? (
                    <PaymentCard
                        serviceFee={job.amount - job.partsAmount}
                        partsAmount={job.partsAmount}
                        date={job.updatedAt}
                    />
                ) : null}

                <View style={{ marginTop: theme.spacing[6], gap: 10 }}>
                    {job.paymentStatus !== "successful" ? (
                        <AppButton
                            label="Pay with Flutterwave"
                            variant="accent"
                            onPress={() =>
                                router.push({ pathname: "/job/pay", params: { jobId: job.id } })
                            }
                        />
                    ) : null}
                    {active ? (
                        <>
                            <AppButton
                                label={
                                    job.status === "in_progress"
                                        ? "Mark complete & review"
                                        : "Simulate next status"
                                }
                                onPress={advance}
                            />
                            {job.status === "requested" || job.status === "accepted" ? (
                                <AppButton
                                    label="Cancel job"
                                    variant="danger"
                                    onPress={cancel}
                                />
                            ) : null}
                        </>
                    ) : job.status === "completed" ? (
                        <>
                            <AppButton
                                label="Rebook artisan"
                                variant="accent"
                                onPress={() =>
                                    router.push({
                                        pathname: "/job/request",
                                        params: { artisanId: artisan.id },
                                    })
                                }
                            />
                            {!job.rating ? (
                                <AppButton
                                    label="Leave a review"
                                    variant="secondary"
                                    onPress={() =>
                                        router.push({
                                            pathname: "/job/review",
                                            params: { jobId: job.id },
                                        })
                                    }
                                />
                            ) : null}
                        </>
                    ) : (
                        <AppButton
                            label="Book again"
                            onPress={() =>
                                router.push({
                                    pathname: "/job/request",
                                    params: { artisanId: artisan.id },
                                })
                            }
                        />
                    )}
                    <Pressable
                        onPress={() => router.push("/help")}
                        style={{ alignItems: "center", padding: 8 }}
                    >
                        <Text style={{ color: theme.colors.textMuted }}>Need help with this job?</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </Screen>
    );
}
