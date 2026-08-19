import { EmptyState } from "@/components/feedback/empty.state";
import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { useNotificationStore } from "@/store/notification.store";
import { useTheme } from "@/theme/useTheme";
import { formatRelativeTime } from "@/utils/format.date";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const ICONS = {
    job: "briefcase-outline",
    promo: "gift-outline",
    message: "chatbubble-outline",
    system: "information-circle-outline",
} as const;

export default function NotificationsScreen() {
    const theme = useTheme();
    const items = useNotificationStore((s) => s.items);
    const markRead = useNotificationStore((s) => s.markRead);
    const markAllRead = useNotificationStore((s) => s.markAllRead);
    const router = useRouter();

    return (
        <Screen padded={false}>
            <AppHeader
                title="Notifications"
                right={
                    <Pressable onPress={markAllRead} hitSlop={10}>
                        <Text style={{ color: theme.colors.primary, fontWeight: "600", fontSize: 13 }}>
                            Mark read
                        </Text>
                    </Pressable>
                }
            />
            <ScrollView contentContainerStyle={{ padding: theme.spacing[4], flexGrow: 1 }}>
                {items.length === 0 ? (
                    <EmptyState icon="notifications-off-outline" title="You're all caught up" />
                ) : (
                    items.map((n) => (
                        <Pressable
                            key={n.id}
                            onPress={() => {
                                markRead(n.id);
                                if (n.href) router.push(n.href as never);
                            }}
                            style={{
                                flexDirection: "row",
                                gap: 12,
                                padding: theme.spacing[3],
                                borderRadius: theme.radius.md,
                                backgroundColor: n.read ? theme.colors.surface : theme.colors.primaryLight,
                                borderWidth: 1,
                                borderColor: n.read ? theme.colors.border : theme.colors.primaryLight,
                                marginBottom: 10,
                            }}
                        >
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    backgroundColor: theme.colors.surface,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Ionicons name={ICONS[n.type]} size={18} color={theme.colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ ...theme.typography.bodyMedium }}>{n.title}</Text>
                                <Text style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                                    {n.body}
                                </Text>
                                <Text
                                    style={{
                                        color: theme.colors.textMuted,
                                        fontSize: 11,
                                        marginTop: 6,
                                    }}
                                >
                                    {formatRelativeTime(n.createdAt)}
                                </Text>
                            </View>
                            {!n.read ? (
                                <View
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: theme.colors.accent,
                                        marginTop: 6,
                                    }}
                                />
                            ) : null}
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </Screen>
    );
}
