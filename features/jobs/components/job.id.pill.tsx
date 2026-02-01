import { useTheme } from '@/theme/ThemeProvider';
import React from 'react';
import { Text, View } from 'react-native';

export default function JobIdPill() {
    const theme = useTheme();


    return (
        <View
            style={{
                backgroundColor: theme.colors.neutral[100],
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[2],
                borderRadius: theme.radius.full
            }}
        >
            <Text style={{
                color: theme.colors.textSecondary
            }}>Job ID: #FX-6786</Text>
        </View>
    )
}