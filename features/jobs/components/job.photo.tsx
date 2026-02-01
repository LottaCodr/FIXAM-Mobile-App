import { useTheme } from '@/theme/ThemeProvider';
import React from 'react';
import { Image } from 'react-native';

export default function JobPhoto({ uri }: { uri: string }) {
    const theme = useTheme();

    return (
        <Image
            source={{ uri }}
            style={{
                width: 100,
                height: 80,
                borderRadius: theme.radius.md
            }}

        />

    )
}