import { useState } from "react";
import useAppStore from "../store/appStore";
import SectionHeader from "../components/ui/SectionHeader";
import Btn from "../components/ui/Btn";
import AppCard from "../features/apps/AppCard";

const FILTERS = ["all", "running", "building", "stopped"];

export default function AppsPage() {
  const apps = useAppStore((s) => s.apps);
  const setShowNewApp = useAppStore((s) => s.setShowNewApp);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = apps.filter((a) => {
    const matchFilter = filter === "all" || a.status === filter;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.url.includes(search);
    return matchFilter && matchSearch;
  });

  const counts = FILTERS.reduce((acc, f) => ({ ...acc, [f]: f === "all" ? apps.length : apps.filter((a) => a.status === f).length }), {});

  return (
    <div className="space-y-6 animate-fadeUp">
      <SectionHeader
        title="Applications"
        count={`${apps.filter((a) => a.status === "running").length} running`}
        description={`${apps.length} total applications deployed`}
        action={<Btn variant="primary" onClick={() => setShowNewApp(true)}>+ Deploy App</Btn>}
      />

      {/* Filter bar + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 p-1 rounded-xl border" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={{
                background: filter === f ? "var(--card)" : "transparent",
                color: filter === f ? "var(--text)" : "var(--text2)",
                boxShadow: filter === f ? "0 1px 4px var(--shadow)" : "none",
              }}>
              {f}
              <span className="ml-1 opacity-50">({counts[f]})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          <span className="text-xs" style={{ color: "var(--text3)" }}>⌕</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search apps…"
            className="bg-transparent text-xs outline-none" style={{ color: "var(--text)", width: "140px" }} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="text-5xl mb-4 opacity-10">◻</div>
          <div className="text-base font-semibold mb-1" style={{ color: "var(--text2)" }}>
            {search ? `No apps matching "${search}"` : "No apps found"}
          </div>
          <p className="text-sm mb-6" style={{ color: "var(--text3)" }}>
            {search ? "Try a different search term" : "Deploy your first application to get started"}
          </p>
          <Btn variant="primary" onClick={() => setShowNewApp(true)}>+ Deploy App</Btn>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((a, i) => (
            <div key={a.id} className={`animate-fadeUp delay-${Math.min(i + 1, 6)}`}><AppCard app={a} /></div>
          ))}
          {/* Add card */}
          <button onClick={() => setShowNewApp(true)}
            className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-10 cursor-pointer transition-all min-h-52 group"
            style={{ borderColor: "var(--border2)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.background = "var(--cyan-dim)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.background = ""; }}>
            <div className="text-3xl mb-2.5 transition-transform group-hover:scale-110 duration-300" style={{ color: "var(--text3)" }}>+</div>
            <div className="text-sm font-semibold" style={{ color: "var(--text2)" }}>Deploy New App</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>Git repo or Docker image</div>
          </button>
        </div>
      )}
    </div>
  );
}
