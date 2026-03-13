import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAppStore from "../../store/appStore";
import useAuthStore from "../../store/authStore";
import ThemeToggle from "../ui/ThemeToggle";
import Btn from "../ui/Btn";

const TITLES = {
  "/": "Dashboard", "/apps": "Applications", "/labs": "Labs",
  "/domains": "Domains", "/monitoring": "Monitoring",
  "/settings": "Settings", "/profile": "Profile",
};
const BREADCRUMBS = {
  "/": ["Platform", "Dashboard"],
  "/apps": ["Platform", "Applications"],
  "/labs": ["Platform", "Labs"],
  "/domains": ["Platform", "Domains"],
  "/monitoring": ["System", "Monitoring"],
  "/settings": ["System", "Settings"],
  "/profile": ["Account", "Profile"],
};

export default function Topbar({ onMenuToggle, onNewApp, onNewLab }) {
  const user = useAuthStore((s) => s.user);
  const apps = useAppStore((s) => s.apps);
  const labs = useAppStore((s) => s.labs);
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  const title = TITLES[location.pathname] || "DevDock";
  const crumbs = BREADCRUMBS[location.pathname] || ["", title];

  const NOTIFS = [
    { id: 1, icon: "✓", color: "var(--emerald)", msg: "SSL cert renewed for api.myshop.dev", time: "2m ago", read: false },
    { id: 2, icon: "!", color: "var(--amber)",   msg: "jenkins-ci CPU exceeds 70%", time: "3h ago", read: false },
    { id: 3, icon: "i", color: "var(--cyan)",    msg: "Worker service build completed", time: "5h ago", read: true },
    { id: 4, icon: "✓", color: "var(--emerald)", msg: "mysql-prod backup succeeded", time: "1d ago", read: true },
  ];
  const unread = NOTIFS.filter((n) => !n.read).length;

  const allItems = [
    ...apps.map((a) => ({ label: a.name, sub: a.url, href: "/apps", icon: "◻" })),
    ...labs.map((l) => ({ label: l.name, sub: l.type, href: "/labs", icon: "◈" })),
    { label: "Dashboard", sub: "/", href: "/", icon: "⬡" },
    { label: "Settings", sub: "/settings", href: "/settings", icon: "⊛" },
    { label: "Profile", sub: "/profile", href: "/profile", icon: "◎" },
  ];
  const results = search.length > 1
    ? allItems.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()) || i.sub?.toLowerCase().includes(search.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowSearch(true); searchRef.current?.focus(); }
      if (e.key === "Escape") { setShowSearch(false); setSearch(""); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="h-13 shrink-0 flex items-center px-4 md:px-5 gap-3 border-b relative z-10"
      style={{ background: "var(--surface)", borderColor: "var(--border)", minHeight: "52px" }}>
      {/* Mobile hamburger */}
      <button onClick={onMenuToggle} className="md:hidden flex flex-col gap-1 p-2 rounded-xl hover:bg-[var(--hover)] transition-all">
        {[0,1,2].map((i) => <span key={i} className={`block h-0.5 rounded-full transition-all ${i === 1 ? "w-4" : "w-5"}`} style={{ background: "var(--text2)" }} />)}
      </button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs min-w-0">
        <span style={{ color: "var(--text3)" }}>{crumbs[0]}</span>
        <span style={{ color: "var(--text4)" }}>/</span>
        <span className="font-semibold" style={{ color: "var(--text)" }}>{crumbs[1]}</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs relative" ref={searchRef}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all"
          style={{ background: "var(--panel)", borderColor: showSearch ? "var(--border2)" : "var(--border)" }}>
          <span className="text-xs shrink-0" style={{ color: "var(--text3)" }}>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowSearch(true)}
            placeholder="Search…"
            className="bg-transparent text-xs outline-none flex-1 min-w-0"
            style={{ color: "var(--text)" }}
          />
          <kbd className="text-[9px] px-1.5 py-0.5 rounded border font-mono hidden sm:block" style={{ color: "var(--text3)", borderColor: "var(--border2)" }}>⌘K</kbd>
        </div>
        {showSearch && search.length > 1 && (
          <div className="absolute top-full mt-1.5 left-0 right-0 rounded-xl border overflow-hidden animate-slideDown z-50"
            style={{ background: "var(--surface)", borderColor: "var(--border2)", boxShadow: "0 16px 48px var(--shadow)" }}>
            {results.length === 0 ? (
              <div className="px-4 py-3 text-xs" style={{ color: "var(--text3)" }}>No results for "{search}"</div>
            ) : results.slice(0, 6).map((r, i) => (
              <button key={i} onClick={() => { navigate(r.href); setSearch(""); setShowSearch(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-xs hover:bg-[var(--hover)]">
                <span style={{ color: "var(--cyan)" }}>{r.icon}</span>
                <span className="font-medium" style={{ color: "var(--text)" }}>{r.label}</span>
                <span className="ml-auto font-mono" style={{ color: "var(--text3)" }}>{r.sub}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        <Btn variant="ghost" size="sm" onClick={onNewApp} className="hidden md:flex">+ App</Btn>
        <Btn variant="primary" size="sm" onClick={onNewLab} className="hidden md:flex">⬡ Lab</Btn>
        <div className="hidden md:block w-px h-5 shrink-0" style={{ background: "var(--border)" }} />
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:bg-[var(--hover)] text-sm"
            style={{ color: "var(--text2)" }}>
            🔔
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full border" style={{ background: "var(--rose)", borderColor: "var(--surface)" }} />
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border overflow-hidden animate-slideDown z-50"
              style={{ background: "var(--surface)", borderColor: "var(--border2)", boxShadow: "0 16px 48px var(--shadow)" }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Notifications</span>
                {unread > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--rose)/15", color: "var(--rose)" }}>{unread} new</span>}
              </div>
              {NOTIFS.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b transition-colors hover:bg-[var(--hover)] cursor-pointer last:border-0"
                  style={{ borderColor: "var(--border)", background: !n.read ? "var(--panel)" : "" }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5" style={{ background: `${n.color}18`, color: n.color }}>{n.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug" style={{ color: n.read ? "var(--text2)" : "var(--text)" }}>{n.msg}</p>
                    <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--text3)" }}>{n.time}</p>
                  </div>
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: "var(--cyan)" }} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <button onClick={() => navigate("/profile")}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--cyan)] to-[var(--violet)] flex items-center justify-center text-[11px] font-black text-black transition-all hover:scale-105"
          style={{ boxShadow: "0 0 12px var(--cyan-dim)" }}>
          {user?.avatar || "?"}
        </button>
      </div>
    </header>
  );
}
