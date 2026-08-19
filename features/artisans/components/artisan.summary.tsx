import { Avatar } from "@/components/ui/avatar";
import type { Artisan } from "@/features/artisans/types";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function ArtisanSummary({ artisan }: { artisan: Artisan }) {
    const theme = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                gap: theme.spacing[4],
                marginBottom: theme.spacing[6],
            }}
        >
            <Avatar uri={artisan.avatar} name={artisan.name} size={64} online={artisan.online} />
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={{ ...theme.typography.h3 }}>{artisan.name}</Text>
                    {artisan.verified ? (
                        <Ionicons name="checkmark-circle" color={theme.colors.primary} size={18} />
                    ) : null}
                </View>
                <Text style={{ color: theme.colors.textMuted }}>{artisan.skill}</Text>
                <Text style={{ marginTop: 4 }}>
                    ★ {artisan.rating.toFixed(1)} ({artisan.reviewCount} reviews)
                </Text>
            </View>
        </View>
    );
}
