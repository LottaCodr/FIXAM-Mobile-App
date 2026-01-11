import React, { createContext, useMemo } from "react";
import { Theme, lightTheme } from "./theme";

type ThemeContextType = Theme;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const theme = useMemo(() => lightTheme, []);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}