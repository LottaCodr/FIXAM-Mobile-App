import { create } from "zustand";

export interface User {
    id: string;
    name: string;
    email: string
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    login: (payload: {
        user: null;
        accessToken: null,
        refreshToken: null,
    }) => void;

    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,

    login: ({ user, accessToken, refreshToken }) =>
        set(() => ({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
        })),

    logout: () =>
        set(() => ({
            use: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        })),
}));