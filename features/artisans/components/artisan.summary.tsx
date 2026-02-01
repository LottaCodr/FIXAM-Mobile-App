import { useTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';

export default function ArtisanSummary() {
    const theme = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                gap: theme.spacing[4],
                marginBottom: theme.spacing[6],
            }}
        >
            <Image
                source={{ uri: "https://randomuser.me/api/portraits/men/75.jpg" }}
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: theme.radius.lg
                }} 
            />
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text
                        style={{
                            fontSize: theme.typography.h3?.fontSize ?? 20,
                            fontWeight: theme.typography.h3?.fontWeight ?? "bold",
                        }}
                    >
                        Lotta Repairs
                    </Text>
                    <Ionicons 
                        name='checkmark-circle' 
                        color={theme.colors.primary} 
                        size={18} 
                        style={{ marginLeft: 2 }} 
                    />
                </View>

                <Text style={{
                    color: theme.colors.textMuted
                }}>
                    Verified Plumber
                </Text>

                <Text style={{ marginTop: 4 }}>
                    ⭐ 4.8 (124 reviews)
                </Text>
            </View>
        </View>
    )
}