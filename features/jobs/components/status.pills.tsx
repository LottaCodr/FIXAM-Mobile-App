import { useTheme } from '@/theme/ThemeProvider'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

export default function StatusPills() {
    const theme = useTheme()

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: theme.colors.primaryLight,
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[2],
                borderRadius: theme.radius.full
            }}
        >
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>Completed</Text>
        </View>
    )
}