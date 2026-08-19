import { useTheme } from "@/theme/useTheme";
import type { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    children: ReactNode;
    padded?: boolean;
    edges?: ("top" | "right" | "bottom" | "left")[];
    background?: string;
};

export function Screen({
    children,
    padded = true,
    edges = ["top"],
    background,
}: Props) {
    const { spacing, colors } = useTheme();

    return (
        <SafeAreaView
            edges={edges}
            style={{ flex: 1, backgroundColor: background ?? colors.background }}
        >
            <View
                style={{
                    flex: 1,
                    padding: padded ? spacing[4] : 0,
                }}
            >
                {children}
            </View>
        </SafeAreaView>
    );
}
