import Spinner from "./Spinner";
import { cls } from "../../utils/cls";

const VARIANTS = {
    primary:  "bg-[var(--cyan)] text-[#080c12] font-semibold hover:opacity-90 shadow-[0_2px_16px_var(--cyan-glow)] focus:ring-2 focus:ring-[var(--cyan)]/40",
    secondary:"bg-[var(--violet)] text-white font-semibold hover:opacity-90 shadow-[0_2px_16px_var(--violet-glow)]",
    ghost:    "border border-[var(--border2)] text-[var(--text2)] hover:bg-[var(--hover)] hover:text-[var(--text)] hover:border-[var(--border3)]",
    outline:  "border border-[var(--cyan)]/35 text-[var(--cyan)] hover:bg-[var(--cyan-dim)] hover:border-[var(--cyan)]/60",
    danger:   "border border-[var(--rose)]/30 text-[var(--rose)] bg-[var(--rose)]/8 hover:bg-[var(--rose)]/15",
    success:  "border border-[var(--emerald)]/30 text-[var(--emerald)] bg-[var(--emerald-dim)] hover:bg-[var(--emerald)]/15",
    subtle:   "text-[var(--text2)] hover:bg-[var(--hover)] hover:text-[var(--text)]",
};
const SIZES = {
    xs: "px-2.5 py-1 text-xs rounded-lg gap-1",
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2 text-sm rounded-xl gap-2",
    lg: "px-5 py-2.5 text-sm rounded-xl gap-2",
};

export default function Btn({ children, variant = "ghost", size = "md", className, loading, disabled, onClick, ...rest }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={cls(
                "inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none disabled:opacity-45 disabled:cursor-not-allowed focus:outline-none",
                VARIANTS[variant] || VARIANTS.ghost,
                SIZES[size] || SIZES.md,
                className
            )}
            {...rest}
        >
            {loading && <Spinner size={12} />}
            {children}
        </button>
    );
}
