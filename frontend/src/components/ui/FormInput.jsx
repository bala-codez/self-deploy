import { useState } from "react";

export default function FormInput({ label, hint, error, type = "text", className = "", ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text3)" }}>
                    {label}
                </label>
            )}
            <input
                type={type}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all"
                style={{
                    background: "var(--input-bg)",
                    border: `1px solid ${error ? "var(--rose)" : focused ? "var(--cyan)" : "var(--border2)"}`,
                    color: "var(--text)",
                    boxShadow: focused && !error ? "0 0 0 3px var(--cyan-dim)" : error ? "0 0 0 3px rgba(248,113,113,.12)" : "none",
                }}
                {...props}
            />
            {hint && !error && <p className="text-[11px]" style={{ color: "var(--text3)" }}>{hint}</p>}
            {error && <p className="text-[11px]" style={{ color: "var(--rose)" }}>{error}</p>}
        </div>
    );
}
