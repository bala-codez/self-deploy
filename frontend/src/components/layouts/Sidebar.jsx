import { NavLink, useNavigate } from "react-router-dom";
import useAppStore from "../../store/appStore";
import useAuthStore from "../../store/authStore";
import { cls } from "../../utils/cls";

const NAV = [
  { to: "/",           icon: "⬡", label: "Dashboard",  group: "Platform" },
  { to: "/apps",       icon: "◻", label: "Applications", group: "Platform" },
  { to: "/labs",       icon: "◈", label: "Labs",         group: "Platform" },
  { to: "/domains",    icon: "◉", label: "Domains",      group: "Platform" },
  { to: "/monitoring", icon: "⬚", label: "Monitoring",   group: "System" },
  { to: "/settings",  icon: "⊛", label: "Settings",     group: "System" },
  { to: "/profile",   icon: "◎", label: "Profile",      group: "Account" },
];

const GROUPS = [...new Set(NAV.map((n) => n.group))];

export default function Sidebar({ onClose }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const apps = useAppStore((s) => s.apps);
  const labs = useAppStore((s) => s.labs);
  const navigate = useNavigate();

  const counts = {
    "/apps": apps.length,
    "/labs": labs.length,
    "/domains": undefined,
  };
  const runningApps = apps.filter((a) => a.status === "running").length;

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className="w-62 flex flex-col h-full border-r shrink-0" style={{ background: "var(--surface)", borderColor: "var(--border)", width: "240px" }}>
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-3 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--cyan)] to-[var(--violet)] flex items-center justify-center text-base font-black shadow-lg"
          style={{ boxShadow: "0 0 16px var(--cyan-glow)" }}>
          ⚓
        </div>
        <div>
          <span className="text-base font-bold tracking-tight" style={{ color: "var(--text)" }}>Dev<span style={{ color: "var(--cyan)" }}>Dock</span></span>
          <div className="text-[9px] font-mono -mt-0.5" style={{ color: "var(--text3)" }}>v2.0 · Self-hosted</div>
        </div>
        <button onClick={onClose} className="ml-auto md:hidden w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[var(--hover)] text-xs transition-all" style={{ color: "var(--text3)" }}>✕</button>
      </div>

      {/* Quick status */}
      <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl border flex items-center gap-2.5" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse-green" style={{ background: "var(--emerald)" }} />
        <span className="text-xs" style={{ color: "var(--text2)" }}>{runningApps} apps running</span>
        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-md border" style={{ color: "var(--emerald)", borderColor: "var(--emerald)/25", background: "var(--emerald-dim)" }}>LIVE</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {GROUPS.map((group) => (
          <div key={group}>
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] px-2 mb-1.5" style={{ color: "var(--text4)" }}>
              {group}
            </div>
            <div className="space-y-0.5">
              {NAV.filter((n) => n.group === group).map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  onClick={onClose}
                  className={({ isActive }) => cls(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 relative border",
                    isActive
                      ? "border-[var(--border2)] text-[var(--cyan)]"
                      : "border-transparent text-[var(--text2)] hover:bg-[var(--hover)] hover:text-[var(--text)] hover:border-[var(--border)]"
                  )}
                  style={({ isActive }) => isActive ? {
                    background: "linear-gradient(135deg, var(--cyan-dim), var(--violet-dim))",
                    textShadow: "0 0 20px var(--cyan-glow)",
                  } : {}}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full" style={{ background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan-glow)" }} />}
                      <span className="text-sm w-4 text-center shrink-0">{n.icon}</span>
                      <span className="flex-1">{n.label}</span>
                      {counts[n.to] !== undefined && (
                        <span className="text-[10px] font-mono w-5 h-5 flex items-center justify-center rounded-lg"
                          style={{ background: isActive ? "var(--cyan-dim)" : "var(--panel)", color: isActive ? "var(--cyan)" : "var(--text3)" }}>
                          {counts[n.to]}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User panel */}
      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[var(--hover)] transition-all cursor-pointer group" onClick={() => navigate("/profile")}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--cyan)] to-[var(--violet)] flex items-center justify-center text-xs font-black text-black shrink-0">
            {user?.avatar || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>{user?.name ?? "Guest"}</div>
            <div className="text-[10px] truncate" style={{ color: "var(--text3)" }}>{user?.plan ?? "Free"} Plan</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-[10px] rounded-lg transition-all hover:bg-[var(--rose)]/15"
            style={{ color: "var(--text3)" }} title="Logout">
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
