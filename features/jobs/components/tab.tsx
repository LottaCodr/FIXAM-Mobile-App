import { useTheme } from '@/theme/ThemeProvider';
import React from 'react';
import { Pressable, Text } from 'react-native';

export default function Tab({ label, active, onPress }: any) {
    const theme = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: theme.spacing[3],
                borderBottomWidth: 2,
                borderBottomColor: active
                    ? theme.colors.primary
                    : theme.colors.border,
            }}
        >
            <Text
                style={{
                    color: active
                        ? theme.colors.primary
                        : theme.colors.textMuted,
                    fontWeight: theme.typography.button.fontWeight,
                    fontSize: theme.typography.button.fontSize,
                }}
            >
                {label}
            </Text>
        </Pressable>
    );
}