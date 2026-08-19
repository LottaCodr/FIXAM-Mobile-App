import { Screen } from "@/components/layout/Screen";
import { AppButton } from "@/components/ui/buttons";
import { Avatar } from "@/components/ui/avatar";
import { useArtisanStore } from "@/store/artisan.store";
import { useAuthStore } from "@/store/auth.store";
import { useJobStore } from "@/store/job.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";

type Item = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    subtitle?: string;
    href?: string;
    danger?: boolean;
    onPress?: () => void;
};

export default function ProfileScreen() {
    const theme = useTheme();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const jobs = useJobStore((s) => s.jobs);
    const saved = useArtisanStore((s) => s.savedIds);
    const router = useRouter();
    const showToast = useUIStore((s) => s.showToast);

    const completed = jobs.filter((j) => j.status === "completed").length;

    const groups: { title: string; items: Item[] }[] = [
        {
            title: "Account",
            items: [
                { icon: "create-outline", label: "Edit profile", href: "/edit-profile" },
                { icon: "heart-outline", label: "Saved artisans", subtitle: `${saved.length} saved`, href: "/saved" },
                { icon: "location-outline", label: "Addresses", subtitle: user?.location, href: "/edit-profile" },
            ],
        },
        {
            title: "Payments & rewards",
            items: [
                { icon: "card-outline", label: "Payment methods", href: "/settings" },
                { icon: "wallet-outline", label: "Payout account", subtitle: "Flutterwave NUBAN", href: "/payout-account" },
                { icon: "gift-outline", label: "Referrals", subtitle: "Earn ₦2,000", href: "/refer" },
            ],
        },
        {
            title: "Support",
            items: [
                { icon: "help-circle-outline", label: "Help & support", href: "/help" },
                { icon: "settings-outline", label: "Settings", href: "/settings" },
                {
                    icon: "log-out-outline",
                    label: "Log out",
                    danger: true,
                    onPress: () => {
                        const run = () => {
                            logout();
                            showToast("You’ve been logged out", "info");
                            router.replace("/(auth)/login");
                        };
                        if (Platform.OS === "web") {
                            const confirmed =
                                typeof window !== "undefined"
                                    ? window.confirm("Log out of FixAm?")
                                    : true;
                            if (confirmed) run();
                            return;
                        }
                        Alert.alert("Log out?", "You can sign back in with your phone number.", [
                            { text: "Stay", style: "cancel" },
                            { text: "Log out", style: "destructive", onPress: run },
                        ]);
                    },
                },
            ],
        },
    ];

    return (
        <Screen padded={false}>
            <ScrollView
                contentContainerStyle={{
                    padding: theme.spacing[4],
                    paddingBottom: theme.spacing[12],
                }}
            >
                <Text style={{ ...theme.typography.h2 }}>Profile</Text>

                <View
                    style={{
                        marginTop: theme.spacing[4],
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.xl,
                        padding: theme.spacing[4],
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        ...theme.shadow.sm,
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                        <Avatar uri={user?.avatar} name={user?.name} size={68} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ ...theme.typography.h3 }}>{user?.name}</Text>
                            <Text style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                                {user?.phone}
                            </Text>
                            <Text style={{ color: theme.colors.textMuted, marginTop: 2 }}>
                                {user?.location}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: theme.spacing[4],
                            backgroundColor: theme.colors.neutral[50],
                            borderRadius: theme.radius.md,
                            paddingVertical: theme.spacing[3],
                        }}
                    >
                        <Stat value={`${completed}`} label="Jobs" />
                        <Stat value={`${saved.length}`} label="Saved" />
                        <Stat value="₦2k" label="Credits" />
                    </View>

                    <View style={{ marginTop: theme.spacing[3] }}>
                        <AppButton
                            label="Edit profile"
                            variant="secondary"
                            size="md"
                            onPress={() => router.push("/edit-profile")}
                        />
                    </View>
                </View>

                {groups.map((group) => (
                    <View key={group.title} style={{ marginTop: theme.spacing[6] }}>
                        <Text
                            style={{
                                ...theme.typography.overline,
                                color: theme.colors.textMuted,
                                marginBottom: theme.spacing[2],
                            }}
                        >
                            {group.title}
                        </Text>
                        <View
                            style={{
                                backgroundColor: theme.colors.surface,
                                borderRadius: theme.radius.lg,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                overflow: "hidden",
                            }}
                        >
                            {group.items.map((item, i) => (
                                <Pressable
                                    key={item.label}
                                    onPress={() => {
                                        if (item.onPress) item.onPress();
                                        else if (item.href) router.push(item.href as never);
                                    }}
                                    style={({ pressed }) => ({
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingHorizontal: theme.spacing[4],
                                        paddingVertical: 14,
                                        backgroundColor: pressed ? theme.colors.neutral[50] : "transparent",
                                        borderTopWidth: i === 0 ? 0 : 1,
                                        borderTopColor: theme.colors.border,
                                    })}
                                >
                                    <View
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            backgroundColor: item.danger
                                                ? theme.colors.errorSoft
                                                : theme.colors.primaryLight,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: 12,
                                        }}
                                    >
                                        <Ionicons
                                            name={item.icon}
                                            size={18}
                                            color={item.danger ? theme.colors.error : theme.colors.primary}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                ...theme.typography.bodyMedium,
                                                color: item.danger ? theme.colors.error : theme.colors.textPrimary,
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                        {item.subtitle ? (
                                            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                                                {item.subtitle}
                                            </Text>
                                        ) : null}
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </Screen>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    const theme = useTheme();
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ ...theme.typography.h3 }}>{value}</Text>
            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>{label}</Text>
        </View>
    );
}
