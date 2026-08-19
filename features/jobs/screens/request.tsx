import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { AppButton } from "@/components/ui/buttons";
import { Avatar } from "@/components/ui/avatar";
import { getArtisan } from "@/data/mock";
import type { JobSchedule } from "@/features/jobs/types";
import { useAuthStore } from "@/store/auth.store";
import { useJobStore } from "@/store/job.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { formatNairaRange } from "@/utils/format.currency";
import { haptic } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const SCHEDULES: { key: JobSchedule; label: string; hint: string }[] = [
    { key: "asap", label: "ASAP", hint: "Usually under 30 mins" },
    { key: "today", label: "Today", hint: "We'll confirm a slot" },
    { key: "schedule", label: "Schedule", hint: "Pick a later time" },
];

export default function JobRequestScreen() {
    const { artisanId } = useLocalSearchParams<{ artisanId?: string }>();
    const id = Array.isArray(artisanId) ? artisanId[0] : artisanId;
    const artisan = getArtisan(id ?? "");
    const theme = useTheme();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const createJob = useJobStore((s) => s.createJob);
    const loading = useJobStore((s) => s.loading);
    const showToast = useUIStore((s) => s.showToast);

    const [description, setDescription] = useState("");
    const [schedule, setSchedule] = useState<JobSchedule>("asap");
    const [error, setError] = useState("");

    if (!artisan) {
        return (
            <Screen padded={false}>
                <AppHeader title="Request job" />
                <View style={{ padding: 24 }}>
                    <Text>Choose an artisan first.</Text>
                </View>
            </Screen>
        );
    }

    const submit = async () => {
        if (description.trim().length < 8) {
            setError("Tell us a bit more about the issue (at least 8 characters).");
            return;
        }
        setError("");
        const job = await createJob({
            artisanId: artisan.id,
            description: description.trim(),
            schedule,
            address: user?.address ?? "",
            service: artisan.skill,
            categoryId: artisan.categoryId,
            amount: artisan.price,
        });
        void haptic("success");
        showToast("Request sent — pay to confirm", "success");
        router.replace({ pathname: "/job/pay", params: { jobId: job.id } });
    };

    return (
        <Screen padded={false}>
            <AppHeader title="Request job" subtitle={artisan.skill} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={{
                        padding: theme.spacing[4],
                        paddingBottom: 40,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 12,
                            backgroundColor: theme.colors.surface,
                            borderRadius: theme.radius.lg,
                            padding: theme.spacing[3],
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Avatar uri={artisan.avatar} name={artisan.name} size={52} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ ...theme.typography.bodyMedium }}>
                                {artisan.name}
                            </Text>
                            <Text style={{ color: theme.colors.textSecondary }}>
                                {artisan.skill} · ★ {artisan.rating.toFixed(1)}
                            </Text>
                            <Text
                                style={{
                                    color: theme.colors.primary,
                                    marginTop: 4,
                                    fontWeight: "600",
                                }}
                            >
                                {formatNairaRange(artisan.price, artisan.priceMax)}
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={{
                            ...theme.typography.h4,
                            marginTop: theme.spacing[6],
                            marginBottom: theme.spacing[2],
                        }}
                    >
                        What’s the issue?
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={(t) => {
                            setDescription(t);
                            if (error) setError("");
                        }}
                        placeholder="e.g. Kitchen sink is leaking from the U-bend and water is pooling in the cabinet."
                        placeholderTextColor={theme.colors.textMuted}
                        multiline
                        textAlignVertical="top"
                        style={{
                            minHeight: 120,
                            borderWidth: 1.5,
                            borderColor: error ? theme.colors.error : theme.colors.border,
                            borderRadius: theme.radius.md,
                            padding: theme.spacing[3],
                            backgroundColor: theme.colors.surface,
                            ...theme.typography.body,
                            color: theme.colors.textPrimary,
                        }}
                    />
                    {error ? (
                        <Text style={{ color: theme.colors.error, marginTop: 6, fontSize: 13 }}>
                            {error}
                        </Text>
                    ) : null}

                    <Text
                        style={{
                            ...theme.typography.h4,
                            marginTop: theme.spacing[6],
                            marginBottom: theme.spacing[2],
                        }}
                    >
                        When do you need this?
                    </Text>
                    <View style={{ gap: 10 }}>
                        {SCHEDULES.map((item) => {
                            const active = schedule === item.key;
                            return (
                                <Pressable
                                    key={item.key}
                                    onPress={() => setSchedule(item.key)}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        padding: theme.spacing[3],
                                        borderRadius: theme.radius.md,
                                        borderWidth: 1.5,
                                        borderColor: active
                                            ? theme.colors.primary
                                            : theme.colors.border,
                                        backgroundColor: active
                                            ? theme.colors.primaryLight
                                            : theme.colors.surface,
                                    }}
                                >
                                    <Ionicons
                                        name={active ? "radio-button-on" : "radio-button-off"}
                                        size={20}
                                        color={active ? theme.colors.primary : theme.colors.textMuted}
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ ...theme.typography.bodyMedium }}>
                                            {item.label}
                                        </Text>
                                        <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                                            {item.hint}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text
                        style={{
                            ...theme.typography.h4,
                            marginTop: theme.spacing[6],
                            marginBottom: theme.spacing[2],
                        }}
                    >
                        Address
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 10,
                            padding: theme.spacing[3],
                            borderRadius: theme.radius.md,
                            backgroundColor: theme.colors.surface,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Ionicons name="location" size={18} color={theme.colors.primary} />
                        <Text style={{ flex: 1, color: theme.colors.textPrimary }}>
                            {user?.address}
                        </Text>
                    </View>

                    <View style={{ marginTop: theme.spacing[8] }}>
                        <AppButton
                            label={`Request ${artisan.name.split(" ")[0]}`}
                            variant="accent"
                            loading={loading}
                            onPress={() => void submit()}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}
