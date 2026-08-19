import { AppButton } from "@/components/ui/buttons";
import { Avatar } from "@/components/ui/avatar";
import { getArtisan } from "@/data/mock";
import { useArtisanStore } from "@/store/artisan.store";
import { useMessageStore } from "@/store/message.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { formatNairaRange } from "@/utils/format.currency";
import { formatRelativeTime } from "@/utils/format.date";
import { formatDistance } from "@/utils/format.location";
import { haptic } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Image,
    Linking,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ArtisanProfileScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const artisanId = Array.isArray(id) ? id[0] : id;
    const artisan = getArtisan(artisanId ?? "");
    const theme = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const saved = useArtisanStore((s) => s.savedIds.includes(artisanId ?? ""));
    const toggleSaved = useArtisanStore((s) => s.toggleSaved);
    const ensureConversation = useMessageStore((s) => s.ensureConversation);
    const showToast = useUIStore((s) => s.showToast);

    if (!artisan) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.colors.background,
                }}
            >
                <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>
                    Artisan not found.
                </Text>
                <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
                    <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>Go back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
            >
                <View style={{ height: 240, position: "relative" }}>
                    <Image
                        source={{ uri: artisan.cover }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />
                        <View
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                backgroundColor: "rgba(0,0,0,0.28)",
                            }}
                        />
                    <View
                        style={{
                            position: "absolute",
                            top: insets.top + 8,
                            left: theme.spacing[4],
                            right: theme.spacing[4],
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <HeaderIcon
                            name="chevron-back"
                            onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/home"))}
                        />
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <HeaderIcon
                                name="share-social-outline"
                                onPress={() => showToast("Share link copied", "success")}
                            />
                            <HeaderIcon
                                name={saved ? "heart" : "heart-outline"}
                                onPress={() => {
                                    void haptic("medium");
                                    toggleSaved(artisan.id);
                                    showToast(saved ? "Removed from saved" : "Saved artisan", "success");
                                }}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ paddingHorizontal: theme.spacing[4] }}>
                    <View
                        style={{
                            backgroundColor: theme.colors.surface,
                            borderRadius: theme.radius.xl,
                            padding: theme.spacing[4],
                            marginTop: -44,
                            ...theme.shadow.md,
                        }}
                    >
                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <Avatar
                                uri={artisan.avatar}
                                name={artisan.name}
                                size={64}
                                online={artisan.online}
                            />
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Text
                                        style={{ ...theme.typography.h3, color: theme.colors.textPrimary, flex: 1 }}
                                        numberOfLines={1}
                                    >
                                        {artisan.name}
                                    </Text>
                                    {artisan.verified ? (
                                        <View
                                            style={{
                                                backgroundColor: theme.colors.successSoft,
                                                paddingHorizontal: 8,
                                                paddingVertical: 3,
                                                borderRadius: 999,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: theme.colors.success,
                                                    fontSize: 10,
                                                    fontWeight: "700",
                                                }}
                                            >
                                                VERIFIED
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                                <Text style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                                    {artisan.skill} · {formatDistance(artisan.distance)}
                                </Text>
                                <Text
                                    style={{
                                        ...theme.typography.caption,
                                        color: theme.colors.textMuted,
                                        marginTop: 2,
                                    }}
                                >
                                    {artisan.location} · replies in {artisan.responseMins}m
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: theme.spacing[4],
                            }}
                        >
                            <Stat label="Experience" value={`${artisan.yearsExp} yrs`} />
                            <Stat label="Jobs done" value={`${artisan.jobsDone}+`} />
                            <Stat label="Rating" value={`★ ${artisan.rating.toFixed(1)}`} />
                        </View>

                        <View
                            style={{
                                marginTop: theme.spacing[4],
                                backgroundColor: theme.colors.primaryLight,
                                borderRadius: theme.radius.md,
                                padding: theme.spacing[3],
                            }}
                        >
                            <Text style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
                                Typical price
                            </Text>
                            <Text style={{ ...theme.typography.h3, color: theme.colors.primaryDark }}>
                                {formatNairaRange(artisan.price, artisan.priceMax)}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                gap: 12,
                                marginTop: theme.spacing[4],
                            }}
                        >
                            <ActionButton
                                icon="call-outline"
                                label="Call"
                                onPress={() => Linking.openURL("tel:+2348030000000")}
                            />
                            <ActionButton
                                icon="chatbubble-outline"
                                label="Chat"
                                onPress={() => {
                                    const cid = ensureConversation(artisan.id);
                                    router.push(`/chat/${cid}`);
                                }}
                            />
                        </View>
                    </View>

                    <Section title={`About ${artisan.name.split(" ")[0]}`}>
                        {artisan.about}
                    </Section>

                    {artisan.portfolio.length > 0 ? (
                        <View style={{ marginTop: theme.spacing[6] }}>
                            <Text style={{ ...theme.typography.h3, marginBottom: theme.spacing[3] }}>
                                Recent work
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {artisan.portfolio.map((uri) => (
                                    <Image
                                        key={uri}
                                        source={{ uri }}
                                        style={{
                                            width: 160,
                                            height: 110,
                                            borderRadius: theme.radius.md,
                                            marginRight: theme.spacing[3],
                                            backgroundColor: theme.colors.neutral[200],
                                        }}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    ) : null}

                    <View
                        style={{
                            marginTop: theme.spacing[6],
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ ...theme.typography.h3 }}>
                            Reviews ({artisan.reviewCount})
                        </Text>
                    </View>

                    {artisan.reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            name={review.name}
                            time={formatRelativeTime(review.createdAt)}
                            rating={review.rating}
                            comment={review.comment}
                            avatar={review.avatar}
                        />
                    ))}
                </View>
            </ScrollView>

            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: theme.spacing[4],
                    paddingBottom: Math.max(insets.bottom, 16),
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                }}
            >
                <AppButton
                    label="Request this artisan"
                    variant="accent"
                    onPress={() =>
                        router.push({
                            pathname: "/job/request",
                            params: { artisanId: artisan.id },
                        })
                    }
                />
            </View>
        </View>
    );
}

