import { EmptyState } from "@/components/feedback/empty.state";
import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { Loader } from "@/components/ui/loader";
import { getCategory } from "@/constants/service.categories";
import { ArtisanCard } from "@/features/artisans/components/ArtisanCard";
import { FilterPills } from "@/features/artisans/components/FilterPills";
import { FilterSheet } from "@/features/artisans/components/FilterSheet";
import { useArtisanStore } from "@/store/artisan.store";
import { useTheme } from "@/theme/useTheme";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, View } from "react-native";

export default function CategoryArtisansScreen() {
    const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
    const id = Array.isArray(categoryId) ? categoryId[0] : categoryId;
    const category = getCategory(id ?? "");
    const theme = useTheme();
    const [sheet, setSheet] = useState(false);

    const artisans = useArtisanStore((s) => s.artisans);
    const loading = useArtisanStore((s) => s.loading);
    const filters = useArtisanStore((s) => s.filters);
    const setFilters = useArtisanStore((s) => s.setFilters);
    const fetchArtisans = useArtisanStore((s) => s.fetchArtisans);

    useEffect(() => {
        void fetchArtisans(id);
    }, [id, filters, fetchArtisans]);

    const filterCount = useMemo(() => {
        let n = 0;
        if (filters.maxDistance) n += 1;
        if (filters.minRating) n += 1;
        if (filters.verifiedOnly) n += 1;
        return n;
    }, [filters]);

    return (
        <Screen padded={false}>
            <AppHeader
                title={category?.title ?? "Artisans"}
                subtitle={`${artisans.length} available nearby`}
            />
            <View style={{ flex: 1, paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[3] }}>
                <FilterPills
                    sort={filters.sort}
                    onSort={(sort) => setFilters({ sort })}
                    onOpenFilters={() => setSheet(true)}
                    activeFilterCount={filterCount}
                />
                {loading && artisans.length === 0 ? (
                    <Loader label="Finding artisans nearby…" />
                ) : (
                    <FlatList
                        data={artisans}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: theme.spacing[10] }}
                        renderItem={({ item }) => <ArtisanCard artisan={item} />}
                        ListEmptyComponent={
                            <EmptyState
                                icon="search-outline"
                                title="No artisans match"
                                subtitle="Try widening the distance or clearing filters."
                                actionLabel="Clear filters"
                                onAction={() => useArtisanStore.getState().resetFilters()}
                            />
                        }
                    />
                )}
            </View>

            <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
                <Pressable
                    onPress={() => setSheet(false)}
                    style={{ flex: 1, backgroundColor: theme.colors.overlay, justifyContent: "flex-end" }}
                >
                    <Pressable onPress={() => undefined}>
                        <FilterSheet onClose={() => setSheet(false)} />
                    </Pressable>
                </Pressable>
            </Modal>
        </Screen>
    );
}
