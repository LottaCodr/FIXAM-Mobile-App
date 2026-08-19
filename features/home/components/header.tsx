import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import { useTheme } from "@/theme/useTheme";
import { haptic } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

export function Header() {
    const { colors, spacing, typography, radius, shadow } = useTheme();
    const user = useAuthStore((s) => s.user);
    const unread = useNotificationStore((s) => s.unreadCount());
    const router = useRouter();

    return (
        <View
            style={{
                paddingHorizontal: spacing[4],
                paddingTop: spacing[3],
                paddingBottom: spacing[4],
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Pressable
                onPress={() => router.push("/(tabs)/profile")}
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
                <Avatar uri={user?.avatar} name={user?.name} size={46} />
                <View style={{ marginLeft: spacing[3], flex: 1 }}>
                    <Text style={{ ...typography.caption, color: colors.textMuted }}>
                        {greeting()}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{ ...typography.h3, color: colors.textPrimary }}
                    >
                        Hi, {user?.firstName ?? "there"} 👋
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 2,
                            gap: 4,
                        }}
                    >
                        <Ionicons name="location" size={12} color={colors.primary} />
                        <Text
                            numberOfLines={1}
                            style={{ ...typography.caption, color: colors.textSecondary }}
                        >
                            {user?.location ?? "Set your location"}
                        </Text>
                    </View>
                </View>
            </Pressable>

            <Pressable
                accessibilityLabel="Notifications"
                onPress={() => {
                    void haptic("light");
                    router.push("/notifications");
                }}
                style={({ pressed }) => ({
                    width: 44,
                    height: 44,
                    borderRadius: radius.full,
                    backgroundColor: colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: colors.border,
                    opacity: pressed ? 0.8 : 1,
                    ...shadow.sm,
                })}
            >
                <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
                {unread > 0 ? (
                    <View
                        style={{
                            position: "absolute",
                            top: 8,
                            right: 9,
                            width: 9,
                            height: 9,
                            borderRadius: 5,
                            backgroundColor: colors.accent,
                            borderWidth: 1.5,
                            borderColor: colors.surface,
                        }}
                    />
                ) : null}
            </Pressable>
        </View>
    );
}
