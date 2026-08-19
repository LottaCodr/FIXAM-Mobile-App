import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ToastHost() {
    const toast = useUIStore((s) => s.toast);
    const clearToast = useUIStore((s) => s.clearToast);
    const { colors, spacing, radius, typography, shadow } = useTheme();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(clearToast, 2800);
        return () => clearTimeout(t);
    }, [toast, clearToast]);

    if (!toast) return null;

    const bg =
        toast.kind === "success"
            ? colors.primaryDark
            : toast.kind === "error"
              ? colors.error
              : colors.neutral[800];
    const icon =
        toast.kind === "success"
            ? "checkmark-circle"
            : toast.kind === "error"
              ? "alert-circle"
              : "information-circle";

    return (
        <View
            pointerEvents="box-none"
            style={{
                position: "absolute",
                left: spacing[4],
                right: spacing[4],
                top: insets.top + 8,
                zIndex: 50,
            }}
        >
            <Pressable
                onPress={clearToast}
                style={{
                    backgroundColor: bg,
                    borderRadius: radius.md,
                    paddingVertical: spacing[3],
                    paddingHorizontal: spacing[4],
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing[2],
                    ...shadow.md,
                }}
            >
                <Ionicons name={icon} size={18} color="#fff" />
                <Text
                    style={{
                        ...typography.bodyMedium,
                        color: "#fff",
                        flex: 1,
                    }}
                >
                    {toast.message}
                </Text>
            </Pressable>
        </View>
    );
}
