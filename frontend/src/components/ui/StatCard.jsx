const COLORS = {
  cyan:    { accent: "var(--cyan)",    bg: "var(--cyan-dim)",    glow: "var(--cyan-glow)" },
  violet:  { accent: "var(--violet)",  bg: "var(--violet-dim)",  glow: "var(--violet-glow)" },
  emerald: { accent: "var(--emerald)", bg: "var(--emerald-dim)", glow: "rgba(52,211,153,.2)" },
  amber:   { accent: "var(--amber)",   bg: "rgba(251,191,36,.1)", glow: "rgba(251,191,36,.2)" },
  rose:    { accent: "var(--rose)",    bg: "rgba(248,113,113,.1)", glow: "rgba(248,113,113,.2)" },
};

export default function StatCard({ icon, label, value, sub, color = "cyan", trend, className = "" }) {
  const c = COLORS[color] || COLORS.cyan;
  return (
    <div
      className={`group relative rounded-2xl border p-5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.boxShadow = `0 8px 32px var(--shadow), 0 0 40px ${c.bg}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all group-hover:scale-110 duration-300"
          style={{ background: c.bg, color: c.accent }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-lg" style={{ color: trend >= 0 ? "var(--emerald)" : "var(--rose)", background: trend >= 0 ? "var(--emerald-dim)" : "rgba(248,113,113,.1)" }}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="text-2xl font-bold tracking-tight mb-0.5" style={{ color: "var(--text)" }}>{value}</div>
      <div className="text-[11px] font-medium mb-0.5" style={{ color: "var(--text2)" }}>{label}</div>
      {sub && <div className="text-[10px] font-mono" style={{ color: "var(--text3)" }}>{sub}</div>}
    </div>
  );
}
