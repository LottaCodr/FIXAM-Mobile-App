import { TextStyle } from "react-native";

type FontVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';

type TypographyVariants = {
    [key in FontVariant]: TextStyle;
};

export const typography: TypographyVariants = {
    h1: {
        fontSize: 26,
        lineHeight: 32,
        fontWeight: "700",
    },
    h2: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "700",
    },
    h3: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: "700",
    },
    body: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "400",
    },
    caption: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "400",
    },
    button: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "500",
    },
};