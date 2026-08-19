import { INITIAL_NOTIFICATIONS, type AppNotification } from "@/data/mock";
import { create } from "zustand";

type NotificationState = {
    items: AppNotification[];
    unreadCount: () => number;
    markAllRead: () => void;
    markRead: (id: string) => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
    items: INITIAL_NOTIFICATIONS,
    unreadCount: () => get().items.filter((n) => !n.read).length,
    markAllRead: () =>
        set((state) => ({
            items: state.items.map((n) => ({ ...n, read: true })),
        })),
    markRead: (id) =>
        set((state) => ({
            items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
}));
