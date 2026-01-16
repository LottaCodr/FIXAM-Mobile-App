import { Screen } from '@/components/layout/Screen'
import { useTheme } from '@/theme/ThemeProvider'
import { colors } from '@/theme/tokens/color'
import { Categories } from '@/utils/data'
import React from 'react'
import { FlatList, ScrollView, Text, View } from 'react-native'
import { ActiveJobCard } from './components/ActiveJobCard'
import { CategoryCard } from './components/CategoryCard'
import { Header } from './components/header'
import { ReferCard } from './components/ReferCard'
import { SearchBar } from './components/SearchBar'

export default function HomeScreen() {
    const { spacing } = useTheme()
    return (
        <Screen padded={false}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: spacing[2] }}
            >
                <Header />

                <View style={{ paddingHorizontal: spacing[4] }}>
                    <SearchBar />
                    <ActiveJobCard />

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginVertical: spacing[8],
                        }}
                    >
                        <Text
                            style={{
                                fontSize: spacing[4], // or use typography.fontSize.lg if available from useTheme
                                fontWeight: 'bold',
                                color: '#222',
                            }}
                        >
                            Categories
                        </Text>
                        <Text
                            style={{
                                fontSize: spacing[3], // or use typography.fontSize.md if available
                                fontWeight: '500',
                                color: colors.textPrimary
                            }}
                        >
                            See All
                        </Text>
                    </View>

                    <FlatList
                        data={Categories}
                        renderItem={({ item }) => <CategoryCard {...item} />}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: "space-between" }}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />

                    <ReferCard />
                </View>
            </ScrollView>

        </Screen>

    )
}