import { AppButton } from "@/components/ui/buttons";
import { useTheme } from "@/theme/useTheme";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function StickyActions({
    primaryLabel,
    onPrimary,
    secondaryLabel,
    onSecondary,
    hint,
}: {
    primaryLabel: string;
    onPrimary: () => void;
    secondaryLabel?: string;
    onSecondary?: () => void;
    hint?: string;
}) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                padding: theme.spacing[4],
                paddingBottom: Math.max(insets.bottom, 16),
                backgroundColor: theme.colors.surface,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
            }}
        >
            {secondaryLabel && onSecondary ? (
                <View style={{ marginBottom: theme.spacing[2] }}>
                    <AppButton
                        label={secondaryLabel}
                        variant="secondary"
                        onPress={onSecondary}
                    />
                </View>
            ) : null}
            <AppButton label={primaryLabel} variant="accent" onPress={onPrimary} />
            {hint ? (
                <Text
                    style={{
                        marginTop: theme.spacing[2],
                        textAlign: "center",
                        color: theme.colors.textMuted,
                    }}
                >
                    {hint}
                </Text>
            ) : null}
        </View>
    );
}
