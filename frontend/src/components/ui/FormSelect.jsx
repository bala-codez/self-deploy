export default function FormSelect({ label, children, className = "", ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text3)" }}>
          {label}
        </label>
      )}
      <select
        className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all appearance-none cursor-pointer border"
        style={{ background: "var(--input-bg)", borderColor: "var(--border2)", color: "var(--text)" }}
        onFocus={(e) => { e.target.style.borderColor = "var(--cyan)"; e.target.style.boxShadow = "0 0 0 3px var(--cyan-dim)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--border2)"; e.target.style.boxShadow = "none"; }}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
