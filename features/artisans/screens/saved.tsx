import { EmptyState } from "@/components/feedback/empty.state";
import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { ARTISANS } from "@/data/mock";
import { ArtisanCard } from "@/features/artisans/components/ArtisanCard";
import { useArtisanStore } from "@/store/artisan.store";
import { useTheme } from "@/theme/useTheme";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

export default function SavedArtisansScreen() {
    const savedIds = useArtisanStore((s) => s.savedIds);
    const artisans = ARTISANS.filter((a) => savedIds.includes(a.id));
    const theme = useTheme();
    const router = useRouter();

    return (
        <Screen padded={false}>
            <AppHeader title="Saved artisans" subtitle={`${artisans.length} saved`} />
            <ScrollView contentContainerStyle={{ padding: theme.spacing[4], flexGrow: 1 }}>
                {artisans.length === 0 ? (
                    <EmptyState
                        icon="heart-outline"
                        title="Nothing saved yet"
                        subtitle="Tap the heart on a profile to keep them handy."
                        actionLabel="Browse categories"
                        onAction={() => router.push("/categories")}
                    />
                ) : (
                    artisans.map((a) => <ArtisanCard key={a.id} artisan={a} />)
                )}
            </ScrollView>
        </Screen>
    );
}