function HeaderIcon({
    name,
    onPress,
}: {
    name: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                backgroundColor: "rgba(0,0,0,0.45)",
                padding: 10,
                borderRadius: 999,
            }}
        >
            <Ionicons name={name} size={20} color="#fff" />
        </Pressable>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    const theme = useTheme();
    return (
        <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={{ ...theme.typography.h4, color: theme.colors.textPrimary }}>
                {value}
            </Text>
            <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>{label}</Text>
        </View>
    );
}

function ActionButton({
    icon,
    label,
    onPress,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
}) {
    const theme = useTheme();
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                flex: 1,
                flexDirection: "row",
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: theme.colors.primaryLight,
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
            })}
        >
            <Ionicons name={icon} size={18} color={theme.colors.primary} />
            <Text style={{ fontWeight: "600", color: theme.colors.primaryDark }}>{label}</Text>
        </Pressable>
    );
}

function Section({ title, children }: { title: string; children: string }) {
    const theme = useTheme();
    return (
        <View style={{ marginTop: 24 }}>
            <Text style={{ ...theme.typography.h3, marginBottom: 8 }}>{title}</Text>
            <Text style={{ color: theme.colors.textSecondary, lineHeight: 22 }}>{children}</Text>
        </View>
    );
}

function ReviewCard({
    name,
    time,
    rating,
    comment,
    avatar,
}: {
    name: string;
    time: string;
    rating: number;
    comment: string;
    avatar: string;
}) {
    const theme = useTheme();
    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                padding: 16,
                borderRadius: theme.radius.md,
                marginTop: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Avatar uri={avatar} name={name} size={36} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700", color: theme.colors.textPrimary }}>{name}</Text>
                    <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>{time}</Text>
                </View>
                <Text style={{ color: theme.colors.warning, fontWeight: "600" }}>
                    {"★".repeat(rating)}
                </Text>
            </View>
            <Text style={{ color: theme.colors.textSecondary, marginTop: 8 }}>{comment}</Text>
        </View>
    );
}
