import {
    INITIAL_CONVERSATIONS,
    INITIAL_MESSAGES,
    type ChatMessage,
    type Conversation,
} from "@/data/mock";
import { create } from "zustand";

type MessageState = {
    conversations: Conversation[];
    messages: ChatMessage[];

    getConversation: (id: string) => Conversation | undefined;
    messagesFor: (conversationId: string) => ChatMessage[];
    unreadCount: () => number;
    markRead: (conversationId: string) => void;
    sendMessage: (conversationId: string, text: string) => void;
    ensureConversation: (artisanId: string) => string;
};

export const useMessageStore = create<MessageState>((set, get) => ({
    conversations: INITIAL_CONVERSATIONS,
    messages: INITIAL_MESSAGES,

    getConversation: (id) => get().conversations.find((c) => c.id === id),

    messagesFor: (conversationId) =>
        get()
            .messages.filter((m) => m.conversationId === conversationId)
            .sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            ),

    unreadCount: () => get().conversations.reduce((sum, c) => sum + c.unread, 0),

    markRead: (conversationId) =>
        set((state) => ({
            conversations: state.conversations.map((c) =>
                c.id === conversationId ? { ...c, unread: 0 } : c,
            ),
        })),

    sendMessage: (conversationId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const msg: ChatMessage = {
            id: `m-${Date.now()}`,
            conversationId,
            from: "user",
            text: trimmed,
            createdAt: new Date().toISOString(),
        };
        set((state) => ({
            messages: [...state.messages, msg],
            conversations: state.conversations.map((c) =>
                c.id === conversationId
                    ? { ...c, lastMessage: trimmed, lastAt: msg.createdAt, unread: 0 }
                    : c,
            ),
        }));
    },

    ensureConversation: (artisanId) => {
        const existing = get().conversations.find((c) => c.artisanId === artisanId);
        if (existing) return existing.id;
        const id = `c-${artisanId}`;
        const convo: Conversation = {
            id,
            artisanId,
            lastMessage: "New conversation",
            lastAt: new Date().toISOString(),
            unread: 0,
        };
        set((state) => ({ conversations: [convo, ...state.conversations] }));
        return id;
    },
}));
