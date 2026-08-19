import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export async function haptic(
    type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light",
) {
    if (Platform.OS === "web") return;
    try {
        if (type === "success") {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return;
        }
        if (type === "warning") {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }
        if (type === "error") {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        const style =
            type === "heavy"
                ? Haptics.ImpactFeedbackStyle.Heavy
                : type === "medium"
                  ? Haptics.ImpactFeedbackStyle.Medium
                  : Haptics.ImpactFeedbackStyle.Light;
        await Haptics.impactAsync(style);
    } catch {
        // Haptics are unavailable on some environments.
    }
}
