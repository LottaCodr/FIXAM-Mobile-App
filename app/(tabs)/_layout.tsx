import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

type TabConfig = {
    name: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon?: keyof typeof Ionicons.glyphMap;
};

const TAB_CONFIG: TabConfig[] = [
    {
        name: "home",
        title: "Home",
        icon: "home-outline",
    },
    {
        name: "jobs",
        title: "Jobs",
        icon: "briefcase-outline",
    },
    {
        name: "messages",
        title: "Messages",
        icon: "chatbubble-outline",
    },
    {
        name: "profile",
        title: "Profile",
        icon: "person-outline",
    },
];

export default function TabsLayout() {
    const { colors: theme } = useTheme();
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.neutral[400],
            tabBarStyle: {
                borderTopColor: theme.neutral[200]
            }
        }}>
            {TAB_CONFIG.map(({ name, title, icon, activeIcon }) => (
                <Tabs.Screen
                    key={name}
                    name={name}
                    options={{
                        title,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused && activeIcon ? activeIcon : icon}
                                size={22}
                                color={color}
                            />
                        ),
                    }}
                />
            ))}


        </Tabs>
    );
}
