import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { SERVICE_CATEGORIES } from "@/constants/service.categories";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function CategoriesScreen() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <Screen padded={false}>
            <AppHeader title="All services" subtitle="What do you need help with?" />
            <ScrollView contentContainerStyle={{ padding: theme.spacing[4] }}>
                {SERVICE_CATEGORIES.map((c) => (
                    <Pressable
                        key={c.id}
                        onPress={() => router.push(`/category/${c.id}`)}
                        style={({ pressed }) => ({
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: theme.colors.surface,
                            borderRadius: theme.radius.lg,
                            padding: theme.spacing[4],
                            marginBottom: theme.spacing[3],
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            opacity: pressed ? 0.9 : 1,
                        })}
                    >
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                backgroundColor: c.soft,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 14,
                            }}
                        >
                            <Ionicons name={c.icon} size={22} color={c.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ ...theme.typography.bodyMedium }}>{c.title}</Text>
                            <Text style={{ color: theme.colors.textMuted, marginTop: 2 }}>{c.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                    </Pressable>
                ))}
            </ScrollView>
        </Screen>
    );
}
