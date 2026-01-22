import { Screen } from "@/components/layout/Screen";
import { useTheme } from "@/theme/ThemeProvider";
import { useLocalSearchParams } from "expo-router";
import { FlatList, ScrollView, View } from "react-native";
import { ArtisanCard } from "./component/ArtisanCard";
import { FilterPills } from "./component/FilterPills";


const MOCK_ARTISANS = [
    {
        id: "1",
        name: "John Okeke",
        skill: "Plumber",
        rating: 4.8,
        distance: 2.4, // km
        price: 5000,
        avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
        id: "2",
        name: "Aisha Bello",
        skill: "Electrician",
        rating: 4.5,
        distance: 5.1,
        price: 7000,
        avatar: "https://i.pravatar.cc/150?img=5",
    },
];

export default function CategoryArtisansScreen() {
    const { category } = useLocalSearchParams<{ category?: string }>();
    const theme = useTheme();

    const categorySlug = Array.isArray(category)
        ? category[0]
        : category;

    return (
        <Screen padded={false}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: theme.spacing[2] }}
            >


                <View
                    style={{
                        flex: 1,
                        backgroundColor: theme.colors.background,
                        paddingHorizontal: theme.spacing[4],
                        paddingTop: theme.spacing[4],
                    }}
                >
                    {/* Filter Pills */}
                    <FilterPills />

                    {/* Artisan List */}
                    <FlatList
                        data={MOCK_ARTISANS}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
                        renderItem={({ item }) => (
                            <ArtisanCard artisan={item} />
                        )}
                    />
                </View>
            </ScrollView>
        </Screen>
    );
}
