import { ToastHost } from "@/components/feedback/toast";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { hydrateSupabaseSession, useAuthStore } from "@/store/auth.store";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
    useEffect(() => {
        if (Platform.OS !== "web" || typeof document === "undefined") return;
        const id = "fixam-fonts";
        if (document.getElementById(id)) return;
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
        document.head.appendChild(link);
        document.title = "FixAm";
    }, []);

    useEffect(() => {
        const unsub = useAuthStore.persist.onFinishHydration(() => {
            useAuthStore.getState().setHydrated(true);
        });
        if (useAuthStore.persist.hasHydrated()) {
            useAuthStore.getState().setHydrated(true);
        }
        void hydrateSupabaseSession();
        return unsub;
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <PhoneShell>
                        <StatusBar style="dark" />
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                animation: "slide_from_right",
                                contentStyle: { backgroundColor: "#F4F6F8" },
                            }}
                        >
                            <Stack.Screen name="index" />
                            <Stack.Screen name="(auth)" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="category" />
                            <Stack.Screen name="artisan" />
                            <Stack.Screen name="job" />
                            <Stack.Screen name="search" options={{ animation: "fade" }} />
                            <Stack.Screen name="notifications" />
                            <Stack.Screen name="chat" />
                            <Stack.Screen name="refer" />
                            <Stack.Screen name="settings" />
                            <Stack.Screen name="edit-profile" />
                            <Stack.Screen name="help" />
                            <Stack.Screen name="saved" />
                            <Stack.Screen name="categories" />
                            <Stack.Screen name="payout-account" />
                            <Stack.Screen name="privacy" />
                            <Stack.Screen name="terms" />
                            <Stack.Screen name="delete-account" />
                            <Stack.Screen name="auth" />
                            <Stack.Screen name="payment" />
                        </Stack>
                        <ToastHost />
                    </PhoneShell>
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
