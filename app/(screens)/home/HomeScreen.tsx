import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Screen } from '@/components/layout/Screen'
import { useTheme } from '@/theme/ThemeProvider'
import { Header } from './components/header'
import { ReferCard } from './components/ReferCard'
import { CategoryCard } from './components/CategoryCard'
import { ActiveJobCard } from './components/ActiveJobCard'
import { SearchBar } from './SearchBar'

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
                          marginVertical: spacing.[8],
                      }}
                  >
                      <Text >Categories</Text>
                      <Text >See All</Text>
                  </View>

                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {categories.map((item) => (
                          <CategoryCard key={item.id} {...item} />
                      ))}
                  </View>

                  <ReferCard />
              </View>
          </ScrollView>
          
          </Screen>
              
  )
}