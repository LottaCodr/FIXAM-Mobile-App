import { useArtisanStore } from "@/store/artisan.store";
import { useTheme } from "@/theme/ThemeProvider";
import { Pressable, Text, View } from "react-native";



export default function FilterBottomSheet({ onClose }: { onClose: () => void }) {

    const { spacing, colors, radius, typography } = useTheme();
    const setFilters = useArtisanStore((s) => s.setFilters)

    const handleFilterOnPress = () => {
        setFilters({ maxDistance: 5 });
        onClose();
    }

    return (
        <View
            style={{
                backgroundColor: colors.surface,
                padding: spacing[5],
                borderTopLeftRadius: radius.xl,
                borderTopRightRadius: radius.xl
            }}
        >
            <Text style={{ fontSize: typography.body.fontSize }}>Filters</Text>

            <Pressable onPress={handleFilterOnPress}>
                <Text>Within 5km</Text>
            </Pressable>
        </View>
    )
}