import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { AppButton } from "@/components/ui/buttons";
import { Avatar } from "@/components/ui/avatar";
import { getArtisan } from "@/data/mock";
import { useJobStore } from "@/store/job.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { haptic } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const TAGS = ["On time", "Professional", "Fair price", "Tidy", "Skilled"];

export default function ReviewScreen() {
    const { jobId } = useLocalSearchParams<{ jobId?: string }>();
    const id = Array.isArray(jobId) ? jobId[0] : jobId;
    const job = useJobStore((s) => s.jobs.find((j) => j.id === id));
    const submitReview = useJobStore((s) => s.submitReview);
    const artisan = job ? getArtisan(job.artisanId) : undefined;
    const theme = useTheme();
    const router = useRouter();
    const showToast = useUIStore((s) => s.showToast);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [picked, setPicked] = useState<string[]>(["Professional"]);

    if (!job || !artisan) {
        return (
            <Screen padded={false}>
                <AppHeader title="Review" />
                <View style={{ padding: 24 }}>
                    <Text>Job not found.</Text>
                </View>
            </Screen>
        );
    }

    const submit = () => {
        const extra = picked.length ? ` ${picked.join(", ")}.` : "";
        submitReview(job.id, rating, `${comment.trim()}${extra}`.trim());
        void haptic("success");
        showToast("Thanks for the review", "success");
        router.replace("/(tabs)/jobs");
    };

    return (
        <Screen padded={false}>
            <AppHeader title="Rate your experience" />
            <View style={{ padding: theme.spacing[5], flex: 1 }}>
                <View style={{ alignItems: "center", marginTop: theme.spacing[4] }}>
                    <Avatar uri={artisan.avatar} name={artisan.name} size={72} />
                    <Text style={{ ...theme.typography.h3, marginTop: 12 }}>{artisan.name}</Text>
                    <Text style={{ color: theme.colors.textSecondary }}>{job.service}</Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                        marginTop: theme.spacing[6],
                    }}
                >
                    {[1, 2, 3, 4, 5].map((n) => (
                        <Pressable
                            key={n}
                            onPress={() => {
                                setRating(n);
                                void haptic("light");
                            }}
                            hitSlop={6}
                        >
                            <Ionicons
                                name={n <= rating ? "star" : "star-outline"}
                                size={36}
                                color={theme.colors.warning}
                            />
                        </Pressable>
                    ))}
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                        marginTop: theme.spacing[6],
                    }}
                >
                    {TAGS.map((tag) => {
                        const on = picked.includes(tag);
                        return (
                            <Pressable
                                key={tag}
                                onPress={() =>
                                    setPicked((prev) =>
                                        on ? prev.filter((t) => t !== tag) : [...prev, tag],
                                    )
                                }
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    borderRadius: 999,
                                    backgroundColor: on
                                        ? theme.colors.primaryLight
                                        : theme.colors.surface,
                                    borderWidth: 1,
                                    borderColor: on ? theme.colors.primary : theme.colors.border,
                                }}
                            >
                                <Text
                                    style={{
                                        color: on ? theme.colors.primaryDark : theme.colors.textPrimary,
                                        fontWeight: "600",
                                        fontSize: 13,
                                    }}
                                >
                                    {tag}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <TextInput
                    value={comment}
                    onChangeText={setComment}
                    placeholder="Share more about the job (optional)"
                    placeholderTextColor={theme.colors.textMuted}
                    multiline
                    style={{
                        marginTop: theme.spacing[5],
                        minHeight: 110,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        borderRadius: theme.radius.md,
                        padding: theme.spacing[3],
                        backgroundColor: theme.colors.surface,
                        ...theme.typography.body,
                        color: theme.colors.textPrimary,
                        textAlignVertical: "top",
                    }}
                />

                <View style={{ marginTop: "auto" }}>
                    <AppButton label="Submit review" variant="accent" onPress={submit} />
                </View>
            </View>
        </Screen>
    );
}
