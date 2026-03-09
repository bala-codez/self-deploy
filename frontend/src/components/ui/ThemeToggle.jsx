import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
    const { dark, toggle } = useTheme();
    return (
        <button onClick={toggle}
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all text-sm hover:bg-(--hover)"
                title={dark ? "Switch to light" : "Switch to dark"}
                style={{ color: "var(--text2)" }}>
            {dark ? "☀️" : " 🌙"}
        </button>
    );
}
