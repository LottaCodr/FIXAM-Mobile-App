import { View, Text, ScrollView, FlatList } from 'react-native'
import React from 'react'
import { Screen } from '@/components/layout/Screen'
import { useTheme } from '@/theme/ThemeProvider'
import { Header } from './components/header'
import { ReferCard } from './components/ReferCard'
import { CategoryCard } from './components/CategoryCard'
import { ActiveJobCard } from './components/ActiveJobCard'
import { SearchBar } from './components/SearchBar'
import { Categories } from '@/utils/data'

export default function HomeScreen() {
const {spacing} = useTheme()
  return (
      <Screen padded={false}>
          <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: spacing[2] }}
          >
              <Header />

              <View style={{ paddingHorizontal: spacing[8] }}>
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
                              color: '#222', // replace with colors.textPrimary if defined: colors.textPrimary,
                          }}
                      >
                          Categories
                      </Text>
                      <Text
                          style={{
                              fontSize: spacing[3], // or use typography.fontSize.md if available
                              fontWeight: '500',
                              color: '#888', // replace with colors.primary or colors.textSecondary if defined
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