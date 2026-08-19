import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

type ToastKind = "success" | "error" | "info";

type Toast = {
    message: string;
    kind: ToastKind;
};

type UIState = {
    loading: boolean;
    toast: Toast | null;
    mode: ThemeMode;

    showLoading: () => void;
    hideLoading: () => void;
    showToast: (message: string, kind?: ToastKind) => void;
    clearToast: () => void;
    setMode: (mode: ThemeMode) => void;
};

export const useUIStore = create<UIState>((set) => ({
    loading: false,
    toast: null,
    mode: "light",

    showLoading: () => set({ loading: true }),
    hideLoading: () => set({ loading: false }),
    showToast: (message, kind = "info") => set({ toast: { message, kind } }),
    clearToast: () => set({ toast: null }),
    setMode: (mode) => set({ mode }),
}));

export const useThemStore = useUIStore;
