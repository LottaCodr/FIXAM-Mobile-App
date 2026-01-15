import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Screen } from '@/components/layout/Screen'
import { useTheme } from '@/theme/ThemeProvider'
import { Header } from './components/header'

export default function HomeScreen() {
const {spacing} = useTheme()
  return (
      <Screen padded={false}>
          <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: spacing[2] }}
          >
              <Header/>
          </ScrollView>
          
          </Screen>
              
  )
}