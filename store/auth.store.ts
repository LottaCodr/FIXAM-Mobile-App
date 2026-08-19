import { DEMO_OTP } from "@/constants/app.config";
import { DEMO_USER } from "@/data/mock";
import { confirmOtp, fetchMyProfile, requestOtp, signOutRemote, updateMyProfile } from "@/features/auth/services";
import { isBackendConfigured } from "@/lib/env";
import type { User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    hasOnboarded: boolean;
    pendingPhone: string | null;
    hydrated: boolean;
    authMode: "mock" | "supabase";

    setHydrated: (value: boolean) => void;
    completeOnboarding: () => void;
    setPendingPhone: (phone: string) => void;
    requestPhoneOtp: (phone: string) => Promise<{ ok: boolean; message?: string }>;
    verifyOtp: (code: string) => Promise<{ ok: boolean; message?: string }>;
    setSessionUser: (user: User, accessToken?: string | null, refreshToken?: string | null) => void;
    loginDemo: () => void;
    updateUser: (patch: Partial<User>) => void;
    logout: () => Promise<void>;
};

const memoryStorage = () => {
    const store = new Map<string, string>();
    return {
        getItem: (name: string) => store.get(name) ?? null,
        setItem: (name: string, value: string) => {
            store.set(name, value);
        },
        removeItem: (name: string) => {
            store.delete(name);
        },
    };
};

const storage = createJSONStorage(() => {
    if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage;
    }
    return memoryStorage();
});

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: isBackendConfigured() ? null : DEMO_USER,
            accessToken: isBackendConfigured() ? null : "demo-access",
            refreshToken: isBackendConfigured() ? null : "demo-refresh",
            isAuthenticated: !isBackendConfigured(),
            hasOnboarded: true,
            pendingPhone: null,
            hydrated: false,
            authMode: isBackendConfigured() ? "supabase" : "mock",

            setHydrated: (value) => set({ hydrated: value }),

            completeOnboarding: () => set({ hasOnboarded: true }),

            setPendingPhone: (phone) => set({ pendingPhone: phone }),

            requestPhoneOtp: async (phone) => {
                set({ pendingPhone: phone });
                if (!isBackendConfigured()) return { ok: true };
                try {
                    await requestOtp(phone);
                    return { ok: true };
                } catch (error) {
                    return { ok: false, message: (error as Error).message };
                }
            },

            verifyOtp: async (code) => {
                const cleaned = code.replace(/\s/g, "");
                if (cleaned.length < 6) {
                    return { ok: false, message: "Enter the 6-digit code." };
                }

                if (!isBackendConfigured()) {
                    if (cleaned !== DEMO_OTP && cleaned !== "000000" && !/^\d{6}$/.test(cleaned)) {
                        return { ok: false, message: "That code looks invalid." };
                    }
                    const phone = get().pendingPhone ?? DEMO_USER.phone;
                    set({
                        user: { ...DEMO_USER, phone },
                        accessToken: "demo-access",
                        refreshToken: "demo-refresh",
                        isAuthenticated: true,
                        pendingPhone: null,
                    });
                    return { ok: true };
                }

                try {
                    const user = await confirmOtp(get().pendingPhone ?? "", cleaned);
                    set({
                        user,
                        isAuthenticated: true,
                        pendingPhone: null,
                        authMode: "supabase",
                    });
                    return { ok: true };
                } catch (error) {
                    return { ok: false, message: (error as Error).message };
                }
            },

            setSessionUser: (user, accessToken, refreshToken) =>
                set({
                    user,
                    accessToken: accessToken ?? get().accessToken,
                    refreshToken: refreshToken ?? get().refreshToken,
                    isAuthenticated: true,
                    authMode: "supabase",
                }),

            loginDemo: () =>
                set({
                    user: DEMO_USER,
                    accessToken: "demo-access",
                    refreshToken: "demo-refresh",
                    isAuthenticated: true,
                    hasOnboarded: true,
                    authMode: "mock",
                }),

            updateUser: (patch) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...patch } : state.user,
                }));
                if (isBackendConfigured()) {
                    void updateMyProfile({
                        full_name: patch.name,
                        first_name: patch.firstName,
                        email: patch.email,
                        address: patch.address,
                        location: patch.location,
                        avatar_url: patch.avatar,
                    });
                }
            },

            logout: async () => {
                if (isBackendConfigured()) {
                    await signOutRemote();
                }
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    pendingPhone: null,
                });
            },
        }),
        {
            name: "fixam-auth",
            storage,
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
                hasOnboarded: state.hasOnboarded,
                authMode: state.authMode,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        },
    ),
);

export async function hydrateSupabaseSession() {
    if (!isBackendConfigured()) return;
    try {
        const user = await fetchMyProfile();
        if (user) useAuthStore.getState().setSessionUser(user);
        else if (useAuthStore.getState().authMode === "supabase") {
            useAuthStore.setState({ user: null, isAuthenticated: false });
        }
    } catch {
        // Stay on whatever persisted.
    }
}
