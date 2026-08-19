import { Screen } from "@/components/layout/Screen";
import { SERVICE_CATEGORIES } from "@/constants/service.categories";
import { ActiveJobCard } from "@/features/home/components/ActiveJobCard";
import { ArtisanRail } from "@/features/home/components/ArtisanRail";
import { CategoryCard } from "@/features/home/components/CategoryCard";
import { Header } from "@/features/home/components/header";
import { ReferCard } from "@/features/home/components/ReferCard";
import { SearchBar } from "@/features/home/components/SearchBar";
import { isActiveJob, useJobStore } from "@/store/job.store";
import { useTheme } from "@/theme/useTheme";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
    const { spacing, typography, colors } = useTheme();
    const jobs = useJobStore((s) => s.jobs);
    const active = jobs.find(isActiveJob);
    const router = useRouter();

    return (
        <Screen padded={false}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: spacing[10] }}
            >
                <Header />

                <View style={{ paddingHorizontal: spacing[4] }}>
                    <SearchBar />
                    {active ? <ActiveJobCard job={active} /> : null}

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: spacing[6],
                            marginBottom: spacing[3],
                        }}
                    >
                        <Text style={{ ...typography.h3, color: colors.textPrimary }}>
                            Categories
                        </Text>
                        <Pressable onPress={() => router.push("/categories")}>
                            <Text style={{ ...typography.captionMedium, color: colors.primary }}>
                                See all
                            </Text>
                        </Pressable>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                    >
                        {SERVICE_CATEGORIES.map((item) => (
                            <CategoryCard key={item.id} {...item} />
                        ))}
                    </View>

                    <ArtisanRail />
                    <ReferCard />
                </View>
            </ScrollView>
        </Screen>
    );
}
