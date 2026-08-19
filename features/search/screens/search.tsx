import { EmptyState } from "@/components/feedback/empty.state";
import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { SERVICE_CATEGORIES } from "@/constants/service.categories";
import { ARTISANS } from "@/data/mock";
import { ArtisanCard } from "@/features/artisans/components/ArtisanCard";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function SearchScreen() {
    const theme = useTheme();
    const [query, setQuery] = useState("");
    const router = useRouter();
    const q = query.trim().toLowerCase();

    const categories = useMemo(
        () =>
            SERVICE_CATEGORIES.filter(
                (c) => !q || c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q),
            ),
        [q],
    );

    const artisans = useMemo(
        () =>
            ARTISANS.filter(
                (a) =>
                    !q ||
                    a.name.toLowerCase().includes(q) ||
                    a.skill.toLowerCase().includes(q) ||
                    a.categoryId.includes(q) ||
                    a.location.toLowerCase().includes(q),
            ),
        [q],
    );

    return (
        <Screen padded={false}>
            <AppHeader title="Search" />
            <View style={{ paddingHorizontal: theme.spacing[4], flex: 1 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.md,
                        borderWidth: 1.5,
                        borderColor: theme.colors.primary,
                        paddingHorizontal: theme.spacing[3],
                        height: 50,
                        marginTop: theme.spacing[3],
                        marginBottom: theme.spacing[4],
                    }}
                >
                    <Ionicons name="search" size={18} color={theme.colors.textMuted} />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Try “plumber”, “AC”, “Lekki”…"
                        placeholderTextColor={theme.colors.textMuted}
                        autoFocus
                        style={{
                            flex: 1,
                            marginLeft: 8,
                            ...theme.typography.body,
                            color: theme.colors.textPrimary,
                        }}
                    />
                    {query ? (
                        <Pressable onPress={() => setQuery("")} hitSlop={8}>
                            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
                        </Pressable>
                    ) : null}
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    <Text style={{ ...theme.typography.overline, color: theme.colors.textMuted }}>
                        Categories
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10, marginBottom: 20 }}>
                        {categories.map((c) => (
                            <Pressable
                                key={c.id}
                                onPress={() => router.push(`/category/${c.id}`)}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 6,
                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    borderRadius: 999,
                                    backgroundColor: c.soft,
                                }}
                            >
                                <Ionicons name={c.icon} size={14} color={c.color} />
                                <Text style={{ fontWeight: "600", color: theme.colors.textPrimary, fontSize: 13 }}>
                                    {c.title}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={{ ...theme.typography.overline, color: theme.colors.textMuted, marginBottom: 10 }}>
                        Artisans
                    </Text>
                    {artisans.length === 0 ? (
                        <EmptyState
                            icon="search-outline"
                            title="No matches"
                            subtitle="Try a different name, trade or area."
                        />
                    ) : (
                        artisans.slice(0, 8).map((a) => <ArtisanCard key={a.id} artisan={a} />)
                    )}
                </ScrollView>
            </View>
        </Screen>
    );
}
