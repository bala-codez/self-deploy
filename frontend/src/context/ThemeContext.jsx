import { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem("selfdeploy-theme");
        return saved ? saved === "dark" : true;
    });

    useEffect(() => {
        document.documentElement.classList.toggle("theme-light", !dark);
        localStorage.setItem("selfdeploy-theme", dark ? "dark" : "light");
    }, [dark]);

    return <ThemeCtx.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
