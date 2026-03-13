import useAppStore from "../store/appStore";
import useAuthStore from "../store/authStore";
import StatCard from "../components/ui/StatCard";
import Btn from "../components/ui/Btn";
import AppCard from "../features/apps/AppCard";
import SectionHeader from "../components/ui/SectionHeader";
import LabsTable from "../features/labs/LabsTable";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const apps = useAppStore((s) => s.apps);
  const labs = useAppStore((s) => s.labs);
  const domains = useAppStore((s) => s.domains);
  const setShowNewApp = useAppStore((s) => s.setShowNewApp);
  const setShowNewLab = useAppStore((s) => s.setShowNewLab);
  const user = useAuthStore((s) => s.user);

  const running = apps.filter((a) => a.status === "running").length;
  const building = apps.filter((a) => a.status === "building").length;
  const runningLabs = labs.filter((l) => l.status === "running").length;
  const sslDomains = domains.filter((d) => d.ssl).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-7 animate-fadeUp max-w-full">
      {/* Welcome banner */}
      <div className="rounded-2xl border px-6 py-5 relative overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="absolute right-0 top-0 w-64 h-full opacity-5 pointer-events-none" style={{ background: "radial-gradient(ellipse at right, var(--cyan), transparent 70%)" }} />
        <div className="flex items-center justify-between flex-wrap gap-4 relative">
          <div>
            <div className="text-xs font-mono mb-1" style={{ color: "var(--text3)" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>{greeting}, {user?.name?.split(" ")[0] ?? "there"} 👋</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text2)" }}>
              {running > 0
                ? `${running} app${running > 1 ? "s" : ""} running smoothly${building > 0 ? ` · ${building} building` : ""}.`
                : "No apps running. Deploy your first app to get started."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Btn variant="ghost" size="sm" onClick={() => setShowNewLab(true)}>⬡ New Lab</Btn>
            <Btn variant="primary" onClick={() => setShowNewApp(true)}>+ Deploy App</Btn>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="◻" label="Running Apps"  value={running}        sub={`${apps.length} total · ${building} building`} color="cyan"    trend={5} />
        <StatCard icon="◈" label="Active Labs"   value={runningLabs}    sub={labs.map((l) => l.type).slice(0, 3).join(" · ")}  color="violet"  />
        <StatCard icon="◉" label="Domains"       value={domains.length} sub={`${sslDomains} with SSL active`}                   color="emerald" />
        <StatCard icon="⬚" label="CPU (avg)"     value="43%"            sub={`${apps.length + labs.length} containers`}         color="amber"   />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: "◻", label: "Deploy App",  action: () => setShowNewApp(true), color: "var(--cyan)", bg: "var(--cyan-dim)" },
          { icon: "◈", label: "New Lab",     action: () => setShowNewLab(true), color: "var(--violet)", bg: "var(--violet-dim)" },
          { icon: "◉", label: "Add Domain",  as: "/domains",  color: "var(--emerald)", bg: "var(--emerald-dim)" },
          { icon: "⬚", label: "Monitoring",  as: "/monitoring", color: "var(--amber)", bg: "rgba(251,191,36,.1)" },
        ].map((q) => (
          q.as ? (
            <Link key={q.label} to={q.as}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:border-[var(--border2)] hover:-translate-y-0.5"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: q.bg, color: q.color }}>{q.icon}</span>
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{q.label}</span>
            </Link>
          ) : (
            <button key={q.label} onClick={q.action}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:border-[var(--border2)] hover:-translate-y-0.5 text-left"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: q.bg, color: q.color }}>{q.icon}</span>
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{q.label}</span>
            </button>
          )
        ))}
      </div>

      {/* Apps */}
      <div>
        <SectionHeader title="Applications" count={`${running}/${apps.length} running`}
          action={<div className="flex gap-2"><Btn variant="ghost" size="sm" as={Link} to="/apps">View All</Btn><Btn variant="ghost" size="sm" onClick={() => setShowNewApp(true)}>+ New</Btn></div>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.slice(0, 3).map((a, i) => (
            <div key={a.id} className={`animate-fadeUp delay-${i + 1}`}><AppCard app={a} /></div>
          ))}
        </div>
      </div>

      {/* Labs */}
      <div>
        <SectionHeader title="Active Labs" count={runningLabs}
          action={<div className="flex gap-2"><Link to="/labs" className="text-xs font-medium hover:underline" style={{ color: "var(--text2)" }}>View All</Link><Btn variant="ghost" size="sm" onClick={() => setShowNewLab(true)}>+ Deploy</Btn></div>}
        />
        <LabsTable labs={labs} />
      </div>
    </div>
  );
}
