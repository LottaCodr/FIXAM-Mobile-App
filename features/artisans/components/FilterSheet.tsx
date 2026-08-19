import { AppButton } from "@/components/ui/buttons";
import { useArtisanStore } from "@/store/artisan.store";
import { useTheme } from "@/theme/useTheme";
import { Pressable, Text, View } from "react-native";

const DISTANCES = [2, 5, 10];
const RATINGS = [4, 4.5, 4.8];

export function FilterSheet({ onClose }: { onClose: () => void }) {
    const { spacing, colors, radius, typography } = useTheme();
    const filters = useArtisanStore((s) => s.filters);
    const setFilters = useArtisanStore((s) => s.setFilters);
    const resetFilters = useArtisanStore((s) => s.resetFilters);

    return (
        <View
            style={{
                backgroundColor: colors.surface,
                padding: spacing[5],
                borderTopLeftRadius: radius.xl,
                borderTopRightRadius: radius.xl,
            }}
        >
            <View
                style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: colors.neutral[300],
                    alignSelf: "center",
                    marginBottom: spacing[4],
                }}
            />
            <Text style={{ ...typography.h3, color: colors.textPrimary }}>Filters</Text>

            <Text
                style={{
                    ...typography.captionMedium,
                    color: colors.textSecondary,
                    marginTop: spacing[5],
                    marginBottom: spacing[2],
                }}
            >
                Distance
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
                {DISTANCES.map((d) => {
                    const active = filters.maxDistance === d;
                    return (
                        <Chip
                            key={d}
                            label={`Within ${d} km`}
                            active={active}
                            onPress={() =>
                                setFilters({ maxDistance: active ? undefined : d })
                            }
                        />
                    );
                })}
            </View>

            <Text
                style={{
                    ...typography.captionMedium,
                    color: colors.textSecondary,
                    marginTop: spacing[5],
                    marginBottom: spacing[2],
                }}
            >
                Minimum rating
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
                {RATINGS.map((r) => {
                    const active = filters.minRating === r;
                    return (
                        <Chip
                            key={r}
                            label={`${r}+`}
                            active={active}
                            onPress={() =>
                                setFilters({ minRating: active ? undefined : r })
                            }
                        />
                    );
                })}
            </View>

            <Pressable
                onPress={() => setFilters({ verifiedOnly: !filters.verifiedOnly })}
                style={{
                    marginTop: spacing[5],
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: spacing[3],
                }}
            >
                <Text style={{ ...typography.body, color: colors.textPrimary }}>
                    Verified artisans only
                </Text>
                <View
                    style={{
                        width: 48,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: filters.verifiedOnly
                            ? colors.primary
                            : colors.neutral[200],
                        padding: 3,
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            backgroundColor: "#fff",
                            alignSelf: filters.verifiedOnly ? "flex-end" : "flex-start",
                        }}
                    />
                </View>
            </Pressable>

            <View style={{ flexDirection: "row", gap: 12, marginTop: spacing[5] }}>
                <View style={{ flex: 1 }}>
                    <AppButton
                        label="Reset"
                        variant="outline"
                        onPress={() => {
                            resetFilters();
                        }}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <AppButton label="Apply" onPress={onClose} />
                </View>
            </View>
        </View>
    );
}

function Chip({
    label,
    active,
    onPress,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    const { colors, radius, typography } = useTheme();
    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: radius.full,
                backgroundColor: active ? colors.primaryLight : colors.neutral[100],
                borderWidth: 1,
                borderColor: active ? colors.primary : colors.border,
            }}
        >
            <Text
                style={{
                    ...typography.captionMedium,
                    color: active ? colors.primaryDark : colors.textPrimary,
                }}
            >
                {label}
            </Text>
        </Pressable>
    );
}
