import type { SortKey } from "@/store/artisan.store";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text } from "react-native";

const SORTS: { key: SortKey; label: string }[] = [
    { key: "distance", label: "Nearest" },
    { key: "rating", label: "Top rated" },
    { key: "price", label: "Price" },
];

type Props = {
    sort: SortKey;
    onSort: (key: SortKey) => void;
    onOpenFilters: () => void;
    activeFilterCount: number;
};

export function FilterPills({ sort, onSort, onOpenFilters, activeFilterCount }: Props) {
    const theme = useTheme();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                gap: theme.spacing[2],
                paddingBottom: theme.spacing[3],
            }}
        >
            <Pressable
                onPress={onOpenFilters}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingVertical: 8,
                    paddingHorizontal: theme.spacing[3],
                    backgroundColor:
                        activeFilterCount > 0 ? theme.colors.primary : theme.colors.surface,
                    borderRadius: theme.radius.full,
                    borderWidth: 1,
                    borderColor:
                        activeFilterCount > 0 ? theme.colors.primary : theme.colors.border,
                }}
            >
                <Ionicons
                    name="options-outline"
                    size={14}
                    color={activeFilterCount > 0 ? "#fff" : theme.colors.textPrimary}
                />
                <Text
                    style={{
                        ...theme.typography.captionMedium,
                        color: activeFilterCount > 0 ? "#fff" : theme.colors.textPrimary,
                    }}
                >
                    Filters{activeFilterCount ? ` · ${activeFilterCount}` : ""}
                </Text>
            </Pressable>
            {SORTS.map((item) => {
                const active = sort === item.key;
                return (
                    <Pressable
                        key={item.key}
                        onPress={() => onSort(item.key)}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: theme.spacing[4],
                            backgroundColor: active
                                ? theme.colors.primaryLight
                                : theme.colors.surface,
                            borderRadius: theme.radius.full,
                            borderWidth: 1,
                            borderColor: active ? theme.colors.primary : theme.colors.border,
                        }}
                    >
                        <Text
                            style={{
                                ...theme.typography.captionMedium,
                                color: active
                                    ? theme.colors.primaryDark
                                    : theme.colors.textPrimary,
                            }}
                        >
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}
