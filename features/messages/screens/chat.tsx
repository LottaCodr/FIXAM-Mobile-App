import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { Avatar } from "@/components/ui/avatar";
import { QUICK_REPLIES, getArtisan } from "@/data/mock";
import { useMessageStore } from "@/store/message.store";
import { useTheme } from "@/theme/useTheme";
import { formatTime } from "@/utils/format.date";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const conversationId = Array.isArray(id) ? id[0] : id;
    const conversation = useMessageStore((s) =>
        s.conversations.find((c) => c.id === conversationId),
    );
    const messages = useMessageStore((s) => s.messagesFor(conversationId ?? ""));
    const sendMessage = useMessageStore((s) => s.sendMessage);
    const markRead = useMessageStore((s) => s.markRead);
    const artisan = conversation ? getArtisan(conversation.artisanId) : undefined;
    const theme = useTheme();
    const router = useRouter();
    const [text, setText] = useState("");
    const listRef = useRef<FlatList>(null);

    useEffect(() => {
        if (conversationId) markRead(conversationId);
    }, [conversationId, markRead]);

    if (!conversation || !artisan) {
        return (
            <Screen padded={false}>
                <AppHeader title="Chat" />
                <View style={{ padding: 24 }}>
                    <Text>Conversation not found.</Text>
                </View>
            </Screen>
        );
    }

    const send = (value?: string) => {
        const payload = (value ?? text).trim();
        if (!payload) return;
        sendMessage(conversation.id, payload);
        setText("");
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    };

    return (
        <Screen padded={false} edges={["top"]}>
            <AppHeader
                title={artisan.name}
                subtitle={artisan.online ? "Online" : artisan.skill}
                right={
                    <Pressable onPress={() => router.push(`/artisan/${artisan.id}`)}>
                        <Avatar uri={artisan.avatar} name={artisan.name} size={34} online={artisan.online} />
                    </Pressable>
                }
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={8}
            >
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        padding: theme.spacing[4],
                        paddingBottom: theme.spacing[2],
                    }}
                    onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                    renderItem={({ item }) => {
                        const mine = item.from === "user";
                        return (
                            <View
                                style={{
                                    alignSelf: mine ? "flex-end" : "flex-start",
                                    maxWidth: "80%",
                                    backgroundColor: mine ? theme.colors.primary : theme.colors.surface,
                                    paddingHorizontal: 14,
                                    paddingVertical: 10,
                                    borderRadius: 16,
                                    borderBottomRightRadius: mine ? 4 : 16,
                                    borderBottomLeftRadius: mine ? 16 : 4,
                                    marginBottom: 10,
                                    borderWidth: mine ? 0 : 1,
                                    borderColor: theme.colors.border,
                                }}
                            >
                                <Text
                                    style={{
                                        color: mine ? "#fff" : theme.colors.textPrimary,
                                        lineHeight: 20,
                                    }}
                                >
                                    {item.text}
                                </Text>
                                <Text
                                    style={{
                                        color: mine ? "rgba(255,255,255,0.7)" : theme.colors.textMuted,
                                        fontSize: 10,
                                        marginTop: 4,
                                        alignSelf: "flex-end",
                                    }}
                                >
                                    {formatTime(item.createdAt)}
                                </Text>
                            </View>
                        );
                    }}
                />

                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                        paddingHorizontal: theme.spacing[4],
                        paddingBottom: 8,
                    }}
                >
                    {QUICK_REPLIES.map((q) => (
                        <Pressable
                            key={q}
                            onPress={() => send(q)}
                            style={{
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 999,
                                backgroundColor: theme.colors.primaryLight,
                            }}
                        >
                            <Text style={{ color: theme.colors.primaryDark, fontSize: 12, fontWeight: "600" }}>
                                {q}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: theme.spacing[4],
                        paddingBottom: theme.spacing[4],
                        gap: 8,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            minHeight: 48,
                            borderRadius: 24,
                            backgroundColor: theme.colors.surface,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            paddingHorizontal: 16,
                            justifyContent: "center",
                        }}
                    >
                        <TextInput
                            value={text}
                            onChangeText={setText}
                            placeholder="Message…"
                            placeholderTextColor={theme.colors.textMuted}
                            onSubmitEditing={() => send()}
                            style={{
                                ...theme.typography.body,
                                color: theme.colors.textPrimary,
                                paddingVertical: 10,
                            }}
                        />
                    </View>
                    <Pressable
                        onPress={() => send()}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: theme.colors.primary,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons name="send" size={18} color="#fff" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
}
