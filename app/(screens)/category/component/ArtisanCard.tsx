import { useTheme } from "@/theme/ThemeProvider";
import { Image, Pressable, Text, View } from "react-native";

type Artisan = {
    id: string;
    name: string;
    skill: string;
    rating: number;
    distance: number;
    price: number;
    avatar: string;
};

export function ArtisanCard({ artisan }: { artisan: Artisan }) {
    const theme = useTheme();

    return (
        <Pressable
            style={{
                flexDirection: "row",
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                padding: theme.spacing[4],
                marginBottom: theme.spacing[3],
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            <Image
                source={{ uri: artisan.avatar }}
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: theme.radius.full,
                    marginRight: theme.spacing[3],
                }}
            />

            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        // fontSize: theme.typography.caption,
                        // fontWeight: theme.typography.caption,
                        // color: theme.colors.textPrimary,
                    }}
                >
                    {artisan.name}
                </Text>

                <Text
                    style={{
                        // fontSize: theme.typography.caption,
                        // color: theme.colors.textSecondary,
                        // marginTop: theme.spacing[1],
                    }}
                >
                    {artisan.skill}
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        marginTop: theme.spacing[2],
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={{ color: theme.colors.textMuted }}>
                        ⭐ {artisan.rating}
                    </Text>

                    <Text style={{ color: theme.colors.textMuted }}>
                        {artisan.distance} km
                    </Text>

                    <Text
                        style={{
                            // color: theme.colors.primary,
                            // fontWeight: theme.typography.caption,
                        }}
                    >
                        ₦{artisan.price}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
