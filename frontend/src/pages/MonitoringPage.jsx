import { useEffect, useState } from "react";
import useAppStore from "../store/appStore";
import SectionHeader from "../components/ui/SectionHeader";
import Card from "../components/ui/Card";
import MiniBar from "../components/ui/MiniBar";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";

export default function MonitoringPage() {
  const apps = useAppStore((s) => s.apps);
  const labs = useAppStore((s) => s.labs);
  const all = [...apps, ...labs];
  const running = all.filter((c) => c.status === "running");

  const [cpus, setCpus] = useState(() => {
    const m = {};
    all.forEach((c) => { m[c.id + c.name] = c.cpu ?? 15; });
    return m;
  });
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => {
      setCpus((prev) => {
        const next = { ...prev };
        running.forEach((c) => {
          const k = c.id + c.name;
          next[k] = Math.max(2, Math.min(95, (prev[k] ?? 20) + (Math.random() - 0.45) * 16));
        });
        return next;
      });
      setTime(new Date());
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  const avgCpu = running.length ? Math.round(running.reduce((s, c) => s + (cpus[c.id + c.name] ?? c.cpu ?? 0), 0) / running.length) : 0;
  const totalMem = running.reduce((s, c) => s + (c.mem || 0), 0);

  const ALERTS = [
    { level: "warn", icon: "!", msg: "jenkins-ci CPU > 70% for 10 minutes", time: "3h ago", color: "var(--amber)" },
    { level: "info", icon: "i", msg: "SSL cert for api.myshop.dev renewed (90 days)", time: "5h ago", color: "var(--cyan)" },
    { level: "ok",   icon: "✓", msg: "mysql-prod daily backup completed", time: "6h ago", color: "var(--emerald)" },
    { level: "warn", icon: "!", msg: "worker-service disk at 72% capacity", time: "1d ago", color: "var(--amber)" },
  ];

  return (
    <div className="space-y-7 animate-fadeUp">
      <SectionHeader title="Monitoring" count={`${running.length} active`} description="Real-time resource usage and system health" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="⬡" label="Running Containers" value={running.length} sub={`${all.length} total`} color="cyan" />
        <StatCard icon="⚡" label="Avg CPU"           value={avgCpu + "%"}  sub="across all containers" color="amber" />
        <StatCard icon="💾" label="Total Memory"       value={totalMem + "M"} sub="RAM in use"          color="violet" />
        <StatCard icon="↕" label="Network I/O"         value="18.4M"         sub="last 5 minutes"       color="emerald" />
      </div>

      {/* Container table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse-green" style={{ background: "var(--emerald)" }} />
          <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>Container Overview</h3>
          <span className="ml-auto text-[10px] font-mono" style={{ color: "var(--text3)" }}>
            Updated {time.toLocaleTimeString()}
          </span>
        </div>

        <div className="hidden md:grid grid-cols-[2fr_1fr_2fr_2fr_1fr] gap-4 px-5 py-3 border-b text-[10px] font-bold uppercase tracking-widest"
          style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--text3)" }}>
          <span>Container</span><span>Status</span><span>CPU</span><span>Memory</span><span>Uptime</span>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {all.map((c) => {
            const k = c.id + c.name;
            const cpu = cpus[k] ?? c.cpu ?? 0;
            const mmax = c.memLimit || c.memMax || 1024;
            const isRunning = c.status === "running";
            return (
              <div key={k} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr_2fr_1fr] gap-3 md:gap-4 px-5 py-4 items-center transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover)"}
                onMouseLeave={(e) => e.currentTarget.style.background = ""}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{c.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: "var(--text3)" }}>{c.image}</div>
                </div>
                <StatusBadge status={c.status} />
                <div className="flex items-center gap-2">
                  <MiniBar value={isRunning ? cpu : 0} max={100} color={cpu > 70 ? "var(--rose)" : "var(--cyan)"} className="flex-1" />
                  <span className="text-xs font-mono w-10 text-right shrink-0" style={{ color: isRunning ? (cpu > 70 ? "var(--rose)" : "var(--cyan)") : "var(--text3)" }}>
                    {isRunning ? Math.round(cpu) + "%" : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MiniBar value={isRunning ? (c.mem || 0) : 0} max={mmax} color="var(--violet)" className="flex-1" />
                  <span className="text-xs font-mono w-14 text-right shrink-0" style={{ color: isRunning ? "var(--violet)" : "var(--text3)" }}>
                    {isRunning ? `${c.mem || 0}/${mmax}M` : "—"}
                  </span>
                </div>
                <span className="text-xs font-mono" style={{ color: "var(--text2)" }}>{c.uptime}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Alerts */}
      <div>
        <SectionHeader title="Recent Alerts" count={ALERTS.length} />
        <div className="space-y-2">
          {ALERTS.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-colors"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--card)"}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: `${a.color}18`, color: a.color }}>{a.icon}</div>
              <p className="flex-1 text-sm" style={{ color: "var(--text2)" }}>{a.msg}</p>
              <span className="text-[10px] font-mono shrink-0" style={{ color: "var(--text3)" }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
