const MAP = {
  running:  { dot: "var(--emerald)", text: "var(--emerald)", bg: "var(--emerald-dim)", label: "Running",  pulse: true },
  building: { dot: "var(--amber)",   text: "var(--amber)",   bg: "rgba(251,191,36,.1)", label: "Building", pulse: true },
  stopped:  { dot: "var(--rose)",    text: "var(--rose)",    bg: "rgba(248,113,113,.1)", label: "Stopped",  pulse: false },
  active:   { dot: "var(--emerald)", text: "var(--emerald)", bg: "var(--emerald-dim)", label: "Active",   pulse: true },
  pending:  { dot: "var(--amber)",   text: "var(--amber)",   bg: "rgba(251,191,36,.1)", label: "Pending",  pulse: true },
  error:    { dot: "var(--rose)",    text: "var(--rose)",    bg: "rgba(248,113,113,.1)", label: "Error",    pulse: false },
};

export default function StatusBadge({ status, className = "" }) {
  const c = MAP[status] || MAP.stopped;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${className}`}
      style={{ color: c.text, background: c.bg, borderColor: `${c.dot}25` }}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.pulse ? (status === "building" ? "animate-pulse-amber" : "animate-pulse-green") : ""}`}
        style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}
