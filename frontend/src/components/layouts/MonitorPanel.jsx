import { useEffect, useState } from "react";
import useAppStore from "../../store/appStore";

export default function MonitorPanel() {
  const apps = useAppStore((s) => s.apps);
  const labs = useAppStore((s) => s.labs);
  const running = [
    ...apps.filter((a) => a.status === "running"),
    ...labs.filter((l) => l.status === "running"),
  ];

  const [cpus, setCpus] = useState(() => {
    const m = {};
    [...apps, ...labs].forEach((c) => { m[c.id + c.name] = c.cpu || 10; });
    return m;
  });

  useEffect(() => {
    const iv = setInterval(() => {
      setCpus((prev) => {
        const next = { ...prev };
        running.forEach((c) => {
          const key = c.id + c.name;
          const cur = prev[key] ?? 20;
          next[key] = Math.max(2, Math.min(96, cur + (Math.random() - 0.45) * 14));
        });
        return next;
      });
    }, 2200);
    return () => clearInterval(iv);
  }, [running.length]);

  return (
    <aside className="w-64 flex flex-col border-l shrink-0 overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2 shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse-green" style={{ background: "var(--emerald)" }} />
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "var(--text2)" }}>Live Monitor</span>
        <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded-md border" style={{ color: "var(--emerald)", borderColor: "var(--emerald)/25", background: "var(--emerald-dim)" }}>
          {running.length} active
        </span>
      </div>

      {/* Containers */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {running.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2 opacity-20">⬚</div>
            <p className="text-xs" style={{ color: "var(--text3)" }}>No containers running</p>
          </div>
        ) : running.map((c) => {
          const key = c.id + c.name;
          const cpu = cpus[key] ?? c.cpu ?? 20;
          const mmax = c.memLimit || c.memMax || 1024;
          const memPct = Math.min(100, ((c.mem || 0) / mmax) * 100);
          const cpuColor = cpu > 80 ? "var(--rose)" : cpu > 60 ? "var(--amber)" : "var(--cyan)";
          const memColor = memPct > 80 ? "var(--rose)" : memPct > 60 ? "var(--amber)" : "var(--violet)";

          return (
            <div key={key} className="rounded-xl border p-3 transition-all hover:border-(--border2)" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse-green shrink-0" style={{ background: "var(--emerald)" }} />
                <span className="text-xs font-semibold truncate flex-1" style={{ color: "var(--text)" }}>{c.name}</span>
                <span className="text-[9px] font-mono shrink-0" style={{ color: "var(--text3)" }}>{c.uptime}</span>
              </div>

              {[["CPU", cpu, 100, cpuColor, Math.round(cpu) + "%"], ["MEM", c.mem || 0, mmax, memColor, (c.mem || 0) + "M"]].map(([lbl, val, mx, col, disp]) => (
                <div key={lbl} className="flex items-center gap-2 mb-1.5 last:mb-0">
                  <span className="text-[9px] font-mono w-6 shrink-0" style={{ color: "var(--text3)" }}>{lbl}</span>
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--border2)" }}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: Math.min(100, (val / mx) * 100) + "%", background: `linear-gradient(90deg, ${col}70, ${col})` }} />
                  </div>
                  <span className="text-[9px] font-mono w-8 text-right shrink-0" style={{ color: col }}>{disp}</span>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                {[["NET↑", "4.2M"], ["NET↓", "12M"], ["PIDs", String(Math.floor(Math.random() * 12) + 4)]].map(([k, v]) => (
                  <div key={k} className="text-center">
                    <div className="text-[8px] font-mono" style={{ color: "var(--text3)" }}>{k}</div>
                    <div className="text-[10px] font-mono" style={{ color: "var(--text2)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
