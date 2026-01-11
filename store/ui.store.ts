import { create } from 'zustand';

export type ThemeMode = "light" | "dark" | "system"

interface ThemeState {
    mode: ThemeMode;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
}

export const useThemStore = create<ThemeState>((set) => ({
    mode: "system",
    isDark: false,

    setMode: (mode) =>
        set(() => ({
            mode,
            isDark: mode === "dark"
        }))
}))


type UIState = {
    loading: boolean;
    toast: string | null

    showLoading: () => void;
    hideLoading: () => void;
    showToast: (message: string) => void;
    clearToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    loading: false,
    toast: null,

    showLoading: () => set({ loading: true }),
    hideLoading: () => set({ loading: false }),

    showToast: (message) => set({ toast: message }),
    clearToast: () => set({ toast: null })
}))