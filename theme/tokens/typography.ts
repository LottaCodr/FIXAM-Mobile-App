import { Platform, TextStyle } from "react-native";

type FontVariant =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "bodyMedium"
    | "caption"
    | "captionMedium"
    | "button"
    | "overline"
    | "tiny";

type TypographyVariants = {
    [key in FontVariant]: TextStyle;
};

const fontFamily = Platform.select({
    ios: "System",
    android: "Roboto",
    web: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    default: "System",
});

export const typography: TypographyVariants = {
    h1: {
        fontFamily,
        fontSize: 28,
        lineHeight: 34,
        fontWeight: "700",
        letterSpacing: -0.4,
    },
    h2: {
        fontFamily,
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "700",
        letterSpacing: -0.3,
    },
    h3: {
        fontFamily,
        fontSize: 18,
        lineHeight: 24,
        fontWeight: "700",
        letterSpacing: -0.2,
    },
    h4: {
        fontFamily,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "600",
    },
    body: {
        fontFamily,
        fontSize: 15,
        lineHeight: 22,
        fontWeight: "400",
    },
    bodyMedium: {
        fontFamily,
        fontSize: 15,
        lineHeight: 22,
        fontWeight: "600",
    },
    caption: {
        fontFamily,
        fontSize: 13,
        lineHeight: 18,
        fontWeight: "400",
    },
    captionMedium: {
        fontFamily,
        fontSize: 13,
        lineHeight: 18,
        fontWeight: "600",
    },
    button: {
        fontFamily,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "600",
        letterSpacing: 0.1,
    },
    overline: {
        fontFamily,
        fontSize: 11,
        lineHeight: 14,
        fontWeight: "700",
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    tiny: {
        fontFamily,
        fontSize: 11,
        lineHeight: 14,
        fontWeight: "500",
    },
};

export const fontFamilyName = fontFamily;
