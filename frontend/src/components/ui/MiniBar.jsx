export default function MiniBar({ value, max, color = "var(--cyan)", className = "" }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  const col = pct > 80 ? "var(--rose)" : pct > 60 ? "var(--amber)" : color;
  return (
    <div className={`h-1.5 rounded-full overflow-hidden ${className}`} style={{ background: "var(--border2)" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: pct + "%", background: `linear-gradient(90deg, ${col}88, ${col})` }} />
    </div>
  );
}
