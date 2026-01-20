import { View, FlatList,  Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { FilterPills } from "./component/FilterPills";
import { ArtisanCard } from "./component/ArtisanCard";


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
    const { category } = useLocalSearchParams<{ category?: string}>();
    const theme = useTheme();

    const categorySlug = Array.isArray(category)
        ? category[0]
        : category;

    return (
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
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
                renderItem={({ item }) => (
                    <ArtisanCard artisan={item} />
                )}
            />
        </View>
    );
}
