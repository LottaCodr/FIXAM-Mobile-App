import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="jobs"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="briefcase-outline" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="chatbubble-outline" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-outline" size={22} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
