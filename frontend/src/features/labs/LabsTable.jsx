import useAppStore from "../../store/appStore";
import StatusBadge from "../../components/ui/StatusBadge";
import MiniBar from "../../components/ui/MiniBar";
import Btn from "../../components/ui/Btn";
import { LAB_TYPES } from "../../data/labTypes";

export default function LabsTable({ labs }) {
  const deleteLab = useAppStore((s) => s.deleteLab);
  const toast = useAppStore((s) => s.toast);

  if (!labs?.length) return (
    <div className="text-center py-16 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
      <div className="text-4xl mb-3 opacity-15">◈</div>
      <p className="text-sm font-medium" style={{ color: "var(--text2)" }}>No labs running</p>
      <p className="text-xs mt-1" style={{ color: "var(--text3)" }}>Deploy a database, CI/CD tool, or dev environment</p>
    </div>
  );

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_2fr_2fr_auto] gap-4 px-5 py-3 border-b text-[10px] font-bold uppercase tracking-widest"
        style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--text3)" }}>
        <span>Lab</span><span>Status</span><span>Uptime</span><span>Resources</span><span>Connection</span><span></span>
      </div>

      <div className="divide-y" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        {labs.map((lab) => {
          const lt = LAB_TYPES.find((t) => t.type === lab.type);
          const memPct = Math.min(100, ((lab.mem || 0) / (lab.memMax || 1024)) * 100);

          return (
            <div key={lab.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_2fr_2fr_auto] gap-3 md:gap-4 px-5 py-4 items-center transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = ""}>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: `${lt?.color || "var(--cyan)"}15`, border: `1px solid ${lt?.color || "var(--cyan)"}30` }}>
                  {lt?.emoji || "🔬"}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{lab.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: "var(--text3)" }}>{lab.image}</div>
                </div>
              </div>

              <div className="flex md:block items-center gap-2">
                <span className="text-[10px] md:hidden" style={{ color: "var(--text3)" }}>Status:</span>
                <StatusBadge status={lab.status} />
              </div>

              <div>
                <span className="text-[10px] md:hidden font-semibold mr-2" style={{ color: "var(--text3)" }}>Uptime:</span>
                <span className="text-xs font-mono" style={{ color: "var(--text2)" }}>{lab.uptime}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-12" style={{ color: "var(--text3)" }}>CPU</span>
                  <MiniBar value={lab.cpu} max={100} color={lab.cpu > 70 ? "var(--rose)" : "var(--cyan)"} className="flex-1" />
                  <span className="font-mono w-7 text-right shrink-0" style={{ color: "var(--text2)" }}>{lab.cpu}%</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-12" style={{ color: "var(--text3)" }}>MEM</span>
                  <MiniBar value={lab.mem || 0} max={lab.memMax || 1024} color="var(--violet)" className="flex-1" />
                  <span className="font-mono w-7 text-right shrink-0" style={{ color: "var(--text2)" }}>{Math.round(memPct)}%</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-12" style={{ color: "var(--text3)" }}>DISK</span>
                  <span className="font-mono" style={{ color: "var(--text2)" }}>{lab.vol} / {lab.volMax}</span>
                </div>
              </div>

              <div className="font-mono text-xs truncate px-2.5 py-1.5 rounded-lg border" style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--cyan)" }}>
                {lab.conn}
              </div>

              <div className="flex items-center gap-1.5">
                <Btn variant="ghost" size="xs" onClick={() => { navigator.clipboard?.writeText(lab.conn); toast("Copied!", "Connection string copied."); }}>📋</Btn>
                <Btn variant="danger" size="xs" onClick={() => { deleteLab(lab.id); toast("Lab deleted", lab.name + " removed.", "warn"); }}>✕</Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
