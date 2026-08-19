import { Avatar } from "@/components/ui/avatar";
import { ARTISANS } from "@/data/mock";
import { useTheme } from "@/theme/useTheme";
import { formatNaira } from "@/utils/format.currency";
import { formatDistance } from "@/utils/format.location";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export function ArtisanRail() {
    const { colors, spacing, radius, typography, shadow } = useTheme();
    const router = useRouter();
    const featured = [...ARTISANS]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);

    return (
        <View style={{ marginTop: spacing[2] }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: spacing[3],
                }}
            >
                <Text style={{ ...typography.h3, color: colors.textPrimary }}>
                    Top nearby
                </Text>
                <Pressable onPress={() => router.push("/categories")}>
                    <Text style={{ ...typography.captionMedium, color: colors.primary }}>
                        Browse
                    </Text>
                </Pressable>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: spacing[3], paddingRight: spacing[2] }}
            >
                {featured.map((artisan) => (
                    <Pressable
                        key={artisan.id}
                        onPress={() => router.push(`/artisan/${artisan.id}`)}
                        style={({ pressed }) => ({
                            width: 168,
                            backgroundColor: colors.surface,
                            borderRadius: radius.lg,
                            padding: spacing[3],
                            borderWidth: 1,
                            borderColor: colors.border,
                            opacity: pressed ? 0.9 : 1,
                            ...shadow.sm,
                        })}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Avatar
                                uri={artisan.avatar}
                                name={artisan.name}
                                size={40}
                                online={artisan.online}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    numberOfLines={1}
                                    style={{ ...typography.captionMedium, color: colors.textPrimary }}
                                >
                                    {artisan.name.split(" ")[0]}
                                </Text>
                                <Text
                                    numberOfLines={1}
                                    style={{ ...typography.tiny, color: colors.textMuted }}
                                >
                                    {artisan.skill}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: spacing[3],
                            }}
                        >
                            <Text style={{ ...typography.caption, color: colors.warning }}>
                                ★ {artisan.rating.toFixed(1)}
                            </Text>
                            <Text style={{ ...typography.caption, color: colors.textMuted }}>
                                {formatDistance(artisan.distance)}
                            </Text>
                        </View>
                        <Text
                            style={{
                                ...typography.captionMedium,
                                color: colors.primary,
                                marginTop: spacing[2],
                            }}
                        >
                            from {formatNaira(artisan.price)}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
