import { EmptyState } from "@/components/feedback/empty.state";
import { Screen } from "@/components/layout/Screen";
import JobCard from "@/features/jobs/components/job.card";
import Tab from "@/features/jobs/components/tab";
import { isActiveJob, useJobStore } from "@/store/job.store";
import { useTheme } from "@/theme/useTheme";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function JobsScreen() {
    const theme = useTheme();
    const [tab, setTab] = useState<"active" | "completed">("active");
    const jobs = useJobStore((s) => s.jobs);
    const router = useRouter();

    const filtered = useMemo(
        () =>
            jobs.filter((j) =>
                tab === "active" ? isActiveJob(j) : j.status === "completed" || j.status === "cancelled",
            ),
        [jobs, tab],
    );

    const activeCount = jobs.filter(isActiveJob).length;
    const pastCount = jobs.length - activeCount;

    return (
        <Screen padded={false}>
            <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[2], flex: 1 }}>
                <Text style={{ ...theme.typography.h2, color: theme.colors.textPrimary }}>
                    My jobs
                </Text>
                <Text
                    style={{
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        marginTop: 4,
                        marginBottom: theme.spacing[3],
                    }}
                >
                    Track live work and revisit past repairs.
                </Text>

                <View style={{ flexDirection: "row", marginBottom: theme.spacing[4] }}>
                    <Tab
                        label="Active"
                        count={activeCount}
                        active={tab === "active"}
                        onPress={() => setTab("active")}
                    />
                    <Tab
                        label="History"
                        count={pastCount}
                        active={tab === "completed"}
                        onPress={() => setTab("completed")}
                    />
                </View>

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: theme.spacing[10], flexGrow: 1 }}
                    renderItem={({ item }) => <JobCard job={item} />}
                    ListEmptyComponent={
                        <EmptyState
                            icon={tab === "active" ? "briefcase-outline" : "checkmark-done-outline"}
                            title={tab === "active" ? "No active jobs" : "No job history yet"}
                            subtitle={
                                tab === "active"
                                    ? "Book a verified artisan and you’ll see live progress here."
                                    : "Completed and cancelled jobs will show up here."
                            }
                            actionLabel="Browse services"
                            onAction={() => router.push("/categories")}
                        />
                    }
                />
            </View>
        </Screen>
    );
}
