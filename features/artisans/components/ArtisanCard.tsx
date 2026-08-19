import { Avatar } from "@/components/ui/avatar";
import type { Artisan } from "@/features/artisans/types";
import { useTheme } from "@/theme/useTheme";
import { formatNaira } from "@/utils/format.currency";
import { formatDistance } from "@/utils/format.location";
import { haptic } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function ArtisanCard({ artisan }: { artisan: Artisan }) {
    const theme = useTheme();
    const router = useRouter();

    return (
        <Pressable
            onPress={() => router.push(`/artisan/${artisan.id}`)}
            style={({ pressed }) => ({
                flexDirection: "row",
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                padding: theme.spacing[4],
                marginBottom: theme.spacing[3],
                borderWidth: 1,
                borderColor: theme.colors.border,
                opacity: pressed ? 0.94 : 1,
                ...theme.shadow.sm,
            })}
        >
            <Avatar
                uri={artisan.avatar}
                name={artisan.name}
                size={58}
                online={artisan.online}
            />

            <View style={{ flex: 1, marginLeft: theme.spacing[3] }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            ...theme.typography.bodyMedium,
                            color: theme.colors.textPrimary,
                            flex: 1,
                        }}
                    >
                        {artisan.name}
                    </Text>
                    {artisan.verified ? (
                        <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={theme.colors.primary}
                        />
                    ) : null}
                </View>

                <Text
                    style={{
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        marginTop: 2,
                    }}
                >
                    {artisan.skill}
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        marginTop: theme.spacing[2],
                        alignItems: "center",
                        gap: theme.spacing[3],
                    }}
                >
                    <Text style={{ ...theme.typography.caption, color: theme.colors.warning }}>
                        ★ {artisan.rating.toFixed(1)}
                    </Text>
                    <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                        {formatDistance(artisan.distance)}
                    </Text>
                    <Text
                        style={{
                            ...theme.typography.captionMedium,
                            color: theme.colors.primary,
                            marginLeft: "auto",
                        }}
                    >
                        from {formatNaira(artisan.price)}
                    </Text>
                </View>

                <Pressable
                    onPress={(event) => {
                        event.stopPropagation();
                        void haptic("medium");
                        router.push({
                            pathname: "/job/request",
                            params: { artisanId: artisan.id },
                        });
                    }}
                    style={({ pressed }) => ({
                        marginTop: theme.spacing[3],
                        paddingVertical: 8,
                        paddingHorizontal: theme.spacing[4],
                        backgroundColor: theme.colors.primary,
                        borderRadius: theme.radius.sm,
                        alignSelf: "flex-end",
                        opacity: pressed ? 0.85 : 1,
                    })}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 13,
                        }}
                    >
                        Request
                    </Text>
                </Pressable>
            </View>
        </Pressable>
    );
}
