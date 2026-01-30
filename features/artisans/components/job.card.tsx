import { useTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export default function JobCard({ job }: any) {
    const theme = useTheme()
    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                padding: theme.spacing[4],
                marginBottom: theme.spacing[4],
                elevation: 3,
            }}
        >
            {/* Top */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                    source={{ uri: job.image }}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: theme.radius.full,
                        marginRight: theme.spacing[3],
                    }}
                />

                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontWeight: theme.typography.h3?.fontWeight ?? "bold",
                            fontSize: theme.typography.h3?.fontSize ?? 20,
                        }}
                    >
                        {job.name}
                    </Text>

                    <Text style={{ color: theme.colors.primary }}>
                        {job.service}
                    </Text>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <Ionicons
                            name="calendar-outline"
                            size={14}
                            color={theme.colors.textMuted}
                        />
                        <Text
                            style={{
                                marginLeft: 6,
                                color: theme.colors.textMuted,
                                fontSize: theme.typography.body?.fontSize ?? 14,
                            }}
                        >
                            {job.date}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <Text
                        style={{
                            fontWeight: theme.typography.h3?.fontWeight ?? "bold",
                            fontSize: theme.typography.h3?.fontSize ?? 16,
                        }}
                    >
                        {job.amount}
                    </Text>

                    <View
                        style={{
                            backgroundColor: theme.colors.primaryLight,
                            paddingHorizontal: theme.spacing[3],
                            paddingVertical: theme.spacing[1],
                            borderRadius: theme.radius.full,
                            marginTop: theme.spacing[2],
                        }}
                    >
                        <Text
                            style={{
                                color: theme.colors.primary,
                                fontSize: theme.typography.caption?.fontSize ?? 12,
                            }}
                        >
                            COMPLETED
                        </Text>
                    </View>
                </View>
            </View>

            {/* Bottom */}
            <View
                style={{
                    marginTop: theme.spacing[4],
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#F59E0B", fontWeight: "600" }}>
                    ⭐ {job.rating}
                </Text>

                <Pressable
                    style={{
                        backgroundColor: theme.colors.primary,
                        paddingHorizontal: theme.spacing[6],
                        paddingVertical: theme.spacing[2],
                        borderRadius: theme.radius.md,
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                        Rebook
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}