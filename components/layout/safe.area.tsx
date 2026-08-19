import { useTheme } from "@/theme/useTheme";
import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function AppSafeArea({ children }: { children: ReactNode }) {
    const { colors } = useTheme();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {children}
        </SafeAreaView>
    );
}
