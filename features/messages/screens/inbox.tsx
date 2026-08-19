import { EmptyState } from "@/components/feedback/empty.state";
import { Screen } from "@/components/layout/Screen";
import { Avatar } from "@/components/ui/avatar";
import { getArtisan } from "@/data/mock";
import { useMessageStore } from "@/store/message.store";
import { useTheme } from "@/theme/useTheme";
import { formatRelativeTime } from "@/utils/format.date";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

export default function InboxScreen() {
    const theme = useTheme();
    const conversations = useMessageStore((s) => s.conversations);
    const router = useRouter();

    return (
        <Screen padded={false}>
            <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[2], flex: 1 }}>
                <Text style={{ ...theme.typography.h2 }}>Messages</Text>
                <Text
                    style={{
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        marginTop: 4,
                        marginBottom: theme.spacing[4],
                    }}
                >
                    Chat with artisans about your jobs.
                </Text>

                <FlatList
                    data={[...conversations].sort(
                        (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime(),
                    )}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
                    renderItem={({ item }) => {
                        const artisan = getArtisan(item.artisanId);
                        return (
                            <Pressable
                                onPress={() => router.push(`/chat/${item.id}`)}
                                style={({ pressed }) => ({
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 12,
                                    opacity: pressed ? 0.85 : 1,
                                })}
                            >
                                <Avatar
                                    uri={artisan?.avatar}
                                    name={artisan?.name}
                                    size={52}
                                    online={artisan?.online}
                                />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ ...theme.typography.bodyMedium }}>
                                            {artisan?.name ?? "Artisan"}
                                        </Text>
                                        <Text style={{ ...theme.typography.tiny, color: theme.colors.textMuted }}>
                                            {formatRelativeTime(item.lastAt)}
                                        </Text>
                                    </View>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            ...theme.typography.caption,
                                            color: item.unread
                                                ? theme.colors.textPrimary
                                                : theme.colors.textSecondary,
                                            fontWeight: item.unread ? "600" : "400",
                                            marginTop: 3,
                                        }}
                                    >
                                        {item.lastMessage}
                                    </Text>
                                </View>
                                {item.unread > 0 ? (
                                    <View
                                        style={{
                                            marginLeft: 8,
                                            minWidth: 20,
                                            height: 20,
                                            borderRadius: 10,
                                            backgroundColor: theme.colors.accent,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            paddingHorizontal: 6,
                                        }}
                                    >
                                        <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
                                            {item.unread}
                                        </Text>
                                    </View>
                                ) : null}
                            </Pressable>
                        );
                    }}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 1, backgroundColor: theme.colors.border, marginLeft: 64 }} />
                    )}
                    ListEmptyComponent={
                        <EmptyState
                            icon="chatbubble-outline"
                            title="No messages yet"
                            subtitle="Start a chat from an artisan’s profile."
                        />
                    }
                />
            </View>
        </Screen>
    );
}
