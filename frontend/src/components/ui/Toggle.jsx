export default function Toggle({ on, onChange, disabled }) {
  return (
    <button
      role="switch" aria-checked={on} onClick={() => !disabled && onChange(!on)}
      disabled={disabled}
      className="relative w-10 h-5.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--cyan)]/40 disabled:opacity-40"
      style={{ background: on ? "var(--cyan)" : "var(--border2)", boxShadow: on ? "0 0 10px var(--cyan-glow)" : "none" }}
    >
      <span className="absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-all duration-200"
        style={{ left: on ? "calc(100% - 18px - 2px)" : "2px" }} />
    </button>
  );
}
