import type { ServiceCategory } from "@/features/artisans/types";
import { useTheme } from "@/theme/useTheme";
import { haptic } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function CategoryCard({
    title,
    icon,
    color,
    soft,
    subtitle,
    id,
}: ServiceCategory) {
    const { spacing, radius, typography, colors, shadow } = useTheme();
    const router = useRouter();

    return (
        <Pressable
            onPress={() => {
                void haptic("light");
                router.push(`/category/${id}`);
            }}
            style={({ pressed }) => ({
                width: "48%",
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                padding: spacing[4],
                marginBottom: spacing[3],
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.88 : 1,
                ...shadow.sm,
            })}
        >
            <View
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: radius.sm,
                    backgroundColor: soft,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing[3],
                }}
            >
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text style={{ ...typography.bodyMedium, color: colors.textPrimary }}>
                {title}
            </Text>
            <Text
                numberOfLines={1}
                style={{ ...typography.caption, color: colors.textMuted, marginTop: 2 }}
            >
                {subtitle}
            </Text>
        </Pressable>
    );
}
