import { Platform, ViewStyle } from "react-native";

const ios = (
    offsetY: number,
    radius: number,
    opacity: number,
): ViewStyle => ({
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
});

export const shadow = {
    none: Platform.select<ViewStyle>({
        ios: { shadowOpacity: 0 },
        android: { elevation: 0 },
        default: {},
    })!,
    sm: Platform.select<ViewStyle>({
        ios: ios(1, 3, 0.06),
        android: { elevation: 2 },
        default: { boxShadow: "0 1px 3px rgba(15,23,42,0.08)" } as ViewStyle,
    })!,
    md: Platform.select<ViewStyle>({
        ios: ios(4, 12, 0.08),
        android: { elevation: 4 },
        default: { boxShadow: "0 6px 16px rgba(15,23,42,0.10)" } as ViewStyle,
    })!,
    lg: Platform.select<ViewStyle>({
        ios: ios(8, 24, 0.12),
        android: { elevation: 8 },
        default: { boxShadow: "0 16px 40px rgba(15,23,42,0.14)" } as ViewStyle,
    })!,
};

export type Shadow = typeof shadow;
