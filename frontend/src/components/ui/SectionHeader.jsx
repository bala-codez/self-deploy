export default function SectionHeader({ title, count, action, description }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>{title}</h2>
          {count !== undefined && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ color: "var(--text3)", borderColor: "var(--border2)", background: "var(--panel)" }}>
              {count}
            </span>
          )}
        </div>
        {description && <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
