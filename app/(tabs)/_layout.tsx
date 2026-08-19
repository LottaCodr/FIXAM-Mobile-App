import { BottomTabBar } from "@/components/navigation/bottom.tabbar";
import { useMessageStore } from "@/store/message.store";
import { useTheme } from "@/theme/useTheme";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    const { colors } = useTheme();
    const unread = useMessageStore((s) => s.unreadCount());

    return (
        <Tabs
            tabBar={(props) => <BottomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.neutral[400],
            }}
        >
            <Tabs.Screen name="home" options={{ title: "Home" }} />
            <Tabs.Screen name="jobs" options={{ title: "Jobs" }} />
            <Tabs.Screen
                name="messages"
                options={{
                    title: "Messages",
                    tabBarBadge: unread > 0 ? unread : undefined,
                }}
            />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
}
