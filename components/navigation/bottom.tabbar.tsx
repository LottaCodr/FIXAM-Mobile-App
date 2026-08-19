import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabBarProps = {
    state: {
        index: number;
        routes: { key: string; name: string }[];
    };
    descriptors: Record<
        string,
        { options: { title?: string; tabBarBadge?: string | number } }
    >;
    // Expo Router 57 and @react-navigation/bottom-tabs disagree on ColorValue vs string.
    // Duck-type the bits we actually use.
    navigation: {
        emit: (event: Record<string, unknown>) => { defaultPrevented: boolean };
        navigate: (name: string) => void;
    };
};

const ICONS: Record<
    string,
    { idle: keyof typeof Ionicons.glyphMap; active: keyof typeof Ionicons.glyphMap }
> = {
    home: { idle: "home-outline", active: "home" },
    jobs: { idle: "briefcase-outline", active: "briefcase" },
    messages: { idle: "chatbubble-outline", active: "chatbubble" },
    profile: { idle: "person-outline", active: "person" },
};

export function BottomTabBar({ state, descriptors, navigation }: TabBarProps | any) {
    const { colors, typography, shadow } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                flexDirection: "row",
                backgroundColor: colors.surface,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 8),
                paddingTop: 8,
                ...shadow.sm,
            }}
        >
            {state.routes.map((route: { key: string; name: string }, index: number) => {
                const { options } = descriptors[route.key];
                const label = options.title ?? route.name;
                const focused = state.index === index;
                const icons = ICONS[route.name] ?? ICONS.home;
                const color = focused ? colors.primary : colors.neutral[400];

                return (
                    <Pressable
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={focused ? { selected: true } : {}}
                        onPress={() => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });
                            if (!focused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        }}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 3,
                            minHeight: 48,
                        }}
                    >
                        <View>
                            <Ionicons
                                name={focused ? icons.active : icons.idle}
                                size={22}
                                color={color}
                            />
                            {route.name === "messages" && options.tabBarBadge ? (
                                <View
                                    style={{
                                        position: "absolute",
                                        top: -4,
                                        right: -8,
                                        minWidth: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        backgroundColor: colors.accent,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        paddingHorizontal: 3,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: 9,
                                            fontWeight: "700",
                                        }}
                                    >
                                        {options.tabBarBadge}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                        <Text
                            style={{
                                ...typography.tiny,
                                color,
                                fontWeight: focused ? "700" : "500",
                            }}
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
