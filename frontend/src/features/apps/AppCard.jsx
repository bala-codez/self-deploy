import { useState, useRef, useEffect } from "react";
import useAppStore from "../../store/appStore";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import MiniBar from "../../components/ui/MiniBar";

const STATUS_ICONS = { running: "🚀", stopped: "📦", building: "⚙️", error: "⚠️" };

export default function AppCard({ app }) {
  const deleteApp = useAppStore((s) => s.deleteApp);
  const updateApp = useAppStore((s) => s.updateApp);
  const toast = useAppStore((s) => s.toast);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    { icon: "🌐", label: "Open URL",  action: () => { window.open(`https://${app.url}`, "_blank"); } },
    { icon: "⟳",  label: "Restart",   action: () => { updateApp(app.id, { status: "building" }); setTimeout(() => updateApp(app.id, { status: "running" }), 2000); toast("Restarting", `${app.name} restarting...`, "info"); } },
    { icon: "⏸",  label: app.status === "running" ? "Stop" : "Start",
      action: () => { updateApp(app.id, { status: app.status === "running" ? "stopped" : "running" }); toast(app.status === "running" ? "Stopped" : "Started", app.name); }
    },
    { icon: "📋", label: "Copy URL",  action: () => { navigator.clipboard?.writeText(app.url); toast("Copied!", "URL copied."); } },
    { icon: "⚙",  label: "Configure", action: () => { toast("Config", "Opening config...", "info"); } },
    { icon: "🗑",  label: "Delete",    action: () => { deleteApp(app.id); toast("Deleted", `${app.name} removed.`, "warn"); }, danger: true },
  ];

  return (
    <Card className="relative group overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.boxShadow = "0 8px 32px var(--shadow), 0 0 32px var(--cyan-dim)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = ""; }}>

      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${app.status === "running" ? "var(--emerald)" : app.status === "building" ? "var(--amber)" : "var(--rose)"}, transparent)` }} />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border transition-all group-hover:scale-105"
            style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            {STATUS_ICONS[app.status] || "📦"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate" style={{ color: "var(--text)" }}>{app.name}</div>
            <div className="text-xs font-mono truncate mt-0.5" style={{ color: "var(--cyan)" }}>{app.url}</div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenu(!menu); }}
              className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-[var(--hover)]"
              style={{ color: "var(--text3)" }}>
              ⋯
            </button>

            {menu && (
              <div className="absolute right-0 top-8 rounded-xl border overflow-hidden z-20 min-w-44 animate-scaleIn"
                style={{ background: "var(--surface)", borderColor: "var(--border2)", boxShadow: "0 16px 48px var(--shadow-lg)" }}>
                {actions.map(({ icon, label, action, danger }) => (
                  <button key={label} onClick={() => { action(); setMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-left transition-colors"
                    style={{ color: danger ? "var(--rose)" : "var(--text)" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = danger ? "rgba(248,113,113,.08)" : "var(--hover)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = ""}>
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            ["CPU", app.status === "running" ? app.cpu + "%" : "—", app.cpu > 70 ? "var(--rose)" : app.cpu > 50 ? "var(--amber)" : "var(--cyan)"],
            ["RAM", app.status === "running" ? app.mem + "M" : "—", "var(--violet)"],
            ["Port", ":" + app.port, "var(--text2)"],
          ].map(([k, v, col]) => (
            <div key={k} className="rounded-xl p-2.5 text-center border" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
              <div className="text-sm font-bold font-mono" style={{ color: app.status === "running" ? col : "var(--text3)" }}>{v}</div>
              <div className="text-[9px] mt-0.5 uppercase tracking-wide" style={{ color: "var(--text3)" }}>{k}</div>
            </div>
          ))}
        </div>

        {app.status === "running" && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] mb-1">
              <span style={{ color: "var(--text3)" }}>Memory usage</span>
              <span className="font-mono" style={{ color: "var(--text2)" }}>{app.mem}M / {app.memLimit}M</span>
            </div>
            <MiniBar value={app.mem} max={app.memLimit} color="var(--violet)" />
          </div>
        )}

        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge status={app.status} />
          {app.ssl && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ color: "var(--emerald)", borderColor: "var(--emerald)/25", background: "var(--emerald-dim)" }}>SSL</span>
          )}
          <span className="text-[10px] font-mono ml-auto" style={{ color: "var(--text3)" }}>{app.image}</span>
        </div>
      </div>
    </Card>
  );
}
